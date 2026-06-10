<div align="center">

```text
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
- **Library Sidebar** - Accessible drawer to scroll through and instantly load your saved generation history.
- **Resizable Workspace** - Drag-adjustable split layout between prompt/chat and output pane.
- **Copy-Ready Output** - One-click code copy for quick export and reuse.
- **Secure JWT Auth** - Register/login flow with protected generation routes.
- **Persistent Generation Records** - Generated outputs are stored securely in PostgreSQL per user.
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
│   │   └── historyRoutes.js       # /api/history
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
│   ├── package.json
│   └── vercel.json                # Vercel SPA routing
│
├── schema/
│   └── schema.sql                 # PostgreSQL schema
└── README.md
```

---

## 🗄 Database Schema

```mermaid
erDiagram
    users {
        int id PK
        varchar name
        varchar email UK
        varchar password
        text avatar_url
        timestamp created_at
    }
    generations {
        int id PK
        int user_id FK
        text prompt
        text generated_code
        boolean is_favourite
        varchar share_id UK
        timestamp created_at
    }
    users ||--o{ generations : "owns"
```

### Table Structure

#### `users` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique identifier for the user |
| `name` | `VARCHAR(100)` | `NOT NULL` | Full name of the user |
| `email` | `VARCHAR(150)` | `NOT NULL, UNIQUE` | Unique email for authentication |
| `password` | `VARCHAR(255)` | `NOT NULL` | Hashed password of the user |
| `avatar_url` | `TEXT` | `NULL` | Optional URL of the user's avatar image |
| `created_at` | `TIMESTAMP` | `NOT NULL, DEFAULT NOW()` | Date and time of user registration |

#### `generations` Table
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `SERIAL` | `PRIMARY KEY` | Unique identifier for the generation |
| `user_id` | `INT` | `NOT NULL, REFERENCES users(id) ON DELETE CASCADE` | Foreign key referencing the owner of the generation |
| `prompt` | `TEXT` | `NOT NULL` | The input prompt sent by the user |
| `generated_code` | `TEXT` | `NOT NULL` | The generated HTML/CSS/JS source code |
| `is_favourite` | `BOOLEAN` | `NOT NULL, DEFAULT FALSE` | Flag indicating if the generation is starred/favorited |
| `share_id` | `VARCHAR(50)` | `UNIQUE` | Unique random slug for share links |
| `created_at` | `TIMESTAMP` | `NOT NULL, DEFAULT NOW()` | Date and time when the UI code was generated |

- **Index**: `idx_generations_user` on `generations(user_id)` for high-performance retrieval of user generation logs.

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

| Method   | Endpoint                     | Description                                           | Auth |
| -------- | ---------------------------- | ----------------------------------------------------- | ---- |
| `GET`    | `/api/history`               | Fetch all past generations for the authenticated user | ✅   |
| `DELETE` | `/api/history/:id`           | Delete a specific logged generation                   | ✅   |
| `PATCH`  | `/api/history/:id/favourite` | Toggle favorite state for a generation                | ✅   |

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

## 🧭 Application Process & User Flow

### 1. Process Architecture Flow
This diagram illustrates the high-level routing, token validations, external Gemini inference, and frontend dynamic preview sandbox.

```mermaid
flowchart TD
    subgraph Client [Frontend (React + Vite)]
        A[Landing Page] --> B{Authenticated?}
        B -- No --> C[Login / Register Pages]
        C -->|Success: Save JWT| D[Builder Workspace]
        B -- Yes --> D
        D -->|1. Submit Prompt| E[Prompt Input Panel]
        D -->|4. Render iframe| F[Live Interactive Preview]
        D -->|5. View Source Code| G[Monaco/Code Editor View]
        D -->|6. Select History| H[Library Sidebar]
    end

    subgraph Server [Backend (Express + Node.js)]
        E -->|POST /api/generate with JWT| I[Auth Middleware]
        I -->|Valid JWT| J[Generation Controller]
        H -->|GET /api/history| K[History Controller]
    end

    subgraph External [External Services / DB]
        J -->|2. Request UI Generation| L[Gemini API]
        L -->|3. Return Clean HTML| J
        J -->|Save Record| M[(Supabase Postgres)]
        K -->|Fetch User Records| M
    end

    style Client fill:#1f1f2e,stroke:#4a4a6a,stroke-width:2px,color:#fff
    style Server fill:#1a2332,stroke:#3b5998,stroke-width:2px,color:#fff
    style External fill:#16241d,stroke:#2e7d32,stroke-width:2px,color:#fff
```

### 2. Prompt-to-Code Generation Lifecycle
A sequence diagram showcasing the step-by-step token validation, generation, and dynamic rendering.

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as React Client
    participant Backend as Express Server
    participant DB as PostgreSQL
    participant LLM as Google Gemini API

    User->>Frontend: Enters prompt & clicks generate
    Frontend->>Backend: POST /api/generate (with JWT & prompt)
    Note over Backend: authMiddleware validates JWT
    Backend->>LLM: Requests HTML code for prompt
    LLM-->>Backend: Returns generated HTML/CSS/JS
    Backend->>DB: INSERT into generations (user_id, prompt, generated_code, share_id)
    DB-->>Backend: Returns inserted row
    Backend-->>Frontend: Returns generation object (JSON)
    Frontend->>Frontend: Renders HTML dynamically inside sandboxed iframe
```

### 3. Step-by-Step User Actions
1. **Discover**: Land on the marketing homepage.
2. **Access Control**: Register or log in to generate and save designs (JWT stored securely in `localStorage`).
3. **Prompting**: Enter a feature request or design idea into the dynamic input field.
4. **Generation**: The backend queries the Gemini model, streams/saves the result to PostgreSQL, and issues a unique `share_id` link slug.
5. **Dynamic Preview**: Render the sandbox iframe side-by-side with the live raw code editor tab.
6. **Iterate**: Submit refining requests (e.g. "make the button larger", "change color palette") in the chat-style sidebar to refine the current layout.
7. **History / Star**: Browse the scrollable Library history sidebar to toggle favorites, delete obsolete builds, or reload old generation variants.

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
3. Deploy frontend and set `VITE_API_URL` to backend public URL. _(Note: `vercel.json` already includes the SPA rewrite logic)._
4. Verify auth + generation end-to-end with production URLs.

---

## 🛣 Roadmap

- [x] Prompt-based UI generation with live preview
- [x] Chat-style iterative builder UX
- [x] Full history retrieval API + frontend history page
- [x] Favorite toggling and deletion endpoints
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
