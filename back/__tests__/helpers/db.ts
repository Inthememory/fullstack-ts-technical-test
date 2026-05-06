import { query } from '../../infrastructure/postgresql'

export async function resetDb(): Promise<void> {
  await query('TRUNCATE bookings, campaigns, devices RESTART IDENTITY CASCADE', [])

  await query(
    `
      INSERT INTO devices (tenant_id, name, location) VALUES
        (1, 'Entrance Screen', 'entrance'),
        (1, 'Bakery Screen', 'bakery'),
        (1, 'Fresh Screen', 'fresh'),
        (1, 'Checkout Left', 'checkout'),
        (1, 'Checkout Right', 'checkout')
    `,
    []
  )
}

export async function insertCampaign(
  name: string,
  startDate: string,
  endDate: string,
  tenantId = 1
): Promise<number> {
  const result = (await query(
    `
      INSERT INTO campaigns (tenant_id, name, start_date, end_date)
      VALUES ($1, $2, $3::date, $4::date)
      RETURNING id
    `,
    [tenantId, name, startDate, endDate]
  )) as unknown as { rows: Array<{ id: number }> }

  return Number(result.rows[0].id)
}

export async function insertBooking(
  campaignId: number,
  deviceId: number,
  startDate: string,
  endDate: string
): Promise<void> {
  await query(
    `
      INSERT INTO bookings (campaign_id, device_id, start_date, end_date)
      VALUES ($1, $2, $3::date, $4::date)
    `,
    [campaignId, deviceId, startDate, endDate]
  )
}

export async function countBookingsForDevice(deviceId: number): Promise<number> {
  const result = (await query('SELECT count(*)::int AS n FROM bookings WHERE device_id = $1', [
    deviceId,
  ])) as unknown as { rows: Array<{ n: number }> }

  return Number(result.rows[0].n)
}
