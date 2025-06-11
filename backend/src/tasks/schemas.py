from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

# This schema remains the same, used for creating tasks where a title is required.
class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Optional[str] = "medium"
    due_date: Optional[datetime] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[datetime] = None
    completed: Optional[bool] = None


# This schema for responses remains the same.
class TaskResponse(TaskBase):
    id: int
    owner_id: int
    completed: bool

    model_config = ConfigDict(from_attributes=True)