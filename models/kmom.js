/**
 * A module exporting functions to access the database.
 */
"use strict";


const sqlite3 = require('sqlite3').verbose();
//const db = new sqlite3.Database('./db/texts.sqlite');
const db = require("../db/database.js");


const mongo = require("mongodb").MongoClient;
const dsn = "mongodb://localhost:27017/chatboard";



var answer = [];
var content ="";

function checkAnswer() {
    return answer;
}

//addar kmom
function addReport(res, content) {
    //answer. = "empty";
    content.text.forEach(function(element) {
        db.run("INSERT INTO reports (id, content) VALUES (?, ?)",
            content.kmom,
            element, (err) => {
            if (err) {
                // returnera error
                answer = ("Something went wrong when adding report: " + err);
                return
            } else {
                // if went well
                answer.push = ["Added: " + element + " to " + content.kmom];
                return
            }
        });
    });


    return
}

function getReport(kmom) {
    console.log("kmomet som söks är: " + kmom); answer = "empty";
    db.all("SELECT content FROM reports WHERE id = ?",
        kmom,
        (err, row) => {
        if (err) {
            // returnera error
            answer = false;
        } else {
            if (row.length > 0) {
                content = row.map(stycke => stycke.content);
                //answer = row.map(stycke => stycke.content);
                answer = {
                     title: kmom,
                     paragraphs: content
                 };
            } else {
                answer = {
                    title: kmom,
                    paragraphs: ["no such index"]
                };
            }

            //console.log(row.length);
        }
    });
    return
}

// nedanstående fullständigt stulen från exempelkod p.g.a. sin förträffliga utbyggnadsmöjlighet
async function findInCollection(dsn, colName, criteria, projection, limit) {
    const client = await mongo.connect(dsn);
    const db = await client.db();
    const col = await db.collection(colName);
    const res = await col.find(criteria, projection).limit(limit).toArray();

    await client.close();
    return res;
}

module.exports = {
    addReport : addReport,
    checkAnswer : checkAnswer,
    getReport : getReport,
    findInCollection: findInCollection
};
