from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi.concurrency import run_in_threadpool

from . import models, schemas
from src.core.security import get_password_hash

async def get_user(db: AsyncSession, user_id: int) -> models.User | None:
    result = await db.execute(select(models.User).filter(models.User.id == user_id))
    return result.scalars().first()

async def get_user_by_email(db: AsyncSession, email: str) -> models.User | None:
    result = await db.execute(select(models.User).filter(models.User.email == email))
    return result.scalars().first()

async def create_user(db: AsyncSession, user: schemas.UserCreate) -> models.User:
    hashed_password = await run_in_threadpool(get_password_hash, user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password) # is_active defaults in model
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user