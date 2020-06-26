package com.gyeongho.webchat.controller;

import com.gyeongho.webchat.model.Message;
import com.gyeongho.webchat.model.MessageType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import org.springframework.web.socket.messaging.SessionSubscribeEvent;

@Component
public class WebSocketEventListener {

    private static final Logger logger = LoggerFactory.getLogger(WebSocketEventListener.class);

    @Autowired private SimpMessageSendingOperations simpMessageSendingOperations;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event){
        logger.info("새로운 웹 소켓 연결");
    }

    @EventListener
    public void handleWebSocketChatListener(SessionSubscribeEvent event){
        logger.info("새로운 구독 " + event.toString());
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event){
        StompHeaderAccessor stompHeaderAccessor = StompHeaderAccessor.wrap(event.getMessage());

        String username = (String) stompHeaderAccessor.getSessionAttributes().get("username");
        if(username != null){
            logger.info("연결 종료 : " + username);

            Message message = new Message();
            message.setType(MessageType.LEAVE);
            message.setSender(username);

            simpMessageSendingOperations.convertAndSend("/topic/public", message);
        }
    }
}
