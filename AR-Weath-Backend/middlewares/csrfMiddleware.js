import crypto from "crypto";
import { getJwtSecret, isProduction } from "../config/env.js";

const CSRF_COOKIE_NAME = "arwt_csrf";
const READABLE_CSRF_COOKIE_NAME = "XSRF-TOKEN";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "strict",
  path: "/",
};

const sign = (nonce) =>
  crypto.createHmac("sha256", getJwtSecret()).update(nonce).digest("hex");

const createToken = () => {
  const nonce = crypto.randomBytes(32).toString("hex");
  return `${nonce}.${sign(nonce)}`;
};

const isValidToken = (token) => {
  if (!token || typeof token !== "string") return false;

  const [nonce, signature] = token.split(".");
  if (!nonce || !signature) return false;

  const expected = sign(nonce);
  const signatureBuffer = Buffer.from(signature, "hex");
  const expectedBuffer = Buffer.from(expected, "hex");

  return (
    signatureBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
  );
};

export const csrfProtection = (req, res, next) => {
  req.csrfToken = () => {
    const token = createToken();
    res.cookie(CSRF_COOKIE_NAME, token, cookieOptions);
    res.cookie(READABLE_CSRF_COOKIE_NAME, token, {
      ...cookieOptions,
      httpOnly: false,
    });
    return token;
  };

  if (SAFE_METHODS.has(req.method)) {
    return next();
  }

  const headerToken = req.get("X-CSRF-Token");
  const cookieToken = req.cookies?.[CSRF_COOKIE_NAME];

  if (
    !headerToken ||
    !cookieToken ||
    headerToken !== cookieToken ||
    !isValidToken(headerToken)
  ) {
    const error = new Error("Invalid or missing CSRF token.");
    error.code = "EBADCSRFTOKEN";
    return next(error);
  }

  next();
};
