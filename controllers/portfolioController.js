const PortfolioItem = require('../models/PortfolioItem');

// Получить все элементы портфолио
exports.getAllItems = async (req, res) => {
    try {
        const items = await PortfolioItem.find(); // Получение всех элементов из базы
        res.render('portfolio', { title: 'Портфолио', items });
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при получении портфолио');
    }
};

// Добавить новый элемент
exports.addItem = async (req, res) => {
    try {
        const { title, description, images } = req.body; // Данные из формы
        const newItem = new PortfolioItem({
            title,
            description,
            images: Array.isArray(images) ? images : [images], // Убедиться, что это массив
        });
        await newItem.save(); // Сохранение в базу данных
        res.redirect('/portfolio'); // Перенаправление обратно на страницу портфолио
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при добавлении элемента');
    }
};

// Редактировать существующий элемент
exports.editItem = async (req, res) => {
    try {
        const { id } = req.params; // Идентификатор элемента из URL
        const { title, description, images } = req.body; // Данные из формы
        await PortfolioItem.findByIdAndUpdate(id, {
            title,
            description,
            images: Array.isArray(images) ? images : [images],
            updatedAt: Date.now(), // Обновление даты
        });
        res.redirect('/portfolio');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при редактировании элемента');
    }
};

// Удалить элемент
exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params; // Идентификатор элемента из URL
        await PortfolioItem.findByIdAndDelete(id); // Удаление из базы данных
        res.redirect('/portfolio');
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при удалении элемента');
    }
};
