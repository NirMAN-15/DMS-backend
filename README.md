# DMS Backend 🚀

Node.js / Express API server for the Distribution Management System, connected to Supabase (PostgreSQL).

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
```bash
cp .env.example .env
```
Open `.env` and fill in your **Supabase URL**, **Supabase Service Role Key**, and a strong **JWT_SECRET**.

Find your Supabase credentials at:  
`Supabase Dashboard → Your Project → Project Settings → API`

### 3. Run the development server
```bash
npm run dev
```

The server will start at `http://localhost:3000`.  
A Supabase connection test runs automatically on startup.

---

## File Structure

```
dms-backend/
├── src/
│   ├── config/
│   │   └── db.js              # Supabase client singleton
│   ├── controllers/
│   │   └── authController.js  # Login & register logic
│   ├── middlewares/
│   │   ├── verifyToken.js     # JWT authentication guard
│   │   └── authorizeRoles.js  # RBAC role guard
│   ├── models/
│   │   └── userModel.js       # Supabase DB queries for users
│   ├── routes/
│   │   └── authRoutes.js      # /api/auth route definitions
│   └── index.js               # Entry point
├── .env.example               # Environment variable template
├── .gitignore
└── package.json
```

## API Endpoints

| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/` | Public | Health check |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/register` | Admin only | Register a new sales rep |

## Security
- Passwords hashed with **bcrypt** (never stored in plain text)
- JWTs expire after **24 hours**
- RBAC prevents sales reps from accessing admin routes
- All secrets stored in `.env` (never committed to git)
