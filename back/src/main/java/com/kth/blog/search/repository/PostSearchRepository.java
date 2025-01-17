package com.kth.blog.search.repository;

import com.kth.blog.search.document.PostDocument;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.repository.ElasticsearchRepository;

import java.util.List;

public interface PostSearchRepository extends ElasticsearchRepository<PostDocument, String> {

    Page<PostDocument> findByTitleContainingOrContentContaining(String title, String content, Pageable pageable);
}