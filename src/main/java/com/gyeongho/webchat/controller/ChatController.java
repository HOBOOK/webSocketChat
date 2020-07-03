package com.gyeongho.webchat.controller;

import com.gyeongho.webchat.model.ChatRoom;
import com.gyeongho.webchat.model.Message;
import com.gyeongho.webchat.model.User;
import com.gyeongho.webchat.repository.ChatRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
public class ChatController {

    @Autowired private ChatRoomRepository chatRoomRepository;

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
        System.out.println("새로운유저입장");
        String chatRoomId = accessor.getDestination().substring(accessor.getDestination().lastIndexOf("/")+1);
        User user = new User();
        user.setId((long)0);
        user.setName(message.getSender());
        ChatRoom chatRoom = ChatRoom.create(chatRoomId);
        chatRoomRepository.addChatRoom(chatRoom);
        chatRoomRepository.addChatRoomUser(chatRoomId,user);
        System.out.println(chatRoomRepository.getChatRoomUser(chatRoomId));
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
