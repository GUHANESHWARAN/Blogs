# papercup - Full Stack Technology Blog Website (MERN Stack)

A clean, corporate technology blog website inspired by modern developer platforms and journals. Built with React, Vite, Node.js, Express, and a resilient document persistence layer supporting MongoDB.

## Setup

1. Copy `.env.example` to `.env` and set a strong, unique `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Install dependencies with `npm install --prefix server` and `npm install --prefix client`.
3. Run `npm start` from the project root to create the administrator and sample content on first launch, then start the server.

The admin portal is available at [http://localhost:5173/admin/login](http://localhost:5173/admin/login), and the website is at [http://localhost:5173](http://localhost:5173).

---

## Deploy on Render

GitHub stores the source code; it does not run the Node.js server. To host the complete application:

1. Push this repository to GitHub and sign in to [Render](https://render.com/).
2. In Render, create a **Blueprint** and select this repository. Render will use `render.yaml` to build and deploy the app.
3. Enter `ADMIN_USERNAME`, `ADMIN_EMAIL`, and a strong `ADMIN_PASSWORD` when prompted. Render generates `JWT_SECRET`.
4. Wait for the first deploy and the initial seed to finish, then open the service URL provided by Render.

The Blueprint attaches a persistent disk at `/var/data` for posts, categories, authors, admin accounts, and uploaded images. A Render plan that supports persistent disks is required; check Render's current pricing before deployment. Keep the generated JWT secret and admin credentials private.

GitHub Pages can publish only the static React client; it cannot run this app's API or admin backend. The Render service serves both the frontend and backend from one URL.

---

## How to Run Manually

### Option 1: Double-click Batch File
Just double-click `start.bat` in the root `WEBSITE` directory. It starts both the backend API and frontend Vite server automatically.

---

### Option 2: Run via Two Terminal Windows (Recommended)

**Terminal 1 (Backend Server):**
```bash
node server/start.js
```
*(Runs backend API on port 5005)*

**Terminal 2 (Frontend React App):**
```bash
cd client
npm run dev
```
*(Runs frontend on http://localhost:5173)*

Then open your browser at **http://localhost:5173**.
