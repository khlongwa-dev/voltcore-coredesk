from sqlalchemy import Column, String, Integer, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from app.database import Base
import enum

class Event(str, enum.Enum):
    created = "created"
    assigned = "assigned"
    reassigned = "reassigned"
    status_changes = "status_changed"
    commented = "commented"
    resolved = "resolved"
    closed = "closed"

class TicketEvent(Base):
    __tablename__ = "ticket_events"

    id = Column(Integer, primary_key=True, index=True)
    ticket_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"))
    performed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    event_type = Column(Enum(Event), nullable=False)
    old_value = Column(String, nullable=True)
    new_value = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())