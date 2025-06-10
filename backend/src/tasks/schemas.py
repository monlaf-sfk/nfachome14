from pydantic import BaseModel, ConfigDict # Import ConfigDict
from typing import Optional

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    completed: Optional[bool] = None

class TaskResponse(TaskBase):
    id: int
    owner_id: int # Assuming you want to expose this
    completed: bool

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 orm_mode