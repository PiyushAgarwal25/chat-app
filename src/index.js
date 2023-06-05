const express = require("express");
const http = require("http");
const path = require("path");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {generateMessage,generateLocMessage} = require('./utils/messages.js');
const {getUser,removeUser,addUser,getUsersInRoom} = require("./utils/users.js");

const port = process.env.PORT ||3000;
const publicDir = path.join(__dirname,"../public")

const app = express();
const server = http.createServer(app);
const io = socketio(server);



io.on("connection",(socket)=>{
    console.log("New WebSocket connection");

    socket.on("join",(obj,callback)=>{
        const {username,room} = obj;
        const {error,user} = addUser({
            id:socket.id,username,room
        });

        if(error){
            return callback(error);
        }

        socket.join(user.room);
        socket.emit('message',generateMessage('Admin','Welcome!'));
        socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`));
        io.to(user.room).emit("roomData",{
            room: user.room,
            users:getUsersInRoom(user.room)
        });

        callback();
    });

    socket.on("sendMessage",(message,callback)=>{
        const filter = new Filter();
        
        if(filter.isProfane(message)){
            return callback("Profane is not allowed!");
        }

        let user = getUser(socket.id);

        if(!user){
            return callback("User with id not present");
        }

        io.to(user.room).emit("message",generateMessage(user.username,message));
        callback();
    });

    
    socket.on("sendLocation",(position,callback)=>{
        let user = getUser(socket.id);
        io.to(user.room).emit("locationMessage",generateLocMessage(user.username,`https://google.com/maps/?=${position.latitude},${position.longitude}`));
        callback();
    });

    socket.on("disconnect",()=>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit("message",generateMessage('Admin',`${user.username} has left the chat!`));
            io.to(user.room).emit("roomData",{
                room: user.room,
                users:getUsersInRoom(user.room)
            })
        };
    });

});

app.use(express.static(publicDir));

server.listen(port,()=>{
    console.log("App started on PORT: ",port);
}) 