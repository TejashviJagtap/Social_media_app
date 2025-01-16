const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const con = require('./src/routes/dbconnection'); 

dotenv.config();

const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/posts');
const userRoutes = require('./src/routes/users');

const app = express();

app.use(bodyParser.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`run server on port ${PORT}`);
});