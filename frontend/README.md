# Coredesk Frontend

React app for Coredesk. Built with Vite, styled with Tailwind CSS.

## What you need first

- Node.js, whatever recent LTS version you've got
- The backend running already at `http://localhost:8000`, this app can't
  do anything on its own without it

## Setup

```bash
cd frontend
npm install
```

## Run it

```bash
npm run dev
```

Runs on `http://localhost:5173`. Log in with a user from the backend's CSV
provisioning, first login forces a password change, that's expected, not
a bug.

## How the styling works

This uses Tailwind CSS v4, which changed how it's set up compared to older
versions. There's no `tailwind.config.js` here. The Tailwind plugin lives
in `vite.config.js`, and the whole colour and font system is defined
straight inside `src/index.css` using an `@theme` block. If you're used to
the old config file setup, it's not missing, it just doesn't exist
anymore in v4.

The colours are Voltcore's, navy and orange, defined once as CSS variables
so every component pulls from the same source instead of hardcoded hex
values scattered everywhere.

## How the project is organised

This follows Component-Driven Development. Built bottom up, not page
first:

```
src/
├── components/
│   ├── ui/            small reusable pieces, Button, Badge, StatusPill, Card
│   └── features/      built from ui/, TicketCard, TicketTable, CommentThread
├── containers/         where data actually gets fetched and passed down
├── pages/               one file per route, kept short on purpose
├── layouts/              AppLayout, the sidebar and topbar shell
├── context/               AuthContext, who's logged in right now
├── services/               thin wrappers around the backend API, one file per resource
├── hooks/                   React Query hooks for fetching and caching
├── routes/                   ProtectedRoute, keeps people out of pages they shouldn't see
└── permissions.js              one file, every role check goes through it
```

If you're coming from a background like mine, .NET and Clean Architecture,
here's the rough mapping. `services/` is your infrastructure layer,
`containers/` and `hooks/` are the application layer, `permissions.js` is
the one bit of domain logic this frontend actually owns. Everything else
defers to the backend.

No atomic design here. Just `ui/` and `features/`, that's the only split,
kept deliberately shallow.

## Role based access

Two layers of this, and they need to agree with each other or you'll get
weird UX, a button that shows up then fails when clicked:

- **Route level**, `ProtectedRoute` keeps someone off a whole page they
  shouldn't reach, the admin users page for example
- **Element level**, `permissions.js` decides whether a specific button or
  section shows up inside a page everyone can otherwise see

If you add a new permission rule, add it to `permissions.js` first, then
use it wherever it's needed. Don't write a role check inline in a
component, that's how these rules drift out of sync with the backend over
time.

## A gotcha worth knowing about

React Query caches by query key. If you're passing an id into a hook like
`useTicket(id)`, make sure you're consistent about where that id comes
from. `useParams()` gives you a string, a ticket object's `.id` field is
a number. Mixing the two means a mutation can succeed on the backend but
the UI won't update until a manual refresh, because React Query thinks
they're two different cached things. Bit me more than once building this,
worth knowing up front.
