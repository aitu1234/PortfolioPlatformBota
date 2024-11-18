const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/register', (req, res) => res.render('register', { title: 'Регистрация' }));
router.post('/register', authController.register);

router.get('/login', (req, res) => res.render('login', { title: 'Вход' }));
router.post('/login', authController.login);

router.get('/2fa', (req, res) => res.render('2fa', {title: 'QR code'}));
router.post('/2fa', authController.generate2FA)


module.exports = router;
