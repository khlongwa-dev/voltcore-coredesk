from sqlalchemy import Column, String, Integer, Text, DateTime, Enum, ForeignKey
from sqlalchemy.sql import func
from app.database import Base
from app.enums.enums import Office, Category, Priority, Status

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    category = Column(Enum(Category), nullable=False)
    priority = Column(Enum(Priority), nullable=False)
    status = Column(Enum(Status), nullable=False, default=Status.open)
    created_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    assigned_to = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    office = Column(Enum(Office), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now(), server_default=func.now(), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)