.PHONY: help start start-local start-codespaces start-detached stop restart logs logs-backend logs-frontend logs-db install install-backend install-frontend dev-backend dev-frontend seed lint lint-backend lint-frontend format format-backend format-frontend health test-api clean prune shell-backend shell-db

# ═══════════════════════════════════════════════════════════════
# E-Commerce Analytics Dashboard — Universal Development Commands
# Auto-detects GitHub Codespaces vs Local environment
# ═══════════════════════════════════════════════════════════════

help: ## Display this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-18s\033[0m %s\n", $$1, $$2}'

# ═══════════════════════════════════════════════════════════════
# UNIVERSAL START — Auto-detects environment
# ═══════════════════════════════════════════════════════════════

start: ## Start full stack (auto-detects Local vs Codespaces)
	@if [ -n "$(CODESPACE_NAME)" ]; then \
		$(MAKE) start-codespaces; \
	else \
		$(MAKE) start-local; \
	fi

# ─── Local Development ─────────────────────────────────────────

.env: .env.example ## Generate .env from template
	@if [ ! -f .env ]; then \
		echo "📝 Creating .env from .env.example..."; \
		cp .env.example .env; \
	fi

start-local: .env ## Start locally (Docker Compose + localhost)
	@echo "🚀 Starting E-Commerce Dashboard (Local)..."
	@echo "   Frontend → http://localhost:5173"
	@echo "   Backend  → http://localhost:5000/api"
	@docker compose up --build

# ─── GitHub Codespaces ───────────────────────────────────────

.env.codespaces: ## Generate .env.codespaces from CODESPACE_NAME
	@if [ -z "$(CODESPACE_NAME)" ]; then \
		echo "❌ CODESPACE_NAME not set. Are you in GitHub Codespaces?"; \
		exit 1; \
	fi
	@echo "📝 Creating .env.codespaces for $(CODESPACE_NAME)..."
	@echo "CLIENT_URL=https://$(CODESPACE_NAME)-5173.app.github.dev" > .env.codespaces
	@echo "VITE_API_URL=https://$(CODESPACE_NAME)-5000.app.github.dev/api" >> .env.codespaces

start-codespaces: .env.codespaces ## Start in GitHub Codespaces
	@echo "🚀 Starting E-Commerce Dashboard (Codespaces)..."
	@echo "   Codespace: $(CODESPACE_NAME)"
	@echo "   Frontend  → https://$(CODESPACE_NAME)-5173.app.github.dev"
	@echo "   Backend   → https://$(CODESPACE_NAME)-5000.app.github.dev/api"
	@docker compose --env-file .env.codespaces up --build

# ═══════════════════════════════════════════════════════════════
# SHARED COMMANDS (work in both environments)
# ═══════════════════════════════════════════════════════════════

start-detached: ## Start in background (daemon mode)
	@if [ -n "$(CODESPACE_NAME)" ]; then \
		docker compose --env-file .env.codespaces up --build -d; \
	else \
		docker compose up --build -d; \
	fi

stop: ## Stop all containers
	@echo "🛑 Stopping containers..."
	@docker compose down

restart: stop start ## Restart full stack

logs: ## Tail all container logs
	@docker compose logs -f

logs-backend: ## Tail backend logs only
	@docker compose logs -f backend

logs-frontend: ## Tail frontend logs only
	@docker compose logs -f frontend

logs-db: ## Tail database logs only
	@docker compose logs -f postgres

install-backend: ## Install backend dependencies
	@cd backend && npm install

install-frontend: ## Install frontend dependencies
	@cd frontend && npm install

install: install-backend install-frontend ## Install all dependencies

dev-backend: ## Start backend in dev mode (requires .env)
	@cd backend && npm run dev

dev-frontend: ## Start frontend in dev mode (requires .env)
	@cd frontend && npm run dev

seed: ## Run database seed script
	@cd backend && npm run seed

lint-backend: ## Lint backend code
	@cd backend && npm run lint

lint-frontend: ## Lint frontend code
	@cd frontend && npm run lint

lint: lint-backend lint-frontend ## Lint all code

format-backend: ## Format backend code
	@cd backend && npm run format

format-frontend: ## Format frontend code
	@cd frontend && npm run format

format: format-backend format-frontend ## Format all code

health: ## Check backend health endpoint
	@curl -s http://localhost:5000/api/health | jq . || echo "❌ Backend not responding"

test-api: ## Quick API smoke test (requires running backend)
	@echo "🔍 Testing API endpoints..."
	@curl -s -X POST http://localhost:5000/api/auth/login \
		-H "Content-Type: application/json" \
		-d '{"email":"admin@shop.com","password":"admin123"}' | jq . || echo "❌ Login failed"

clean: stop ## Remove containers, volumes, and generated files
	@echo "🧹 Cleaning up..."
	@docker compose down -v --remove-orphans
	@rm -f .env.codespaces
	@echo "✅ Cleanup complete"

prune: clean ## Deep clean + remove all dangling Docker resources
	@echo "🧹 Pruning Docker system..."
	@docker system prune -f
	@echo "✅ Prune complete"

shell-backend: ## Open shell in backend container
	@docker compose exec backend sh

shell-db: ## Open psql shell in database container
	@docker compose exec postgres psql -U postgres -d ecommerce_dashboard
