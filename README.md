# fullstack-ts-technical-test

This repository is made for candidates full-stack technical tests. It includes a front, a back and a db. Everything is ready to be used through docker

## requirement

You need docker installed

## usage

```
docker compose build
docker compose up
```

Verify you can access [http://localhost:4200](http://localhost:4200).

If you change DB init scripts after a first run, remove the `./.database_data` volume folder (or truncate tables) so Postgres re-applies migrations, or apply SQL manually inside the DB container.

## Booking boilerplate

Playground for livecoding overlap detection and concurrency. Postgres has an exclusion constraint on overlapping `bookings` per device so bad data cannot persist; candidates still implement application-side checks.

### Data model

- `campaigns`: tenant + name + `[start_date, end_date]` (inclusive calendar days).
- `bookings`: one row per reserved slot = `(campaign_id, device_id, start_date, end_date)` overlapping intervals conflict on the **same device** (DB excludes overlaps).

### Existing routes

- `GET /devices/available?tenantId=1&startDate=2026-05-10&endDate=2026-05-12` — naive: returns **all** devices for the tenant (ignores overlaps; candidate implements real availability).
- `GET /campaigns?tenantId=1` — campaigns with aggregated booking slots.
- `POST /campaigns` — body: `{ tenantId, name, startDate, endDate, deviceIds[] }`: creates campaign then booking rows (**naive** DB rejects overlaps).

### Tests

The test suite is **integration-first**: it talks to a real Postgres so candidates cannot fake the implementation by matching SQL strings.

- `back/__tests__/services/devices.test.ts` — `availableDevices` must exclude busy devices on the requested window.
- `back/__tests__/services/bookings.test.ts` — `createBookings` must handle concurrent inserts on the same device gracefully (no double booking, no leaked driver error).

Both suites are **red** against the current boilerplate. Making them green is the candidate exercise.

#### How the tests bootstrap their database

- `__tests__/setup/globalSetup.ts` recreates a dedicated `<db>_test` Postgres database on the same server before the suite, then applies `db/booking_boilerplate.sql` to it.
- `__tests__/setup/setupEnv.ts` rewrites `MEMORY_TEST_DATABASE_URL` to point at that test database, so the connection pool inside `back/infrastructure/postgresql.ts` connects there.
- `__tests__/helpers/db.ts` provides `resetDb`, `insertCampaign`, `insertBooking`, `countBookingsForDevice` — every test starts from a known state (5 devices, no campaigns, no bookings).

#### Running the tests

The tests need to reach the Postgres referenced by `MEMORY_TEST_DATABASE_URL`. The simplest way is to run them inside the backend container:

```
docker compose up -d database backend
docker compose exec backend yarn test
```

If you prefer running on the host, point the env var at the mapped port first, e.g.:

```
MEMORY_TEST_DATABASE_URL=postgresql://memoryuser:memorypassword@localhost:5432/memorytest yarn --cwd back test
```
