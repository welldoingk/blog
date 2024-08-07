package com.kth.blog.event.entity;

import com.kth.blog.util.Timestamped;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "events")
public class Event extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "start_time")
    private LocalDateTime start;

    @Column(name = "end_time")
    private LocalDateTime end;

    private String color;

    @Builder
    public Event(String title, LocalDateTime start, LocalDateTime end, String color) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.color = color;
    }

    public void update(String title, LocalDateTime start, LocalDateTime end, String color) {
        this.title = title;
        this.start = start;
        this.end = end;
        this.color = color;
    }
}