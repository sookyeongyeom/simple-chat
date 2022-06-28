const { time } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

io.on("connection", (socket) => {
    console.log("a user connected!");
    let entry = {
        msg: "누군가 입장했습니다. 대화를 나눠보세요!",
        name: "SYSTEM",
    };
    socket.broadcast.emit("chat message", entry);
    socket.on("chat message", (msg, name) => {
        let data = { msg: msg, name: name };
        io.emit("chat message", data);
        console.log(name);
        console.log("message: " + msg);
    });
    setTimeout(() => {
        socket.on("disconnect", () => {
            console.log("user disconnected");
            let data = { msg: "상대방이 퇴장했습니다.", name: "SYSTEM" };
            io.emit("chat message", data);
        });
    }, 5000);
});

server.listen(3000, () => {
    console.log("listening on *:3000");
});
