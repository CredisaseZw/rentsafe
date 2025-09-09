FROM python:3.13-slim-trixie

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

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
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies in a single layer
COPY requirements.txt .


RUN pip install --upgrade pip && \
    pip install -r requirements.txt --no-cache-dir

# Copy application code
COPY . .

# Copy entrypoint and set permissions
COPY --chmod=755 entrypoint.py /app/entrypoint.py
RUN dos2unix /app/entrypoint.py

# Create necessary directories
RUN mkdir -p /app/static /app/media /app/logs

# Set environment variables
ENV DJANGO_SETTINGS_MODULE=core.settings
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000



# Use exec form for ENTRYPOINT to ensure proper signal handling
# ENTRYPOINT ["/bin/sh", "-c", "./entrypoint.sh"]

# Default command to run
ENTRYPOINT ["python", "/app/entrypoint.py"]
CMD ["gunicorn", "core.wsgi:application", "--bind", "0.0.0.0:8000"]

