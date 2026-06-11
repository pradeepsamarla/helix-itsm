.PHONY: up down logs build backend frontend test clean

# Start the full stack (Postgres, Redis, OpenSearch, Keycloak, backend, frontend)
up:
	docker compose up --build -d

down:
	docker compose down

logs:
	docker compose logs -f

build:
	docker compose build

# Run backend locally (requires Postgres on localhost:5432)
backend:
	cd backend && ./mvnw spring-boot:run

# Run frontend dev server (proxies /api to localhost:8080)
frontend:
	cd frontend && npm run dev

test:
	cd backend && ./mvnw test

clean:
	docker compose down -v
	cd backend && ./mvnw clean
