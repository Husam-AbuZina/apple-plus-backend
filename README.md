# Apple Plus Backend

Express and MongoDB API for the Apple Plus storefront and admin dashboard.

## Run locally

1. Copy `.env.example` to `.env` and set a secure `JWT_SECRET`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`.
2. Start MongoDB locally, or replace `MONGODB_URI` with a MongoDB Atlas connection string.
3. Install dependencies and start the API:

```bash
npm install
npm run seed:admin
npm run dev
```

The API runs at `http://localhost:5000`; `GET /api/health` confirms the service is running.

### Docker alternative

If Docker is installed, copy `.env.example` to `.env`, set the secrets, then run:

```bash
docker compose up --build -d
docker compose exec api npm run seed:admin
```

This starts the API and an isolated MongoDB database. `docker compose down` stops them while retaining database data in Docker volumes.

## Core endpoints

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/api/auth/login` | Public |
| POST | `/api/auth/logout` | Admin |
| GET | `/api/auth/me` | Admin |
| GET | `/api/products` | Public (published products) |
| GET | `/api/products/admin/all` | Admin (all products, including drafts) |
| GET | `/api/products/admin/:id` | Admin |
| GET | `/api/products/:id` | Public (published products) |
| POST | `/api/products` | Admin |
| PATCH | `/api/products/:id` | Admin |
| DELETE | `/api/products/:id` | Admin |
| POST | `/api/products/uploads/images` | Admin |

Admin authentication uses a secure HTTP-only cookie. When the frontend is connected, it must make requests with credentials enabled.

## Production notes

Use a real domain for `CLIENT_ORIGIN`, set `NODE_ENV=production`, and place the service behind Nginx or Caddy with HTTPS. Local `uploads/` are for development; move media to Cloudinary or S3-compatible storage for production.
