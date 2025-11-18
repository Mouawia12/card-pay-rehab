## Rehab QR backend (Laravel 12 + Sanctum)

Back-end API that powers both the web dashboard and the Expo app. It ships with full seed data that mirrors the current UI cards/customers/products so you can log in and test flows immediately.

### Quick start
```bash
cd backend-rehab
composer install
cp .env.example .env      # already set to sqlite by default
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve --host=0.0.0.0 --port=8000
```
- API base URL: `http://localhost:8000/api/v1`
- CORS is open for local development.

### Seeded accounts
- Admin: `admin@rehab-qr.com` / `password123`
- Merchant: `merchant@rehab-qr.com` / `password123`
- Staff: `staff@rehab-qr.com` / `password123`

### Main endpoints
- `POST /auth/login` → returns `{ user, token }` (email or phone accepted in `email` field).
- `GET /auth/me` (Bearer token).
- `GET /cards` / `POST /cards` / `GET /cards/{id}`.
- `GET /customers` / `POST /customers` / `GET /customers/{id}`.
- `GET /products` / `POST /products`.
- `GET /transactions`.
- `GET /blog` and `GET /plans` are public; CRUD requires auth.
- `GET /dashboard/summary` gives counts + recent activity.

### Data model (tables)
- businesses, users (role: admin/merchant/staff/customer), cards, customers, card_customers (progress + rewards), products, transactions, blog_posts, subscription_plans, business_user pivot.

### Front-end wiring tips
- Web (Vite): set `VITE_API_BASE_URL=http://localhost:8000/api/v1` in `Rehabsa-Fullsa-main/.env`.
  - Login now calls the backend and stores `auth_token` in `localStorage`.
  - Cards/Customers pages fetch live data with fallback to demo fixtures.
- Expo app: set `EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1` in `rehab.saQRCODE--main/.env`.
  - AuthContext uses the backend login/me endpoints and persists the token in AsyncStorage.

### Running everything together
1) Start backend: `php artisan serve --host=0.0.0.0 --port=8000`
2) Web: `cd ../Rehabsa-Fullsa-main && npm install && npm run dev`
3) Mobile: `cd ../rehab.saQRCODE--main && npm install && npm start` (ensure `EXPO_PUBLIC_API_URL` matches the backend URL reachable by your device/emulator).
