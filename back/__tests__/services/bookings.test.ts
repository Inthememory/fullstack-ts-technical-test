import { BookingsService } from '../../services/bookings'
import { countBookingsForDevice, insertCampaign, resetDb } from '../helpers/db'

const TENANT_ID = 1

describe('BookingsService.createBookings concurrency', () => {
  const service = new BookingsService()

  beforeEach(async () => {
    await resetDb()
  })

  it('exposes a domain-level error (not a raw pg driver error) when a device is already booked', async () => {
    const firstCampaignId = await insertCampaign('first', '2026-06-01', '2026-06-03')
    await service.createBookings(firstCampaignId, TENANT_ID, [4], '2026-06-01', '2026-06-03')

    const secondCampaignId = await insertCampaign('second', '2026-06-01', '2026-06-03')

    let caught: unknown
    try {
      await service.createBookings(secondCampaignId, TENANT_ID, [4], '2026-06-01', '2026-06-03')
    } catch (error) {
      caught = error
    }

    expect(caught).toBeInstanceOf(Error)
    expect((caught as { code?: unknown }).code).toBeUndefined()
    expect((caught as Error).constructor.name).not.toBe('DatabaseError')
  })

  it('keeps the database consistent when two concurrent bookings race for the same device', async () => {
    const campaignAId = await insertCampaign('A', '2026-06-01', '2026-06-03')
    const campaignBId = await insertCampaign('B', '2026-06-01', '2026-06-03')

    const results = await Promise.allSettled([
      service.createBookings(campaignAId, TENANT_ID, [5], '2026-06-01', '2026-06-03'),
      service.createBookings(campaignBId, TENANT_ID, [5], '2026-06-01', '2026-06-03'),
    ])

    const fulfilled = results.filter((r) => r.status === 'fulfilled') as PromiseFulfilledResult<{
      insertedCount: number
    }>[]
    const rejected = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[]

    expect(fulfilled).toHaveLength(1)
    expect(rejected).toHaveLength(1)
    expect(fulfilled[0].value).toEqual({ insertedCount: 1 })

    const reason = rejected[0].reason as { code?: unknown; constructor: { name: string } }
    expect(reason).toBeInstanceOf(Error)
    expect(reason.code).toBeUndefined()
    expect(reason.constructor.name).not.toBe('DatabaseError')

    expect(await countBookingsForDevice(5)).toBe(1)
  })

  it('does not serialize concurrent bookings on independent devices', async () => {
    const campaignAId = await insertCampaign('A', '2026-06-10', '2026-06-12')
    const campaignBId = await insertCampaign('B', '2026-06-10', '2026-06-12')

    const results = await Promise.all([
      service.createBookings(campaignAId, TENANT_ID, [1], '2026-06-10', '2026-06-12'),
      service.createBookings(campaignBId, TENANT_ID, [2], '2026-06-10', '2026-06-12'),
    ])

    expect(results).toEqual([{ insertedCount: 1 }, { insertedCount: 1 }])
    expect(await countBookingsForDevice(1)).toBe(1)
    expect(await countBookingsForDevice(2)).toBe(1)
  })
})
