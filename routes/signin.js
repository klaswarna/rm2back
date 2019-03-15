var express = require('express');
var router = express.Router();


const bcrypt = require('bcryptjs');
const users = require("../models/users.js");
const saltRounds = 10;

router.post('/', async function(req, res, next) {
    var data = "";
    var email = req.body.email;
    var name = req.body.name;
    var password = req.body.password;

    var hashatPassword = bcrypt.hashSync(password, saltRounds);

    var data = await users.newUser(email, name, hashatPassword); //det blir undefined om fel
    res.json(data);
    });


module.exports = router;
