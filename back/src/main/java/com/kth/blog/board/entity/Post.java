package com.kth.blog.board.entity;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostResponseDto;
import com.kth.blog.util.Timestamped;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import static lombok.AccessLevel.PROTECTED;

@Entity
@Getter
@NoArgsConstructor(access = PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Post extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long id; // 번호

    private Long boardId; // 게시판 번호

    private String title; // 제목

    private String content; // 내용

    @ColumnDefault("0")
    private Long viewCount; // 조회수

    private String delYn; // 삭제여부

    public Post update(String title, String content) {
        this.title = title;
        this.content = content;
        return this;
    }

    public Post delete(String delYn) {
        this.delYn = delYn;
        return this;
    }

    public Post updateViewCount(Long viewCount) {
        this.viewCount = viewCount + 1;
        return this;
    }

    public PostDto toDto() {
        return PostDto.builder()
                .id(id)
                .title(title)
                .content(content)
                .viewCount(viewCount)
                .boardId(boardId)
                .createAt(getCreateAt())
                .modifiedAt(getModifiedAt())
                .build();
    }

    @Builder
    public Post(String title, String content, Long viewCount, String delYn, Long boardId) {
        this.title = title;
        this.content = content;
        this.viewCount = 0L;
        this.delYn = "N";
        this.boardId = boardId;
    }
}