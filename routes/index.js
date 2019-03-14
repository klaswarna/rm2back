var express = require('express');
var router = express.Router();
var url = require("url");

const bors = require("../models/bors.js");
const aktier = require("../app.js");



router.get('/', function(req, res, next) {
    console.log("aktier är: ");
    console.log(aktier);
    res.json(aktier.aktier);
});


module.exports = router;
