var express = require('express');
var router = express.Router();
let main = require('../controllers/main');

/* GET users listing. */
router.get('/', main.get_signs);


module.exports = router;
