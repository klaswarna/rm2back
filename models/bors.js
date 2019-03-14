/**
 * A module exporting functions to access the database.
 */
"use strict";


//const sqlite3 = require('sqlite3').verbose();

const jwt = require('jsonwebtoken');
const db = require("../db/database.js");
const secret = process.env.JWT_SECRET;

function intRand() {
    var rand1 = Math.floor(Math.random() * 2000);
    var rand2 = Math.floor(Math.random() * 3000);
    var factor1 = rand1 / 10000 + 0.902
    var factor2 = rand2 / 10000 + 0.852

    return factor1*factor2
}


function randValue() {
    var result = []
    for (var i = 0; i < 5; i++) {
        result.push(intRand())
    }
    return result
}


async function updateValue(inarray) {
    var varden = randValue();
    //console.log("nu uppdaterades värdena");
    for (var i=0 ; i < 5; i++) {
        inarray.aktier[i] = inarray.aktier[i] * varden[i];
    }
    return inarray;
}

// async function updateValue() {
//     var varden = randValue();
//     //console.log("nu uppdaterades värdena");
//
//     await db.run("UPDATE bolag SET amount1 = amount1 * ?, amount2 = amount2 * ?, amount3 = amount3 * ?, amount4 = amount4 * ?, amount5 = amount5 * ? WHERE name = ?",
//         varden[0],
//         varden[1],
//         varden[2],
//         varden[3],
//         varden[4],
//         "portfolj",
//         (err) => {
//         if (err) {
//             // returnera error
//             console.log("Något sket sig när databasens börsvärde skulle uppdateras: " + err);
//             return
//         } else {
//             // if went well
//             //console.log("Börsvärdet uppdaterat");
//             return
//         }
//     });
// }



function getPromisedValue() {
    return new Promise(function(resolve, reject) {
        db.all("SELECT * FROM bolag WHERE name = ?",
            "portfolj",
            (err, row) => {
                if (err) {
                    // returnera error
                    reject(new Error("Shit! Something went wrong:" + err));
                } else {
                    resolve(row[0])// if went well
                }
            }
        )
    })
}

async function getValue() {
    var vardet = await getPromisedValue().then(function(value) {
        //console.log(value);
        return value;
    });
    //console.log("vardet: " + vardet);
    return vardet;
}


async function reset() {
    console.log("databasen återställs");
    process.env.BORS="reset"
}

async function showCapital(token) {
    var vardet = await promiseShowCapital(token).then(function(value) {
        return value;
    });
    return vardet;
}

function promiseShowCapital(token) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                console.log("invalid token: " + err)
            } else { // nu har token krypterats
                console.log("krypterade grejer: ");
                console.log(decoded);
                db.all("SELECT * FROM innehav WHERE email = ?",
                    decoded.email,
                    (err, row) => {
                    if (err) {
                        reject({error: "Något blev fel vid check av innehav: " + err});
                    } else {
                        if (row.length == 0) {
                            resolve({}) //eventuellt skicka nåt relevant meddelande här att inloggningsuppg. felaktiga
                        } else {
                            resolve({capital:row[0].kapital, stock: [row[0].stock1, row[0].stock2, row[0].stock3, row[0].stock4, row[0].stock5]})
                        }
                    }
                });
            }
        })
    })
}


async function buy(token, bolag, antal) {
    await promiseBuy(token, bolag, antal).catch(function(error) {
        console.log("Det fuckade sig: ");
        console.log(error);
    })
    };


function promiseBuy(token, bolag, antal) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                console.log("invalid token: " + err)
                reject({error: "Något blev när innehav skulle uppdateras pga fel token: " + err})
            } else { // nu har token krypterats
                db.run(`UPDATE innehav SET stock${bolag} = stock${bolag} + ? WHERE email = ?`,
                    antal,
                    decoded.email,
                    (err) => {
                    if (err) {
                        reject({error: "Något blev när innehav skulle uppdateras: " + err});
                    } else {
                        resolve({msg:"något är uppdaterat"})
                    }
                });
            }
        })
    })
}

async function insert(token, cash) {
    await promiseInsert(token, cash).catch(function(error) {
        console.log("Det fuckade sig vid pengainsättning: ");
        console.log(error);
    })
    };


function promiseInsert(token, cash) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                console.log("invalid token: " + err)
                reject({error: "Något blev när innehav skulle uppdateras pga fel token: " + err})
            } else { // nu har token krypterats
                db.run(`UPDATE innehav SET kapital = kapital + ? WHERE email = ?`,
                    cash,
                    decoded.email,
                    (err) => {
                    if (err) {
                        reject({error: "Något blev när innehav i cash skulle uppdateras: " + err});
                    } else {
                        resolve({msg:"något är uppdaterat"})
                    }
                });
            }
        })
    })
}






module.exports = {
    updateValue: updateValue,
    getValue: getValue,
    reset: reset,
    showCapital: showCapital,
    buy: buy,
    insert:insert
}
