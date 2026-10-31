FROM node:26.13-alpine@sha256:c6ad9e9c1d80f6eb607c26b4b0a132ff7a2344fad1c78ea3baa2a7d4c8de6d94 AS builder

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

FROM nginx/nginx-unprivileged:stable-alpine@sha256:2daef144b574804198caccc4041819fa1801ecd5df2252a39646bfa2b1ff3bea AS runtime

COPY config/nginx/default.conf.template  /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# Switch to non-root user.
USER 10001

CMD ["nginx", "-g", "daemon off;"]
