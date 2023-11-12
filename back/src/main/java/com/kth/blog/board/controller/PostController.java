package com.kth.blog.board.controller;

import com.kth.blog.board.dto.PostResponseDto;
import com.kth.blog.board.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PostController {

    private PostService postService;

    public List<PostResponseDto> selectPosts(){
        List<PostResponseDto> postList = postService.selectPosts();
        return postList;
    }

}
