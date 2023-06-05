const socket = io();


// const countdiv = document.querySelector(".count");
// const btn = document.getElementById("btn");
// socket.on("message",msg=>{
//     console.log(msg);
// })
// btn.addEventListener("click",()=>{
//     socket.emit("updated-count");
// })
// socket.on("get-count",count=>{
//     countdiv.innerHTML = count;
// })


let form = document.querySelector("#message-form")

socket.on("message",msg=>{
    console.log(msg);
})

form.addEventListener("submit",(e)=>{
    e.preventDefault();
    let message = document.querySelector("input").value;
    socket.emit("sendMessage",message)
})
