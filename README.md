# Helix ITSM (Pilot)

An open-source, BMC Helix ITSM–style service management platform. This pilot
delivers **Incident Management** end-to-end (data model → REST API → web UI),
on a containerized, production-shaped stack designed to scale from a laptop to
Kubernetes without a rewrite.

> Target scale: ~20,000 end users, ~2,000 support staff, ~200 concurrent users.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 17 + Spring Boot 3.5 (Web, Data JPA, Security, Validation, Actuator) |
| Database | PostgreSQL 16 (schema via Flyway migrations) |
| Cache | Redis |
| Search | OpenSearch (provisioned; wired in a later phase) |
| Identity / SSO | Keycloak (OAuth2/OIDC, AD/LDAP federation) |
| Frontend | React 18 + TypeScript + Ant Design + Vite |
| API docs | springdoc-openapi (Swagger UI) |
| Packaging | Docker (multi-stage) + Docker Compose |

## Quick start (Docker Compose)

```bash
docker compose up --build
```

Then open:

- **Web UI:** http://localhost:3000
- **API + Swagger UI:** http://localhost:8080/swagger-ui.html
- **Keycloak admin:** http://localhost:8081 (admin / admin)

The database is seeded with reference data (support groups, users, categories)
and two example incidents.

## Local development (without containers)

Requires Java 17, Node 22, and a PostgreSQL instance.

```bash
# 1. Start just the infra dependencies
docker compose up -d postgres redis

# 2. Run the backend (http://localhost:8080)
cd backend && ./mvnw spring-boot:run

# 3. Run the frontend dev server (http://localhost:5173, proxies /api -> :8080)
cd frontend && npm install && npm run dev
```

## Security modes

The backend runs in **dev mode** by default (`ITSM_SECURITY_DEV_MODE=true`),
which leaves the API open so the pilot runs without Keycloak wired in. To
enforce OAuth2/JWT via Keycloak:

```bash
ITSM_SECURITY_DEV_MODE=false
KEYCLOAK_ISSUER_URI=http://localhost:8081/realms/helix-itsm
```

A `helix-itsm` realm (with a `helix-itsm-web` public client and sample users)
is auto-imported into Keycloak on startup from `keycloak/realm-helix.json`.

## Incident Management — what's implemented

- ITIL incident lifecycle as a validated **state machine**
  (`NEW → ASSIGNED → IN_PROGRESS → ON_HOLD → RESOLVED → CLOSED`, plus `CANCELLED`).
- **Priority** auto-derived from the impact × urgency matrix, with per-priority
  **SLA resolution targets** and a background **SLA breach monitor**.
- Assignment to agents and support groups.
- Comments / internal work notes.
- Append-only **activity/audit log** of field changes.
- Filtering, search, and pagination over incidents.
- Dashboard statistics (counts by status, priority, SLA breaches).

### Key API endpoints

```
GET    /api/incidents                 # list (filters: status, priority, assigneeId, groupId, search)
POST   /api/incidents                 # create
GET    /api/incidents/{id}            # detail (+ comments, activity)
PATCH  /api/incidents/{id}            # partial update / status transition
GET    /api/incidents/{id}/comments   # list comments
POST   /api/incidents/{id}/comments   # add comment / work note
GET    /api/dashboard/stats           # dashboard metrics
GET    /api/reference/{users|groups|categories|levels}
```

## Tests

```bash
cd backend && ./mvnw test
```

Includes pure-logic unit tests (priority matrix, state machine) and a
Testcontainers-backed integration test that boots the app against a real
PostgreSQL container and exercises the API.

## Repository layout

```
helix-itsm/
├── backend/                 # Spring Boot service
│   ├── src/main/java/com/helix/itsm/
│   │   ├── incident/        # Incident Management feature (entities, API, service, SLA)
│   │   ├── user/            # Users & support groups
│   │   ├── category/        # Incident categories
│   │   ├── reference/       # Reference-data endpoints
│   │   ├── dashboard/       # Dashboard stats
│   │   ├── config/          # Security, OpenAPI
│   │   └── common/          # Error handling
│   └── src/main/resources/db/migration/   # Flyway SQL
├── frontend/                # React + TS + Ant Design SPA
├── keycloak/                # Realm import
├── docker-compose.yml
└── Makefile
```

## Roadmap (next modules)

Problem Management → Change Management (BPMN approvals) → CMDB / Asset
Management → Release Management → full SLM engine → Service Catalog / Self-Service
Portal → Reporting (Metabase) → integrations (email, Slack/Teams, monitoring).
