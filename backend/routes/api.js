import express from 'express';
import { db } from '../server.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

const router = express.Router();

// Get Free Consultation
router.post('/consultation', (req, res) => {
    const { name, email, service, message } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const sql = `INSERT INTO consultations (name, email, service, message) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, email, service, message], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            success: true,
            message: 'Consultation request received successfully',
            id: results.insertId
        });
    });
});

// Start Tax Filing Flow (Mock)
router.post('/file-taxes', (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required.' });
    }

    const sql = `INSERT INTO tax_filings (userId, status) VALUES (?, ?)`;
    db.query(sql, [userId, 'Document Collection'], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            success: true,
            message: 'Tax filing initiated',
            filingId: results.insertId
        });
    });
});

// Contact Form Submission
router.post('/contact', (req, res) => {
    const { name, phone, email, service, otherDetails, comments } = req.body;

    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const sql = `INSERT INTO contacts (name, phone, email, service, other_details, comments) VALUES (?, ?, ?, ?, ?, ?)`;
    db.query(sql, [name, phone, email, service || null, otherDetails || null, comments], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({
            success: true,
            message: 'Contact form submitted successfully',
            id: results.insertId
        });
    });
});

// User Signup
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    try {
        // Check if user exists
        db.query('SELECT id FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length > 0) return res.status(400).json({ error: 'User already exists with this email.' });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Insert user
            const sql = `INSERT INTO users (name, email, password) VALUES (?, ?, ?)`;
            db.query(sql, [name, email, hashedPassword], (err, insertResults) => {
                if (err) return res.status(500).json({ error: err.message });
                
                const userId = insertResults.insertId;
                // Create empty profile
                db.query(`INSERT INTO user_profiles (user_id, name) VALUES (?, ?)`, [userId, name], (profileErr) => {
                    if (profileErr) console.error("Could not create empty profile", profileErr);
                    
                    const token = jwt.sign({ id: userId, email }, JWT_SECRET, { expiresIn: '1h' });
                    res.status(201).json({
                        success: true,
                        message: 'User created successfully',
                        token,
                        user: { id: userId, name, email }
                    });
                });
            });
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// User Login
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ error: 'Invalid credentials.' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials.' });

        const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
        
        res.status(200).json({
            success: true,
            message: 'Logged in successfully',
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    });
});

// Middleware to authenticate
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Get User Profile
router.get('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    
    const sql = `
        SELECT p.name, u.email, p.mobile_no, p.whatsapp_subscribed, p.company_name, p.state, p.billing_mobile, p.billing_email 
        FROM users u 
        LEFT JOIN user_profiles p ON u.id = p.user_id 
        WHERE u.id = ?
    `;
    
    db.query(sql, [userId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'User not found' });
        
        // Handle case where user_profiles row might not exist for old users
        if (results[0].mobile_no === null && results[0].company_name === null) {
            db.query('INSERT IGNORE INTO user_profiles (user_id, name) VALUES (?, (SELECT name FROM users WHERE id = ?))', [userId, userId]);
        }
        res.status(200).json(results[0]);
    });
});

// Update User Profile
router.put('/profile', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { name, mobile_no, whatsapp_subscribed, company_name, state, billing_mobile, billing_email } = req.body;
    
    const profileSql = `
        UPDATE user_profiles 
        SET name = ?, mobile_no = ?, whatsapp_subscribed = ?, company_name = ?, state = ?, billing_mobile = ?, billing_email = ? 
        WHERE user_id = ?
    `;
    const profileValues = [name || '', mobile_no || '', whatsapp_subscribed ? 1 : 0, company_name || '', state || '', billing_mobile || '', billing_email || '', userId];
    
    db.query(profileSql, profileValues, (profileErr) => {
        if (profileErr) return res.status(500).json({ error: profileErr.message });
        res.status(200).json({ success: true, message: 'Profile updated successfully' });
    });
});

// Fetch Testimonials
router.get('/testimonials', (req, res) => {
    const testimonials = [
        {
            id: 1,
            name: "Rohan K.",
            role: "Tech YouTuber",
            content: "A.R. Wealth & Tax Co. completely took the anxiety out of filing taxes.",
            rating: 5
        },
        {
            id: 2,
            name: "Sneha M.",
            role: "Lifestyle Influencer",
            content: "As a freelancer, I had no idea how GST applied to PR packages.",
            rating: 5
        }
    ];

    res.status(200).json(testimonials);
});

export default router;
