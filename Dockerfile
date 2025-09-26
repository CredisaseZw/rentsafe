FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# Install OS dependencies (include git)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    postgresql-client \
    libpq-dev \
    libgdal-dev \
    python3-dev \
    libffi-dev \
    libssl-dev \
    netcat-openbsd \
    dos2unix \
    git \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy app code
COPY . .

# Fix line endings on entrypoint
COPY --chmod=755 entrypoint.py /app/entrypoint.py
RUN dos2unix /app/entrypoint.py

# Create required dirs
RUN mkdir -p /app/static /app/media /app/logs

# Set environment vars
ENV DJANGO_SETTINGS_MODULE=core.settings
ENV PYTHONPATH=/app

EXPOSE 8081

ENTRYPOINT ["python", "/app/entrypoint.py"]
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8081"]