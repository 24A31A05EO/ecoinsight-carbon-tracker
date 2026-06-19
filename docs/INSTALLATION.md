# Installation Guide

Welcome to the EcoTrack AI developer on-ramping documentation. Follow these steps to initialize the Matrix locally.

## Prerequisites

- Node.js (v18+)
- Python (v3.10+)
- npm or yarn

## 1. Clone the Matrix

```bash
git clone https://github.com/organization/ecotrack-ai.git
cd ecotrack-ai
```

## 2. Frontend Initialization

The frontend utilizes Vite as its build tool for rapid hot-module replacement.

```bash
# Install dependencies
npm install

# Boot local holographic development environment
npm run dev
```

The client will be running at `http://localhost:5173` (or `http://localhost:3000` via our production port router).

## 3. Backend Engine Initialization

The backend operates via an isolated Python virtual environment.

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Boot the API server
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 4. Run Unit Tests

Execute the testing suites to ensure local integrity.

```bash
# Frontend
npm run test

# Backend
cd backend
pytest
```
