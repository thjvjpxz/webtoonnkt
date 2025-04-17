package com.thjvjpxx.backend_comic.task;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.dto.request.CrawlerComicRequest;
import com.thjvjpxx.backend_comic.dto.websocket.CrawlerProgressMessage;
import com.thjvjpxx.backend_comic.service.impl.CrawlerServiceImpl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CrawlerTask implements Runnable {

    protected final SimpMessagingTemplate messagingTemplate;
    protected final CrawlerServiceImpl crawlerService;

    protected CrawlerComicRequest request;
    protected String sessionId;

    private volatile boolean stopped = false;

    public void initialize(CrawlerComicRequest request, String sessionId) {
        this.request = request;
        this.sessionId = sessionId;
        this.stopped = false;
    }

    public void stop() {
        this.stopped = true;
    }

    public boolean isStopped() {
        return stopped;
    }

    @Override
    public void run() {
        // Phương thức này sẽ được ghi đè bởi lớp con
        log.info("CrawlerTask đang chạy cho session: {}", sessionId);
    }

    protected void sendProgressUpdate(CrawlerProgressMessage message) {
        messagingTemplate.convertAndSend("/topic/crawler/" + message.getSessionId(), message);
    }
}