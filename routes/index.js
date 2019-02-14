var express = require('express');
var router = express.Router();
let main = require('../controllers/main');

/* GET home page. */
router.get('/', main.get_main);

//submit home page form
router.post('/', main.submit_sign);


module.exports = router;