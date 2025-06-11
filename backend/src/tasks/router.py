from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.auth.dependencies import get_current_active_user
from src.users.models import User as UserModel
from . import schemas, service

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.post("/", response_model=schemas.TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task_for_current_user(
    task: schemas.TaskCreate,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    # Service function creates and adds to session
    new_task = await service.create_user_task(db=db, task=task, user_id=current_user.id)
    # Router commits the transaction
    await db.commit()
    return new_task

@router.get("/", response_model=List[schemas.TaskResponse])
async def read_tasks_for_current_user(
    skip: int = 0,
    limit: int = 10,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    return await service.get_tasks_by_owner(db, owner_id=current_user.id, skip=skip, limit=limit)

@router.get("/{task_id}", response_model=schemas.TaskResponse)
async def read_single_task(
    task_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: UserModel = Depends(get_current_active_user),
):
    db_task = await service.get_task_by_id_and_owner(db, task_id=task_id, owner_id=current_user.id)
    if db_task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return db_task


@router.put("/{task_id}", response_model=schemas.TaskResponse)
async def update_single_task(
        task_id: int,
        task_update: schemas.TaskUpdate,
        db: AsyncSession = Depends(get_db),
        current_user: UserModel = Depends(get_current_active_user),
):
    db_task_to_update = await service.get_task_by_id_and_owner(db, task_id=task_id, owner_id=current_user.id)
    if db_task_to_update is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    updated_task = await service.update_task(db=db, db_task=db_task_to_update, task_update=task_update)
    await db.commit()
    return updated_task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_single_task(
        task_id: int,
        db: AsyncSession = Depends(get_db),
        current_user: UserModel = Depends(get_current_active_user),
):
    db_task_to_delete = await service.get_task_by_id_and_owner(db, task_id=task_id, owner_id=current_user.id)
    if db_task_to_delete is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    await service.delete_task(db=db, db_task=db_task_to_delete)
    await db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)