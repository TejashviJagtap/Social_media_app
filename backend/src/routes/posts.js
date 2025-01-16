const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();
const db=require('./dbconnection')


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post('/', authenticateToken, (req, res) => {
    const { content } = req.body;
    db.query('INSERT INTO posts (user_id, content) VALUES (?, ?)', [req.user.id, content], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Post created' });
    });
});

router.get('/', authenticateToken, (req, res) => {
    db.query('SELECT * FROM posts', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.post('/:postId/like', authenticateToken, (req, res) => {
    const postId = req.params.postId;
    db.query('INSERT INTO likes (user_id, post_id) VALUES (?, ?)', [req.user.id, postId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Post liked' });
    });
});

module.exports = router;