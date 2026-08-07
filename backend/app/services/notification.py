from datetime import datetime, timezone

import httpx
from sqlalchemy.orm import Session

from app.config import settings
from app.models.notification import Notification
from app.models.ticket import Ticket
from app.enums.enums import Priority, Channel
from app.models.user import User

def _ntfy_topic(user_id: int) -> str:
    return f"{settings.NTFY_TOPIC_PREFIX}-{user_id}"

def _send_ntfy(user_id: int, message: str, title: str = "Coredesk") -> bool:
    topic = _ntfy_topic(user_id)
    try:
        response = httpx.post(
            f"{settings.NTFY_BASE_URL}/{topic}",
            data = message.encode("utf-8"),
            headers = {"Title": title},
            timeout = 5.0,
        )
        return response.status_code == 200
    except httpx.HTTPError:
        return False

def notify_user(db: Session, user_id: int, ticket_id: int, message: str) -> Notification:
    notification = Notification(
        user_id = user_id,
        ticket_id = ticket_id,
        message = message,
        channel = Channel.ntfy,
        is_sent = False,
    )
    db.add(notification)
    db.flush()

    if _send_ntfy(user_id, message):
        notification.is_sent = True
        notification.sent_at = datetime.now(timezone.utc)

    db.commit()
    db.refresh(notification)
    return notification

def notify_ticket_assigned(db: Session, ticket: Ticket) -> None:
    if ticket.assigned_to:
        notify_user(
            db,
            ticket.assigned_to,
            ticket.id,
            f"Ticket #{ticket.id} '{ticket.title}' has been assigned to you.",
        )

def notify_critical_unassigned(db: Session, ticket: Ticket) -> None:
    if ticket.priority == Priority.critical and ticket.assigned_to is None:
        agents = db.query(User).filter(User.role.in_(["agent", "admin"])).all()

        for agent in agents:
            notify_user(
                db,
                agent.id,
                ticket.id,
                f"CRITICAL ticket #{ticket.id} '{ticket.title}' is unassigned.",
            )