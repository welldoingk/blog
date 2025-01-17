package com.kth.blog.search.service;

import com.kth.blog.board.repository.PostRepository;
import com.kth.blog.search.document.PostDocument;
import com.kth.blog.search.repository.PostSearchRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PostIndexingService {
    private final PostRepository postRepository;
    private final PostSearchRepository postSearchRepository;

    @Transactional(readOnly = true)
    public void indexAllPosts() {
        postRepository.findAll().forEach(post -> {
            PostDocument document = PostDocument.builder()
                    .id(post.getId().toString())
                    .boardId(post.getBoardId())
                    .title(post.getTitle())
                    .content(post.getContent())
                    .viewCount(post.getViewCount())
                    .createdAt(post.getCreatedAt())
                    .modifiedAt(post.getModifiedAt())
                    .build();
            postSearchRepository.save(document);
        });
    }
}