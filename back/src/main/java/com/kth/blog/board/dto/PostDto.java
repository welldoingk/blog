package com.kth.blog.board.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class PostDto {
    private Long id;
    private Long boardId;
    private String title;
    private String content;
    private Long viewCount;
    private String delYn;
    private LocalDateTime createdAt;
    private LocalDateTime modifiedAt;

    @Builder
    @QueryProjection
    public PostDto(Long id, Long boardId, String title, String content, Long viewCount, String delYn, LocalDateTime createdAt, LocalDateTime modifiedAt) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.delYn = delYn;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }
}