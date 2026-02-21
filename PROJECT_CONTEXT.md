# Project Context: Distribution Management System (DMS)

## 1. Project Overview
[cite_start]You are an expert AI assistant helping a 5-member startup team build a Distribution Management System (DMS)[cite: 2]. [cite_start]The system acts like a restaurant: the backend is the kitchen, the web admin is the manager's office, and the mobile app is the waiter taking orders[cite: 3, 5, 6]. 
Always write clean, modular, and well-commented code. [cite_start]Prioritize open-source tools and free tiers[cite: 10].

## 2. Core Tech Stack
* [cite_start]**Database:** PostgreSQL (Hosted on Supabase free tier)[cite: 11].
* [cite_start]**Backend Server:** Node.js with Express.js[cite: 12].
* [cite_start]**Web Frontend:** React.js (built with Vite), styled with Material UI or Tailwind CSS[cite: 13].
* [cite_start]**Mobile App:** Flutter (Dart) with SQLite for local offline data storage[cite: 14].

## 3. Security Guidelines
* [cite_start]**Authentication:** Strictly use JWT (JSON Web Tokens)[cite: 16]. [cite_start]Tokens must expire every 24 hours[cite: 26]. 
* [cite_start]**Password Hashing:** Never save raw passwords; always use Bcrypt to hash passwords in the database[cite: 19].
* [cite_start]**Access Control:** Implement Role-Based Access Control (RBAC) to ensure sales reps cannot access admin API routes[cite: 20].
* [cite_start]**Network:** All API calls must use HTTPS[cite: 18].

## 4. Key Features & Business Logic
* [cite_start]**Web Admin:** Must handle CRUD operations for Inventory (SKU, price, stock, images)[cite: 29]. [cite_start]Must register Sales Reps and view a master list of customer shops (addresses, credit limits)[cite: 30, 31].
* [cite_start]**Mobile App:** Must support an "Offline Mode" magic trick[cite: 8]. [cite_start]Waiters (sales reps) must be able to download products/shops in the morning [cite: 35][cite_start], create orders offline and calculate totals [cite: 37][cite_start], print invoices to a 58mm Bluetooth POS printer [cite: 38][cite_start], and sync orders to the cloud database when back online[cite: 40]. [cite_start]Capturing GPS coordinates during shop onboarding is required[cite: 39].

## 5. Strict File Structures
Do not invent new folder structures. Place code exactly where it belongs based on these blueprints:

### Backend (Node.js/Express)
dms-backend/
├── src/
[cite_start]│   ├── config/          # Database connections (Supabase URL) [cite: 45]
[cite_start]│   ├── controllers/     # Business logic (e.g., orderController.js) [cite: 45]
[cite_start]│   ├── middlewares/     # Security (e.g., verifyToken.js) [cite: 45]
[cite_start]│   ├── models/          # Database queries [cite: 45]
[cite_start]│   ├── routes/          # API endpoints (e.g., api/orders) [cite: 45]
[cite_start]│   └── index.js         # Main server file [cite: 45]
[cite_start]├── .env                 # SECRET KEYS [cite: 46]
[cite_start]└── package.json [cite: 46]

### Web Admin (React.js)
dms-web-admin/
├── src/
[cite_start]│   ├── assets/          # Images, logos [cite: 49]
[cite_start]│   ├── components/      # Reusable UI (Buttons, Tables, Navbar) [cite: 49]
[cite_start]│   ├── pages/           # Full screens (Dashboard, Inventory, Login) [cite: 49]
[cite_start]│   ├── services/        # API calls to backend (api.js) [cite: 49]
[cite_start]│   ├── context/         # Global state (AuthContext) [cite: 49]
[cite_start]│   ├── App.jsx          # Main routing file [cite: 49, 50]
[cite_start]│   └── index.css        # Global styles [cite: 50]
[cite_start]├── package.json [cite: 50]
[cite_start]└── vite.config.js [cite: 50]

### Mobile App (Flutter)
dms_mobile/
├── lib/
[cite_start]│   ├── core/            # Constants, colors, theme [cite: 53]
[cite_start]│   ├── data/            # Local SQLite database setup (database_helper.dart) [cite: 53]
[cite_start]│   ├── models/          # Data blueprints (Product, Order, Shop) [cite: 53]
[cite_start]│   ├── screens/         # UI pages (LoginScreen, CartScreen, PrintScreen) [cite: 53]
[cite_start]│   ├── services/        # API calls (api_service.dart) & Bluetooth config [cite: 53]
[cite_start]│   ├── widgets/         # Reusable UI (CustomCards, AppBars) [cite: 54]
[cite_start]│   └── main.dart        # App entry point [cite: 54]
[cite_start]├── pubspec.yaml         # Package dependencies [cite: 54]