# Athenaeum — College Library Management System

Athenaeum is a library management system for colleges, built to replace manual, register-based tracking with a role-based web application. It handles the full lending cycle: cataloging books, registering students, issuing loans, processing returns, and calculating overdue fines.

It's a MERN stack project. **MongoDB** for storage, **Express** for the API, **React** for the interface, **Node** underneath all of it. Two roles exist: student and admin. A student logs in and sees what they've borrowed, when it's due, what they owe. An admin manages the catalog, issues books, marks returns, and blocks accounts that don't return items on time.

## What it actually does

- Students register, log in, and see a dashboard of their currently issued books, due dates, and outstanding fines
- Admins add, edit, and remove books from the catalog
- Admins issue a book to a student and set a due date, with a live preview before confirming
- Returning a book updates the copy count and calculates a fine if it's late
- Overdue status isn't stored as a fixed value. I calculate it live, against today's date, every time it's displayed
- Every write action that matters (adding a book, blocking a student, issuing a loan) sits behind role-checked middleware, not just a hidden button on the frontend

## Stack

| Layer | Tech |
|---|---|
| Frontend | React, React Router, Axios, Vite |
| Backend | Node.js, Express |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |

## Why I made some of the choices I did

I didn't trust the frontend to enforce anything security-related, because a Postman request can bypass a frontend in about ten seconds. So role checks (`protect`, `adminOnly`) live entirely on the server. A student token hitting an admin route gets a `403`, no matter what the React app tried to hide or show.

I also didn't store "overdue" as a saved status that needs a background job to keep updating. I calculate it from `dueDate` versus `today`, on every request. One less moving part to get wrong.

## Getting it running locally

You'll need Node installed and a local MongoDB instance running.

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

You'll need a `.env` file inside `backend`, with your own values:
```
MONGO_URI=mongodb://127.0.0.1:27017/library
JWT_SECRET=your_own_secret_here
PORT=5000
```

None of that gets committed. Check `.gitignore` before you push anything.

## Project structure

```
backend/
├── models/        # User, Book, Issue schemas
├── middleware/     # protect, adminOnly
├── server.js
frontend/
├── src/
│   ├── api/         # axios instance, interceptor
│   ├── components/  # Sidebar, Topbar, Modal, StatCard
│   ├── pages/
│   │   ├── Student/
│   │   └── Admin/
│   └── utils/       # date helpers
```

## Bugs I actually hit while building this

I'm listing these because I think a README that pretends everything went smoothly is lying to you.

- Forgot `await` on a few Mongoose calls and stored a pending Promise instead of real data
- Mismatched field names between frontend and backend — sent `branch`, schema expected `department`
- Middleware in the wrong order, read `req.user.role` before `protect` had run, crashed on `undefined`
- A `.filter()` callback with no `return` statement, silently dropping every row instead of filtering correctly

None of these were exotic. All of them cost real time to track down.

## What's not built yet

- No email or SMS reminders before a due date
- No barcode scanning for issuing books faster
- No pagination on the book catalog, so a very large collection would load everything at once

I'm fixing what breaks first, not what looks impressive in a demo.

## Running it as more than a solo project

If you clone this and want to extend it, the service-layer pattern in `src/api/` is where I'd start. Every route's expected request and response shape is documented as a comment at the top of its service file. Match that shape, and the frontend components barely need to change.
