.DEFAULT_GOAL := up
.PHONY: up setup env local start stop down restart logs ps clean

## up: build and start the complete Docker development stack
up: env
	docker compose up --build -d --wait
	@echo ""
	@echo "Stack is up!"
	@echo "  Frontend: http://localhost:4200"
	@echo "  API:      http://localhost:3000"
	@echo "  Health:   http://localhost:3000/up"

## setup: alias for `up`
setup: up

## env: create local env files without overwriting existing values
env:
	@test -f .env || (cp .env.example .env && echo "Created .env")
	@test -f back/.env || (cp back/.env.example back/.env && echo "Created back/.env")

## local: run frontend/backend locally with PostgreSQL in Docker
local: env
	@./scripts/dev-local.sh

## start: start existing Docker services without rebuilding
start: env
	docker compose up -d --wait

## stop: stop containers without removing them
stop:
	docker compose stop

## down: stop and remove containers and network
down:
	docker compose down

## restart: recreate the Docker stack
restart:
	@$(MAKE) down
	@$(MAKE) up

## logs: follow logs (use `make logs s=backend` for one service)
logs:
	docker compose logs -f $(s)

## ps: list stack containers
ps:
	docker compose ps

## clean: remove containers and database volume
clean:
	docker compose down -v
