import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';
import path from 'path';
import { fileURLToPath } from 'url';
import apiRoutes from './routes/api.js';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MySQL Connection
export const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Rajat370@'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL', err.message);
        return;
    }
    console.log('Connected to MySQL server.');

    // Create database if it doesn't exist
    const DB_NAME = process.env.DB_NAME || 'sterling_db';
    db.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
        if (err) throw err;
        console.log(`Database ${DB_NAME} selected or created`);

        // Switch to the database
        db.query(`USE ${DB_NAME}`, (err) => {
            if (err) throw err;

            // Create tables
            db.query(`CREATE TABLE IF NOT EXISTS contacts (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              phone VARCHAR(20),
              email VARCHAR(255) NOT NULL,
              service VARCHAR(255),
              other_details VARCHAR(255),
              comments TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            db.query(`CREATE TABLE IF NOT EXISTS users (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL UNIQUE,
              password VARCHAR(255) NOT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            db.query(`CREATE TABLE IF NOT EXISTS user_profiles (
              id INT AUTO_INCREMENT PRIMARY KEY,
              user_id INT NOT NULL,
              name VARCHAR(255) DEFAULT '',
              mobile_no VARCHAR(20) DEFAULT '',
              whatsapp_subscribed BOOLEAN DEFAULT false,
              company_name VARCHAR(100) DEFAULT '',
              state VARCHAR(50) DEFAULT '',
              billing_mobile VARCHAR(20) DEFAULT '',
              billing_email VARCHAR(100) DEFAULT '',
              FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )`);

            db.query(`CREATE TABLE IF NOT EXISTS consultations (
              id INT AUTO_INCREMENT PRIMARY KEY,
              name VARCHAR(255) NOT NULL,
              email VARCHAR(255) NOT NULL,
              service VARCHAR(255),
              message TEXT,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`);

            db.query(`CREATE TABLE IF NOT EXISTS tax_filings (
              id INT AUTO_INCREMENT PRIMARY KEY,
              userId VARCHAR(255) NOT NULL,
              status VARCHAR(255) DEFAULT 'Pending'
            )`);
        });
    });
});

// API Routes
app.use('/api', apiRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
