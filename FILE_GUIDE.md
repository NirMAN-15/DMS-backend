# 📘 DMS Backend — File-by-File Guide (Simple English)

---

## 🗺️ How All Files Work Together (Big Picture)

```
📱 App/Browser sends:  POST /api/auth/login
                              ↓
                      [ src/index.js ]          ← Receives request, routes it
                              ↓
                  [ routes/authRoutes.js ]       ← Matches the URL path
                              ↓
            [ middlewares/verifyToken.js ]       ← Checks login badge (skipped for login)
                              ↓
           [ controllers/authController.js ]     ← Does the actual work
                              ↓
                  [ models/userModel.js ]        ← Fetches data from database
                              ↓
                    [ config/db.js ]             ← Talks to Supabase
                              ↓
            Response sent back: { token:"eyJ...", user:{...} }
```

---

## 📁 Root Files

---

### 📄 `package.json` — *"The shopping list"*

Tells Node.js which libraries to download and what commands to run.

| Key | What it does |
|---|---|
| `"main"` | Start from `src/index.js` |
| `"scripts"` | Shortcut commands for the terminal |
| `"dependencies"` | Libraries the app needs to work |
| `"devDependencies"` | Libraries only used while coding |

**Scripts example:**
```json
"scripts": {
  "start": "node src/index.js",    // Use in production
  "dev":   "nodemon src/index.js"  // Use while coding — auto-restarts on save
}
```
When you type `npm run dev`, it's a shortcut for running `nodemon src/index.js`.

**Libraries installed:**

| Library | Simple Explanation |
|---|---|
| `express` | The web server — handles incoming requests |
| `@supabase/supabase-js` | Lets the app talk to our Supabase database |
| `bcryptjs` | Scrambles passwords so we never store them in plain text |
| `jsonwebtoken` | Creates the login "badge" (JWT) given to users |
| `dotenv` | Reads secret keys from the `.env` file |
| `cors` | Allows the React web app to talk to this server |
| `morgan` | Prints request logs in the terminal |
| `nodemon` | Auto-restarts the server when you save a file |

---

### 📄 `.env.example` — *"A blank form — fill it with your real secrets"*

A safe template showing what values you need. Copy it, rename to `.env`, fill in real values.

```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-secret-key
JWT_SECRET=any-long-random-string
```

> ⚠️ `.env.example` is safe to share. `.env` contains your real passwords — never share or upload it.

---

### 📄 `.gitignore` — *"The Do Not Pack list"*

Tells Git which files to skip when uploading to GitHub.

```
.env           ← Never upload — contains passwords
node_modules/  ← 131 packages, no need to upload (too large)
```

---

### 📄 `README.md` — *"The instruction manual on the box"*

The first thing any developer reads. Explains how to install, run, and use the API.

---

### 📄 `FILE_GUIDE.md` — *"This file!"*

Plain-English explanation of every file in the project. Written for the whole team to understand.

---

## 📁 `src/` — The Engine Room

---

### ⚙️ `src/config/db.js` — *"The phone line to Supabase"*

Creates the connection to the Supabase (PostgreSQL) database. Every file that needs the
database imports this one file.

```js
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
module.exports = supabase;
```

Other files use it like this:
```js
const supabase = require('../config/db');
// Now this file can run database queries
```

> 🔑 Uses the **Service Role Key** (the "master key") so the backend has full DB access.

---

### 🛡️ `src/middlewares/verifyToken.js` — *"The bouncer at the door"*

Before a request can enter a protected route, this checks if the user has a valid login badge (JWT token).

```
User sends header:  Authorization: Bearer eyJhbGci...
                                           ↑ The JWT token

verifyToken checks:
  ✅ Token exists?
  ✅ It's real (we signed it)?
  ✅ It hasn't expired (24 hours)?

YES → Let the request through
NO  → Send back "401 Access denied" or "403 Invalid token"
```

---

### 🛡️ `src/middlewares/authorizeRoles.js` — *"The VIP list"*

Even after passing the token check, this verifies you have the **right role** for the route.

```js
// Only admin users can reach the register function:
router.post('/register', verifyToken, authorizeRoles('admin'), register);
```

