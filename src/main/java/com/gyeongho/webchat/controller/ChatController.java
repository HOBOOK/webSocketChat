package com.gyeongho.webchat.controller;

import com.gyeongho.webchat.model.Message;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {
    @MessageMapping("/chat.sendMessage")
    @SendTo("/topic/public")
    public Message sendMessage(@Payload Message message){
        return message;
    }

    @MessageMapping("/chat.sendMessage/{id}")
    @SendTo("/topic/{id}")
    public Message sendMessageToRoom(@Payload Message message){
        return message;
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Message addUser(@Payload Message message, SimpMessageHeaderAccessor accessor){
        accessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }

    @MessageMapping("/chat.addUser/{id}")
    @SendTo("/topic/{id}")
    public Message addUserToRoom(@Payload Message message, SimpMessageHeaderAccessor accessor){
        accessor.getSessionAttributes().put("username", message.getSender());
        return message;
    }

    @MessageMapping("/chat.removeUser")
    @SendTo("/topic/public")
    public Message removeUser(@Payload Message message, SimpMessageHeaderAccessor accessor){
        accessor.getSessionAttributes().remove(message.getSender());
        return message;
    }

    @MessageMapping("/chat.removeUser/{id{")
    @SendTo("/topic/{id}")
    public Message removeUserToRoom(@Payload Message message, SimpMessageHeaderAccessor accessor){
        accessor.getSessionAttributes().remove(message.getSender());
        return message;
    }
}
