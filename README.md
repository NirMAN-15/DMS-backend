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
│   │   └── db.js                  # Supabase client singleton
│   ├── controllers/
│   │   ├── authController.js      # Login & register logic
│   │   ├── productController.js   # Product CRUD operations
│   │   ├── orderController.js     # Order CRUD + status updates
│   │   ├── shopController.js      # Shop CRUD operations
│   │   ├── userController.js      # User listing (admin)
│   │   └── dashboardController.js # System statistics
│   ├── middlewares/
│   │   ├── verifyToken.js         # JWT authentication guard
│   │   └── authorizeRoles.js      # RBAC role guard
│   ├── models/
│   │   ├── userModel.js           # DB queries for users
│   │   ├── productModel.js        # DB queries for products
│   │   ├── orderModel.js          # DB queries for orders
│   │   └── shopModel.js           # DB queries for shops
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── productRoutes.js       # /api/products
│   │   ├── orderRoutes.js         # /api/orders
│   │   ├── shopRoutes.js          # /api/shops
│   │   ├── userRoutes.js          # /api/users
│   │   └── dashboardRoutes.js     # /api/dashboard
│   └── index.js                   # Entry point
├── .env.example                   # Environment variable template
├── .gitignore
└── package.json
```

## API Endpoints

### Auth
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/` | Public | Health check |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/auth/register` | Admin only | Register a new sales rep |

### Products
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/products` | Authenticated | List all products |
| GET | `/api/products/:id` | Authenticated | Get single product |
| POST | `/api/products` | Admin | Add product |
| PUT | `/api/products/:id` | Admin | Update product |
| DELETE | `/api/products/:id` | Admin | Delete product |

### Orders
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/orders` | Authenticated | List all orders |
| GET | `/api/orders/:id` | Authenticated | Get single order |
| POST | `/api/orders` | Authenticated | Create order |
| PATCH | `/api/orders/:id` | Admin | Update order status |
| DELETE | `/api/orders/:id` | Admin | Delete order |

### Shops
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/shops` | Authenticated | List all shops |
| GET | `/api/shops/:id` | Authenticated | Get single shop |
| POST | `/api/shops` | Admin | Add shop |
| PUT | `/api/shops/:id` | Admin | Update shop |
| DELETE | `/api/shops/:id` | Admin | Delete shop |

### Users & Dashboard
| Method | Route | Access | Description |
|--------|-------|--------|-------------|
| GET | `/api/users` | Admin | List all users |
| GET | `/api/users/:id` | Admin | Get single user |
| GET | `/api/dashboard/stats` | Admin | System statistics |

## Security
- Passwords hashed with **bcrypt** (never stored in plain text)
- JWTs expire after **24 hours**
- RBAC prevents sales reps from accessing admin routes
- All secrets stored in `.env` (never committed to git)
