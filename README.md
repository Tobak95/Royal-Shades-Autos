# The Royal Shades Autos Limited — frontend

React 19 + TypeScript + Vite + Tailwind v4. Showroom, car tracking, garage and reservations for customers, plus an admin dashboard.

## Run it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build
npm run lint
```

`VITE_API_URL` sets the backend URL (auth already uses the live backend).

## Mock mode and the admin dashboard

Cars, reservations and admin activity come from mock data while `USE_MOCK_DATA` is `true` in `src/services/mockStore.ts`.
Admin changes are saved in this browser's localStorage (`rsa.demo.*`), so they show on the public pages too.
**Reset demo data** in the admin sidebar puts everything back to the seed data.

In development, the login page has a **Log in as demo admin** button that opens `/admin` without the backend. It isn't included in production builds.

Every admin action goes through `src/services/adminCarService.ts` or `src/services/adminOpsService.ts`. Each function maps to one endpoint below. When the backend is ready, replace each function body with the matching `api` call and set `USE_MOCK_DATA` to `false`.

## Admin API endpoints (to build)

All routes need an admin bearer token (`Authorization: Bearer <token>`, `role: "admin"`). Dates are `yyyy-mm-dd`, timestamps are ISO 8601, and prices are naira.

### Overview

| Method | Path | Body | Returns | Frontend function |
| --- | --- | --- | --- | --- |
| GET | `/admin/overview` | — | `{ counts: { arriving, arrived, inspection, available, sold, total }, arrivingSoon: [{ carId, slug, name, eta, daysLeft, stage }], recent: ActivityEntry[] }`. `arrivingSoon` is arriving cars with an ETA in the next 14 days. `recent` is the last 8 activity entries. | `getOverview` |
| GET | `/admin/activity?limit=` | — | `ActivityEntry[]` (`{ id, at, message, carId? }`), newest first | (part of overview for now) |

### Cars

| Method | Path | Body | Returns | Frontend function |
| --- | --- | --- | --- | --- |
| GET | `/admin/cars?search=&status=` | — | `Car[]`, latest `updatedAt` first. `search` matches make, model, trim, VIN, year and tracking number. `status` is one of the five statuses or `all`. | `adminListCars` |
| GET | `/admin/cars/:id` | — | `Car` or 404 | `adminGetCar` |
| POST | `/admin/cars` | `CarInput` (see below) | Created `Car`. The server sets `id`, `slug`, `createdAt` and `updatedAt`. | `createCar` |
| PUT | `/admin/cars/:id` | `CarInput` | Updated `Car`. Keep the slug unless make, model or year changed; then regenerate it (unique). | `updateCar` |
| DELETE | `/admin/cars/:id` | — | 204 | `deleteCar` |
| PATCH | `/admin/cars/:id/status` | `{ status, shipment?: ShipmentDetails }` | Updated `Car` | `changeCarStatus` |
| PATCH | `/admin/cars/:id/featured` | `{ featured: boolean }` | Updated `Car`. 400 if the car isn't `available`. | `setCarFeatured` |

**Status rules (enforce on the server):**

- `arriving` needs a shipment. Send `shipment` if the car has none yet; otherwise 400.
- `sold` sets `soldAt` to today. If the car was already sold, keep its `soldAt`.
- Any status other than `available` sets `featured` to `false`. Only available cars are shown in the home hero.

**`CarInput`:**

```ts
{
  make, model, year, trim, price, mileage, mileageUnit: "mi" | "km",
  transmission, fuelType, engine, color, bodyType, seats, vin,
  condition, origin, status,
  images: string[],        // URLs, the first one is the main photo
  description, features: string[],
  featured?: boolean,
  soldAt?: string,         // set by the server, see the rules above
  shipment?: Shipment       // see the shipments section
}
```

The slug is `year-make-model` (lower case, hyphens). If that slug is taken, add `-2`, `-3` and so on.

### Shipments

| Method | Path | Body | Returns | Frontend function |
| --- | --- | --- | --- | --- |
| GET | `/admin/shipments` | — | Cars with status `arriving` or `arrived` that have a shipment, soonest ETA first | `listShipments` |
| PATCH | `/admin/cars/:id/shipment` | `{ current: StageKey, vesselName, eta }` | `{ car: Car, suggestArrived: boolean }` | `updateShipment` |

**`ShipmentDetails`** (sent with a status change to `arriving`):

```ts
{ trackingNumber, vesselName, originPort, destinationPort: "Tin Can Island" | "Apapa", eta, current: StageKey }
```

**Stages,** in order: `purchased`, `to_origin_port`, `departed_origin`, `at_sea`, `arrived_lagos`, `customs`, `ready`.

**When the stage is set:**

- Every earlier stage is marked completed. A stage reached for the first time gets today's date.
- The chosen stage gets `current: true`.
- Later stages are cleared, except that `arrived_lagos.date` is the ETA.

**Progress** (%) by current stage: 8, 15, 30, 55, 80, 90, 100.

`suggestArrived` is `true` when the stage is `arrived_lagos` or later and the car's status is still `arriving`. The admin is then offered **Mark as arrived**, which calls `PATCH /admin/cars/:id/status` with `{ status: "arrived" }`.

### Reservations and customers

| Method | Path | Body | Returns | Frontend function |
| --- | --- | --- | --- | --- |
| GET | `/admin/reservations` | — | `Reservation[]`, newest first, each with `carNames: string[]` | `listReservations` |
| PATCH | `/admin/reservations/:id/status` | `{ status: "pending" \| "confirmed" \| "completed" }` | 204 or the updated reservation | `updateReservationStatus` |
| GET | `/admin/customers` | — | `[{ email, fullName, phone, reservations, totalDeposits, lastReservationAt }]`, grouped by email, most recent first | `listCustomers` |

### Uploads (later)

| Method | Path | Body | Returns |
| --- | --- | --- | --- |
| POST | `/admin/uploads` | `multipart/form-data` with `file` | `{ url }` (Cloudinary). The car form will then upload files instead of taking pasted URLs. |

### Activity log

Every write above should add an `ActivityEntry`. The mock uses these messages:

- `Added 2021 Toyota Camry (Available)`
- `Edited …`
- `Deleted …`
- `… : Arriving → Arrived`
- `… shipment: At sea · MV Grande Lagos · ETA 2026-11-02`
- `Reservation RSV-… (Name) marked confirmed`
- `… added to the home hero`
