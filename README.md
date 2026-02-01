# Meeting Room Booking API

Kokoushuoneiden varausjärjestelmän REST API.

## Käynnistys

```bash
npm install
npm run dev
```

API käynnistyy osoitteeseen `http://localhost:3000`

## API-endpointit

| Metodi | Endpoint | Kuvaus |
|--------|----------|--------|
| GET | `/health` | Health check |
| GET | `/api/v1/rooms/:id/bookings` | Listaa huoneen varaukset |
| POST | `/api/v1/bookings` | Luo varaus |
| DELETE | `/api/v1/bookings/:id` | Peruuta varaus |

## Esimerkki

```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": "neukkari-1",
    "user": "Matti Meikäläinen",
    "startTime": "2026-02-10T10:00:00Z",
    "endTime": "2026-02-10T11:00:00Z"
  }'
```

## Teknologiat

- Node.js + Express
- TypeScript
- SQLite (better-sqlite3)
- Zod (validointi)
