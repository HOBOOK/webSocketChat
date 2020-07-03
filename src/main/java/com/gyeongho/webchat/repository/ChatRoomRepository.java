package com.gyeongho.webchat.repository;

import com.gyeongho.webchat.model.ChatRoom;
import com.gyeongho.webchat.model.User;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import java.util.*;


@Repository
public class ChatRoomRepository {
    private final Map<ChatRoom, Set<User>> chatRoomUserMap = new HashMap<>();
    private final Map<String, ChatRoom> chatRoomMap = new HashMap<>();

    public void addChatRoomUser(String chatRoomId, User user){
        if(!chatRoomMap.containsKey(chatRoomId)){
            System.out.println("채팅방 유저추가 오류 - 존재하지 않는 채팅방 " + chatRoomId);
            return;
        }
        ChatRoom chatRoom = getChatRoom(chatRoomId);
        if(chatRoomUserMap.containsKey(chatRoom)){
            chatRoomUserMap.get(chatRoom).add(user);
            chatRoomUserMap.put(chatRoom, chatRoomUserMap.get(chatRoom));
        }
        else{
            Set<User> set = new HashSet<>();
            set.add(user);
            chatRoomUserMap.put(chatRoom,set);
        }
    }

    public void addChatRoom(ChatRoom chatRoom){
        chatRoomMap.put(chatRoom.getName(), chatRoom);
    }

    public Collection<User> getChatRoomUser(String chatRoomId){
        if(!chatRoomMap.containsKey(chatRoomId)){
            System.out.println("채팅방 유저정보 가져오기 오류 - 존재하지 않는 채팅방 " + chatRoomId);
            return null;
        }
        ChatRoom chatRoom = getChatRoom(chatRoomId);
        return chatRoomUserMap.get(chatRoom);
    }
    public ChatRoom getChatRoom(String id){
        return chatRoomMap.get(id);
    }

    public Collection<ChatRoom> getChatRooms(){
        return chatRoomMap.values();
    }
}
