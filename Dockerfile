FROM python:3.10-slim-buster

ENV PYTHONUNBUFFERED 1
WORKDIR /app

RUN sed -i 's/deb.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/archive.debian.org/g' /etc/apt/sources.list && \
    sed -i '/stretch-updates/d' /etc/apt/sources.list && \
    apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt /app/requirements.txt

RUN pip install --no-cache-dir -r requirements.txt
COPY . /app/

EXPOSE 8000

CMD ["/bin/bash", "-c", "python manage.py collectstatic --noinput && python manage.py migrate --noinput && gunicorn core.wsgi:application --bind 0.0.0.0:8000"]

