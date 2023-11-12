package com.kth.blog.board.service;

import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.dto.PostResponseDto;
import com.kth.blog.board.repository.PostCustomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostCustomRepository postCustomRepository;

    public PostResponseDto selectPosts(PostRequestDto dto) {
        return postCustomRepository.selectPostList(dto);
    }
}