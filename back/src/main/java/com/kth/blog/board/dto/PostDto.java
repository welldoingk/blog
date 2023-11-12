package com.kth.blog.board.dto;

import com.querydsl.core.annotations.QueryProjection;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
public class PostDto {

    private Long id;
    private Long boardId;
    private String title;
    private String content;
    private Long viewCount;
    private List<MultipartFile> postFiles;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;

    @QueryProjection
    @Builder
    public PostDto(Long id, Long boardId, String title, String content, Long viewCount, LocalDateTime createAt, LocalDateTime modifiedAt) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.createAt = createAt;
        this.modifiedAt = modifiedAt;
    }
}
