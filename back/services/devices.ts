import { query } from '../infrastructure/postgresql'

export type Device = {
  id: number
  tenantId: number
  name: string
  location: string
}

export class DevicesService {
  /**
   * Naive boilerplate: returns all tenant devices regardless of requested window.
   * startDate/endDate are accepted only for API shape; overlap filtering is candidate work.
   */
  async availableDevices(tenantId: number, _startDate: string, _endDate: string): Promise<Device[]> {
    const result = await query(
      `
        SELECT id, tenant_id AS "tenantId", name, location
        FROM devices
        WHERE tenant_id = $1
        ORDER BY id
      `,
      [tenantId]
    )

    const rows = (result as any).rows as Array<{ id: number; tenantId: number; name: string; location: string }>

    return rows.map((row) => ({
      id: Number(row.id),
      tenantId: Number(row.tenantId),
      name: String(row.name),
      location: String(row.location),
    }))
  }
}
