from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, Field
from app.enums.enums import Channel

class NotificationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    
    id: int
    user_id: int
    ticket_id: int
    message: str
    channel: Channel
    is_sent: bool
    is_read: bool
    created_at: datetime
    sent_at: Optional[datetime] = None