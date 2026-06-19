# API Documentation

The Neo-Terra API is built on FastAPI, providing automatic, interactive Swagger documentation when the server is running. This document serves as a high-level overview.

## Core Endpoints

### User & Authentication
- `POST /api/auth/register` - Instantiate a new user node in the system.
- `POST /api/auth/token` - Authenticate and retrieve a JWT bearer token.
- `GET /api/users/me` - Retrieve current user status, gamification level, and badges.

### Telemetry (Activity Logging)
- `POST /api/activities/` - Ingest new carbon activity point.
  - **Payload:** `{ category: string, subCategory: string, amount: float, date: string }`
  - **Response:** Calculated footprint and updated gamification state.
- `GET /api/activities/` - Retrieve historical logged activities.

### Algorithmic AI Coach
- `GET /api/coach/recommendations` - Retrieve personalized, dynamic protocols.
  - **Response:** List of `{ title, description, co2_savings_kg, money_savings_usd, difficulty }`

## Data Schemas Format

**User Resource:**
```json
{
  "id": "uuid",
  "eco_points": 2450,
  "sustainability_level": 4,
  "daily_streak": 12,
  "badges": ["FIRST_LOG", "STREAK_7", "TRANSIT_MASTER"]
}
```

## Integration Protocol
All routes expect an `Authorization: Bearer <TOKEN>` header unless otherwise specified. Ensure cross-origin resource sharing (CORS) is configured for your domain.
