# Stage 1: Build
FROM node:26-slim@sha256:14bf3eac4bf209d906d3c41256597d3ab1f926b2e93a79e9bdfe1efd32454239 AS build

WORKDIR /app

COPY src src

COPY public public

COPY css css

COPY index.html package.json package-lock.json vite.config.js ./

RUN npm ci

RUN npm run build

# Stage 2: Runtime
FROM nginxinc/nginx-unprivileged:alpine@sha256:2ddec616f1cb58bcac057aa388f28cb81e35137641ef4226d321714499329bd1

COPY config/nginx/default.conf.template  /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Switch to non-root user.
USER 10001

CMD ["nginx", "-g", "daemon off;"]
