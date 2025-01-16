const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();
const db=require('./dbconnection')


router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    let missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
        return res.status(400).json({ error: `Please enter ${missingFields.join(' and ')}` });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User registered' });
    });
});

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log("@@",req.body)
    let missingFields = [];
    if (!username) missingFields.push('username');
    if (!password) missingFields.push('password');

    if (missingFields.length > 0) {
        console.log("@@",missingFields)
        return res.status(400).json({ error: `Please enter ${missingFields.join(' and ')}` });
    }
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0 || !await bcrypt.compare(password, results[0].password)) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

module.exports = router;