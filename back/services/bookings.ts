import { PoolClient } from 'pg'
import { query } from '../infrastructure/postgresql'

export class BookingsService {
  async createBookings(
    campaignId: number,
    _tenantId: number,
    deviceIds: number[],
    startDate: string,
    endDate: string,
    client?: PoolClient
  ): Promise<{ insertedCount: number }> {
    if (deviceIds.length === 0) {
      return { insertedCount: 0 }
    }

    const exec = client ? client.query.bind(client) : query
    await exec(
      `
        INSERT INTO bookings (campaign_id, device_id, start_date, end_date)
        SELECT $1, UNNEST($2::int[]), $3::date, $4::date
      `,
      [campaignId, deviceIds, startDate, endDate]
    )

    return { insertedCount: deviceIds.length }
  }
}
