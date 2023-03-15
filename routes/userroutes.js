
const express = require('express');
const userController = require('../controllers/users');

const router = express.Router();

router.post('/addUser',userController.addUser);
router.post('/checkUser',userController.checkUser);






module.exports = router;