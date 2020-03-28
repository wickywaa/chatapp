
const socket = io()

const chatInput = document.getElementById('message-input')
const nameInput = document.getElementById('username-input')
const chatMessageButton = document.querySelector('#send-message-button')
const sendLocationButton = document.querySelector('#send-location-button')
const $messagesContainer = document.querySelector('#messages')


// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const shareLocationTemplate = document.querySelector('#share-location-template').innerHTML
const sidebarTemplate =document.querySelector('#sidebar-template').innerHTML


//options

const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix:true} )
const autoscroll = ()=>{
    // new message element
    const $newMessage = $messagesContainer.lastElementChild

    // height of last message
    const newmMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newmMessageStyles.marginBottom)
    const newmessageheight = $newMessage.offsetHeight + newMessageMargin


    // visibleheight
    const visibleHeight = $messagesContainer.offsetHeight



    //height of messages container
    const containerHeight = $messagesContainer.scrollHeight


    // how far have I scrolled
    const scrollOffset = $messagesContainer.scrollTop +visibleHeight

    if (containerHeight-newmessageheight <=scrollOffset){
        $messagesContainer.scrollTop = $messagesContainer.scrollHeight

    }





    console.log(newmessageheight)
    console.log(newMessageMargin)

    // new

}




socket.on('welcomemessage',(message)=>{
    
    
    const html =  Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a'),
        username:message.username
    })
    $messagesContainer.insertAdjacentHTML('beforeend',html)
    
    autoscroll()
})

socket.on('chatMessage',(message)=>{
   
   
    const html =  Mustache.render(messageTemplate,{
        message: message.text,
        createdAt: moment(message.createdAt).format('hh:mm a'),
        username: message.username
    })
    $messagesContainer.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('locationMessage',(location)=>{
    
    url = location.locationUrl
    
   
    createdAt = moment(location.createdAt).format('hh:mm a')
    
    const html =  Mustache.render(shareLocationTemplate,{
       url,
       createdAt,
       username:location.username
        
}) 

$messagesContainer.insertAdjacentHTML('beforeend',html)
autoscroll()
})


socket.on('roomData',({room,users})=>{
   html =  Mustache.render(sidebarTemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})


chatMessageButton.addEventListener('click',(e)=>{
    e.preventDefault()
    // disable
    chatMessageButton.setAttribute('disabled','disabled')
     const newMessage = nameInput.value.concat(chatInput.value)
     
     socket.emit('chatMessage',newMessage,(error)=>{

    //enable
         if (error){
             chatMessageButton.removeAttribute('disabled')
             return console.log(error)
         }
         chatMessageButton.removeAttribute('disabled')
         
     })

     chatInput.value ='' 
     chatInput.focus()
    
})

sendLocationButton.addEventListener('click',(e)=>{
    e.preventDefault()
    sendLocationButton.setAttribute('disabled','disabled')
    if (!navigator.geolocation){
        sendLocationButton.removeAttribute('diasbled')
       return alert(' your browser is shit you cant use this function')
      
    }

    navigator.geolocation.getCurrentPosition((position)=>{
        latitude = position.coords.latitude
        longitude = position.coords.longitude
        const coords={
            latitude,
            longitude
        }

        socket.emit('sendLocation',coords,(callback)=>{
            sendLocationButton.removeAttribute('disabled')
            
        })
    
        

    })
    

})


socket.emit('join',{username,room},(error)=>{

    if (error){
        alert(error)
        location.href = '/'
    }
    
})












