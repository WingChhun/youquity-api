const express = require('express');
const app = express();

app.get('/api/*', (req, res) => {
    res.json({ok: true});
});

module.exports = app;