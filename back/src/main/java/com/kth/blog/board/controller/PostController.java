package com.kth.blog.board.controller;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.service.PostService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @GetMapping
    public ResponseEntity<Page<PostDto>> getPosts(PostRequestDto requestDto, Pageable pageable) {
        log.info("post request posts with params: {}", requestDto.toString());
        return ResponseEntity.ok(postService.selectPosts(requestDto, pageable));
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(@RequestBody PostRequestDto requestDto) {
        return ResponseEntity.ok(postService.savePost(requestDto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostDto> updatePost(@PathVariable Long id, @RequestBody PostRequestDto requestDto) {
        return ResponseEntity.ok(postService.updatePost(id, requestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        postService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}