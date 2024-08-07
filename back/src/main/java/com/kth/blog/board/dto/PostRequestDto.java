package com.kth.blog.board.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PostRequestDto {
    private Long id;
    private Long boardId;
    private String title;
    private String content;

    @Builder
    public PostRequestDto(Long id, Long boardId, String title, String content) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.content = content;
    }
}