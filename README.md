# Coredesk

An IT helpdesk system built for Voltcore Engineering Solutions, a fictional
company specializing in electrical infrastructure, industrial automation, and IT systems integration
for the mining, manufacturing, and commercial sectors across South Africa.

Employees log issues. IT agents pick them up, work them and close them out.
Admins manage the team and keep an eye on the whole queue. Everything gets
logged, from who created a ticket to who touched it last, so there's always
a trail.

This is part of my 110 day Systems Administration roadmap, Phase 4. I am
pivoting from software development into systems administration and
infrastructure, and Coredesk is where I put the development side of things
to use while I do that.

## Why I built it this way

Voltcore doesn't have open sign up. IT provisions every account from a CSV,
same way I did the 80 users in the Active Directory phase of this roadmap.
Everyone starts on a shared temporary password and has to change it before
they can do anything else. No employee can see another employee's tickets,
and internal notes agents leave for each other stay internal.

Three roles run the whole thing:

- **Employee** submits tickets and tracks their own
- **Agent** works the queue, assigns tickets, resolves them, leaves internal notes
- **Admin** does everything an agent does plus manages users and roles

## Stack

**Backend:** FastAPI, PostgreSQL, SQLAlchemy, JWT auth
**Frontend:** React, Vite, Tailwind CSS
**Notifications:** ntfy.sh, so agents get pinged the moment a critical ticket
comes in unassigned

## Structure

```
voltcore-coredesk/
                  ├── backend/     FastAPI API, see backend/README.md to run it
                  ├── frontend/    React app, see frontend/README.md to run it
                  └── README.md    you're reading it
```

## Getting it running

Backend first, it needs to be up before the frontend can talk to it.
Full steps are in each folder's own README:

1. [`backend/README.md`](./backend/README.md)
2. [`frontend/README.md`](./frontend/README.md)

## Where this sits in the roadmap

Coredesk is Phase 4 of my 110 day roadmap. Earlier phases:

- **Phase 1, The Fortress Project** — a hardened Ubuntu server, SSH locked
  down, fail2ban, automated backups
- **Phase 2, Voltcore AD Environment** — a full Active Directory setup for
  the same fictional company, two sites, 80 users, GPOs, working replication
- **Phase 3, Voltcore Network** — the same company's WAN, built out fully in
  Cisco Packet Tracer, two offices talking to each other

Coredesk ties into all of it. Same fictional company, same two offices,
same people, just now with a proper helpdesk running on top.

## About me

I'm Kusasalakhe Hlongwa, based in Durban. I post about this roadmap weekly
on LinkedIn. Find the rest of my work on GitHub at
[khlongwa-dev](https://github.com/khlongwa-dev).
