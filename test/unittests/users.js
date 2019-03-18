/**
 * Test for class users.
 */
"use strict";

/* global describe it */

process.env.NODE_ENV = "test";

var assert = require("assert");
const users = require("../../models/users");
const bors = require("../../models/bors");
const bcrypt = require('bcryptjs');
const saltRounds = 10;



// stolen from stackoverflow
function makeid(length) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}



var randomName =  makeid(20);
var token;

describe("Testing adding new User", function() {
    describe("Adding User with random name and password 123", function() {
        it("should return an object including name and JWT token, a string with 227 characters", async function() {

            var hashatPassword = bcrypt.hashSync("123", saltRounds);
            let res = await users.newUser(randomName +"@coolmail.com", randomName, hashatPassword);

            assert.equal(res.name, randomName);
            assert.equal(res.token.length, 227);
        });
    });
});

describe("Testing logging in a new User", function() {
    describe("Adding User with the same random name as before", function() {
        it("should return an object including name and JWT token, a string with 227 characters", async function() {

            let res = await users.login(randomName +"@coolmail.com", "123");

            token = res.token;
            assert.equal(res.name, randomName);
            assert.equal(res.token.length, 227);
        });
    });
});


describe("Testing insert", function() {
    describe("inserting 1000 to capital of the same random name as before", function() {
        it("should NOT return an error message", async function() {

            let res = await bors.insert(token, 1000);

            assert.notEqual(res, "Något blev när innehav i cash skulle uppdateras: ");

        });
    });
});

describe("Testing buy", function() {
    describe("buying 55 from middle stock", function() {
        it("should NOT return an error message", async function() {

            let res = await bors.buy(token, 3, 55);

            assert.notEqual(res, "Något blev när innehav skulle uppdateras: ");

        });
    });
});





describe("Testing showCapital", function() {
    describe("showing current capital of the same random name as before", function() {
        it("should return an object containing {capital: 1000, stock: [0, 0, 55, 0, 0]}", async function() {

            let res = await bors.showCapital(token);

            assert.equal(res.capital, 1000);
            assert.equal(res.stock[2], 55);

        });
    });
});
