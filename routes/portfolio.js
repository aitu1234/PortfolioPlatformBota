const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController');

router.get('/', portfolioController.getAllItems);
router.post('/add', portfolioController.addItem);
router.put('/edit/:id', portfolioController.editItem);
router.delete('/delete/:id', portfolioController.deleteItem);

module.exports = router;
