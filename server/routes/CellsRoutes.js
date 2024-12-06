const express = require('express');
const router = express.Router();
const cellsController = require('../controllers/CellsController');
const verifyLoggedJWT = require('../middlewares/VerifyLoggedJWT');
const rateLimiter = require('../middlewares/RateLimiter');

router.route('/').get(rateLimiter(100, 1), cellsController.findAll);
router.route('/:pos').get(cellsController.getCellInfos);

router.use(verifyLoggedJWT)
router.route('/').post(rateLimiter(1000, 1), cellsController.saveCell);

module.exports = router;