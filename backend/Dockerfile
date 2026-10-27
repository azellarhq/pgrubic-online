ARG PYTHON_IMAGE=python:3.15-slim@sha256:f786b2e19cf9bb54e96bfcd4c1b40c4c56336c22e60607ffd4b080ae5b5dee83

FROM ${PYTHON_IMAGE} AS builder

# Install uv
# Ref: https://docs.astral.sh/uv/guides/integration/docker/#installing-uv
COPY --from=ghcr.io/astral-sh/uv:0.13.5@sha256:32a7bb39b496babbd997b0a39a4d66c126bdaf5661b302bf6f06abda8deca6ff /uv /usr/local/bin/uv

WORKDIR /src

COPY pyproject.toml uv.lock ./

RUN uv sync --locked --no-dev --no-install-project

COPY app app

FROM ${PYTHON_IMAGE}

WORKDIR /src

COPY --from=builder /src/.venv .venv

COPY --from=builder /src/app app

ENV PATH="/src/.venv/bin:$PATH"

ENV PYTHONUNBUFFERED=1

# Switch to non-root user.
USER 10001

CMD ["python3", "app/main.py"]
