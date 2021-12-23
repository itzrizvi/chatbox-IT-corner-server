const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const port = 5000 || process.env.PORT;

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});


app.get('/', (req, res) => {
    res.status(200).json({ name: "Server" })
})

const users = {};

io.on("connection", (socket) => {
    console.log('Some one is Connected and Socket id' + socket.id);

    socket.on('disconnect', () => {
        console.log(`${socket.id} is Disconnected`);

        // Remove Disconnected User
        for (let user in users) {
            if (users[user] === socket.id) {
                delete users[user];
            }
        }

        io.emit('all_users', users);

    });

    socket.on('new_user', (userName) => {
        console.log(`Server: ${userName}`);
        users[userName] = socket.id;

        // Tell Others that someone connected
        io.emit('all_users', users);

    });
});

httpServer.listen(port, () => {
    console.log(`Server Listening on port : ${port}`);
});