const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');

const authRouter = require('./routes/authRouter');
const companyRouter = require('./routes/companyRouter');
const userRouter = require('./routes/userRouter');

const app = express();

const {CLIENT_ORIGIN} = require('./config');
const jwtStrategy = require('./auth/strategies');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);
app.use(morgan('combined'));

passport.use(jwtStrategy);

app.use('/api/auth', authRouter);
app.use('/api/company', companyRouter);
app.use('/api/users', userRouter);

app.get('/api/', (req, res) => {
    res.json({ok: true});
});

module.exports = app;