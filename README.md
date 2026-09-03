# Full-stack TypeScript technical test

Development environment for the full-stack interview. It contains a React
frontend, an Express API, and PostgreSQL. Both development modes support hot
reload.

## Quick start with Docker

Prerequisites: Docker Desktop and Make.

```bash
make
```

This builds and starts the complete stack in the background. Open
http://localhost:4200.

## Quick start with local Node.js

Prerequisites: Docker Desktop, Make, Node.js 22, and Yarn 1.

```bash
make local
```

The frontend and backend run on the host with hot reload. Only PostgreSQL runs
in Docker. Press `Ctrl-C` to stop the host development servers; the database
remains available for the next run.

Environment files are created automatically from committed examples. Existing
files are never overwritten.

## Services

- Frontend: http://localhost:4200
- API: http://localhost:3000
- API health: http://localhost:3000/up
- PostgreSQL: `localhost:5432`

The frontend sends API requests through its development proxy. Source edits in
`front/` and `back/` reload their service in both development modes.

## Commands

```bash
make              # build and start the complete Docker stack
make local        # run host apps with PostgreSQL in Docker
make start        # start existing Docker services without rebuilding
make logs         # follow all Docker logs
make logs s=backend
make ps           # show service status
make stop         # stop containers
make down         # remove containers and network
make restart      # rebuild and recreate the stack
make clean        # remove stack and database data
```

`make clean` permanently removes the local PostgreSQL volume. Use it when the
seed database must be recreated from `db/structure.sql`.

## Without Make

```bash
cp .env.example .env
cp back/.env.example back/.env
docker compose up --build -d --wait
```

## Project layout

```text
back/               Express and TypeScript API
db/structure.sql    PostgreSQL schema and interview dataset
front/              React and TypeScript frontend
docker-compose.yml  Docker development stack
Makefile            one-command development workflows
```
