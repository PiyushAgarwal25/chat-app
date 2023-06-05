const generateMessage = (text)=>{
    return {
        message:text,
        createdAt: new Date().getTime()
    }
}

const generateLocMessage = (url)=>{
    return {
        url,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateMessage,
    generateLocMessage
}