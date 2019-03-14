var express = require('express');
var router = express.Router();
var url = require("url");

const bors = require("../models/bors.js");
const aktier = require("../app.js");



router.get('/', function(req, res, next) {

    res.json({
        msg:"Servern är igång!",
        instruktioner: [
            "Använd rm2back.kwramverk.me/reset för att nollställa aktiekurserna till 100",
            "Använd rm2back.kwramverk.me/reset/start för att aktivera automatisk uppdatering var 10:e sekund",
            "Använd rm2back.kwramverk.me/reset/stop för att inaktivera automatisk uppdatering var 10:e sekund"
        ]
    });
});


module.exports = router;