```
Admin logs in     → role: 'admin'     → ✅ Can register new sales reps
Sales Rep logs in → role: 'sales_rep' → ❌ Blocked — "Access denied"
```

Like how an employee badge opens the break room, but only a manager's badge opens the server room.

---

### 🧠 `src/controllers/authController.js` — *"The chef — does the actual work"*

Contains the business logic. When a login or register request arrives, this file processes it.

#### `login()` function
```
User sends: { email: "john@dms.com", password: "secret123" }

1. Look up "john@dms.com" in the database
2. Use bcrypt to compare "secret123" vs the scrambled password stored
3. If match  → create a JWT token and send it back ✅
4. No match  → "401 Invalid credentials" ❌
```

**Success response:**
```json
{
  "success": true,
  "token": "eyJhbGci...",
  "user": { "id": "1", "name": "John", "role": "admin" }
}
```

#### `register()` function *(admin only)*
```
Admin sends: { name: "Jane", email: "jane@dms.com", password: "pass456", role: "sales_rep" }

1. Hash "pass456" with bcrypt → "£$@3jxH#..." (scrambled, safe to store)
2. Insert new user into Supabase
3. Send back confirmation ✅
```

> 🔒 **Security rule:** Passwords are always hashed before storing. Even if the DB is stolen, hackers only see scrambled text.

---

### 🗂️ `src/models/userModel.js` — *"The filing clerk"*

Contains reusable database query functions. Instead of writing the same Supabase query
everywhere, we write it once here.

```js
// Find a user by their email address
const findUserByEmail = async (email) => {
  const { data } = await supabase.from('users').select('*').eq('email', email).single();
  return data; // Returns user row, or null if not found
};
```

**Why separate from the controller?**
- Controller = decides *what to do*
- Model = decides *how to get the data from DB*
- Clean separation → easier to maintain and test

---

### 🚦 `src/routes/authRoutes.js` — *"The traffic signals"*

Defines the URL paths and points each one to the right controller function.

```js
router.post('/login',    login);
//   ↑ method ↑ path     ↑ controller function

router.post('/register', verifyToken, authorizeRoles('admin'), register);
//                        ↑ check token   ↑ must be admin role
```

**Traffic flow:**
```
POST /api/auth/login    →  authController.login()
POST /api/auth/register →  verifyToken → authorizeRoles('admin') → authController.register()
```

---

### 🚀 `src/index.js` — *"The main switch"*

The first file that runs when you type `npm run dev`. Wires everything together.

**Step-by-step startup sequence:**
```
Step 1: Load .env secrets into memory
Step 2: Import the Supabase connection
Step 3: Apply CORS (allow React app to talk to server)
Step 4: Apply JSON parser (read request body data)
Step 5: Apply Morgan logger (print request logs)
Step 6: Set up health-check route GET /
Step 7: Mount all route files under /api
Step 8: Add 404 and error handlers
Step 9: Start listening on port 3000
Step 10: Ping Supabase to confirm connection ✅
```

**Health-check example:**
```
You visit: http://localhost:3000/
You get:
{
  "success": true,
  "message": "🚀 DMS Backend API is running!",
  "timestamp": "2026-02-22T01:13:00Z"
}
```

**CORS guard example:**
```
React app at http://localhost:5173  → ✅ Allowed (in ALLOWED_ORIGINS list)
Random unknown website              → ❌ Blocked by CORS
```

---

## 🔐 Security Rules Summary

| Rule | Where It's Applied | Why |
|---|---|---|
| Never store raw passwords | `authController.js` | bcrypt hashes them first |
| JWTs expire after 24 hours | `authController.js` + `.env` | Limits damage if token is stolen |
| Only admins can register users | `authRoutes.js` + `authorizeRoles.js` | RBAC protection |
| Secrets never in code | `.env` file only | Prevents accidental exposure on GitHub |
| Supabase Service Role Key backend-only | `config/db.js` | Never sent to the browser |

---

## 🚀 Quick Start (3 Steps)

```bash
# 1. Copy the environment template
cp .env.example .env

# 2. Open .env and fill in your Supabase URL, Service Role Key, and JWT_SECRET

# 3. Start the server
npm run dev
```

Server runs at → `http://localhost:3000`
