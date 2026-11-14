ARG PYTHON_IMAGE=python:3.15-alpine@sha256:a0f2e268f2ce8f3709611a90054ec6a8ae31f6251f5896b8648b9bb99835e30a

FROM ${PYTHON_IMAGE} AS builder

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.13.8@sha256:5cc1805e2426484abca4ad46ea783bab281fdb225fd82d8ce6d66a81254bac85 /uv /usr/local/bin/uv

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
