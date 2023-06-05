const generateMessage = (username,text)=>{
    return {
        username,
        message:text,
        createdAt: new Date().getTime()
    }
}

const generateLocMessage = (username,url)=>{
    return {
        username,
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocMessage
}