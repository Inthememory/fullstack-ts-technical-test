import { PoolClient } from 'pg'
import { query } from '../infrastructure/postgresql'

export type Campaign = {
  id: number
  tenantId: number
  name: string
  startDate: string
  endDate: string
}

export type CampaignBookingSlot = {
  deviceId: number
  deviceName: string
  location: string
  bookingStartDate: string
  bookingEndDate: string
}

export type CampaignWithBookings = Campaign & {
  bookings: CampaignBookingSlot[]
}

export class CampaignsService {
  async create(
    tenantId: number,
    name: string,
    startDate: string,
    endDate: string,
    client?: PoolClient
  ): Promise<Campaign> {
    const exec = client ? client.query.bind(client) : query
    const result = await exec(
      `
        INSERT INTO campaigns (tenant_id, name, start_date, end_date)
        VALUES ($1, $2, $3::date, $4::date)
        RETURNING
          id,
          tenant_id AS "tenantId",
          name,
          start_date::text AS "startDate",
          end_date::text AS "endDate"
      `,
      [tenantId, name, startDate, endDate]
    )

    const row = (result as any).rows?.[0] as
      | { id: number; tenantId: number; name: string; startDate: string; endDate: string }
      | undefined

    if (!row) {
      throw new Error('campaign creation failed')
    }

    return {
      id: Number(row.id),
      tenantId: Number(row.tenantId),
      name: String(row.name),
      startDate: String(row.startDate),
      endDate: String(row.endDate),
    }
  }

  async listByTenantWithBookings(tenantId: number): Promise<CampaignWithBookings[]> {
    const result = await query(
      `
        SELECT
          c.id,
          c.tenant_id AS "tenantId",
          c.name,
          c.start_date::text AS "startDate",
          c.end_date::text AS "endDate",
          COALESCE(
            json_agg(
              json_build_object(
                'deviceId', d.id,
                'deviceName', d.name,
                'location', d.location,
                'bookingStartDate', b.start_date::text,
                'bookingEndDate', b.end_date::text
              )
              ORDER BY d.id NULLS LAST, b.start_date NULLS LAST
            ) FILTER (WHERE b.id IS NOT NULL),
            '[]'
          )::json AS bookings
        FROM campaigns c
        LEFT JOIN bookings b ON b.campaign_id = c.id
        LEFT JOIN devices d ON d.id = b.device_id
        WHERE c.tenant_id = $1
        GROUP BY c.id
        ORDER BY c.id
      `,
      [tenantId]
    )

    const rows = (result as any).rows as Array<CampaignWithBookings & { bookings: unknown }>

    return rows.map((row) => ({
      id: Number(row.id),
      tenantId: Number(row.tenantId),
      name: String(row.name),
      startDate: String(row.startDate),
      endDate: String(row.endDate),
      bookings: Array.isArray(row.bookings)
        ? (row.bookings as CampaignBookingSlot[]).map((b) => ({
            deviceId: Number(b.deviceId),
            deviceName: String(b.deviceName),
            location: String(b.location),
            bookingStartDate: String(b.bookingStartDate),
            bookingEndDate: String(b.bookingEndDate),
          }))
        : [],
    }))
  }
}
