const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

const app = express();

const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use(morgan('combined'));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/api/', (req, res) => {
    res.json({ok: true});
});

module.exports = app;