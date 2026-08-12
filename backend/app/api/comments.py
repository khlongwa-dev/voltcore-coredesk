from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse
from app.services.auth import get_current_active_user
from app.services.comment import create_comment, list_comments

router = APIRouter(
    prefix = "/api/tickets/{ticket_id}/comments",
    tags = ["comments"],
    dependencies = [Depends(get_current_active_user)],
)

@router.post("", response_model=CommentResponse, status_code=201)
def create(
    ticket_id: int,
    payload: CommentCreate,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    return create_comment(db, ticket_id, payload, current_user)

@router.get("", response_model=list[CommentResponse])
def list_all(
    ticket_id: int,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    return list_comments(db, ticket_id, current_user)