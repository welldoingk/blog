package com.kth.blog.util;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;

@Slf4j
public class Utils {

//    public static LocalDateTime safeParseLocalDateTime(LocalDateTime dateTime) {
//        if (dateTime == null || dateTime.isBlank()) {
//            return null; // null을 반환하거나 기본값을 반환할 수 있음
//        }
//        try {
//            return LocalDateTime.parse(dateTime);
//        } catch (DateTimeParseException e) {
//            // 로그를 남기고 null을 반환하거나 기본값을 반환
//            log.warn("Invalid date format: {}", dateTime, e);
//            return null;
//        }
//    }
}
