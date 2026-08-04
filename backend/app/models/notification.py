from sqlalchemy import Column, Enum, Integer, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.database import Base
from app.enums.enums import Channel

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    ticket_id = Column(Integer, ForeignKey("tickets.id", ondelete="CASCADE"), nullable=False)
    message = Column(Text, nullable=False)
    channel = Column(Enum(Channel), nullable=False, default=Channel.ntfy)
    is_sent = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    sent_at = Column(DateTime(timezone=True), nullable=True)