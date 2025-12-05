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
- `POST /cards/{card}/assign` → يربط عميل ببطاقة ويعيد `qr_payload` بالصيغة `العميل|الموظف|card_code`. يقبل `customer_id` أو بيانات عميل جديدة (اسم + جوال) ويستخدم نشاط المستخدم الحالي.
- `GET /customers` / `POST /customers` / `GET /customers/{id}`.
- `GET /products` / `POST /products`.
- `GET /transactions` → يعيد `{id,type,note,happened_at,card,customer,product,scanner}` حتى تعرض الواجهات اسم الموظف الذي نفذ المسح.
- `POST /transactions` → يقبل `reference` أو `card_code`، يحدد البطاقة والعميل تلقائياً، ويحدث تقدم البطاقة (`card_customers`) و `last_visit_at`.
- `GET /blog` and `GET /plans` are public; CRUD requires auth.
- `GET /dashboard/summary` gives counts + recent activity.

#### API samples
Assign card to a customer:
```http
POST /api/v1/cards/1/assign
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ali Test",
  "phone": "+966500000111",
  "email": "ali@example.com"
}
```
Response includes `{ data: { card, customer, assignment, qr_payload } }`.

Record a QR scan / stamp:
```http
POST /api/v1/transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "stamp_awarded",
  "amount": 0,
  "currency": "SAR",
  "card_code": "123-456-789-012",
  "note": "إضافة ختم جديد",
  "happened_at": "2024-12-04T12:00:00+03:00"
}
```
Response mirrors the structure returned by `GET /transactions`.

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
