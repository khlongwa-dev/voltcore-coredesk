import csv
import sys

from app.database import SessionLocal
from app.models.user import User
from app.enums.enums import Role, Department, Office
from app.services.auth import hash_password
from app.config import settings

def provision_from_csv(path: str) -> None:
    db = SessionLocal()
    created, skipped = 0, 0

    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)

        for row in reader:
            email = row["email"].strip().lower()
            if db.query(User).filter(User.email == email).first():
                print(f"skip (exists): {email}")
                skipped += 1
                continue

            user = User(
                full_name = row["full_name"].strip(),
                email = email,
                password_hash = hash_password(settings.DEFAULT_TEMP_PASSWORD),
                role = Role(row["role"].strip()),
                department = Department(row["department"].strip()),
                office = Office(row["office"].strip()),
                must_change_password = True,
            )

            db.add(user)
            created += 1

    db.commit()
    db.close()
    print(f"done: created {created}, skipped {skipped}.")

if __name__ == "__main__":
    provision_from_csv(sys.argv[1] if len(sys.argv) > 1 else "employees.csv")