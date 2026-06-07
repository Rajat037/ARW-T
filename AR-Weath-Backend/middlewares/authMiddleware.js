import jwt from "jsonwebtoken";
import { getJwtSecret, isProduction } from "../config/env.js";

export const JWT_SECRET = getJwtSecret();

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "strict" : "lax",
  maxAge: 60 * 60 * 1000,
  path: "/",
};

export const authenticateToken = (req, res, next) => {
  const token = req.cookies?.auth_token;

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions" });
    }
    next();
  };
};

export const setAuthCookie = (res, payload) => {
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("auth_token", token, COOKIE_OPTIONS);
  return token;
};
