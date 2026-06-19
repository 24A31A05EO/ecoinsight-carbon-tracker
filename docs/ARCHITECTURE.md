# System Architecture

EcoTrack AI employs a modern decoupled architecture, combining a blazing-fast SPA frontend with a resilient backend service designed for horizontal scalability.

## High-Level Architecture Diagram

```mermaid
graph TD
    Client[React SPA Frontend] --> |REST API calls| API_Gateway[FastAPI Backend]
    
    subgraph Neo-Terra Backend
        API_Gateway --> Auth[JWT Authentication Service]
        API_Gateway --> CoreService[Carbon Engine]
        API_Gateway --> Gamification[Gamification Engine]
        
        CoreService --> DB_ORM[SQLAlchemy ORM]
        Gamification --> DB_ORM
        Auth --> DB_ORM
        
        DB_ORM --> DB[(PostgreSQL / SQLite)]
    end
    
    subgraph External Dependencies (Planned)
        CoreService -.-> |Telemetry| AI_Model[External LLM / Vertex AI]
    end
```

## Matrix Components

### 1. Frontend (React / Vite)
A purely static Single Page Application (SPA), allowing deployment to CDN edges for instantaneous load times worldwide. Styled using Tailwind CSS ensuring high contrast (WCAG AAA) within the "Glitch Art" aesthetic.

### 2. Backend (FastAPI)
A Python based API operating entirely asynchronously. Separated into distinct services:
- **Carbon Engine:** Translates raw user actions into normalized CO2e vectors based on known emission coefficients.
- **Gamification Engine:** Calculates XP thresholds, validates streaks, and unlocks achievement badges.

### 3. Data Tier
Uses SQLAlchemy as the translation layer. Uses SQLite for fast local development testing, but natively supports drop-in replacements with PostgreSQL for production workloads.
