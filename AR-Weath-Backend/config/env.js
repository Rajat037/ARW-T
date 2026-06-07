import dotenv from "dotenv";

dotenv.config({ quiet: true });

export const isProduction = process.env.NODE_ENV === "production";

export const DEFAULT_JWT_SECRET = "your_super_secret_key_123";
let hasWarnedAboutDefaultJwtSecret = false;

export const getRequiredEnv = (name) => {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(`${name} must be configured in production.`);
  }
  return value;
};

export const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET || DEFAULT_JWT_SECRET;

  if (
    isProduction &&
    (!process.env.JWT_SECRET ||
      process.env.JWT_SECRET === DEFAULT_JWT_SECRET ||
      process.env.JWT_SECRET.length < 32)
  ) {
    throw new Error(
      "JWT_SECRET must be set to a strong secret of at least 32 characters in production.",
    );
  }

  if (
    !isProduction &&
    secret === DEFAULT_JWT_SECRET &&
    !hasWarnedAboutDefaultJwtSecret
  ) {
    hasWarnedAboutDefaultJwtSecret = true;
    console.warn(
      "\x1b[33m[SECURITY WARNING]\x1b[0m JWT_SECRET is not set. Using the local development fallback.",
    );
  }

  return secret;
};

export const validateProductionEnv = () => {
  if (!isProduction) return;

  getJwtSecret();
  getRequiredEnv("FRONTEND_ORIGIN");

  if (!process.env.DATABASE_URL) {
    ["DB_HOST", "DB_PORT", "DB_USER", "DB_PASSWORD", "DB_NAME"].forEach(
      getRequiredEnv,
    );
  }

  [
    "EMAIL_HOST",
    "EMAIL_USER",
    "EMAIL_PASS",
    "EMAIL_FROM",
    "EMAIL_TO",
    "RAZORPAY_KEY_ID",
    "RAZORPAY_KEY_SECRET",
    "RAZORPAY_WEBHOOK_SECRET",
    "OPENAI_API_KEY",
  ].forEach(getRequiredEnv);

  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_KEY must be configured in production.");
  }
};
