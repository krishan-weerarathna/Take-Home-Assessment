# Take-Home-Assessment

Full-stack To-Do application with:
- `api` (Node.js + Express + TypeScript)
- `web-app` (React + TypeScript)
- `db` (PostgreSQL)

The recommended way to run the whole project is with Docker Compose.

## Project Structure

- `api`: backend service
- `web-app`: frontend service
- `docker-compose.yml`: orchestrates database, API, and frontend
- `.env`: shared database environment values used by Docker Compose



## Environment Setup

Create or update the root `.env` file in the project root:

```env
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=to_do_db
```

This file is read by `docker-compose.yml` for PostgreSQL and API container environment variables.

## Run the Full Project with Docker

From the project root (`Take-Home-Assessment`):

1. Build and start all services:
   ```bash
   docker compose up --build
   ```

2. Open the app:
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - API health route: [http://localhost:4001/api](http://localhost:4001/api)

3. Stop services:
   ```bash
   docker compose down
   ```

4. Stop and remove volumes (reset database data):
   ```bash
   docker compose down -v
   ```

## Services and Ports

- `web` container (Nginx serving React build): `http://localhost:3000`
- `api` container (Express): `http://localhost:4001`
- `db` container (PostgreSQL): `localhost:5432`

## API Endpoints

Base API URL:
- `http://localhost:4001/api`

Task routes:
- `GET /api/tasks/all` - fetch latest pending tasks (up to 5)
- `POST /api/tasks` - create a task
- `PUT /api/tasks` - update task status

Example request payloads:

```json
{
  "title": "Buy milk",
  "description": "2 liters"
}
```

```json
{
  "id": "1",
  "status": "done"
}
```

## Optional: Run Without Docker

### 1) Start the API

```bash
cd api
npm install
```

Create `api/.env`:

```env
PORT=4001
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=1234
DB_NAME=to_do_db
```

Run API in development:

```bash
npm run start:dev
```

### 2) Start the Frontend

In a new terminal:

```bash
cd web-app
npm install
```

Ensure `web-app/.env` contains:

```env
REACT_APP_API_URL=http://127.0.0.1:4001/api
```

Start frontend:

```bash
npm start
```

## Testing

API tests:
```bash
cd api
npm test
```

Frontend tests:
```bash
cd web-app
npm test
```