const express = require('express');
const router = express.Router();
const cellsController = require('../controllers/CellsController');

router.get('/', cellsController.findAll);
router.post('/', cellsController.saveCell);

module.exports = router;