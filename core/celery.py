# core/celery.py
import os
from celery import Celery
from django import setup
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
setup()
app = Celery('core')
app.config_from_object('django.conf:settings', namespace='CELERY')

app.autodiscover_tasks([
    'apps.common.services.tasks',
    'apps.companies.services.tasks',
    'apps.individuals.services.tasks',
    'apps.properties.services.tasks',
    'apps.leases.services.tasks',
])

app.conf.beat_schedule = {
    'cleanup-expired-otps': {
        'task': 'apps.common.tasks.cleanup_expired_otps',
        'schedule': 3600.0,
    },
}

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}')

