from celery import Celery
import os

# Импорт моделей для корректной работы SQLAlchemy
from src.users import models as user_models
from src.tasks import models as task_models

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

celery_app = Celery(
    "tasks",
    broker=REDIS_URL,
    backend=REDIS_URL,
    include=["src.tasks.brainly_tasks"]
)

celery_app.conf.timezone = 'UTC'
celery_app.conf.beat_schedule = {
    'fetch-gemini-daily': {
        'task': 'src.tasks.brainly_tasks.fetch_gemini_and_add_task',
        'schedule': 86400,
    },
} 