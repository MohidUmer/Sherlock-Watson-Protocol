# Watson Protocol Challenge

This repository contains the `Watson Protocol` Node.js CTF challenge.
It is designed to run locally via Docker Compose and on a public host such as Render with safe fallback behavior and runtime isolation.

## Repository structure

- `Dockerfile` — builds the Node.js app on `node:20-alpine`
- `docker-entrypoint.sh` — generates `/flag.txt` from platform metadata or fallback values
- `docker-compose.yml` — local development service definition mapping port `5000`
- `app.js` — Express challenge server with prototype pollution exploit logic
- `README.md` — usage and deployment notes

## Local development

Use Docker Compose for local testing:

```bash
docker compose up --build
```

Then open:

```bash
http://localhost:5000
```

If you need to stop the service:

```bash
docker compose down
```

### Direct Docker build

```bash
docker build -t watson-protocol .
docker run --rm -p 5000:5000 -e NODE_ENV=development -e FLAG="EHCP{LOCAL_DEV_FLAG_REPLACE_ME}" watson-protocol
```

## Environment variables

The entrypoint supports both platform and local fallback modes.

- `CHALLENGE_ID` — required for platform flag retrieval
- `TEAM_ID` — required for platform flag retrieval
- `FLAG_ENDPOINT_HOST` — optional override for flag service host
- `FLAG_ENDPOINT_PORT` — optional override for flag service port
- `FLAG` — fallback flag value when network retrieval is unavailable
- `NODE_ENV` — `production` enables periodic process restart every 5 minutes

If `CHALLENGE_ID` or `TEAM_ID` are missing, the entrypoint skips network retrieval and will write the `FLAG` env value to `/flag.txt`. If `FLAG` is unset, it uses a default placeholder value.

## Deploying on Render

Render can host this service in free-tier mode with the following goals:

- Use `node:20-alpine` for a smaller build footprint
- Keep network-based flag retrieval optional and safe
- Use `/flag.txt` as the only flag source read by the app
- Periodically restart the instance in `production` mode to clear runtime contamination

Recommended Render service settings:

- Environment: `Docker`
- Port: `5000`
- Start command: none (entrypoint handles startup)
- Set `NODE_ENV=production`

## Notes

- The challenge logic still reads the flag from `/flag.txt` only.
- `docker-entrypoint.sh` now safely avoids `/dev/tcp/` socket operations when platform metadata is absent.
- `app.js` uses `setInterval` in production to trigger a graceful restart every 5 minutes, which helps keep Render instances clean.

## Git ignore

This repository includes a `.gitignore` to exclude runtime artifacts such as `node_modules/`, local `.env` files, and generated `flag.txt`.
