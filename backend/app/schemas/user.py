from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field
from app.models.user import Role, Department, Office

class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(min_length=8)
    role: Role = Role.employee
    department: Department
    office: Office

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    full_name: str
    email: EmailStr
    role: Role
    department: Department
    office: Office
    is_active: bool
    created_at: datetime