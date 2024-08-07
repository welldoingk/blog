package com.kth.blog.event.service;

import com.kth.blog.event.dto.EventDto;
import com.kth.blog.event.dto.EventRequestDto;
import com.kth.blog.event.entity.Event;
import com.kth.blog.event.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class EventService {
    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public List<EventDto> getAllEvents() {
        List<EventDto> collect = eventRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        return collect;
    }

    @Transactional
    public EventDto createEvent(EventRequestDto requestDto) {
        Event event = Event.builder()
                .title(requestDto.getTitle())
                .start(requestDto.getStart())
                .end(requestDto.getEnd())
                .color(requestDto.getColor())
                .build();
        return convertToDto(eventRepository.save(event));
    }

    @Transactional
    public EventDto updateEvent(Long id, EventRequestDto requestDto) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.update(requestDto.getTitle(), requestDto.getStart(), requestDto.getEnd(), requestDto.getColor());
        return convertToDto(event);
    }

    @Transactional
    public void deleteEvent(Long id) {
        eventRepository.deleteById(id);
    }

    private EventDto convertToDto(Event event) {
        return EventDto.builder()
                .id(event.getId())
                .title(event.getTitle())
                .start(event.getStart())
                .end(event.getEnd())
                .color(event.getColor())
                .build();
    }

}