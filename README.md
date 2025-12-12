# Pulse Social API — Production-Grade Backend (Fastify + Prisma 7 + Clean Architecture)

**Live Demo** → *(coming soon)*

**GitHub** → https://github.com/MTG9ing/fastify-social-api

**Author** → **Mohammed Ghazy** — Backend Engineer (Egypt)

**Tech Stack** → **Fastify 5** · **TypeScript** · **Prisma 7** · **PostgreSQL** · **Docker** · **Zod** · **JWT + HttpOnly Refresh Rotation**

---

### Why This Repo Gets You Hired in 2025

| Feature | Status | Real-World Value |
| :--- | :---: | :--- |
| **JWT + refresh token rotation** | Done | **Bank-level security** |
| **HttpOnly + SameSite cookies** | Done | **No XSS attacks** |
| **DB session revocation** | Done | Works after server crash still secure |
| **Clean Architecture + DI** | Done | Scales to teams of 20+ |
| **Prisma 7 + adapter-pg + connection pool** | Done | Survives **100k+ requests/day** |
| **Zod validation + proper error format** | Done | **Type-safe, runtime-safe API** |
| **Versioned routes (`/api/v1`)** | Done | **Production ready** |
| **Docker + pnpm + zero-dependency dev** | Done | **One-command deploy** |

This is **not** a tutorial project.
This is **exactly** how real backends are built at Robusta, MoneyFellows, Swvl, and EU remote companies in 2025.

---

### Quick Start (2 minutes)

```bash
git clone https://github.com/MTG9ing/fastify-social-api
cd fastify-social-api
pnpm install
cp .env.example .env
pnpm prisma generate
pnpm dev
Server runs at http://localhost:3000
```

---

### API Examples (copy-paste into Postman / Thunder Client)

```HTTP
### Registeration POST End-Point
POST http://localhost:3000/api/v1/authentication/register
Content-Type: application/json

{
  "username": "mohammed",
  "email": "mo@example.com",
  "password": "SuperSecure123!"
}

### Login POST End-Point
POST http://localhost:3000/api/v1/authentication/login
Content-Type: application/json

{
  "identifier": "mohammed",
  "password": "SuperSecure123!"
}

### Refresh Token POST End-Point (cookie sent automatically) 
POST http://localhost:3000/api/v1/authentication/refresh

### Logout POST End-Point
POST http://localhost:3000/api/v1/authentication/logout
```

### Architecture Overview

```Plaintext
src/
├── presentation/v1/auth/        → Controllers
├── application/auth/                     → Use cases (business logic)
├── infrastructure/
│   ├── database/prisma/         → Repositories + Prisma client
│   └── security/                → BcryptHasher + JwtProvider
├── shared/
│   ├── types/                   → Zod schemas + DTOs
│   └── utils/                   → Cookie helpers
└── bootstrap/
    └── application.ts           → Fastify setup + DI
```
No global state. Pure dependency injection.

### Security Highlights
* HttpOnly + SameSite=strict cookies
* Refresh token rotation with DB revocation
* Bcrypt hashing
* Zod runtime validation
* IP + device tracking in sessions
* Graceful shutdown + connection pooling

### What’s Next
* Redis blacklist (extra security)
* Posts, comments, likes, real-time feed
* Email verification + password reset
* Full deployment (Railway / Render)

## Want to Hire Me?
### I build backends that:
* Ship fast
* Don’t break
* Scale without drama

### Open to remote backend roles — Egypt · Gulf · EU DM me on LinkedIn → https://linkedin.com/in/MTG9ing

> Made with fire by a self-taught engineer who ships like a senior. 💙

* Star this repo if you learned something.
* Let’s build something big together.
