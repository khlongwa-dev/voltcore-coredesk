from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.enums.enums import Event

class TicketEventResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    ticket_id: int
    performed_by: int
    event_type: Event
    old_value: str
    new_value: str
    created_at: datetime