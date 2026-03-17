<div align="center">

```
                                    ███████╗██████╗  █████╗ ██████╗ ██╗  ██╗
                                    ██╔════╝██╔══██╗██╔══██╗██╔══██╗██║ ██╔╝
                                    ███████╗██████╔╝███████║██████╔╝█████╔╝
                                    ╚════██║██╔═══╝ ██╔══██║██╔══██╗██╔═██╗
                                    ███████║██║     ██║  ██║██║  ██║██║  ██╗
                                    ╚══════╝╚═╝     ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
```

# Spark

**AI-powered UI Builder for rapid prompt-to-interface generation**

Generate polished interfaces from natural language, preview instantly, and refine through a chat-style workflow.

[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Project Structure](#-project-structure) · [API Reference](#-api-reference) · [Environment Variables](#-environment-variables)

</div>

---

## ✨ Features

- **Prompt-to-Code Generation** - Send natural language prompts and get full HTML documents with structured CSS and optional JS.
- **Chat-Style Iteration** - Refine output with follow-up prompts in a conversational builder panel.
- **Live Preview + Code View** - Switch between rendered output and source code instantly.
- **Resizable Workspace** - Drag-adjustable split layout between prompt/chat and output pane.
- **Copy-Ready Output** - One-click code copy for quick export and reuse.
- **Secure JWT Auth** - Register/login flow with protected generation routes.
- **Persistent Generation Records** - Generated outputs are stored in PostgreSQL per user.
- **Polished Landing + Auth UX** - Marketing landing, themed login/register pages, and protected route gating.

---

## 🛠 Tech Stack

### Frontend

| Technology       | Purpose                                         |
| ---------------- | ----------------------------------------------- |
| React 19 + Vite  | SPA framework and build tooling                 |
| React Router DOM | Client-side routing and protected navigation    |
| Axios            | API client with auth token interceptor          |
| Lucide React     | UI icons                                        |
| Custom CSS       | Branded UI for landing/auth/builder experiences |

### Backend

| Technology               | Purpose                                      |
| ------------------------ | -------------------------------------------- |
| Node.js + Express        | REST API server                              |
| PostgreSQL (`pg`)        | User and generation persistence              |
| JSON Web Tokens          | Stateless auth for protected routes          |
| bcryptjs                 | Password hashing                             |
| Google Generative AI SDK | Gemini-powered UI code generation            |
| CORS + dotenv            | Environment configuration and origin control |

### External Services

| Service                                                          | Purpose                             | Notes                                         |
| ---------------------------------------------------------------- | ----------------------------------- | --------------------------------------------- |
| [Google AI Studio / Gemini](https://aistudio.google.com)         | Model inference for code generation | Requires `GEMINI_API_KEY`                     |
| [Supabase Postgres](https://supabase.com) or any PostgreSQL host | Production database                 | SSL config is already enabled in backend pool |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have:

- **Node.js** v18 or higher
- **PostgreSQL** (local or hosted)
- **Git**
- A valid **Gemini API key**

### 1. Clone the Repository

```bash
git clone https://github.com/subxm/Spark.git
cd Spark
```

### 2. Set Up the Database

Run the SQL schema:

```bash
# Example with psql
psql "your_postgres_connection_string" -f schema/schema.sql
```

This creates:

- `users`
- `generations`
- `idx_generations_user`

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
```

Run backend:

```bash
npm run dev
# or
npm start
```

### 4. Configure the Frontend

Open a second terminal:

```bash
cd frontend
npm install
```

Create `frontend/.env` (optional but recommended):

```env
VITE_API_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Visit: **http://localhost:5173**

---

## 📁 Project Structure

```text
Spark/
│
├── backend/                       # Express API server
│   ├── config/
│   │   └── db.js                  # PostgreSQL pool (SSL enabled)
│   ├── controllers/
│   │   └── authController.js      # Register and login handlers
│   ├── middleware/
│   │   └── authMiddleware.js      # JWT verification middleware
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth/*
│   │   ├── generateRoutes.js      # /api/generate
│   │   └── historyRoutes.js       # /api/history (placeholder)
│   ├── package.json
│   └── server.js                  # App entry point + route mounting
│
├── frontend/                      # React client app
│   ├── src/
│   │   ├── components/
│   │   │   └── FormInput.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state + token persistence
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Builder.jsx        # Prompt/chat + preview workspace
│   │   ├── services/
│   │   │   └── api.js             # Axios instance + API helpers
│   │   ├── App.jsx                # Routes + ProtectedRoute
│   │   └── main.jsx
│   └── package.json
│
├── schema/
│   └── schema.sql                 # PostgreSQL schema
└── README.md
```

---

## 🗄 Database Schema

```text
users (1) ----------- (N) generations
```

| Table         | Description                                                            |
| ------------- | ---------------------------------------------------------------------- |
| `users`       | Stores account identity, email, hashed password, timestamps            |
| `generations` | Stores prompt, generated code, favorite state, owner, and created date |

Key details:

- `generations.user_id` is a foreign key to `users.id` with `ON DELETE CASCADE`
- `is_favourite` defaults to `false`
- `idx_generations_user` accelerates per-user history lookups

---

## 📡 API Reference

Base URL: `http://localhost:5000`

### Auth

| Method | Endpoint             | Description                      | Auth |
| ------ | -------------------- | -------------------------------- | ---- |
| `POST` | `/api/auth/register` | Create a new user and return JWT | ❌   |
| `POST` | `/api/auth/login`    | Login and return JWT             | ❌   |

### Generation

| Method | Endpoint        | Description                                     | Auth |
| ------ | --------------- | ----------------------------------------------- | ---- |
| `POST` | `/api/generate` | Generate UI code from prompt and persist result | ✅   |

### History

| Method | Endpoint       | Description                                      | Auth |
| ------ | -------------- | ------------------------------------------------ | ---- |
| `GET`  | `/api/history` | Placeholder response for upcoming history module | ✅   |

### Health

| Method | Endpoint | Description       |
| ------ | -------- | ----------------- |
| `GET`  | `/`      | API running check |

---

## 🔐 Authentication Flow

1. User registers or logs in through `/api/auth/*`.
2. Backend returns a JWT (24h expiry).
3. Frontend stores token in localStorage.
4. Axios interceptor attaches `Authorization: Bearer <token>` to API calls.
5. Protected routes validate token through middleware.

---

## 🧭 User Flow

1. Open landing page.
2. Sign up or log in.
3. Enter a UI prompt in Builder.
4. Backend calls Gemini and returns generated document code.
5. Preview inside iframe or inspect raw code tab.
6. Continue refining through chat-style iterations.

---

## 🔒 Environment Variables

### `backend/.env`

| Variable         | Required | Description                     |
| ---------------- | -------- | ------------------------------- |
| `PORT`           | ❌       | Server port (default: `5000`)   |
| `FRONTEND_URL`   | ✅       | Frontend origin allowed by CORS |
| `DATABASE_URL`   | ✅       | PostgreSQL connection string    |
| `JWT_SECRET`     | ✅       | Secret used to sign/verify JWT  |
| `GEMINI_API_KEY` | ✅       | API key for Gemini model access |

### `frontend/.env`

| Variable       | Required | Description                                         |
| -------------- | -------- | --------------------------------------------------- |
| `VITE_API_URL` | ❌       | Backend base URL (default: `http://localhost:5000`) |

---

## 🧪 Scripts

### Backend (`backend/package.json`)

| Script  | Command             | Purpose                        |
| ------- | ------------------- | ------------------------------ |
| `start` | `node server.js`    | Run backend in production mode |
| `dev`   | `nodemon server.js` | Run backend with auto-reload   |

### Frontend (`frontend/package.json`)

| Script    | Command        | Purpose                          |
| --------- | -------------- | -------------------------------- |
| `dev`     | `vite`         | Start development server         |
| `build`   | `vite build`   | Create production build          |
| `preview` | `vite preview` | Preview production build locally |
| `lint`    | `eslint .`     | Lint frontend source             |

---

## 🚢 Deployment

### Suggested Stack

| Layer    | Service                  |
| -------- | ------------------------ |
| Frontend | Vercel / Netlify         |
| Backend  | Railway / Render         |
| Database | Supabase Postgres / Neon |

### Deploy Checklist

1. Deploy backend first and configure all backend env vars.
2. Set `FRONTEND_URL` to your deployed frontend domain.
3. Deploy frontend and set `VITE_API_URL` to backend public URL.
4. Verify auth + generation end-to-end with production URLs.

---

## ⚠ Current Limitations

- `GET /api/history` is currently a placeholder route.
- Frontend service helpers include delete/favorite history actions, but matching backend routes are not implemented yet.

---

## 🛣 Roadmap

- [x] Prompt-based UI generation with live preview
- [x] Chat-style iterative builder UX
- [ ] Full history retrieval API + frontend history page
- [ ] Favorite toggling and deletion endpoints
- [ ] Better multi-turn context memory between prompts
- [ ] One-click deploy/export flows

---

## 🤝 Contributing

Contributions are welcome.

```bash
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
```

Open a Pull Request and include a clear description with screenshots for UI updates.

---

## 📄 License

No license file has been added yet. Add a `LICENSE` file before open-source distribution.

---

<div align="center">

Built by [subxm](https://github.com/subxm)

If Spark helped you, consider starring the repo.

</div>
