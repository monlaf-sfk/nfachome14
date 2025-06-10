from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete, update
from typing import List, Optional

from . import models, schemas

async def create_user_task(db: AsyncSession, task: schemas.TaskCreate, user_id: int) -> models.Task:
    db_task = models.Task(**task.model_dump(), owner_id=user_id)
    db.add(db_task)
    await db.commit()
    await db.refresh(db_task)
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
    update_data = task_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_task, key, value)
    # db.add(db_task) # Not strictly necessary if db_task is already in session and modified
    await db.commit()
    await db.refresh(db_task)
    return db_task

async def delete_task(db: AsyncSession, db_task: models.Task): # No return needed for 204
    await db.delete(db_task)
    await db.commit()