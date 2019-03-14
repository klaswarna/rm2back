var express = require('express');
var router = express.Router();
var url = require("url");

const bors = require("../models/bors.js");
const aktier = require("../app.js");


// router.get('/', async function(req, res, next) {
//     var value = await bors.getValue();
//     const data = {
//         aktievarde: {
//             bolag1: value.amount1,
//             bolag2: value.amount2,
//             bolag3: value.amount3,
//             bolag4: value.amount4,
//             bolag5: value.amount5,
//         }
//     };
//
//     res.json(data);
// });

router.get('/', function(req, res, next) {
    res.json(aktier.aktier);
});


module.exports = router;
