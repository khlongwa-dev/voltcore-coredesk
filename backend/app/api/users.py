from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.enums.enums import Role
from app.schemas.user import UserResponse
from app.services.auth import require_role

router = APIRouter(
    prefix = "/api/users",
    tags = ["users"],
    dependencies = [Depends(require_role(Role.admin))],
)

@router.get("", response_model=list[UserResponse])
def list_users(db: Session = Depends(get_db)):
    return db.query(User).order_by(User.full_name).all()

@router.patch("/{user_id}/deactivate", response_model=UserResponse)
def deactivate_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = False
    db.commit()
    db.refresh(user)
    return user

@router.patch("/{user_id}/reactivate", response_model=UserResponse)
def reactivate_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.is_active = True
    db.commit()
    db.refresh(user)
    return user

@router.patch("/{user_id}/role", response_model=UserResponse)
def change_role(user_id: int, new_role: Role, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    user.role = new_role
    db.commit()
    db.refresh(user)
    return user