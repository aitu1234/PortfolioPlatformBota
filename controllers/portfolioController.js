const PortfolioItem = require('../models/PortfolioItem');

// Получить все элементы портфолио для страницы портфолио
exports.getAllItems = async (req, res) => {
    try {
        const items = await PortfolioItem.find();
        res.render('portfolio', {
            items,
            user: req.session.user || null, // Передача текущего пользователя (если он существует)
        });
    } catch (error) {
        console.error('Ошибка получения элементов портфолио:', error.message || error);
        res.status(500).send('Ошибка сервера');
    }
};

// Получить все элементы портфолио для главной страницы
exports.getAllItemsForHomePage = async (req, res) => {
    try {
        const items = await PortfolioItem.find();
        res.render('index', {
            title: 'Главная страница',
            items,
            user: req.session.user || null, // Передача текущего пользователя
        });
    } catch (error) {
        console.error('Ошибка получения элементов для главной страницы:', error.message || error);
        res.status(500).send('Ошибка сервера');
    }
};

// Добавить новый элемент в портфолио
exports.addItem = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).send('Доступ запрещен');
        }

        const { title, description, images } = req.body;
        const newItem = new PortfolioItem({
            title,
            description,
            images: images.split(',').map((img) => img.trim()),
        });
        await newItem.save();
        res.redirect('/portfolio');
    } catch (error) {
        console.error('Ошибка при добавлении нового элемента:', error.message || error);
        res.status(500).send('Ошибка при добавлении');
    }
};

// Удалить элемент из портфолио
exports.deleteItem = async (req, res) => {
    try {
        if (!req.session.user || req.session.user.role !== 'admin') {
            return res.status(403).send('Доступ запрещен');
        }

        const { id } = req.params;
        await PortfolioItem.findByIdAndDelete(id);
        res.redirect('/portfolio');
    } catch (error) {
        console.error('Ошибка при удалении элемента:', error.message || error);
        res.status(500).send('Ошибка при удалении');
    }
};
