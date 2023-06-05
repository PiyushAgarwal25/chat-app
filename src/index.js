const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const port = process.env.PORT ||3000;
const publicDir = path.join(__dirname,"../public")

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let count = 0;

io.on("connection",(socket)=>{
    console.log("New WebSocket connection");

    // socket.emit("get-count",count) 

    socket.emit("message","Welcome !");

    socket.on("sendMessage",(message)=>{
        io.emit("message",message);
    })

    socket.on("updated-count",()=>{
        count++;
        io.emit("get-count",count);
    })
});

app.use("/static",express.static(publicDir));

server.listen(port,()=>{
    console.log("App started on PORT: ",port);
}) 