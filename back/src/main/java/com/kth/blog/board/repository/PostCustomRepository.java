package com.kth.blog.board.repository;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostCustomRepository {
    Page<PostDto> selectPostList(PostRequestDto dto, Pageable pageable);
}