package com.kth.blog.board.entity;


import com.kth.blog.util.Timestamped;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "posts")
public class Post extends Timestamped {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long boardId;
    private String title;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Long viewCount;
    private String delYn;

    @Builder
    public Post(Long boardId, String title, String content, Long viewCount, String delYn) {
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.delYn = delYn;
    }

    public void update(String title, String content) {
        this.title = title;
        this.content = content;
    }
}