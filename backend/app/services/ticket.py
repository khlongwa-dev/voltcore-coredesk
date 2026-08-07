from typing import Optional

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.enums.enums import Event, Office, Status, Role
from app.models.ticket_event import TicketEvent
from app.models.user import User
from app.models.ticket import Ticket
from app.schemas.ticket import TicketCreate, TicketUpdate

from app.services.notification import notify_critical_unassigned, notify_ticket_assigned

def _log_event(
        db: Session,
        ticket_id: int,
        performed_by: int,
        event_type: Event,
        old_value: Optional[str] = None,
        new_value: Optional[str] = None,
) -> None:
    db.add(
        TicketEvent(
            ticket_id = ticket_id,
            performed_by = performed_by,
            event_type = event_type,
            old_value = old_value,
            new_value = new_value,
        )
    )

def create_ticket(db: Session, ticket_in: TicketCreate, current_user: User) -> Ticket:
    ticket = Ticket(
        title = ticket_in.title,
        description = ticket_in.description,
        category = ticket_in.category,
        priority = ticket_in.priority,
        status = Status.open,
        office = ticket_in.office,
        created_by = current_user.id,
    )
    db.add(ticket)
    db.flush() # get ticket.id before commit, so the event can reference it

    _log_event(db, ticket.id, current_user.id, Event.created)

    db.commit()
    db.refresh(ticket)

    notify_critical_unassigned(db, ticket)
    return ticket


def get_ticket(db: Session, ticket_id: int, current_user: User) -> Ticket:
    ticket= db.query(Ticket).filter(Ticket.id == ticket_id).first()
    if not ticket:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found.")

    if current_user.role == Role.employee and ticket.created_by != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ticket not found")

    return ticket

def list_tickets(
        db: Session,
        current_user: User,
        office: Optional[Office] = None,
        assigned_to_me: bool = False,
        ticket_status: Optional[Status] = None,
) -> list[Ticket]:
    query = db.query(Ticket)

    if current_user.role == Role.employee:
        query = query.filter(Ticket.created_by == current_user.id)
    else:
        if assigned_to_me:
            query = query.filter(Ticket.assigned_to == current_user.id)
        if office:
            query = query.filter(Ticket.office == office)

    if ticket_status:
        query = query.filter(Ticket.status == ticket_status)

    return query.order_by(Ticket.created_at.desc()).all()


def update_ticket_details(
        db: Session, ticket_id: int, payload: TicketUpdate, current_user: User
) -> Ticket:
    ticket = get_ticket(db, ticket_id, current_user)

    if payload.category is not None:
        ticket.category = payload.category
    if payload.priority is not None:
        ticket.priority = payload.priority

    db.commit()
    db.refresh(ticket)
    return ticket

def assign_ticket(db: Session, ticket_id: int, agent_id: int, current_user: User) -> Ticket:
    ticket = get_ticket(db, ticket_id, current_user)

    was_assigned = ticket.assigned_to is not None
    old_value = str(ticket.assigned_to) if was_assigned else None

    ticket.assigned_to = agent_id
    _log_event(
        db,
        ticket.id,
        current_user.id,
        Event.reassigned if was_assigned else Event.assigned,
        old_value = old_value,
        new_value = str(agent_id)
    )

    db.commit()
    db.refresh(ticket)

    notify_ticket_assigned(db, ticket)
    return ticket


def update_ticket_status(
        db: Session, ticket_id: int, new_status: Status, current_user: User
) -> Ticket:
    ticket = get_ticket(db, ticket_id, current_user)
    old_status = ticket.status

    if old_status == new_status:
        return ticket

    ticket.status = new_status
    if new_status == Status.resolved:
        from datetime import datetime, timezone
        ticket.resolved_at = datetime.now(timezone.utc)

    event_type = {
        Status.resolved: Event.resolved,
        Status.closed: Event.closed,
    }.get(new_status, Event.status_changed)

    _log_event(
        db,
        ticket_id,
        current_user.id,
        event_type,
        old_value = old_status.value,
        new_value = new_status.value,
    )

    db.commit()
    db.refresh(ticket)
    return ticket

