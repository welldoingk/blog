package com.kth.blog.event.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class EventDto {
    private Long id;
    private String title;
    private LocalDateTime start;
    private LocalDateTime end;
    private String color;

    @Builder
    public EventDto(Long id, String title, LocalDateTime start, LocalDateTime end, String color) {
        this.id = id;
        this.title = title;
        this.start = start;
        this.end = end;
        this.color = color;
    }
}