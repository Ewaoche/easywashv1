const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');


//Load order controllers 
const { createOrderController } = require('../controllers/orderController');


router.post('/', createOrderController);



module.exports = router;