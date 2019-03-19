var express = require('express');
var router = express.Router();

const bors = require("../models/bors.js");


router.get('/', function(req, res, next) {
    var value = bors.reset();
    res.json("återsällt")
});

router.get('/stop', function(req, res, next) {
    process.env.BORS="false";
    res.json("stoppad")
});


router.get('/start', function(req, res, next) {
    process.env.BORS="true";
    res.json("startad")
});




module.exports = router;
