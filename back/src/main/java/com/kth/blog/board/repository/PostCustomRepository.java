package com.kth.blog.board.repository;

import com.kth.blog.board.dto.PostResponseDto;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface PostCustomRepository {
    List<PostResponseDto> selectPostList(String searchVal, Pageable pageable, Long boardId);
}
