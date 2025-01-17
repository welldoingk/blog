package com.kth.blog.board.service;

import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.entity.Post;
import com.kth.blog.board.repository.PostCustomRepository;
import com.kth.blog.board.repository.PostRepository;
import com.kth.blog.common.exception.ResourceNotFoundException;
import com.kth.blog.search.document.PostDocument;
import com.kth.blog.search.repository.PostSearchRepository;
import com.kth.blog.util.Utils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Transactional(readOnly = true)
public class PostService {
    private final PostCustomRepository postCustomRepository;
    private final PostRepository postRepository;
    private final PostSearchRepository postSearchRepository;

    public PostService(PostCustomRepository postCustomRepository, PostRepository postRepository, PostSearchRepository postSearchRepository) {
        this.postCustomRepository = postCustomRepository;
        this.postRepository = postRepository;
        this.postSearchRepository = postSearchRepository;
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

        PostDocument document = PostDocument.builder()
                .id(savedPost.getId().toString())
                .boardId(savedPost.getBoardId())
                .title(savedPost.getTitle())
                .content(savedPost.getContent())
                .viewCount(savedPost.getViewCount())
                .createdAt(savedPost.getCreatedAt())
                .modifiedAt(savedPost.getModifiedAt())
                .build();
        postSearchRepository.save(document);

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

    public Page<PostDto> searchPosts(String keyword, Pageable pageable) {
//        return postSearchRepository.findByTitleContainingOrContentContaining(keyword, keyword)
//                .stream()
//                .map(doc -> new PostDto(
//                        Long.parseLong(doc.getId()),
//                        doc.getBoardId(),
//                        doc.getTitle(),
//                        doc.getContent(),
//                        doc.getViewCount(),
//                        "N",
//                        LocalDateTime.parse(doc.getCreatedAt()),
//                        LocalDateTime.parse(doc.getCreatedAt())
//                ))
//                .collect(Collectors.toList());
        Page<PostDocument> searchResults = postSearchRepository.findByTitleContainingOrContentContaining(keyword, keyword, pageable);
        return searchResults.map(doc -> new PostDto(
                Long.parseLong(doc.getId()),
                doc.getBoardId(),
                doc.getTitle(),
                doc.getContent(),
                doc.getViewCount(),
                "N",
                doc.getCreatedAt(),
                doc.getModifiedAt()
        ));
    }

}