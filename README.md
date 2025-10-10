# Banking App - Signup + Chatbot

This project contains a simple banking app with a React frontend and a Node.js backend. It supports account signup and a lightweight chatbot for common banking questions.

## Structure

- `server/` – Node.js + Express backend
- `client/` – React + Vite frontend

## Prerequisites

- Node.js 18+

## Setup

In two terminals:

1. Backend

```bash
cd server
npm install
npm run dev
```

2. Frontend

```bash
cd client
npm install
npm run dev
```

Open the frontend at `http://localhost:5173`. The backend runs at `http://localhost:4000`.

You can override the backend URL by creating a `.env` file in `client/` with:

```
VITE_API_BASE=http://localhost:4000
```

## API

- `POST /api/signup` – body: `{ fullName, email, password, phone? }`
- `POST /api/chat` – body: `{ message }`

Users are persisted to `server/data/users.json` for demo purposes only.
