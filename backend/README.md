# Coredesk Backend

FastAPI backend for Coredesk. Handles auth, tickets, comments,
notifications and user management.

## What you need first

- Python 3.14 (or whatever you've got, just check `python3 --version`)
- PostgreSQL running locally, with a database and user already created
- Node isn't needed here, that's the frontend

## Setup

Clone the repo and get into the backend folder, then set up a virtual
environment:

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Environment variables

Copy `.env.example` to `.env` and fill in your own values:

```bash
cp .env.example .env
```

You'll need:

- `DATABASE_URL`, your Postgres connection string
- `SECRET_KEY`, used to sign JWTs. Generate a real one with
  `python -c "import secrets; print(secrets.token_hex(32))"`, don't ship
  the placeholder
- `ALGORITHM`, leave this as `HS256` unless you know why you'd change it
- `ACCESS_TOKEN_EXPIRE_MINUTES`, how long a login session lasts
- `DEFAULT_TEMP_PASSWORD`, what every CSV-provisioned user starts with
- `NTFY_BASE_URL` and `NTFY_TOPIC_PREFIX`, for push notifications

Watch out for typos in this file. A misspelled key here is quiet, it won't
throw an error until something downstream tries to use it and can't find
it. Learned that one the hard way.

## Set up the database

This project doesn't use a migration tool yet, so whenever the models
change, you rebuild the tables from scratch:

```bash
python -c "from app.database import Base, engine; import app.models.user, app.models.ticket, app.models.comment, app.models.ticket_event, app.models.notification; Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)"
```

Fine to run this early on. Once real data matters, this needs to become a
proper migration instead.

## Provision your users

There's no public sign up. Everyone comes from a CSV, same way I did the
80 AD users back in Phase 2 of this roadmap.

Your CSV needs these columns: `full_name,email,role,department,office`.
Roles are `employee`, `agent` or `admin`. Drop it in `app/data/` and run:

```bash
python -m app.scripts.provision_users app/data/employees.csv
```

Everyone comes in on the shared `DEFAULT_TEMP_PASSWORD` and has to change
it on first login, that's enforced, there's no way round it through the
frontend.

### Getting your first admin

Nobody starts out as admin. The role-change endpoint itself needs an admin
to call it, so the very first one has to be set directly in the database:

```bash
psql -d coredesk -c "UPDATE users SET role='admin' WHERE email='your.email@voltcore.co.za';"
```

After that, every other promotion goes through the API properly.

## Run it

```bash
uvicorn app.main:app --reload
```

Runs on `http://localhost:8000`. Docs are at `/docs`, that's where you can
test every endpoint by hand before the frontend's even involved.

## CORS

The backend only accepts requests from `http://localhost:5173` right now,
that's where the frontend runs in dev. If you deploy this somewhere, add
the real frontend URL to `allow_origins` in `app/main.py`, don't just open
it up to everything.

## A note on the stack

`bcrypt` is pinned to `4.0.1` in requirements.txt on purpose. Newer
versions break `passlib`'s internal checks, it's a known clash between the
two libraries, not something wrong with this code. Don't bump it without
checking that's actually been fixed upstream first.
