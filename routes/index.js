const express = require('express');
const router = express.Router();
const PortfolioController = require('../controllers/portfolioController'); // Импортируем контроллер

// Главная страница с данными портфолио
router.get('/', PortfolioController.getAllItems); // Используем метод из контроллера для обработки запроса

module.exports = router;
