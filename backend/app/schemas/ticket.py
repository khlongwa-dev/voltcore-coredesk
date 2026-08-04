from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.ticket import Category, Office, Priority, Status

class TickeCreate(BaseModel):
    title: str
    description: str
    category: Category
    priority: Priority
    office: Office

class TicketUpdate(BaseModel):
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
    created_by: int
    assigned_to: Optional[int] = None
    office: Office
    created_at: datetime
    updated_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None