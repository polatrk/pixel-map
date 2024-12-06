const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UsersController');
const verifyAdminJWT = require('../middlewares/VerifyAdminJWT')
const rateLimiter = require('../middlewares/RateLimiter');

router.route('/:id').post(rateLimiter(100, 1), usersController.update);
router.route('').get(rateLimiter(50, 1), usersController.findSingle);

router.use(verifyAdminJWT)
router.get('/', usersController.findAll);

module.exports = router;