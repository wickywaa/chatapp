const generateMessage=(text,username)=>{
    return{
        text,
        username,
        createdAt: new Date().getTime()
    }
}


const generateLocationMessage=(location,username)=>{
    return{
        locationUrl:`https://google.com/maps?q=${location.latitude},${location.longitude}`,
        username,
        createdAt:new Date().getTime()

    }
}

module.exports = {

    generateMessage,
    generateLocationMessage
}
