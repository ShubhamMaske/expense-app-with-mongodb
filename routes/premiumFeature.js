
const express = require('express');
const premiumfeatureController = require('../controllers/premiumFeature');
const userAuth = require('../middleware/Authorization');
const router = express.Router();


router.get('/showLeaderBoard',userAuth.authenticate,premiumfeatureController.getUserLeaderBoard);

module.exports = router;