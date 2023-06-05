const users = [];

// addUser,removeUser,getUser,getUsersInRoom

const addUser = (obj)=>{
    let {id,username,room} = obj;
    console.log(id,username,room);
    
    if(!username || !room){
        return {
            error:"Username and room are required!"
        }
    }

    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // check the existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username;
    });

    // validate username
    if(existingUser){
        return 'Username is in use!';
    }

    const user = {id,username,room};
    users.push(user);
    return {user};
};

const removeUser = (id)=>{
    const index = users.findIndex(user=>{
        return user.id ===id
    });

    if(index !== -1){
        return users.splice(index,1)[0];
    }
};

const getUser = (id)=>{
    return users.find(user=>user.id===id);
};

const getUsersInRoom = (room)=>{
    return users.filter(user=>user.room === room);
};


module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}