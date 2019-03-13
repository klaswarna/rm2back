var url = require("url");

// för mongo db
// const mongo = require("mongodb").MongoClient;
// const dsn = "mongodb://localhost:27017/chatboard"; //chatboard är databasen, chat är kollektionen
//
// async function insertChatboard(dsn, message) {
//     const client = await mongo.connect(dsn);
//     const db = await client.db();
//     const col = await db.collection("chat");
//     await col.insertOne(message)
//     await client.close();
// }


websocket = function (ws, req, wss){
    const location = url.parse(req.url, true);

    ws.on("message", (message) => {
            console.log("Received: %s", message);
            wss.broadcastExcept(ws, message);
            //insertChatboard("mongodb://localhost:27017/chatboard", JSON.parse(message) ); // denna rad skickar meddelandet till databasen
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
