const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

const { isAdmin, isEditorOrAdmin } = require('../middleware/chekRole.js'); 
// CRUD-операции
router.get('/', isEditorOrAdmin, portfolioController.getAllItems);
router.post('/add', isAdmin, portfolioController.addItem);
router.post('/delete/:id', isAdmin, portfolioController.deleteItem);

module.exports = router;
