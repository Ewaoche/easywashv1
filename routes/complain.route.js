const express = require('express');


const router = express.Router();

//Load  complain controller

const { complainController, getComplainsController } = require('../controllers/complainController');


router.post('/complains', complainController);
router.get('/complains', getComplainsController);

module.exports = router;