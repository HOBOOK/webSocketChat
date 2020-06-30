'use strict';

var app = angular.module("chatApp", ['ngAnimate', 'ui.bootstrap','ngSanitize']);
var stompClient = null;
var username = null;
var rooms = null;
var currentRoom  = null;
var chatPage = document.querySelector('#chat-page');
var messageInput = document.querySelector('#message');
var messageArea = document.querySelector('#messageArea');
var connectingElement = document.querySelector('.connecting');
var chatMenu = document.querySelector('#chat-menu');

app.controller("chatController", function ($scope, $http) {
    $scope.rooms = [];
    $scope.rooms = [{
        id: "1",
        type: 0,
        title: "제목",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "2",
        type: 1,
        title: "제목2",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "3",
        type: 0,
        title: "제목3",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "4",
        type: 1,
        title: "제목4",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "5",
        type: 0,
        title: "제목5",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "6",
        type: 1,
        title: "제목6",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "7",
        type: 0,
        title: "제목7",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    },{
        id: "8",
        type: 1,
        title: "제목8",
        description: "채팅방 들어오세요~",
        category:["#태그1","#태그2"],
        img: "/img/test.png",
        max: 10,
        member: 0
    }];
    $scope.connect = function ($event, room) {
        connect($event, room);
        $scope.currentRoom = room;
    };

    $scope.sendMessage = function ($event) {
        sendMessage($event);
    };

    $scope.onClickToggleMenu = function () {
        var display = chatMenu.style.display;
        if(display === 'none' || display ===''){
            chatMenu.style.display = 'inline-block';
        }else{
            chatMenu.style.display = 'none';
        }
    };
});


var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event, room) {
    //username = document.querySelector('#name').value.trim();
    username = Math.random().toString(36).substr(2, 5);
    if(username) {
        disConnect();
        currentRoom = room;
        chatPage.classList.remove('hidden');

        var socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);

        stompClient.connect({}, onConnected, onError);
    }
    event.preventDefault();
}

function onConnected() {
    // Subscribe to the Public Topic
    stompClient.subscribe('/topic/'+currentRoom.id, onMessageReceived);

    // Tell your username to the server
    stompClient.send("/app/chat.addUser/"+currentRoom.id,
        {},
        JSON.stringify({
            content: currentRoom.title,
            sender: username,
            type: 'JOIN'
        })
    )

    connectingElement.classList.add('hidden');
    clearChatText();
}


function onError(error) {
    connectingElement.textContent = 'Could not connect to WebSocket server. Please refresh this page to try again!';
    connectingElement.style.color = 'red';
}

function disConnect(){
    if(stompClient !== null){
        stompClient.send("/app/chat.removeUser/" + currentRoom.id,
            {},
            JSON.stringify({sender: username, type: 'LEAVE'})
        )
        stompClient.disconnect();
        currentRoom = null;
    }
}

function sendMessage(event) {
    var messageContent = messageInput.value.trim();
    if(messageContent && stompClient) {
        var message = {
            type: 'CHAT',
            content: messageInput.value,
            sender: username

        };
        stompClient.send("/app/chat.sendMessage/"+currentRoom.id, {}, JSON.stringify(message));
        messageInput.value = '';
    }
    event.preventDefault();
}


function onMessageReceived(payload) {
    var message = JSON.parse(payload.body);

    var messageElement = document.createElement('li');
    var messageCoverElement = document.createElement('span');

    if(message.type === 'JOIN') {
        messageCoverElement.classList.add('event-message-cover');
        messageElement.classList.add('event-message');
        message.content = message.content +' 방에 ' + message.sender + ' 님이 입장하였습니다.';
    } else if (message.type === 'LEAVE') {
        messageCoverElement.classList.add('event-message-cover');
        messageElement.classList.add('event-message');
        message.content = message.sender + ' 님이 나갔습니다.';
    } else {
        messageCoverElement.classList.add('chat-message-cover');
        messageElement.classList.add('chat-message');
        if(message.sender === username){
            messageCoverElement.classList.add('me');
            messageElement.classList.add('me');
        }
        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageCoverElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageCoverElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageCoverElement.appendChild(textElement);

    messageElement.appendChild(messageCoverElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}


function getAvatarColor(messageSender) {
    var hash = 0;
    for (var i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    var index = Math.abs(hash % colors.length);
    return colors[index];
}

function clearChatText() {
    $("#messageArea").empty();
}
