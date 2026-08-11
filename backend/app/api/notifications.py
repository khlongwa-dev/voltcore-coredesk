from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.notification import NotificationResponse
from app.services.auth import get_current_active_user
from app.services.notification import list_notifications, mark_notification_read

router = APIRouter(
    prefix="/api/notifications",
    tags=["notifications"],
    dependencies=[Depends(get_current_active_user)],
)


@router.get("", response_model=list[NotificationResponse])
def list_mine(current_user: User = Depends(get_current_active_user), db: Session = Depends(get_db)):
    return list_notifications(db, current_user.id)


@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_read(
    notification_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return mark_notification_read(db, notification_id, current_user.id)