package com.kth.blog;

import com.kth.blog.board.entity.Post;
import com.kth.blog.board.repository.PostRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class InitDB {

    private final InitService initService;

    @PostConstruct
    public void init() {
        initService.userDBInit();
    }

    @Component
    @Transactional
    @RequiredArgsConstructor
    static class InitService {

        private final PostRepository postRepository;

        public void userDBInit() {
            Post post = Post.builder()
                    .title("test")
                    .content("test")
                    .boardId(1L)
                    .build();
            postRepository.save(post);
        }

    }

}
