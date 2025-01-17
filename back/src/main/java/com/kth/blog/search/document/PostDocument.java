package com.kth.blog.search.document;

import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@JsonNaming(PropertyNamingStrategies.SnakeCaseStrategy.class)
@Document(indexName = "posts")
public class PostDocument {
    @Field(type = FieldType.Keyword)
    private String id;

    @Field(type = FieldType.Long)
    private Long boardId;

    @Field(type = FieldType.Text, analyzer = "nori")
    private String title;

    @Field(type = FieldType.Text, analyzer = "nori")
    private String content;

    @Field(type = FieldType.Long)
    private Long viewCount;

    @Field(type = FieldType.Date, format = DateFormat.date_optional_time ,name="created_at")
    private LocalDateTime createdAt;

    @Field(type = FieldType.Date, format = DateFormat.date_optional_time)
    private LocalDateTime modifiedAt;

    @Builder
    public PostDocument(String id, Long boardId, String title, String content,
                        Long viewCount, LocalDateTime createdAt, LocalDateTime modifiedAt) {
        this.id = id;
        this.boardId = boardId;
        this.title = title;
        this.content = content;
        this.viewCount = viewCount;
        this.createdAt = createdAt;
        this.modifiedAt = modifiedAt;
    }
}