const express = require('express');
const router = express.Router();
const cellsController = require('../controllers/PropertiesController.js');
const verifyAdminJWT = require('../middlewares/VerifyAdminJWT.js');

router.get('/:property', cellsController.findProperty);

router.use(verifyAdminJWT)
router.post('/:property', cellsController.saveProperty);

module.exports = router;