const express = require("express");
const app = express();
const cors = require('cors'); //för att kunna köra från local till local på nåt sätt
const morgan = require('morgan');
const port = 1337; //me-app lyssnar på 8333
//const port = 8333; // behövde vara så för att köra chai
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


setInterval(async function() {
    if(process.env.BORS=="reset") {
        aktier = {
            aktier: [100, 100, 100, 100, 100]
        }
        process.env.BORS="true";
    };
    if(process.env.BORS=="true") {
        aktier = await bors.updateValue(aktier);
        //console.log(aktier);
        wss.broadcast(JSON.stringify(aktier));
    }
}, 10000);





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
    });
});



// Startup server (med websocket)
server.listen(port, () => {
    console.log(`Server is listening on ${port}`);
});

module.exports = server;
