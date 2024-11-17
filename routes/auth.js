const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Маршрут для страницы регистрации
router.get('/register', (req, res) => {
    res.render('register', { title: 'Регистрация' });
});

// Обработка регистрации пользователя
router.post('/register', authController.register);

// Маршрут для страницы входа
router.get('/login', (req, res) => {
    res.render('login', { title: 'Вход' });
});

// Обработка входа пользователя
router.post('/login', authController.login);

router.get('/2fa', authController.generate2FA);

module.exports = router;
