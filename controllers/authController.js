const User = require('../models/user');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

// Настройка транспортера
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // или 587, если используется STARTTLS
    secure: true, // true для порта 465, false для 587
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});



// Функция отправки письма
const sendWelcomeEmail = async (to, firstName) => {
    try {
        await transporter.sendMail({
            from: `"Платформа портфолио" <${process.env.EMAIL_USER}>`,
            to,
            subject: 'Добро пожаловать на платформу портфолио!',
            text: `Здравствуйте, ${firstName}! Добро пожаловать на платформу.`,
        });
        console.log('Письмо успешно отправлено');
    } catch (error) {
        console.error('Ошибка отправки письма:', error);
    }
};

// Регистрация пользователя
exports.register = async (req, res) => {
    try {
        const { username, password, firstName, lastName, age, gender } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('Hashed password:', hashedPassword); // Добавьте отладку здесь

        const user = new User({
            username,
            password: hashedPassword,
            firstName,
            lastName,
            age,
            gender,
        });
        await user.save();
        const savedUser = await User.findOne({ username });
        console.log('Хешированный пароль (сохранённый):', savedUser.password);
        console.log('Хешированный пароль (в памяти):', hashedPassword);


        req.session.user = { id: user._id, role: user.role }; // Сохранение пользователя в сессии
        res.redirect('/auth/2fa');
    } catch (err) {
        console.error('Ошибка регистрации:', err);
        res.status(500).send('Ошибка регистрации');
    }
};


// Логин пользователя
exports.login = async (req, res) => {
    try {
        const { username, password, twoFactorAuth } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            console.log('Пользователь не найден');
            return res.status(401).send('Неверное имя пользователя или пароль');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('User:', user); // Отладка: Проверка найденного пользователя
        console.log('Password check:', password, user.password); // Отладка: Результат проверки пароля

        if (!isPasswordValid) {
            return res.status(401).send('Неверное имя пользователя или пароль');
        }

        if (user.twoFactorAuth) {
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorAuth,
                encoding: 'base32',
                token: twoFactorAuth,
            });
            if (!verified) return res.status(401).send('Неверный 2FA код');
        }
        req.session.user = { id: user._id, role: user.role };
        console.log('gay');
        res.redirect('/portfolio');
    } catch (err) {
        console.error('Ошибка входа:', err);
        res.status(500).send('Ошибка входа');
    }
};


// Генерация 2FA
exports.generate2FA = async (req, res) => {
    try {
        if (!req.session || !req.session.user) return res.status(401).send('Пользователь не авторизован');

        const user = await User.findById(req.session.user.id);
        if (!user) return res.status(404).send('Пользователь не найден');

        const secret = speakeasy.generateSecret({ length: 20 });
        user.twoFactorAuth = secret.base32;
        await user.save();

        const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
        res.render('qrcode', { qrCodeUrl });
    } catch (err) {
        console.error('Ошибка генерации 2FA:', err);
        res.status(500).send('Ошибка генерации 2FA');
    }
};
