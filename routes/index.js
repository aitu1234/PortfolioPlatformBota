const express = require('express');
const router = express.Router();

// Главная страница
router.get('/', (req, res) => {
    res.render('index', { title: 'Главная страница' });
});

module.exports = router;