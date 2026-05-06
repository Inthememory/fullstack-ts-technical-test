import React, { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'

type Device = {
  id: number
  tenantId: number
  name: string
  location: string
}

type CampaignBookingSlot = {
  deviceId: number
  deviceName: string
  location: string
  bookingStartDate: string
  bookingEndDate: string
}

type CampaignWithBookings = {
  id: number
  tenantId: number
  name: string
  startDate: string
  endDate: string
  bookings: CampaignBookingSlot[]
}

const tenantId = 1

const formatReservedDevices = (bookings: CampaignBookingSlot[]): string => {
  if (bookings.length === 0) {
    return '—'
  }

  return bookings
    .map(
      (b) =>
        `${b.deviceName} (${b.location}) · ${b.bookingStartDate} → ${b.bookingEndDate}`
    )
    .join('; ')
}

const App = () => {
  const [name, setName] = useState<string>('Livecoding campaign')
  const [startDate, setStartDate] = useState<string>('2026-05-10')
  const [endDate, setEndDate] = useState<string>('2026-05-11')
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDeviceIds, setSelectedDeviceIds] = useState<number[]>([])
  const [campaigns, setCampaigns] = useState<CampaignWithBookings[]>([])
  const [status, setStatus] = useState<string>('Ready')

  const availableQuery = useMemo(
    () =>
      `/devices/available?tenantId=${tenantId}&startDate=${startDate}&endDate=${endDate}`,
    [startDate, endDate]
  )

  const fetchCampaigns = useCallback(async () => {
    const response = await fetch(`/campaigns?tenantId=${tenantId}`)
    const payload = await response.json()
    if (!response.ok) {
      throw new Error(payload.error ?? 'failed to load campaigns')
    }
    setCampaigns(payload)
  }, [])

  const fetchAvailableDevices = useCallback(async () => {
    const response = await fetch(availableQuery)
    const payload = await response.json()
    setDevices(payload)
    setSelectedDeviceIds((current) =>
      current.filter((id) => payload.some((d: Device) => d.id === id))
    )
    return payload.length as number
  }, [availableQuery])

  useEffect(() => {
    void (async () => {
      try {
        const [count] = await Promise.all([fetchAvailableDevices(), fetchCampaigns()])
        setStatus(`Loaded ${count} available device(s)`)
      } catch {
        setStatus('Failed to load devices or campaigns')
      }
    })()
  }, [fetchAvailableDevices, fetchCampaigns])

  const refreshDevices = async () => {
    setStatus('Loading devices...')
    try {
      const count = await fetchAvailableDevices()
      setStatus(`Loaded ${count} available device(s)`)
    } catch {
      setStatus('Failed to load devices')
    }
  }

  const refreshCampaignTable = async () => {
    try {
      await fetchCampaigns()
    } catch {
      /* keep silent; status line already reflects main flows */
    }
  }

  const toggleDevice = (deviceId: number) => {
    setSelectedDeviceIds((current) => {
      if (current.includes(deviceId)) {
        return current.filter((id) => id !== deviceId)
      }

      return [...current, deviceId]
    })
  }

  const submitCampaign = async (event: React.FormEvent) => {
    event.preventDefault()
    setStatus('Creating campaign and bookings...')

    try {
      const createResponse = await fetch('/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenantId,
          name,
          startDate,
          endDate,
          deviceIds: selectedDeviceIds,
        }),
      })

      const payload = await createResponse.json()
      if (!createResponse.ok) {
        setStatus(`Request failed: ${payload.error ?? createResponse.statusText}`)
        return
      }

      const inserted = payload.bookings?.insertedCount ?? 0
      try {
        const count = await fetchAvailableDevices()
        await refreshCampaignTable()
        setStatus(
          `Campaign ${payload.campaign?.id} created. ${inserted} booking row(s). Listed ${count} available device(s).`
        )
      } catch {
        setStatus(`Campaign ${payload.campaign?.id} created (${inserted} bookings), but refresh failed`)
      }
    } catch (error) {
      setStatus('Unexpected error while creating campaign/bookings')
    }
  }

  return (
    <main className="App">
      <h1>Campaign Booking Playground</h1>

      <form onSubmit={submitCampaign} className="card">
        <label>
          Campaign name
          <input value={name} onChange={(event) => setName(event.target.value)} />
        </label>

        <label>
          Start date
          <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} />
        </label>

        <label>
          End date
          <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} />
        </label>

        <button type="button" onClick={refreshDevices}>
          Refresh device list
        </button>

        <section className="device-list">
          {devices.map((device) => {
            const isSelected = selectedDeviceIds.includes(device.id)

            return (
              <label key={device.id} className="device-row">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleDevice(device.id)}
                />
                <span>
                  {device.name} ({device.location})
                </span>
              </label>
            )
          })}
        </section>

        <button type="submit" disabled={selectedDeviceIds.length === 0}>
          Create campaign and reserve selected devices
        </button>
      </form>

      <p className="status">{status}</p>

      <hr />

      <section className="campaigns-section card">
        <div className="campaigns-heading">
          <h2>Campaigns</h2>
          <button type="button" className="button-secondary" onClick={refreshCampaignTable}>
            Refresh table
          </button>
        </div>
        <div className="table-wrap">
          <table className="campaigns-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Tenant</th>
                <th>Campaign period</th>
                <th>Reserved devices</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.length === 0 ? (
                <tr>
                  <td colSpan={5} className="empty-cell">
                    No campaigns loaded.
                  </td>
                </tr>
              ) : (
                campaigns.map((c) => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td>{c.tenantId}</td>
                    <td>
                      {c.startDate} → {c.endDate}
                    </td>
                    <td className="devices-cell">{formatReservedDevices(c.bookings)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default App
