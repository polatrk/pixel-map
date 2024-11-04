const express = require('express');
const router = express.Router();
const cellsController = require('../controllers/CellsController');
const verifyLoggedJWT = require('../middlewares/VerifyLoggedJWT');

router.get('/', cellsController.findAll);
router.get('/:pos', cellsController.getCellInfos);

router.use(verifyLoggedJWT)
router.post('/', cellsController.saveCell);

module.exports = router;