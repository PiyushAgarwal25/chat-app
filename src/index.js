const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {generateMessage,generateLocMessage} = require('./utils/messages.js');

const port = process.env.PORT ||3000;
const publicDir = path.join(__dirname,"../public")

const app = express();
const server = http.createServer(app);
const io = socketio(server);



io.on("connection",(socket)=>{
    console.log("New WebSocket connection");

    socket.broadcast.emit("message",generateMessage("A new user has joined the chat!"));

    socket.on("sendMessage",(message,callback)=>{
        const filter = new Filter();
        
        if(filter.isProfane(message)){
            return callback("Profane is not allowed!");
        }

        io.to('10').emit("message",generateMessage(message));
        callback();
    });

    socket.on("join",obj=>{
        const {username,room} = obj;
        socket.join(room);

        socket.emit('message',generateMessage('Welcome!'));
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined!`));
    });
    
    socket.on("sendLocation",(position,callback)=>{
        io.emit("locationMessage",generateLocMessage(`https://google.com/maps/?=${position.latitude},${position.longitude}`));
        callback();
    });

    socket.on("disconnect",()=>{
        io.emit("message",generateMessage("A user has left the chat!"));
    });

});

app.use(express.static(publicDir));

server.listen(port,()=>{
    console.log("App started on PORT: ",port);
}) 