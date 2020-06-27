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

app.controller("chatController", function ($scope, $http) {
    $scope.rooms = [];
    $scope.rooms = [{
        id: "1",
        title: "제목",
        category:["#example","#example2"],
        img: "/img/test.png",
        max: 10,
        member: 3
    },{
        id: "2",
        title: "제목2",
        category:["#example","#example2"],
        img: "/img/test.png",
        max: 10,
        member: 3
    },{
        id: "3",
        title: "제목3",
        category:["#example","#example2"],
        img: "/img/test.png",
        max: 10,
        member: 3
    },{
        id: "4",
        title: "제목3",
        category:["#example","#example2"],
        img: "/img/test.png",
        max: 10,
        member: 3
    },{
        id: "5",
        title: "제목3",
        category:["#example","#example2"],
        img: "/img/test.png",
        max: 10,
        member: 3
    },{
        id: "6",
        title: "제목3",
        category:["#example","#example2"],
        img: "/img/test.png",
        max: 10,
        member: 3
    }];
    $scope.connect = function ($event, room) {
        connect($event, room);
        $scope.currentRoom = room;
    };

    $scope.sendMessage = function ($event) {
        sendMessage($event);
    };
});


var colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
];

function connect(event, room) {
    //username = document.querySelector('#name').value.trim();
    username = '박경호';
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

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.content +' 방에 ' + message.sender + ' 님이 입장하였습니다.';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' 님이 나갔습니다.';
    } else {
        if(message.sender === username){
            messageElement.classList.add('chat-message');
            messageElement.classList.add('me');
        }else{
            messageElement.classList.add('chat-message');
        }


        var avatarElement = document.createElement('i');
        var avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        var usernameElement = document.createElement('span');
        var usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    var textElement = document.createElement('p');
    var messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

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
