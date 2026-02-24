from __future__ import absolute_import, unicode_literals

import os

from celery import Celery
from celery.schedules import crontab
from django import setup

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
setup()
app = Celery("core")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
app.conf.broker_connection_retry_on_startup = True
app.conf.include = ["rentsafe.helper"]


app.conf.beat_schedule = {
    "track-balances-daily": {
        "task": "rentsafe.helper.run_tasks",
        "schedule": crontab(hour=9, minute=0),
    },
    "send-reminder-notifications": {
        "task": "rentsafe.helper.send_reminder_notifications",
        "schedule": crontab(hour=7, minute=45),
    },
    "send-lease-renewal-notifications": {
        "task": "rentsafe.helper.send_lease_renewal_notifications",
        "schedule": crontab(hour=7, minute=30),
    },
}
