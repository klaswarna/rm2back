/**
 * A module exporting functions to access and modify the stock database.
 */
"use strict";


const jwt = require('jsonwebtoken');
const db = require("../db/database.js");
const secret = process.env.JWT_SECRET;


//genererar en förändringsfaktor
function intRand() {
    var rand1 = Math.floor(Math.random() * 2000);
    var rand2 = Math.floor(Math.random() * 3000);
    var factor1 = rand1 / 10000 + 0.902
    var factor2 = rand2 / 10000 + 0.852

    return factor1*factor2
}

// lägger förändringsfaktorer i en array
function randValue() {
    var result = []
    for (var i = 0; i < 5; i++) {
        result.push(intRand())
    }
    return result
}


// tar emot befintliga börsvärden och förändrar med respektive faktoroch återsänder
function updateValue(inarray) {
    var varden = randValue();
    for (var i=0 ; i < 5; i++) {
        inarray.aktier[i] = inarray.aktier[i] * varden[i];
    }
    return inarray;
}


// lägger resetvärde i miljövariabel för att återställa
function reset() {
    console.log("databasen återställs");
    process.env.BORS="reset"
}

// söker upp persons innehav av kapital och respektive aktie
async function showCapital(token) {
    var vardet = await promiseShowCapital(token).then(function(value) {
        return value;
    });
    return vardet;
}
// del av ovanstående
function promiseShowCapital(token) {
    return new Promise(function(resolve, reject) {
        jwt.verify(token, secret, function(err, decoded) {
            if (err) {
                console.log("invalid token: " + err)
            } else { // nu har token krypterats
                console.log("dekrypterat innehåll: ");
                console.log(decoded);
                db.all("SELECT * FROM innehav WHERE email = ?",
                    decoded.email,
                    (err, row) => {
                    if (err) {
                        reject({error: "Något blev fel vid check av innehav: " + err});
                    } else {
                        if (row.length == 0) {
                            resolve({}) //eventuellt skicka nåt relevant meddelande här att inloggningsuppg.felaktiga
                        } else {
                            resolve({capital:row[0].kapital, stock: [row[0].stock1, row[0].stock2, row[0].stock3, row[0].stock4, row[0].stock5]})
                        }
                    }
                });
            }
        })
    })
}

// köp sälj viss aktie visst antal
async function buy(token, bolag, antal) {
    await promiseBuy(token, bolag, antal).catch(function(error) {
        console.log("Det blev fel: ");
        console.log(error);
    })
};
// till ovanstående
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

// sätt in nytt kapital
async function insert(token, cash) {
    await promiseInsert(token, cash).catch(function(error) {
        console.log("Fel vid pengainsättning: ");
        console.log(error);
    })
};
// hör till ovanstående
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
    //getValue: getValue,
    reset: reset,
    showCapital: showCapital,
    buy: buy,
    insert:insert
}
