package com.kth.blog.board.controller;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.service.PostService;
import com.kth.blog.search.service.PostIndexingService;
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
    private final PostIndexingService postIndexingService;

    public PostController(PostService postService, PostIndexingService postIndexingService) {
        this.postService = postService;
        this.postIndexingService = postIndexingService;
    }

    @GetMapping
    public ResponseEntity<Page<PostDto>> getPosts(PostRequestDto requestDto, Pageable pageable) {
        log.info("post request posts with params: {}", requestDto.toString());
        return ResponseEntity.ok(postService.selectPosts(requestDto, pageable));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PostDto>> searchPosts(@RequestParam String keyword, Pageable pageable) {
        log.info("Search posts with keyword: {}", keyword);
        return ResponseEntity.ok(postService.searchPosts(keyword, pageable));
    }

    @GetMapping("/index")
    public void searchPosts() {
        log.info("indexing All Posts");
        postIndexingService.indexAllPosts();
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