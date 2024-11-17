const dotenv = require('dotenv');
dotenv.config(); // Загрузка переменных из .env

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const portfolioRoutes = require('./routes/portfolio');
const authRoutes = require('./routes/auth');

dotenv.config(); // Загружаем переменные из .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use('/auth', authRoutes);

// Session setup
app.use(
    session({
        secret: 'secretkey',
        resave: false,
        saveUninitialized: false,
    })
);

// Подключение маршрутов
app.use('/portfolio', portfolioRoutes);
app.use('/', require('./routes/index')); // Подключаем основной маршрут

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI || 'mongodb+srv://akbotash:akbota2005@cluster1.vsh0k.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster1')
    .then(() => {
        console.log('MongoDB успешно подключен');
        app.listen(PORT, () => {
            console.log(`Сервер запущен на http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Ошибка подключения к MongoDB:', error);
    });

