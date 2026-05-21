# ============================================================================
# Master Dockerfile Template for EHCP Web/API Challenges
# ============================================================================

FROM node:20-alpine

WORKDIR /app

# Install minimal runtime utilities.
RUN apk add --no-cache bash

# Copy dependency manifests first for better build cache.
COPY package*.json ./
RUN npm install

# Copy app source.
COPY . .
COPY docker-entrypoint.sh /tmp/docker-entrypoint.sh

# Normalize line endings and make entrypoint executable.
RUN sed -i 's/\r$//' /tmp/docker-entrypoint.sh \
    && chmod +x /tmp/docker-entrypoint.sh

# Flag placement: root / as requested
RUN touch /flag.txt && chmod 444 /flag.txt

EXPOSE 5000
ENTRYPOINT ["/tmp/docker-entrypoint.sh"]
