var express = require('express');
var router = express.Router();
let main = require('../controllers/main');

/* GET users listing. */
router.get('/', main.get_signs); //get method to retrieve mongodb data


module.exports = router; //exports router to be used in app.js
