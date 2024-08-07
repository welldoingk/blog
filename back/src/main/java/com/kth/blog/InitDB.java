package com.kth.blog;

import com.kth.blog.board.entity.Post;
import com.kth.blog.board.repository.PostRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
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
            log.info("userDBInit");
            List<Post> all = postRepository.findAll();
            if (all.isEmpty()) {
                for (int i = 0; i < 10; i++) {
                    log.info("try :{}", i);
                    Post post = Post.builder()
                            .title("test" + i)
                            .content("test" + i)
                            .delYn("N")
                            .boardId(1L)
                            .build();
                    postRepository.save(post);
                }
            }

        }

    }

}
