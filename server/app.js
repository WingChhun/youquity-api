const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const userRouter = require('./routes/userRouter');
const authRouter = require('./routes/authRouter');

const app = express();

const {CLIENT_ORIGIN} = require('./config');
const jwtStrategy = require('./auth/strategies');
const jwtAuth = require('./middleware/jwtAuth');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use(morgan('combined'));

passport.use(jwtStrategy);

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);

app.get('/api/', jwtAuth, (req, res) => {
    res.json({ok: true});
});

module.exports = app;