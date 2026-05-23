# Sherlock: The Watson Protocol

> "When you have eliminated the impossible, whatever remains, however improbable, must be the truth."
>
> - Sherlock Holmes

## Project Name

**Sherlock: The Web of Vulnerabilities**

## Concept

Learn web security by solving Sherlock Holmes-inspired cybercrime cases. Each case turns a real web/API vulnerability into an interactive investigation with clues, endpoints, story beats, and hands-on exploitation.

This repository contains **The Watson Protocol**, a medium-level case focused on GraphQL discovery, weak sanitization, and prototype pollution.

## Overview

**Sherlock: The Watson Protocol** is a narrative-driven web security lab where players investigate a locked OMEGA-7 vault. The player must follow internal clues, query hidden APIs, decode a signal, exploit a vulnerable hydration endpoint, and retrieve the final flag from the vault.

The flag is centralized in `flag.js`. No frontend file or route should hardcode the flag directly.

## Challenge

### Case: The Watson Protocol

Exploit a vulnerable API flow to open the vault.

Learn:

- GraphQL endpoint discovery
- Hidden route enumeration
- Encoding and decoding investigation clues
- Prototype pollution through unsafe object merging
- Why partial sanitization fails
- Why sensitive values should be centralized

## Features

- Story-driven Sherlock Holmes investigation
- Victorian-inspired interactive UI
- In-browser training terminal
- Real Express API endpoints
- Intentional prototype pollution vulnerability
- Centralized flag module through `flag.js`
- Vercel-ready serverless deployment
- Docker support for local/container deployment

## Tech Stack

### Frontend

- HTML
- CSS animations
- Vanilla JavaScript
- Express static hosting

### Backend

- Node.js
- Express.js
- GraphQL
- Lodash

### Deployment

- Vercel serverless functions
- Docker
- Docker Compose

## Current Project Structure

```text
Watson-Protocol/
|
├── api/
│   └── index.js                 # Vercel serverless entrypoint
|
├── public/
│   └── index.html               # Story UI and interactive terminal
|
├── app.js                       # Express app and vulnerable API routes
├── flag.js                      # Central challenge flag source
├── vercel.json                  # Vercel routing/serverless config
├── Dockerfile                   # Docker deployment
├── docker-compose.yml           # Local Docker Compose setup
├── docker-entrypoint.sh         # Container startup script
├── package.json
└── README.md
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm start
```

Open:

```text
http://localhost:5000
```

### 3. Run with Docker

```bash
docker compose up --build
```

Stop the service:

```bash
docker compose down
```

## Deploying to Vercel

This project includes Vercel deployment support:

- `api/index.js` exports the Express app as a serverless function.
- `vercel.json` rewrites all routes to the Express handler.
- `app.js` explicitly serves `public/index.html` at `/`.
- `app.js` only calls `listen()` during local execution, not when imported by Vercel.

Deploy steps:

```bash
npm install
vercel
```

For production:

```bash
vercel --prod
```

If Vercel previously showed `Cannot GET /`, redeploy after these files are included:

```text
api/index.js
vercel.json
public/index.html
app.js
```

## Important Routes

```text
GET  /
GET  /v3/internal/notes.txt
GET  /v3/internal/archive/
GET  /v3/internal/archive/naming_convention.json
POST /v3/internal/api/query
POST /api/v1/hydrate
GET  /api/v1/vault/open
```

## Flag Handling

The flag lives in:

```text
flag.js
```

Runtime code must call:

```js
const { getFlag } = require('./flag');
```

Do not hardcode the flag in `app.js`, `public/index.html`, route handlers, or documentation examples.

## Learning Outcomes

By completing this case, users will understand:

- How hidden API routes can expose an attack path
- How GraphQL can leak useful structure and clues
- How unsafe object merging can create prototype pollution
- Why denylist-based sanitization is fragile
- How small backend design decisions can unlock serious vulnerabilities

## Disclaimer

This project is for educational purposes only. All vulnerabilities are intentionally created in a controlled lab environment. Do not test these techniques on systems you do not own or have explicit permission to assess.

## Inspiration

Inspired by:

- Sherlock Holmes stories by Sir Arthur Conan Doyle
- Real-world web security training labs
- OWASP API Security concepts

## Author

**Mohid Umer**

Cybersecurity Enthusiast | Developer
