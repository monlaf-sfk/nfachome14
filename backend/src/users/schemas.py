from pydantic import BaseModel, EmailStr, ConfigDict # Import ConfigDict
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    is_active: bool

    model_config = ConfigDict(from_attributes=True) # Pydantic V2 orm_mode