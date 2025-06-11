from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from . import models, schemas

async def create_user_task(db: AsyncSession, task: schemas.TaskCreate, user_id: int) -> models.Task:
    """Creates a task instance, adds it to the session, but does not commit."""
    db_task = models.Task(**task.model_dump(), owner_id=user_id)
    db.add(db_task)
    await db.flush()  # Flush to assign an ID to db_task
    await db.refresh(db_task) # Refresh to load all attributes (like defaults)
    return db_task

async def get_tasks_by_owner(db: AsyncSession, owner_id: int, skip: int = 0, limit: int = 100) -> List[models.Task]:
    query = select(models.Task).filter(models.Task.owner_id == owner_id).offset(skip).limit(limit)
    result = await db.execute(query)
    return result.scalars().all()

async def get_task_by_id_and_owner(db: AsyncSession, task_id: int, owner_id: int) -> Optional[models.Task]:
    query = select(models.Task).filter(models.Task.id == task_id, models.Task.owner_id == owner_id)
    result = await db.execute(query)
    return result.scalars().first()

async def update_task(db: AsyncSession, db_task: models.Task, task_update: schemas.TaskUpdate) -> models.Task:
    """Updates a task instance in the session from a schema object."""
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    db.add(db_task) # Add it to the session again to mark it as 'dirty'
    await db.flush()
    await db.refresh(db_task)
    return db_task

async def delete_task(db: AsyncSession, db_task: models.Task):
    """Marks a task for deletion in the session."""
    await db.delete(db_task)
    # The commit will be handled in the router.

def create_user_task_sync(db, title, description, user_id, priority="medium", due_date=None):
    """Synchronous version for Celery: creates and adds a Task, but does not commit."""
    from .models import Task
    task = Task(
        title=title,
        description=description,
        completed=False,
        priority=priority,
        due_date=due_date,
        owner_id=user_id
    )
    db.add(task)
    db.flush()  # Assigns an ID
    db.refresh(task)
    return task