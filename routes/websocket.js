var url = require("url");

websocket = function (ws, req, wss){
    const location = url.parse(req.url, true);

    ws.on("message", (message) => {
            console.log("Received: %s", message);
            wss.broadcastExcept(ws, message);
        });


    ws.on("error", (error) => {
        console.log(`Server error: ${error}`);
    });

    ws.on("close", (code, reason) => {
        console.log(`Closing connection: ${code} ${reason}`);
    });
    return
};


module.exports = {
    websocket: websocket
};
