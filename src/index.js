const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const path = require('path')
const Filter = require('bad-words')
const {generateLocationMessage,generateMessage} = require('./utils/messages')
const {addUser,removeUser,getUserById,getUserByRoom} = require('./utils/users')








const app = express()
const server = http.createServer(app)
const io = socketio(server)


const port = process.env.PORT || 3000

const pubPath = path.join(__dirname,'../public')
app.use(express.static(pubPath))
app.use(express.json())



io.on('connection',(socket)=>{


  

     socket.on('join',(options,callback)=>{
        
        const {error,user} = addUser({id:socket.id, ...options} )
        
        
        
        if(error){
            
           return callback(error)
           
        }
        
        
        socket.join(user.room)
        

        socket.emit('welcomemessage',generateMessage(`welcome ${user.username}`,'admin'))
        socket.broadcast.to(user.room).emit('chatMessage',generateMessage(` ${user.username} has entered`,'admin'))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserByRoom(user.room)

        })
        callback()
    })

     

     socket.on('chatMessage',(msg,callback)=>{
         

     const user = getUserById(socket.id)

     const filter = new Filter()
     if (filter.isProfane(msg)){
         return callback('please do not use profanity ')
     }
       
     
     io.to(user.room).emit('chatMessage',generateMessage(msg,user.username))
     callback()

     })

     socket.on('disconnect',()=>{
         const user = removeUser(socket.id)
         if(user){
         io.to(user.room).emit('chatMessage',generateMessage(`${user.username} has left`,'admin'))
         io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUserByRoom(user.room)

        })
         }
     })

     socket.on('sendLocation',(location,callback)=>{

        const user = getUserById(socket.id)
        
        
    
         io.to(user.room).emit('locationMessage',generateLocationMessage(location,user.username))
         
         
         
         callback('location shared')
     })
     


   
})



app.get('',(req,res)=>{
    res.render('../index',{
        message:'hey',
    })

})

server.listen(port,()=>{

    console.log('server is open on port'+port)
})