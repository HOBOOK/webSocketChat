package com.gyeongho.webchat.model;

import lombok.Getter;
import lombok.NonNull;
import org.springframework.web.socket.WebSocketSession;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Getter
public class ChatRoom {
    private String id;
    private String name;
    private String category;
    private int max;
    private Set<WebSocketSession> sessions = new HashSet<>();

    public static ChatRoom create(@NonNull String name){
        ChatRoom created = new ChatRoom();
        created.id = UUID.randomUUID().toString();
        created.name = name;
        return created;
    }
}
