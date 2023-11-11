package com.kth.photoBlog.board.repository;

import com.kth.photoBlog.board.dto.PostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface PostCustomRepository {
    Page<PostDto> selectPostList(String searchVal, Pageable pageable, Long boardId);
}
