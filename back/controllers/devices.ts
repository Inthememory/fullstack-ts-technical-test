import { Request, Response } from 'express'
import { DevicesService } from '../services/devices'

const service = new DevicesService()

const parseTenantId = (tenantIdRaw: unknown): number | undefined => {
  const tenantId = Number(tenantIdRaw)
  if (!Number.isInteger(tenantId) || tenantId <= 0) {
    return undefined
  }

  return tenantId
}

export const availableDevices = async (req: Request, res: Response) => {
  const tenantId = parseTenantId(req.query.tenantId)
  const { startDate, endDate } = req.query

  if (!tenantId) {
    return res.status(400).json({ error: 'tenantId query param is required and must be a positive integer' })
  }

  if (typeof startDate !== 'string' || typeof endDate !== 'string') {
    return res.status(400).json({ error: 'startDate and endDate query params are required' })
  }

  const devices = await service.availableDevices(tenantId, startDate, endDate)
  return res.json(devices)
}
