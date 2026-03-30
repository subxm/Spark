<div align="center">

<img src="https://raw.githubusercontent.com/subxm/Spark/main/frontend/public/favicon.svg" alt="Spark Logo" width="100" />

# Spark v2.0

**Build apps at the speed of thought.**

[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://spark-nine-beta.vercel.app/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Gemini](https://img.shields.io/badge/Google_Gemini-2.0_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

[Live Demo](https://spark-nine-beta.vercel.app/) · [Report Bug](#) · [Request Feature](#)

</div>

---

## ? Overview

Spark is a next-generation AI-powered UI builder designed to bridge the gap between imagination and production-ready code. By leveraging Google's **Gemini 2.0 Flash** model, Spark transforms natural language prompts into highly polished, fully functioning React interfaces within seconds.

Instead of fighting with boilerplate, setting up Tailwind configs, and wrestling with initial component structures, simply describe what you need. Spark will write, render, and execute the interface right before your eyes. 

### Key Capabilities
- **?? Prompt-to-UI**: Generate entire layout structures, CSS scopes, and web components conversationally.
- **?? Iterative Memory context**: A persistent chat thread that "remembers" your previous generations so you can ask to "Make the nav bar darker" without losing the rest of the page.
- **?? Fluid Viewports**: Instantly preview how your generated UI responds across Desktop, Tablet, and Mobile viewports.
- **? Version Control**: Effortlessly jump backward and forward through your generation history using visual Undo/Redo tools.
- **?? Project Library**: Save your favorite generated assets to your personal history sandbox so you can load them back up days later.
- **?? Clean Export**: Download your creations as raw HTML/CSS/JS or seamlessly copy the syntax-highlighted code.

<br />

## ?? Architecture & Tech Stack

Spark is split into two highly optimized repositories running concurrently.

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router v7
- **Styling:** Custom Scoped CSS + Utility classes (No heavy UI libraries)
- **Highlighters:** PrismJS with custom dark-monokai theme overrides
- **Deployment:** Vercel (Edge Network)

### Backend
- **Framework:** Node.js + Express
- **Database:** PostgreSQL (Aiven / Neon)
- **AI Integration:** @google/generative-ai (Gemini 2.0 Flash)
- **Authentication:** JWT (JSON Web Tokens) with locally persistent secure storage
- **Deployment:** Render (Web Service)

<br />

## ?? Getting Started

To run Spark locally on your own machine, follow these steps.

### Prerequisites
- Node.js version 18.0 or higher
- PostgreSQL instance running locally or hosted remotely
- A Google API Key for Gemini Access

### 1. Clone the repository
\\\ash
git clone https://github.com/subxm/Spark.git
cd Spark
\\\

### 2. Backend Setup
\\\ash
cd backend
npm install
\\\
Create a \.env\ file in the ackend directory:
\\\env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/spark_db
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_google_gemini_api_key
\\\
Initialize the database using the provided schema:
\\\ash
psql -U your_user -d spark_db -f ../schema/schema.sql
\\\
Start the server:
\\\ash
npm run dev
\\\

### 3. Frontend Setup
Open a new terminal window:
\\\ash
cd frontend
npm install
\\\
Create a \.env\ file in the rontend directory:
\\\env
VITE_API_URL=http://localhost:5000
\\\
Start the Vite development server:
\\\ash
npm run dev
\\\

<br />

## ?? API Reference

If you are expanding the backend, here are the core exposed endpoints:

#### Authentication
- \POST /api/auth/register\ - Create a new user account.
- \POST /api/auth/login\ - Authenticate and receive a JWT.

#### Generation
- \POST /api/generate\ - Sends the prompt to Gemini and streams back the generated UI code.

#### Workspace Library
- \GET /api/history\ - Fetch all saved user generations.
- \DELETE /api/history/:id\ - Delete a specific project.
- \PATCH /api/history/:id/favourite\ - Toggle the favourite state of a generation.

---

<div align="center">
  <p>Code is optional. Ideas aren't.</p>
</div>
