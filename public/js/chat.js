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
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML;

// options
const {username, room} = Qs.parse(location.search,{ignoreQueryPrefix:true});

const autoScroll = () =>{

    // New message element
    const newMessage = messages.lastElementChild;

    //height of the new message
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight+newMessageMargin;

    // visible height 
    const visibleHeight = messages.offsetHeight;

    // height of messages container
    const containerHeight = messages.scrollHeight;

    // how far have I scrolled ??
    const scrollOffset = messages.scrollTop + visibleHeight;

    if(containerHeight-newMessageHeight<=scrollOffset){
        messages.scrollTop = messages.scrollHeight;
    }

}

socket.on("message",obj=>{
    let {message,createdAt,username} = obj;
    console.log(message);
    const html = Mustache.render(msgtemplate,{
        username,
        message,
        createdAt:moment(createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML("beforeend",html);
    autoScroll();
});

socket.on("locationMessage",obj=>{
    let {url,createdAt,username} = obj;
    console.log(url);
    const html = Mustache.render(locmsgtemplate,{
        username,
        url,
        createdAt:moment(createdAt).format('h:mm a')
    });
    messages.insertAdjacentHTML("beforeend",html);
    autoScroll();
});


socket.on('roomData',({room,users})=>{
    console.log(room,users);
    const html = Mustache.render(sidebarTemplate,{
        room,
        users
    });
    document.querySelector("#sidebar").innerHTML = html
})

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

socket.emit("join",{username,room},(error)=>{
    if(error){
        alert(error);
        location.href = "/";
    }
});


