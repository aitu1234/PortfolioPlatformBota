const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Настройка транспортера (переменные из .env файла)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Укажите вашу почту в .env
        pass: process.env.EMAIL_PASS, // Укажите App Password в .env
    },
});

// Функция для отправки письма
const sendWelcomeEmail = async (to, firstName) => {
    try {
        await transporter.sendMail({
            from: '"Платформа портфолио" <' + process.env.EMAIL_USER + '>', // От кого письмо
            to, // Кому письмо
            subject: 'Добро пожаловать на платформу портфолио!', // Тема письма
            text: `Здравствуйте, ${firstName}! Добро пожаловать на платформу.`, // Текст письма
        });
        console.log('Письмо успешно отправлено');
    } catch (error) {
        console.error('Ошибка отправки письма:', error);
    }
};
exports.generate2FA = async (req, res) => {
    try {
        if (!req.session || !req.session.userId) {
            return res.status(401).send('Пользователь не авторизован');
        }

        const user = await User.findById(req.session.userId);
        if (!user) {
            return res.status(404).send('Пользователь не найден');
        }

        const secret = speakeasy.generateSecret({ length: 20 });
        user.twoFactorSecret = secret.base32;
        await user.save();

        qrcode.toDataURL(secret.otpauth_url, (err, dataUrl) => {
            if (err) {
                console.error('Ошибка генерации QR-кода:', err);
                return res.status(500).send('Ошибка генерации QR-кода');
            }
            res.render('qrcode', { qrCodeUrl: dataUrl });
        });
    } catch (err) {
        console.error('Ошибка генерации 2FA:', err.message || err);
        res.status(500).send('Ошибка генерации 2FA');
    }
};



// Регистрация пользователя
exports.register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender } = req.body;

        // Хеширование пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Создание нового пользователя
        const user = new User({ username, password: hashedPassword, firstName, lastName, age, gender });
        await user.save();

        // Устанавливаем ID пользователя в сессии
        req.session.userId = user._id;

        // Отправка приветственного письма
        await sendWelcomeEmail(username, firstName);

        // Перенаправление на страницу генерации 2FA
        res.redirect('/auth/2fa');
    } catch (err) {
        console.error('Ошибка регистрации:', err.message || err);
        res.status(500).send('Ошибка регистрации');
    }
};


// Вход пользователя
exports.login = async (req, res) => {
    try {
        const { username, password, twoFactorAuth } = req.body;

        // Поиск пользователя в базе данных
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send('Неверное имя пользователя или пароль');
        }

        // Проверка 2FA
        if (user.twoFactorSecret) {
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: twoFactorAuth,
            });

            if (!verified) {
                return res.status(401).send('Неверный 2FA код');
            }
        }
        

        // Сохраняем ID пользователя в сессии
        req.session.userId = user._id;

        // Перенаправление на страницу портфолио
        res.redirect('/portfolio');
    } catch (err) {
        console.error('Ошибка входа:', err.message || err);
        res.status(500).send('Ошибка входа');
    }
};
