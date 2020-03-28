const users=[]


//Add User

const addUser =({id,username,room})=>{
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate data
    if(!username || !room){
        return{
            error:'Username and Room name are required'
        }
    }

    //chack for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })



    if(existingUser){

        return {
            error:'username already taken',
            users
            
        }
    }
    //store user

    const user = {id,username,room}
    users.push(user)
    
    
    return{user}
    

}



// Remove User

const removeUser =(id)=>{
    const index = users.findIndex((user)=> user.id === id)
   

    if( index !== -1){
        return users.splice(index,1)[0]
    }
    
}



//Get User by id

const getUserById = (id)=>{
    const index = users.find((user)=> user.id === id)

      if( index ){
          return index
      }  

      return{
          error:'no user with that id'
      }   
}



// Get Users in room

const getUserByRoom = (room)=>{
    room = room.toLowerCase()
    const roomsarray = users.filter((user)=>user.room === room)
     
    if (roomsarray.length<1){
        return{
            error:'no rooms with that name or nobody in that room'
        }
    }
    return roomsarray
}

module.exports={
    addUser,
    removeUser,
    getUserById,
    getUserByRoom
}



