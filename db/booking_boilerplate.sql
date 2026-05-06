-- Booking playground schema + seed (runs on first Postgres init).
-- Bookings store one interval row per campaign + device (overlap is a candidate exercise).

DROP TABLE IF EXISTS public.bookings CASCADE;

CREATE TABLE IF NOT EXISTS public.devices (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id integer NOT NULL,
    name text NOT NULL,
    location text NOT NULL
);

CREATE TABLE IF NOT EXISTS public.campaigns (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    tenant_id integer NOT NULL,
    name text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    CONSTRAINT campaign_dates CHECK (start_date <= end_date)
);

CREATE TABLE public.bookings (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    campaign_id integer NOT NULL REFERENCES public.campaigns(id),
    device_id integer NOT NULL REFERENCES public.devices(id),
    start_date date NOT NULL,
    end_date date NOT NULL,
    CONSTRAINT booking_dates CHECK (start_date <= end_date)
);

-- Prevent overlapping bookings on the same device (inclusive date bounds).
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE public.bookings
    ADD CONSTRAINT bookings_no_overlap_per_device
    EXCLUDE USING gist (
        device_id WITH =,
        daterange(start_date, end_date, '[]') WITH &&
    );

CREATE INDEX IF NOT EXISTS bookings_device_range_idx
    ON public.bookings(device_id, start_date, end_date);

TRUNCATE public.bookings, public.campaigns, public.devices RESTART IDENTITY CASCADE;

INSERT INTO public.devices (tenant_id, name, location)
VALUES
    (1, 'Entrance Screen', 'entrance'),
    (1, 'Bakery Screen', 'bakery'),
    (1, 'Fresh Screen', 'fresh'),
    (1, 'Checkout Left', 'checkout'),
    (1, 'Checkout Right', 'checkout');

INSERT INTO public.campaigns (tenant_id, name, start_date, end_date)
VALUES
    (1, 'Spring promo', '2026-05-10', '2026-05-12'),
    (1, 'Summer teaser', '2026-05-14', '2026-05-15');

INSERT INTO public.bookings (campaign_id, device_id, start_date, end_date)
VALUES
    (1, 1, '2026-05-10', '2026-05-11'),
    (1, 2, '2026-05-12', '2026-05-12'),
    (2, 3, '2026-05-14', '2026-05-14');
