let io;
module.exports = {
    init: (server) => {
        io = require('socket.io')(server, {
            cors: {
                origin: '*',
            }
        });
        io.on("connection", (client) => {

            console.log("a client has connected", client.id);
            console.log("Total Connections: ", io.sockets.sockets.size);

            client.on("bdikale", (msg) => {

                console.log("bdikale ", msg);

            })

        })

        return io;
    },
    get: () => {
        if (!io) {
            console.log("Socket was requested but is not initialized !");
        }
        return io
    }
}