package com.kth.blog.board.service;

import com.kth.blog.board.dto.PostResponseDto;
import com.kth.blog.board.repository.PostCustomRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private PostCustomRepository postCustomRepository;

    public List<PostResponseDto> selectPosts(Pageable pageable) {
        return postCustomRepository.selectPostList(null, pageable, 1L);
    }
}