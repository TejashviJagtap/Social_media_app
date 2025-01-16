const express = require('express');
//const mysql = require('mysql2');

const router = express.Router();
const db=require('./dbconnection')
// const db = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'social_media_db'
// });

const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization').split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

router.post('/:userId/follow', authenticateToken, (req, res) => {
    const followedId = req.params.userId;
    db.query('INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)', [req.user.id, followedId], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'User followed' });
    });
});

module.exports = router;