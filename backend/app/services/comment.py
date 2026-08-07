from typing import List

from sqlalchemy.orm import Session

from app.models.comment import Comment
from app.models.user import User
from app.enums.enums import Role
from app.schemas.comment import CommentCreate
from app.services.ticket import get_ticket

def create_comment(
        db: Session, ticket_id: int, payload: CommentCreate, current_user: User
) -> Comment:
    get_ticket(db, ticket_id, current_user)
    is_internal = payload.is_internal if current_user.role in (Role.agent, Role.admin) else False

    comment = Comment(
        ticket_id = ticket_id,
        author_id = current_user.id,
        body = payload.body,
        is_internal = is_internal,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)
    return comment

def list_comments(db: Session, ticket_id: int, current_user: User) -> List[Comment]:
    get_ticket(db, ticket_id, current_user)

    query = db.query(Comment).filter(Comment.ticket_id == ticket_id)

    if current_user.role == Role.employee:
        query = query.filter(Comment.is_internal.is_(False))

    return query.order_by(Comment.created_at.asc()).all()