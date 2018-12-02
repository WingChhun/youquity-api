const express = require('express');
const cors = require('cors');
const app = express();

const {CLIENT_ORIGIN} = require('./config');

app.use(
    cors({
        origin: CLIENT_ORIGIN
    })
);


app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

module.exports = app;