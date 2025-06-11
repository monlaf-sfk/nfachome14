from datetime import timedelta
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.concurrency import run_in_threadpool

from src.core.config import settings
from src.core.security import verify_password, create_access_token
from src.users import service as user_service, models as user_models


async def authenticate_user(db: AsyncSession, email: str, password: str) -> user_models.User | None:
    user = await user_service.get_user_by_email(db, email=email)
    if not user:
        return None
    # Run the CPU-bound password verification in a thread pool to avoid blocking the event loop
    if not await run_in_threadpool(verify_password, password, user.hashed_password):
        return None
    return user

def create_user_access_token(user: user_models.User) -> str:
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return access_token