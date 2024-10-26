const express = require('express');
const router = express.Router();
const cellsController = require('../controllers/PropertiesController.js');

router.get('/:property', cellsController.findProperty);
router.post('/:property', cellsController.saveProperty);

module.exports = router;