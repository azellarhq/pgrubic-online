# Stage 1: Build
FROM node:26-slim@sha256:ec7758ee051e457b468b32bde57b0879010b325bb9862718e9615225ce4aaae1 AS build

WORKDIR /app

COPY src src

COPY public public

COPY css css

COPY index.html package.json package-lock.json vite.config.js ./

RUN npm ci

RUN npm run build

# Stage 2: Runtime
FROM nginxinc/nginx-unprivileged:alpine@sha256:6a23acdfca2b9cfbcec61419e3f1426bcbedb91362f2f19306a8567423bb4612

COPY config/nginx/default.conf.template  /etc/nginx/templates/default.conf.template

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Switch to non-root user.
USER 10001

CMD ["nginx", "-g", "daemon off;"]
