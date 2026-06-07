import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";
import apiRoutes from "./routes/api.js";
import chatRoutes from "./routes/chat.js";
import { initializeDb } from "./config/db.js";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import admin from "firebase-admin";
import { xss } from "express-xss-sanitizer";
import { isProduction, validateProductionEnv } from "./config/env.js";
import { csrfProtection } from "./middlewares/csrfMiddleware.js";

validateProductionEnv();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

const allowedOrigins = process.env.FRONTEND_ORIGIN 
  ? process.env.FRONTEND_ORIGIN.split(',').map(o => o.trim()) 
  : ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      console.warn(`Blocked by CORS: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many requests from this IP, please try again later.",
  },
});

// Initialize Firebase Admin
if (
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY &&
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY !==
    "your-firebase-service-account-json-here"
) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error.message);
    if (isProduction) {
      process.exit(1);
    }
    console.warn("Google auth will not work until Firebase Admin is configured.");
  }
} else {
  console.warn(
    "Firebase service account key not provided. Google auth will not work.",
  );
}

// Middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "script-src": [
          "'self'",
          "'unsafe-inline'",
          "https://checkout.razorpay.com",
          "https://apis.google.com",
          "https://*.firebaseapp.com",
        ],
        "connect-src": [
          "'self'",
          "https://api.razorpay.com",
          "https://checkout.razorpay.com",
          "https://*.googleapis.com",
          "https://*.firebase.com",
          "https://*.firebaseio.com",
          "https://identitytoolkit.googleapis.com",
          "https://securetoken.googleapis.com",
        ],
        "frame-src": [
          "'self'",
          "https://api.razorpay.com",
          "https://checkout.razorpay.com",
          "https://maps.google.com",
          "https://www.google.com",
          "https://accounts.google.com",
          "https://*.firebaseapp.com",
        ],
        "img-src": [
          "'self'",
          "data:",
          "https://*.google.com",
          "https://*.googleusercontent.com",
          "https://*.gstatic.com",
        ],
      },
    },
  }),
);
app.use(compression());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: false, limit: "10kb" }));
app.use(xss());
app.use(morgan("tiny"));
app.use(limiter);
app.use(csrfProtection);
app.use((req, res, next) => {
  if (
    isProduction &&
    req.headers["x-forwarded-proto"] !== "https" &&
    !req.secure
  ) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Lazy database initialization middleware for serverless environment compatibility
app.use(async (req, res, next) => {
  try {
    const { pool } = await import("./config/db.js");
    if (!pool) {
      await initializeDb();
    }
    next();
  } catch (error) {
    console.error("Database initialization failed:", error);
    res.status(500).json({ error: "Database initialization failed" });
  }
});

app.use((req, res, next) => {
  console.log(`REQ ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/chat", chatRoutes);
app.use("/api", apiRoutes);

if (isProduction) {
  const staticPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(staticPath, { maxAge: "1y", etag: false }));

  app.get("*", (req, res, next) => {
    if (
      req.path.startsWith("/api") ||
      req.path === "/health"
    ) {
      return next();
    }
    res.sendFile(path.join(staticPath, "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  if (err.code === "EBADCSRFTOKEN") {
    console.error("CSRF validation failed:", err);
    return res.status(403).json({ error: "Invalid or missing CSRF token." });
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", message: "Backend is running" });
});

const startServer = async () => {
  try {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database and start server:", error);
    process.exit(1);
  }
};

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  startServer();
}

export default app;
