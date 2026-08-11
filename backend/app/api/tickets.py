from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.enums.enums import Role, Office, Status
from app.schemas.ticket import TicketCreate, TicketResponse, TicketUpdate, TicketAssign
from app.services.auth import get_current_active_user, require_role
from app.services.ticket import (
    assign_ticket,
    create_ticket,
    get_ticket,
    list_tickets,
    update_ticket_details,
    update_ticket_status,
)

router = APIRouter(
    prefix = "/api/tickets",
    tags = ["tickets"],
    dependencies = [Depends(get_current_active_user)],
)

@router.post("", response_model=TicketResponse, status_code=201)
def create(
    ticket_in: TicketCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return create_ticket(db, ticket_in, current_user)

@router.get("", response_model=list[TicketResponse])
def list_all(
    office: Optional[Office] = None,
    assigned_to_me: bool = Query(False),
    status: Optional[Status] = None,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return list_tickets(
        db, current_user, office=office, assigned_to_me=assigned_to_me, ticket_status=status
    )

@router.get("/{ticket_id}", response_model=TicketResponse)
def get_one(
    ticket_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return get_ticket(db, ticket_id, current_user)

@router.patch("/{ticket_id}", response_model=TicketResponse)
def update_details(
    ticket_id: int,
    payload: TicketUpdate,
    current_user: User = Depends(require_role(Role.agent, Role.admin)),
    db: Session = Depends(get_db),
):
    return update_ticket_details(db, ticket_id, payload, current_user)

@router.patch("/{ticket_id}/assign", response_model=TicketResponse)
def assign(
    ticket_id: int,
    payload: TicketAssign,
    current_user: User = Depends(require_role(Role.agent, Role.admin)),
    db: Session = Depends(get_db)
):
    return assign_ticket(db, ticket_id, payload.assigned_to, current_user)

@router.patch("/{ticket_id}/status", response_model=TicketResponse)
def update_status(
    ticket_id: int,
    new_status: Status,
    current_user: User = Depends(require_role(Role.agent, Role.admin)),
    db: Session = Depends(get_db),
):
    return update_ticket_status(db, ticket_id, new_status, current_user)