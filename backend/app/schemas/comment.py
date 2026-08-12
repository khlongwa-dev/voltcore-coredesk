from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from app.schemas.user import UserSummary
class CommentCreate(BaseModel):
    body: str = Field(min_length=1)
    is_internal: bool = False

class CommentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_id: int
    author_id: int
    author: Optional[UserSummary] = None
    body: str
    is_internal: bool
    created_at: datetime