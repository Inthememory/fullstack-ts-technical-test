import { Request, Response } from 'express'
import { BookingsService } from '../services/bookings'
import { CampaignsService } from '../services/campaigns'
import { getClient } from '../infrastructure/postgresql'

const campaignsService = new CampaignsService()
const bookingsService = new BookingsService()

const parseTenantId = (tenantIdRaw: unknown): number | undefined => {
  const tenantId = Number(tenantIdRaw)
  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    return undefined
  }

  return tenantId
}

const isIsoDate = (value: unknown): value is string => {
  if (typeof value !== 'string') {
    return false
  }

  return /^\d{4}-\d{2}-\d{2}$/.test(value)
}

export const createCampaign = async (req: Request, res: Response) => {
  const { tenantId, name, startDate, endDate, deviceIds } = req.body

  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    return res.status(400).json({ error: 'tenantId must be a positive integer' })
  }

  if (typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name is required' })
  }

  if (!isIsoDate(startDate) || !isIsoDate(endDate)) {
    return res.status(400).json({ error: 'startDate and endDate must use YYYY-MM-DD format' })
  }

  if (startDate > endDate) {
    return res.status(400).json({ error: 'startDate must be before or equal to endDate' })
  }

  if (!Array.isArray(deviceIds) || deviceIds.length === 0 || deviceIds.some((id) => !Number.isInteger(id))) {
    return res.status(400).json({ error: 'deviceIds must be a non-empty array of integers' })
  }

  const client = await getClient()
  try {
    const campaign = await campaignsService.create(tenantId, name.trim(), startDate, endDate, client)
    const bookingResult = await bookingsService.createBookings(
      campaign.id,
      tenantId,
      deviceIds,
      startDate,
      endDate,
      client
    )

    return res.status(201).json({ campaign, bookings: bookingResult })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'unexpected error while creating campaign and bookings' })
  } finally {
    client.release()
  }
}

export const listCampaigns = async (req: Request, res: Response) => {
  const tenantId = parseTenantId(req.query.tenantId)
  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId query param is required and must be a positive integer' })
  }

  const campaigns = await campaignsService.listByTenantWithBookings(tenantId)
  return res.json(campaigns)
}
