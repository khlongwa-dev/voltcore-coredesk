from datetime import datetime
from pydantic import BaseModel, EmailStr, Field

from app.models.user import Role

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(BaseModel):
    sub: int
    email: EmailStr
    role: Role
    exp: datetime