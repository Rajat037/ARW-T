# A.R. Wealth & Tax Co. Frontend

This is the standalone React (Vite + TypeScript + Tailwind) frontend for the A.R. Wealth & Tax Co. platform.

## Features
- **Modern Responsive Landing Page**: Dynamic scrolling, smooth gradients, premium typography, and elegant layout.
- **Oreo Chatbot Integration**: Responsive overlay interface with smooth entrance animations and markdown rendering.
- **Interactive Forms**: Secure consultation scheduling and contact page.
- **Client Portal**: Complete user authentication, secure registration/login, password reset support, profile management, and dashboard to track active tax filings.

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

## Deployment on Vercel
1. Set up a new project in Vercel pointing to this repository.
2. In the **Environment Variables** section of the Vercel project, add:
   - `VITE_API_URL` = `https://ar-weath-backend.onrender.com`
   - Add your other Firebase configuration variables from your local `.env` file if you are utilizing Google Auth / Firebase Client Services.
