const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');
const verifyLoggedJWT = require('../middlewares/VerifyLoggedJWT');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(verifyLoggedJWT)
router.post('/logout', authController.logout);

module.exports = router;