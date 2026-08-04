from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict
from app.enums.enums import Event

class TicketEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    ticket_id: int
    performed_by: Optional[int] = None
    event_type: Event
    old_value: Optional[str] = None
    new_value: Optional[str] = None
    created_at: datetime