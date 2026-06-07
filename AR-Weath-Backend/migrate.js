import { initializeDb } from "./config/db.js";

const run = async () => {
  try {
    await initializeDb();
    console.log("Database initialized successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Database migration failed:", error);
    process.exit(1);
  }
};

run();
