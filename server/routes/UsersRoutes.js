const express = require('express');
const router = express.Router();
const usersController = require('../controllers/UsersController');
const verifyAdminJWT = require('../middlewares/VerifyAdminJWT')

router.post('/:id', usersController.update);
router.get('/:id', usersController.findSingle);

router.use(verifyAdminJWT)
router.get('/', usersController.findAll);

module.exports = router;