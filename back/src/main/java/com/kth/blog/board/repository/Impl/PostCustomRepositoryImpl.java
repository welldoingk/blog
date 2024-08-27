package com.kth.blog.board.repository.Impl;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.dto.QPostDto;
import com.kth.blog.board.repository.PostCustomRepository;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.kth.blog.board.entity.QPost.post;

@Slf4j
@Repository
public class PostCustomRepositoryImpl implements PostCustomRepository {
    private final JPAQueryFactory queryFactory;

    public PostCustomRepositoryImpl(JPAQueryFactory queryFactory) {
        this.queryFactory = queryFactory;
    }

    @Override
    public Page<PostDto> selectPostList(PostRequestDto dto, Pageable pageable) {
        List<PostDto> content = queryFactory
                .select(new QPostDto(
                        post.id,
                        post.boardId,
                        post.title,
                        post.content,
                        post.viewCount,
                        post.delYn,
                        post.createdAt,
                        post.modifiedAt
                ))
                .from(post)
                .where(
                        containsTitle(dto.getTitle()),
                        eqBoardId(dto.getBoardId()),
                        eqPostId(dto.getId()),
                        post.delYn.ne("Y")
                )
                .orderBy(post.id.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long totalCount = queryFactory
                .select(post.count())
                .from(post)
                .where(
                        containsTitle(dto.getTitle()),
                        eqBoardId(dto.getBoardId()),
                        eqPostId(dto.getId()),
                        post.delYn.ne("Y")
                )
                .fetchOne();

        return new PageImpl<>(content, pageable, totalCount != null ? totalCount : 0L);
    }

    private BooleanExpression containsTitle(String title) {
        return title != null ? post.title.contains(title) : null;
    }

    private BooleanExpression eqBoardId(Long boardId) {
        return boardId != null ? post.boardId.eq(boardId) : null;
    }

    private BooleanExpression eqPostId(Long postId) {
        return postId != null ? post.id.eq(postId) : null;
    }
}