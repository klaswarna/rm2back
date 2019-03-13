var express = require('express');
var router = express.Router();

const bors = require("../models/bors.js");


router.get('/', async function(req, res, next) {
    var value = await bors.reset();
    res.json("återsällt")
});

router.get('/stop', async function(req, res, next) {
    process.env.BORS="false";
    res.json("stoppad")
});


router.get('/start', async function(req, res, next) {
    process.env.BORS="true";
    res.json("startad")
});




module.exports = router;
