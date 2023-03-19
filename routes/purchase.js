const express = require('express');
const purchaseController = require('../controllers/purchase');
const userAuth = require('../middleware/Authorization');


const router = express.Router();

router.get('/premiummembership',userAuth.authenticate,purchaseController.purchasepremium);
router.post('/updatestatus',userAuth.authenticate,purchaseController.updateTransactionStatus);


module.exports = router;
