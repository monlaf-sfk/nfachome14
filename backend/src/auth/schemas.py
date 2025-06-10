from pydantic import BaseModel, EmailStr
from typing import Optional # Ensure Optional is imported if using Python < 3.10 for EmailStr | None

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[EmailStr] = None # Or `EmailStr | None = None` for Python 3.10+