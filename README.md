# E-Commerce Analytics Dashboard

> Production-grade full-stack analytics platform for e-commerce operations. Built with **React 19**, **Node.js**, **PostgreSQL**, and **Docker** — featuring JWT authentication, role-based access control, real-time analytics, and enterprise security hardening.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-22-339933?logo=nodedotjs)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)](https://postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)](https://docker.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## Table of Contents

- [Executive Summary](#executive-summary)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Security Hardening](#security-hardening)
- [Features](#features)
- [Project Structure](#project-structure)
- [Quick Start](#quick-start)
- [Environment Configuration](#environment-configuration)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Development Workflow](#development-workflow)
- [License](#license)

---

## Executive Summary

This dashboard solves a critical operational need for e-commerce businesses: **centralized, real-time visibility into sales performance, inventory, and order fulfillment** — all within a secure, role-governed environment.

Unlike generic admin templates, this application implements:

- **Enterprise-grade security** — Helmet headers, CORS lockdown, rate limiting, bcrypt-hashed credentials, and JWT-based RBAC
- **Production-ready infrastructure** — Docker Compose with health checks, database wait scripts, and non-root container execution
- **Scalable data layer** — PostgreSQL with connection pooling, SSL-ready for cloud deployment, and idempotent seeding
- **Responsive analytics UI** — Chart.js visualizations with dark/light theming, mobile-adaptive layouts, and role-aware navigation

---

## Architecture & Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework with concurrent features |
| **Vite** | Ultra-fast build tooling and HMR |
| **React Router v7** | Declarative client-side routing |
| **Chart.js + react-chartjs-2** | Interactive analytics visualizations |
| **Axios** | HTTP client with JWT interceptor pipeline |
| **CSS Modules / Context API** | Theming engine (dark/light mode) and global state |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js 22 + Express 5** | High-performance API server |
| **PostgreSQL 16** | Relational datastore with ACID compliance |
| **pg (node-postgres)** | Connection-pooled database client |
| **JWT (jsonwebtoken)** | Stateless authentication |
| **bcryptjs** | Credential hashing (cost factor 12) |
| **express-validator** | Request sanitization and validation |
| **Helmet** | Security header hardening |
| **express-rate-limit** | DDoS and brute-force protection |
| **Morgan** | Structured HTTP request logging |

### DevOps & Infrastructure
| Technology | Purpose |
|------------|---------|
| **Docker + Docker Compose** | Containerized local and CI/CD environments |
| **Node 22 Alpine** | Minimal, secure base images |
| **Health Checks** | PostgreSQL readiness probes before app startup |
| **wait-for-db script** | Resilient startup sequencing |
| **Non-root USER** | Principle of least privilege in containers |
| **Makefile** | Unified build automation across environments |

---

## Security Hardening

Security was not an afterthought — it was architected into every layer:

| Layer | Implementation |
|-------|----------------|
| **Transport** | Helmet.js sets `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`, and more |
| **CORS** | Whitelist-locked origin policy with credentials support |
| **Authentication** | Stateless JWT (HS256) with configurable expiration; Bearer token extraction via middleware |
| **Authorization** | Role-based access control (`admin` vs `customer`) enforced at route and middleware levels |
| **Rate Limiting** | Separate tiers: 20 req/15min for auth endpoints, 120 req/min for general API |
| **Input Validation** | `express-validator` sanitizes all inbound payloads |
| **Password Storage** | bcryptjs with salt rounds = 12 |
| **Database** | Parameterized queries via `pg` pool (SQL injection prevention); SSL enabled in production |
| **Container Security** | Non-root `node` user; minimal Alpine base; no secrets baked into images |

### Post-Audit Security Fixes

After a comprehensive security audit, the following critical improvements were implemented:

| Issue | Fix | File |
|-------|-----|------|
| **JWT_WEAK_DEFAULT** | Production now crashes on startup if `JWT_SECRET` is missing; dev uses a clearly labeled placeholder | `backend/src/config/env.js` |
| **CORS_ORIGIN_ERROR** | CORS middleware returns `403` instead of throwing `500` on blocked origins | `backend/src/app.js` |
| **NO_TRANSACTION_SUPPORT** | Order creation uses `FOR UPDATE` row locking to prevent race conditions on stock deduction | `backend/src/models/orderModel.js` |
| **RATE_LIMIT_PROXY** | Express trusts `X-Forwarded-For` from nginx proxy for accurate client IP detection | `backend/src/app.js` |

---

## Features

### Authentication & Access Control
- JWT login (`POST /api/auth/login`) with secure token persistence
- Current user introspection (`GET /api/auth/me`)
- Role-based sidebar rendering and route guards (`admin` / `customer`)

### Analytics Dashboard
- **Sales trajectory** — 30-day revenue trend line
- **Category breakdown** — Revenue distribution by product category (doughnut chart)
- **Top performers** — Ranked product leaderboard
- **Order funnel** — Status distribution (Pending → Shipped → Delivered → Cancelled)

### Product Management
- Full CRUD with server-side search, category filtering, and paginated tables
- Stock-level tracking with visual indicators

### Order Lifecycle
- Status-driven workflow: **Pending → Shipped → Delivered**
- Customer-scoped views (customers only see their own orders)
- Admin override capabilities for full order pipeline
- **ACID transactions** with row-level locking prevent concurrent stock corruption

### Customer Insights
- Paginated customer directory with embedded order history modal
- Order count aggregation per customer

### UI/UX
- Responsive sidebar navigation with role-aware menu items
- Dark / light mode toggle with CSS custom properties
- Mobile-first grid layouts
- Axios interceptors for automatic JWT attachment and 401 redirection

---

## Project Structure

```text
ecommerce-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js      # PostgreSQL connection pool + SSL logic
│   │   │   └── env.js           # Centralized environment validation
│   │   ├── controllers/         # Business logic handlers
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification + role enforcement
│   │   │   ├── rateLimit.js     # Tiered rate limiting (auth vs API)
│   │   │   └── errorHandler.js  # Centralized error serialization
│   │   ├── models/              # Data access layer (pg queries)
│   │   ├── routes/              # Express route definitions
│   │   ├── utils/
│   │   │   ├── seed.js          # Idempotent database seeding (50 products, 10 users, 20 orders)
│   │   │   └── waitForDb.js     # Retry-loop DB readiness probe
│   │   ├── app.js               # Express app configuration (middleware + routes)
│   │   └── server.js            # Server bootstrap with graceful shutdown
│   ├── Dockerfile               # Multi-stage Alpine build, non-root execution
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI primitives (charts, tables, modals)
│   │   ├── pages/               # Route-level views (Dashboard, Products, Orders, Customers)
│   │   ├── services/            # Axios API client with JWT interceptors
│   │   ├── context/             # Auth + Theme global state
│   │   ├── hooks/               # Custom React hooks
│   │   └── App.jsx              # Root router and layout shell
│   ├── Dockerfile               # Nginx-served production build
│   ├── package.json
│   └── .env.example
├── docker-compose.yml           # Orchestrated stack: Postgres + Backend + Frontend
├── Makefile                     # Universal build automation (auto-detects environment)
├── .env.example                 # Root-level Docker Compose environment template
└── README.md
```

---

## Quick Start

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) + Docker Compose
- Node.js 22+ (for local development without Docker)
- `make` (usually pre-installed on macOS/Linux; Windows users can use Git Bash or WSL)

### One-Command Start (Recommended)

```bash
# Clone and enter
git clone https://github.com/MPadberg-svg/ecommerce-dashboard.git
cd ecommerce-dashboard

# See all available commands
make help

# Start the full stack (auto-detects Local vs Codespaces)
make start
```

| Command | Environment | Description |
|---------|-------------|-------------|
| `make start` | **Auto-detect** | Uses `.env` locally, `.env.codespaces` in GitHub Codespaces |
| `make start-local` | Local | Force localhost mode |
| `make start-codespaces` | Codespaces | Force Codespaces mode |
| `make start-detached` | Any | Background daemon mode |
| `make stop` | Any | Stop all containers |
| `make restart` | Any | Full restart |
| `make logs` | Any | Tail all logs |
| `make clean` | Any | Remove containers + volumes |

### Local URLs

| Service | URL |
|---------|-----|
| Frontend Dashboard | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| API Health Check | http://localhost:5000/api/health |

### GitHub Codespaces

In GitHub Codespaces, `make start` automatically:
1. Detects your `CODESPACE_NAME`
2. Generates `.env.codespaces` with the correct URLs
3. Starts the stack with those overrides

> No manual URL editing required. No long commands.

### Manual Docker Setup (Alternative)

If you prefer not to use Make:

```bash
# Local development
cp .env.example .env
docker compose up --build

# GitHub Codespaces
cat > .env.codespaces << 'EOF'
CLIENT_URL=https://YOUR_CODESPACE_ID-5173.app.github.dev
VITE_API_URL=https://YOUR_CODESPACE_ID-5000.app.github.dev/api
EOF
docker compose --env-file .env.codespaces up --build
```

### Local Development (No Docker)

**Backend:**
```bash
cd backend
cp .env.example .env
npm install
npm run seed      # One-time: creates schema + seed data
npm run dev       # Nodemon hot-reload on :5000
```

**Frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev       # Vite HMR on :5173
```

---

## Environment Configuration

### Root `.env` (Docker Compose)

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=ecommerce_dashboard
JWT_SECRET=change-me-in-production-to-a-256-bit-secret
JWT_EXPIRES_IN=1d
BACKEND_PORT=5000
FRONTEND_PORT=5173
NODE_ENV=development
CLIENT_URL=http://localhost:5173
VITE_API_URL=http://localhost:5000/api
```

### Backend `backend/.env`

```env
# General
NODE_ENV=development
PORT=5000

# Security
# Change this to a long random string in production
JWT_SECRET=super-secret-jwt-key
JWT_EXPIRES_IN=1d

# Database
# Use 'postgres' as the host when running via Docker Compose
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/ecommerce_dashboard

# Frontend URL (For CORS)
# Local: http://localhost:5173
# Codespaces: https://YOUR_CODESPACE_ID-5173.app.github.dev
CLIENT_URL=http://localhost:5173
```

### Frontend `frontend/.env`

```env
VITE_API_URL=http://localhost:5000/api
```

> **Production Note:** Set `NODE_ENV=production` to enable PostgreSQL SSL (`rejectUnauthorized: false` for managed cloud providers like Render/Railway).

---

## API Reference

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Liveness probe — returns status, timestamp, and uptime |

### Authentication
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | — | Authenticate user → returns JWT + user profile |
| GET | `/api/auth/me` | Bearer | Retrieve current authenticated user |

### Dashboard
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/dashboard/stats` | Bearer | Aggregated chart data (sales, revenue, top products, order status) |

### Products
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/products` | Bearer | List with `search`, `category`, `page`, `limit` |
| GET | `/api/products/:id` | Bearer | Single product detail |
| POST | `/api/products` | Bearer + Admin | Create product |
| PUT | `/api/products/:id` | Bearer + Admin | Update product |
| DELETE | `/api/products/:id` | Bearer + Admin | Delete product |

### Orders
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/orders` | Bearer | List orders (customer-scoped unless admin) |
| POST | `/api/orders` | Bearer | Create new order (ACID transaction with stock locking) |
| PUT | `/api/orders/:id` | Bearer + Admin | Update order status (`Pending` → `Shipped` → `Delivered`) |

### Customers
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/customers` | Bearer + Admin | Customer directory with order count aggregation |

---

## Deployment

### Render / Railway / VPS

1. **Database:** Provision a managed PostgreSQL instance. Copy the connection string.
2. **Backend Service:**
   - Build: `npm install`
   - Start: `npm run seed && npm run start`
   - Env vars: `DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`, `NODE_ENV=production`
3. **Frontend Service:**
   - Build: `npm install && npm run build`
   - Publish: `dist/` directory
   - Env: `VITE_API_URL=https://your-api-domain.com/api`
4. **CORS:** Ensure `CLIENT_URL` matches your deployed frontend origin exactly.

### Docker Production

```bash
docker compose -f docker-compose.yml up --build -d
```

> For production, override the compose file with a `docker-compose.prod.yml` that removes volume mounts and uses pre-built images.

---

## Development Workflow

```bash
# Linting
make lint

# Formatting
make format

# Database seeding
make seed

# Health check
make health

# API smoke test
make test-api

# Interactive shells
make shell-backend    # Backend container shell
make shell-db         # PostgreSQL psql shell
```

---

## Default Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@shop.com` | `admin123` |
| Admin | `manager@shop.com` | `admin123` |
| Customer | `customer1@shop.com` | `password123` |
| Customer | `customer2@shop.com` | `password123` |

> Seeding is idempotent — it skips if the `users` table already contains data, making it safe for container restarts.

---

## License

[MIT](LICENSE) — Built by [MPadberg-svg](https://github.com/MPadberg-svg).
