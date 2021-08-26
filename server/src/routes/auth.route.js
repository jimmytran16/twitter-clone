const router = require('express').Router();
const authController = require('../controllers/auth.controller')

router.post('/signin', authController.signIn);
router.post('/verify', authController.verify);
router.post('/newToken', authController.refreshToken);

module.exports = router;
