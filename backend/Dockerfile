ARG PYTHON_IMAGE=python:3.15-alpine@sha256:0f9552bb28711333da16915ec146f5e6bb44a7fdac9ced15dc17c2e0206346dd

FROM ${PYTHON_IMAGE} AS builder

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.13.7@sha256:96f40d3904aad8d0bd010539001d36c8e2188b981e1334471a90c4a1d93bb490 /uv /usr/local/bin/uv

WORKDIR /src

ENV UV_LINK_MODE=copy

COPY pyproject.toml uv.lock ./

# Cache runtime dependencies separately from application source changes.
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --locked --no-default-groups --no-install-project --compile-bytecode

COPY app app

FROM ${PYTHON_IMAGE} AS runtime

WORKDIR /src

COPY --from=builder /src/.venv .venv

COPY --from=builder /src/app app

ARG APP_USER=app

RUN python -m pip uninstall --yes pip \
    && addgroup -S -g 10001 "${APP_USER}" \
    && adduser -S -D -u 10001 -G "${APP_USER}" -h "/home/${APP_USER}" -s /bin/sh "${APP_USER}"

ENV PATH="/src/.venv/bin:$PATH" \
    HOME=/home/${APP_USER} \
    ENVIRONMENT=production \
    PYTHONUNBUFFERED=1

EXPOSE 8000

# Use an explicit non-root user and group.
USER ${APP_USER}:${APP_USER}

CMD ["python3", "app/main.py"]
