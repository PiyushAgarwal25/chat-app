const socket = io();

// Elements
let form = document.querySelector("#message-form");
let formInput = form.querySelector("input");
let formBtn = form.querySelector("button");
let locBtn = document.querySelector("#send-location");
let messages = document.querySelector("#messages");

// templates
const msgtemplate = document.querySelector("#message-template").innerHTML;
const locmsgtemplate = document.querySelector('#locMessage-template').innerHTML;

// options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

socket.on("message",obj=>{
    let {message,createdAt} = obj;
    console.log(message);
    const html = Mustache.render(msgtemplate,{
        message,
        createdAt:moment(createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML("beforeend",html);
});

socket.on("locationMessage",obj=>{
    let {url,createdAt} = obj;
    console.log(url);
    const html = Mustache.render(locmsgtemplate,{
        url,
        createdAt:moment(createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML("beforeend",html);
});


// when we will submit the form we will emit message using sendMessage event
form.addEventListener("submit",(e)=>{
    e.preventDefault();
    formBtn.setAttribute("disabled","disabled");
    let message = e.target.elements.message.value;

    socket.emit("sendMessage",message,(error)=>{

        formBtn.removeAttribute("disabled");
        formInput.value = "";
        formInput.focus();

        if(error){
            return console.log(error);
        }
        console.log("Message delivered!");
    })
})

locBtn.addEventListener("click",()=>{
    if(!navigator.geolocation){
        return alert("Geolocation is not supported by browser !");
    }

    locBtn.setAttribute("disabled","disabled");

    navigator.geolocation.getCurrentPosition(position=>{
        socket.emit("sendLocation",{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>{
            locBtn.removeAttribute("disabled");
            console.log("Location Shared!");
        })
    });

});

socket.emit("join",{username,room});
