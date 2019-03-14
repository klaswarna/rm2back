const express = require("express");
const app = express();
const cors = require('cors'); //för att kunna köra från local till local på nåt sätt
const morgan = require('morgan');
const port = 1337; //me-app lyssnar på 8333

const bodyParser = require("body-parser");


const index = require('./routes/index');
const signin = require('./routes/signin');
const login = require('./routes/login');
const reset = require('./routes/reset');
const capital = require('./routes/capital');
const webs = require('./routes/websocket');

const bors = require("./models/bors.js");


//för websocket
const http = require("http");
const url = require("url");
const Websocket = require("ws");
const server = http.createServer(app);
const wss = new Websocket.Server({
    server: server,
    clientTracking: true,
    handleProtocols: handleProtocols
});

var aktier = {
    aktier: [100, 100, 100, 100, 100]
}


app.use(cors());


// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}



// This is middleware called for all routes. Måste ligga högst i koden om man vill att den alltid skall anropas före alla andra
// Middleware takes three parameters.
app.use((req, res, next) => {
    console.log(req.method);
    console.log(req.path);
    next();
});


app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


app.use('/', index);
app.use('/signin', signin);
app.use('/login', login);
app.use('/reset', reset);
app.use('/capital', capital);

// setInterval(async function() {
//     if(process.env.BORS=="true") {
//         bors.updateValue();
//         var data = await currentStock();
//         console.log(data);
//         wss.broadcast(JSON.stringify(data));
//     }
// }, 10000);


setInterval(async function() {
    if(process.env.BORS=="true") {
        aktier = bors.updateValue(aktier);
        //var data = await currentStock();
        console.log(aktier);
        wss.broadcast(JSON.stringify(data));
    }
}, 10000);





/// websocket trixande
//Bestämma subprotokoll
/**
 * Select subprotocol to use for connection.
 *
 * @param {Array} protocols              Subprotocols to choose from, sent
 *                                        by client request.
 * @param {http.IncomingMessage} request The client HTTP GET request.
 *
 * @return {void}
 */
function handleProtocols(protocols , request) {
    console.log(`Incoming protocol requests '${protocols}'.`);
    for (var i=0; i < protocols.length; i++) {
        if (protocols[i] === "text") {
            return "text";
        } else if (protocols[i] === "json") {
            return "json";
        }
    }
    return false;
}


// Broadcast data to everyone except one self (ws).
wss.broadcast = (data) => {
    let clients = 0;

    wss.clients.forEach((client) => {
        //if (client !== ws && client.readyState === Websocket.OPEN) { // för att inte skicka till sig själv
        if (client.readyState === Websocket.OPEN) { // för att även skicka till sig själv
            clients++;
                client.send(data); // detta sänder
            }
    });
    console.log(`Broadcasted data to ${clients} (${wss.clients.size}) clients.`);
};


// Handle websocket requests nya tillagda klienter
wss.on("connection", (ws /*, req*/) => {
    console.log(`Connection received. Adding client (${wss.clients.size}).`);

    //wss.broadcastExcept(ws, `New client connected (${wss.clients.size}).`);

    ws.on("message", (message) => {
        console.log("Received: %s", message);
        wss.broadcast(ws, message);
    });

    ws.on("error", (error) => {
        console.log(`Server error: ${error}`);
    });

    ws.on("close", (code, reason) => {
        console.log(`Closing connection: ${code} ${reason}`);
        console.log(`Client disconnected (${wss.clients.size}).`)
        //wss.broadcastExcept(ws, `Client disconnected (${wss.clients.size}).`);
    });
});


//wss.on("connection", (ws, req) => {webs.websocket(ws, req, wss)});



async function currentStock(res, err) {
    var value = await bors.getValue();
    const data = {
        "aktier": [
            value.amount1,
            value.amount2,
            value.amount3,
            value.amount4,
            value.amount5
        ]
    };

    return data;
    console.log(data);
};

















/*
// Handle websocket requests
wss.on("connection", (ws, req) => {webs.websocket(ws, req, wss)});
/// slut websockettrixande
*/

// Startup server (med websocket)
server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});


//app.listen(port, () => console.log(`rm2back API listening on port ${port}!`)); // originalet
