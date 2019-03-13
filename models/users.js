/**
 * A module exporting functions to access the database.
 */
"use strict";

const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;


const sqlite3 = require('sqlite3').verbose();
const db = require("../db/database.js");
const bcrypt = require('bcryptjs');
const saltRounds = 10;


async function newUser(email, name, password) {
    await promiseNewStockholder(email).catch(function(err) {
        console.log("Gick ej skapa ny stockholder:");
        console.log(err);
        return
    });
    var vardet = await promiseNewUser(email, name, password).then(function(value) {
        return value;
    }).catch(function(err) {
        console.log("Gick ej skapa ny användare");
        console.log(err);
        return
    });
    return vardet;
}

function promiseNewStockholder(email) {
    return new Promise(function(resolve, reject) {
        db.run("INSERT INTO innehav (email, kapital, stock1, stock2, stock3, stock4, stock5) VALUES (?, 0, 0, 0, 0, 0, 0)",
            email,
            (err) => {
            if (err) {
                reject({error: "Fuckade sig när ny post i innehav tillades: " + err});
            } else {
                resolve({msg: "ny kapitalinnehavare"}) //
            }
        });
    })
}

function promiseNewUser(email, name, password) {
    return new Promise(function(resolve, reject) {
        console.log("inatad email: " + email);
        db.run("INSERT INTO users (email, name, password) VALUES (?, ?, ?)",
            email,
            name,
            password, (err) => {
            if (err) {
                reject({error: "Email finns redan: " + err});
            } else {
                var payload = {
                    email: email,
                    name: name,
                    //password: password
                }
                var token = jwt.sign(payload, secret, {expiresIn: '1h'});
                resolve({email: email, name: name, /*password: password,*/ token: token}) //
            }
        });
    })
}


async function login(email, password) {
    var vardet = await promiseLogin(email, password).then(function(value) {
        return value;
    }).catch(function(err) {
        console.log("Användaren finns ej!");
        console.log(err);
    }
    );
    return vardet;
}

function promiseLogin(email, password) {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM users WHERE email = ?",
            email,
            (err, row) => {
            if (err) {
                reject({error: "Något blev fel vid inloggningen: " + err});
            } else {
                if (row.length == 0) {
                    reject({error: "Användaren finns ej."});
                    //resolve({}) //eventuellt skicka nåt relevant meddelande här att inloggningsuppg. felaktiga
                } else {
                    if (bcrypt.compareSync(password, row[0].password)) {
                        var payload = {
                            email: row[0].email,
                            name: row[0].name,
                            //password: row[0].password
                        }
                        var token = jwt.sign(payload, secret, {expiresIn: '1h'});
                        resolve({email: row[0].email, name: row[0].name, /*password: row[0].password,*/ token: token})
                    } else {
                        reject({error: "Fellösenord"});
                    }

                }
            }
        });
    })
}



module.exports = {
    newUser : newUser,
    login : login
};
