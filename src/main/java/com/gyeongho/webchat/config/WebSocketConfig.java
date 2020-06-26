package com.gyeongho.webchat.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker // 웹소켓 서버를 활성화
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    //웹 소켓 등록 앤드포인트
    // SockJs는 웹 소켓을 지원하지 않는 브라우저에 Fallback 옵션을 활성화하는데 사용
    // Fallback : 기능이 제대로 동작하지 않을때 대처하는 동작
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws").withSockJS();
    }

    // 한 클라이언트에서 다른 클라이언트로 메시지를 라우팅 하는데 사용될 메시지 브로커 구성
    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry){
        registry.setApplicationDestinationPrefixes("/app");
        registry.enableSimpleBroker("/topic");
    }
}
