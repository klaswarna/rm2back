var express = require('express');
var router = express.Router();

//const bcrypt = require('bcrypt');
//const bcrypt = require('bcryptjs');
const bors = require("../models/bors.js");
const saltRounds = 10;

router.post('/', async function(req, res, next) {
    var data;
    var token = req.body.token;
    //console.log("inkommen token är:" + token)
    var data = await bors.showCapital(token);
    //console.log("data som återskickas är:");
    //console.log(data);
    res.json(data);
    });


router.post('/buy', async function(req, res, next) {
    var data;
    var token = req.body.token;
    var bolag = req.body.bolag;
    var antal = req.body.antal;
    var data = await bors.buy(token, bolag, antal);
    res.json(data);
    });

router.post('/insert', async function(req, res, next) {
    var data;
    var token = req.body.token;
    var cash = req.body.cash;
    var data = await bors.insert(token, cash);
    res.json(data);
    });


module.exports = router;
