const express = require('express');
const passwordController = require('../controllers/passwordController');

const router = express.Router();

router.get('/updatepassword/:resetpasswordid', passwordController.updatepassword)
router.get('/resetpassword/:id', passwordController.resetpassword)
router.post('/forgotpassword',passwordController.forgotPassword);


module.exports = router;