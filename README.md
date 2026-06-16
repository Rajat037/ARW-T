# A.R. Wealth & Tax Co.

Professional tax advisory platform for individuals, startups, and enterprises across India. Built with React (Vite) + Express.js + PostgreSQL.

## Tech Stack

| Layer    | Technology                                                         |
| -------- | ------------------------------------------------------------------ |
| Frontend | React 18, TypeScript, Vite, TailwindCSS 4, Framer Motion, Radix UI |
| Backend  | Express.js, Node.js (ESM)                                          |
| Database | PostgreSQL                                                         |
| Auth     | JWT (httpOnly cookies), Firebase Auth (Google SSO)                 |
| Payments | Razorpay                                                           |
| Email    | Nodemailer (SMTP)                                                  |

## Deployment-Ready Setup

This repository is prepared for safe deployment with:

- separate frontend and backend configuration
- environment examples for safe local setup
- `.gitignore` protection for secrets and local artifacts

## Prerequisites

- Node.js 18+
- PostgreSQL database or managed PostgreSQL provider
- Razorpay account for payments
- Firebase project for Google sign-in
- SMTP email account for notifications

## Local Development

### 1. Clone the repo

```bash
git clone <repo-url>
cd "Website design with features"
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

Edit `frontend/.env` with your Vite/Firebase values. Edit `backend/.env` with your real database, email, JWT, Razorpay, and Firebase values.

### 4. Run database setup

```bash
npm --prefix backend run migrate
```

### 5. Start development servers

```bash
# Backend
npm run dev:backend

# Frontend
npm run dev:frontend
```

Open the frontend at: `http://localhost:5173`

## Production Build

To build the frontend assets:

```bash
npm run build
```

To start the backend server in production mode:

```bash
NODE_ENV=production npm start
```

In production, the frontend is intended to be deployed on Vercel and the backend on Render.

## Environment Variables

### Frontend `.env`

- `VITE_API_URL` — backend API URL, e.g. `http://localhost:3005`
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`

### Backend `.env`

Required values:

- `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`
- `DB_SSL` or `DATABASE_URL`
- `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `EMAIL_TO`
- `JWT_SECRET`
- `PORT`
- `FRONTEND_ORIGIN`
- `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`
- `FIREBASE_SERVICE_ACCOUNT_KEY` (full service account JSON string, with `\n` escapes in the private key)
- `OPENAI_API_KEY`

## Production Notes

- Keep `.env` files out of version control.
- Use `frontend/.env.example` and `backend/.env.example` as templates only.
- Confirm `FRONTEND_ORIGIN` matches your deployed frontend URL.
- Confirm Azure/Razorpay/Firebase keys are production-ready before launch.

## API Endpoints

### Auth

| Method | Path               | Description    |
| ------ | ------------------ | -------------- |
| POST   | `/api/signup`      | Create account |
| POST   | `/api/login`       | Login          |
| POST   | `/api/auth/google` | Google SSO     |
| GET    | `/api/csrf-token`  | Get CSRF token |

### Services

| Method | Path                | Description          |
| ------ | ------------------- | -------------------- |
| POST   | `/api/contact`      | Submit contact form  |
| POST   | `/api/consultation` | Request consultation |
| POST   | `/api/file-taxes`   | Initiate tax filing  |

### Payments

| Method | Path                         | Description          |
| ------ | ---------------------------- | -------------------- |
| POST   | `/api/payments/create-order` | Create payment order |
| POST   | `/api/payments/verify`       | Verify payment       |

### Health

| Path      | Description  |
| --------- | ------------ |
| `/health` | Health check |

## Security

- `helmet` for secure headers
- `csurf` for CSRF protection
- `xss-clean` for request sanitization
- `express-rate-limit` for throttling
- `express-validator` for request validation
- `bcryptjs` for password hashing
- **HTTPS redirect** in production

## Project Structure

```
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── common/ # Shared app widgets
│   │   │   │   ├── layout/ # Header, footer, shell layout
│   │   │   │   └── ui/     # Radix-based design system
│   │   │   ├── pages/      # Route pages
│   │   │   └── App.tsx
│   │   ├── context/        # React context providers
│   │   ├── lib/            # Firebase config
│   │   ├── routes/         # Router and route guards
│   │   ├── services/       # API/client service helpers
│   │   └── styles/         # CSS theme
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
├── backend/                # Express.js API
│   ├── config/             # Database and runtime config
│   ├── middlewares/        # Auth and validation middleware
│   ├── routes/             # Focused route modules
│   ├── services/           # Mailer and reusable app services
│   ├── uploads/            # Uploaded files
│   ├── utils/              # Shared backend helpers
│   ├── server.js           # App entry + middleware
│   └── migrate.js          # DB migration script
├── docs/                   # API docs, diagrams, notes
├── package.json            # Root scripts for frontend/backend
```

## License

Proprietary — A.R. Wealth & Tax Co.
