const mongoose = require('mongoose');

// Функция для подключения к базе данных
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://akbotash:akbota2005@cluster1.vsh0k.mongodb.net/Node-API?retryWrites=true&w=majority&appName=Cluster1', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB Atlas успешно подключен');
    } catch (err) {
        console.error('Ошибка подключения к MongoDB Atlas:', err);
        process.exit(1); // Завершить процесс при ошибке подключения
    }
};

module.exports = connectDB;
