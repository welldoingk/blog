package com.kth.blog.board.service;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.entity.Post;
import com.kth.blog.board.repository.PostCustomRepository;
import com.kth.blog.board.repository.PostRepository;
import com.kth.blog.common.exception.ResourceNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional(readOnly = true)
public class PostService {
    private final PostCustomRepository postCustomRepository;
    private final PostRepository postRepository;

    public PostService(PostCustomRepository postCustomRepository, PostRepository postRepository) {
        this.postCustomRepository = postCustomRepository;
        this.postRepository = postRepository;
    }

    public Page<PostDto> selectPosts(PostRequestDto dto, Pageable pageable) {
        Page<PostDto> postDtos = postCustomRepository.selectPostList(dto, pageable);
        return postDtos;
    }

    @Transactional
    public PostDto savePost(PostRequestDto dto) {
        Post post = Post.builder()
                .boardId(dto.getBoardId())
                .title(dto.getTitle())
                .content(dto.getContent())
                .viewCount(0L)
                .delYn("N")
                .build();
        Post savedPost = postRepository.save(post);
        return new PostDto(savedPost.getId(), savedPost.getBoardId(), savedPost.getTitle(), savedPost.getContent(),
                savedPost.getViewCount(), savedPost.getDelYn(), savedPost.getCreatedAt(), savedPost.getModifiedAt());
    }

    @Transactional
    public PostDto updatePost(Long id, PostRequestDto dto) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        post.update(dto.getTitle(), dto.getContent());
        return new PostDto(post.getId(), post.getBoardId(), post.getTitle(), post.getContent(),
                post.getViewCount(), post.getDelYn(), post.getCreatedAt(), post.getModifiedAt());
    }

    @Transactional
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found with id: " + id));
        postRepository.delete(post);
    }
}