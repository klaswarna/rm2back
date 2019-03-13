var express = require('express');
var router = express.Router();

//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
const users = require("../models/users.js");
const saltRounds = 10;

router.post('/', async function(req, res, next) {
    var data;
    var email = req.body.email;
    var password = req.body.password;

    // var hashatPassword = bcrypt.hash(password, saltRounds, function(err, hash) {
    //     console.log("hasg:");
    //     console.log(hash);
    //     return hash;
    // });
    //var hashatPassword = bcrypt.hashSync(password, saltRounds); // så kan man inte göra

    
    var data = await users.login(email, password);
    res.json(data);
    });


module.exports = router;
