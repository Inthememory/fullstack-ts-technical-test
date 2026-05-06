import { DevicesService } from '../../services/devices'
import { insertBooking, insertCampaign, resetDb } from '../helpers/db'

const TENANT_ID = 1

describe('DevicesService.availableDevices', () => {
  const service = new DevicesService()

  beforeEach(async () => {
    await resetDb()
  })

  it('returns every tenant device when nothing is booked', async () => {
    const devices = await service.availableDevices(TENANT_ID, '2026-05-10', '2026-05-12')

    expect(devices.map((d) => d.id)).toEqual([1, 2, 3, 4, 5])
  })

  it('excludes a device booked on the requested window', async () => {
    const campaignId = await insertCampaign('busy', '2026-05-10', '2026-05-12')
    await insertBooking(campaignId, 1, '2026-05-10', '2026-05-12')

    const devices = await service.availableDevices(TENANT_ID, '2026-05-10', '2026-05-12')

    expect(devices.map((d) => d.id)).toEqual([2, 3, 4, 5])
  })

  it('excludes a device whose booking only partially overlaps the requested window', async () => {
    const campaignId = await insertCampaign('partial', '2026-05-10', '2026-05-11')
    await insertBooking(campaignId, 2, '2026-05-10', '2026-05-11')

    const devices = await service.availableDevices(TENANT_ID, '2026-05-11', '2026-05-13')

    expect(devices.map((d) => d.id)).not.toContain(2)
  })

  it('keeps a device available when its booking ends strictly before the requested window starts', async () => {
    const campaignId = await insertCampaign('past', '2026-05-08', '2026-05-09')
    await insertBooking(campaignId, 3, '2026-05-08', '2026-05-09')

    const devices = await service.availableDevices(TENANT_ID, '2026-05-10', '2026-05-12')

    expect(devices.map((d) => d.id)).toContain(3)
  })

  it('keeps a device available when its booking starts strictly after the requested window ends', async () => {
    const campaignId = await insertCampaign('future', '2026-05-20', '2026-05-22')
    await insertBooking(campaignId, 4, '2026-05-20', '2026-05-22')

    const devices = await service.availableDevices(TENANT_ID, '2026-05-10', '2026-05-12')

    expect(devices.map((d) => d.id)).toContain(4)
  })

  it('only returns devices owned by the requested tenant', async () => {
    const devices = await service.availableDevices(99, '2026-05-10', '2026-05-12')

    expect(devices).toEqual([])
  })
})
