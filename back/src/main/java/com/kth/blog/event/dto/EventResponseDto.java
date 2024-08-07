package com.kth.blog.event.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class EventResponseDto {
    private Long id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String color;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}