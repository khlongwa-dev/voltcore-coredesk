from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.enums.enums import Category, Office, Priority, Status
from app.schemas.user import UserSummary
class TicketCreate(BaseModel):
    title: str
    description: str
    category: Category
    priority: Priority
    office: Office

class TicketAssign(BaseModel):
    assigned_to: int

class TicketUpdate(BaseModel):
    status: Optional[Status] = None
    category: Optional[Category] = None
    priority: Optional[Priority] = None
    assigned_to: Optional[int] = None

class TicketResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    title: str
    description: str
    category: Category
    priority: Priority
    status: Status
    created_by: Optional[int] = None
    assigned_to: Optional[int] = None
    assignee: Optional[UserSummary] = None
    office: Office
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None