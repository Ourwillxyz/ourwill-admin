# OurWill Admin Backend

## Features

- User authentication (JWT)
- User CRUD and delete (admin only)
- User group assignment (candidate, agent, returning officer, observer)
- CORS for frontend (`CORS_ORIGIN` in .env)
- SQLite for fast setup

## Quickstart

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set environment variables**
   - Copy `.env` and set `JWT_SECRET` (any secret string), `PORT`, and `CORS_ORIGIN` (your frontend URL).

3. **Run the server**
   ```bash
   npm run dev
   # or
   npm start
   ```

4. **APIs**
   - `POST   /api/login` - { username, password }
   - `GET    /api/me` - Get current user info (token required)
   - `GET    /api/users` - List users (admin only)
   - `PUT    /api/users/:id/group` - Change user's group (admin only)
   - `DELETE /api/users/:id` - Delete user (admin only)
   - `POST   /api/users` - Create user (admin only)

**Demo users created on first run:**
- `admin` / `admin123` (admin)
- `user` / `user123` (agent group)

## Deployment

- Deploy to [Railway](https://railway.app/), [Render](https://render.com/), or any Node.js host.
- Set `CORS_ORIGIN` to your deployed frontend URL.

---
