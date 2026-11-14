FROM node:26.13-alpine@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS builder

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

FROM nginx/nginx-unprivileged:stable-alpine@sha256:6b0610b60dff09248d642643a29393543a92eb355b00bbd1d12c7af562ef94c4 AS runtime

COPY config/nginx/default.conf.template  /etc/nginx/templates/default.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

# Switch to non-root user.
USER 10001

CMD ["nginx", "-g", "daemon off;"]
