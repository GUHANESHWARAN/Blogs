# papercup - Full Stack Technology Blog Website (MERN Stack)

A clean, corporate technology blog website inspired by modern developer platforms and journals. Built with React, Vite, Node.js, Express, and a resilient document persistence layer supporting MongoDB.

## Setup

1. Copy `.env.example` to `.env` and set a strong, unique `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Install dependencies with `npm install --prefix server` and `npm install --prefix client`.
3. Run `npm run seed` from the project root to create the administrator and sample content.

The admin portal is available at [http://localhost:5173/admin/login](http://localhost:5173/admin/login), and the website is at [http://localhost:5173](http://localhost:5173).

---

## How to Run Manually

### Option 1: Double-click Batch File
Just double-click `start.bat` in the root `WEBSITE` directory. It starts both the backend API and frontend Vite server automatically.

---

### Option 2: Run via Two Terminal Windows (Recommended)

**Terminal 1 (Backend Server):**
```bash
cd server
node index.js
```
*(Runs backend API on port 5005)*

**Terminal 2 (Frontend React App):**
```bash
cd client
npm run dev
```
*(Runs frontend on http://localhost:5173)*

Then open your browser at **http://localhost:5173**.
