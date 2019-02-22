var express = require('express');
var router = express.Router();
let main = require('../controllers/main'); //imports main module which deals with mongodb

/* GET home page. */
router.get('/', main.get_main); //default get_main function from main

//submit home page form
router.post('/', main.submit_sign); //post method to collect user input messages


module.exports = router; //exports to send route to app.js