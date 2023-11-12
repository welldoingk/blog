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
public class PostRequestDto {

    private Long id;
    private Long boardId;
    private String title;
    private String content;
    private Long viewCount;
    private String username;
    private String memberId;
    private List<MultipartFile> postFiles;
    private LocalDateTime createAt;
    private LocalDateTime modifiedAt;

    @QueryProjection
    @Builder
    public PostRequestDto(Long id, String title, String content, LocalDateTime createAt, LocalDateTime modifiedAt, Long viewCount,
                          String username, Long boardId) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.username = username;
        this.createAt = createAt;
        this.modifiedAt = modifiedAt;
    }

}
