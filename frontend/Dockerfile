FROM node:26.13-alpine@sha256:8996bb5821d62a8fd9bb27c1cb07462f3fdce6e47d640c6a881ead0b064ce216 AS builder

WORKDIR /app

COPY package.json package-lock.json ./

# Cache runtime dependencies separately from application source changes.
RUN --mount=type=cache,target=/root/.npm \
    npm ci

COPY src src

COPY public public

COPY css css

COPY index.html vite.config.js ./

RUN npm run build

FROM nginx/nginx-unprivileged:stable-alpine@sha256:44e74ca483234093081138b6d7b6f561d55557756a2deefc3a5056148defeb99 AS runtime

COPY config/nginx/default.conf.template  /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# Switch to non-root user.
USER 10001

CMD ["nginx", "-g", "daemon off;"]
