# QBR Air Quality Backend

A production-ready Node.js middleware for the Quality ba riyan? (QBR) application.

## Features
- **IQAir API Integration**: Securely fetches data from the AirVisual API.
- **In-Memory Caching**: Caches city data for 15 minutes to stay within API rate limits.
- **Data Standardization**: Transforms raw API responses into a clean, frontend-ready format.
- **Security**: Includes CORS support and rate limiting (100 req / 15 min).
- **Error Handling**: Standardized error responses for easy frontend integration.

## Folder Structure
```
/server
  /src
    /controllers    # Request/Response logic
    /routes         # API Route definitions
    /services       # External API integrations & Caching
    /utils          # Data mapping and helpers
  server.js         # Entry point
```

## Setup & Installation

1. **Install Dependencies**:
   ```bash
   cd server
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the `server/` directory (template provided):
   ```env
   PORT=5000
   IQAIR_API_KEY=your_key_here
   ```

3. **Run Locally**:
   ```bash
   node server.js
   ```

## API Endpoints

### GET /api/air-quality
Fetches standardized air quality data for a city in Metro Manila.
- **Query Params**: `city` (string)
- **Example**: `GET /api/air-quality?city=Makati`

### GET /health
Simple status check for the server.
