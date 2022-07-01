const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

//get username and room
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});



const socket = io();


//join chatroom
socket.emit('joinRoom', { username, room});

//get room and users
socket.on('roomUsers', ({room, users }) =>{
 outputRoomName(room);
 outputUsers(users);
});


socket.on('message', message => {
   
    if(message['text'].includes('/nick')){
        console.log('Changement de pseudo');
        const args = message['text'].slice(['text'].length).trim().split(' ');
        // var x = document.querySelector('li');
        // x.innerText = args[1];
        r = message;
       message.username = args[1];
        console.log(userList);
       
     console.log(username);
     console.log(r.username);
     var results = {};
     results.username = args[1];
     results.text = message.text;
     results.time = `${message.time}`;
     Object.keys(message).forEach(function(username) {
       
        message[username] = results[username];
        
      })
      
      console.log(message);
    }
    if(results){
        outputMessage(results);
    }else{
    outputMessage(message);
    }
    //scroll down when message
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', (e) =>{
    e.preventDefault();
    const msg = e.target.elements.msg.value;

    //Emit the message
    socket.emit('chatMessage', msg);

    // Clear inputs
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

function outputMessage(message){
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML =`<p class="meta">${message.username}<span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}


// add room name to dom
function outputRoomName(room){
 roomName.innerText = room;
}

// add user name to dom

function outputUsers(users){
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `
}