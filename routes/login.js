var express = require('express');
var router = express.Router();

const bcrypt = require('bcryptjs');
const users = require("../models/users.js");
const saltRounds = 10;

router.post('/', async function(req, res, next) {
    var data;
    var email = req.body.email;
    var password = req.body.password;

    var data = await users.login(email, password);
    res.json(data);
    });


module.exports = router;
