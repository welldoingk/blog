package com.kth.blog.board.controller;

import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.dto.PostResponseDto;
import com.kth.blog.board.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @GetMapping("/api/selectPostList")
    public PostResponseDto selectPosts(@RequestParam("id") Long id){
        PostRequestDto dto = PostRequestDto.builder().boardId(id).build();
        PostResponseDto postList = postService.selectPosts(dto);
        return postList;
    }

}
