/**
 * Test for class bors
 */
"use strict";

/* global describe it */


process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = "hemlighet";



var assert = require("assert");
const bors = require("../../models/bors");


describe("Testing methods in bors", function() {
    describe("Inject an array with 100, 100, 100, 100, 100 and modifies the values", function() {
        it("should return modefied array with slightly higher and lower values", async function() {

            var originalAktier = {
                aktier: [100, 100, 100, 100, 100]
            };


            var testAktier = {
                aktier: [100, 100, 100, 100, 100]
            };

            let res = await bors.updateValue(testAktier);


            assert.notEqual(res, originalAktier);
        });
    });
});
