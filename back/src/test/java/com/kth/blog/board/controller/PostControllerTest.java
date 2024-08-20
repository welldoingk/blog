package com.kth.blog.board.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kth.blog.board.dto.PostDto;
import com.kth.blog.board.dto.PostRequestDto;
import com.kth.blog.board.service.PostService;
import com.kth.blog.common.exception.CustomException;
import com.kth.blog.user.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.Arrays;

import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.get;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.request.RequestDocumentation.parameterWithName;
import static org.springframework.restdocs.request.RequestDocumentation.queryParameters;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(PostController.class)
@AutoConfigureRestDocs
@AutoConfigureMockMvc(addFilters = false)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void getPosts_Success() throws Exception {
        PostDto postDto = PostDto.builder()
                .id(1L)
                .boardId(1L)
                .title("테스트 제목")
                .content("테스트 내용")
                .viewCount(0L)
                .delYn("N")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        Page<PostDto> postPage = new PageImpl<>(Arrays.asList(postDto));

        given(postService.selectPosts(any(PostRequestDto.class), any(Pageable.class))).willReturn(postPage);

        mockMvc.perform(get("/api/posts")
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andDo(document("get-posts-success",
                        queryParameters(
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        responseFields(
                                fieldWithPath("content[].id").type(JsonFieldType.NUMBER).description("게시글 ID"),
                                fieldWithPath("content[].boardId").type(JsonFieldType.NUMBER).description("게시판 ID"),
                                fieldWithPath("content[].title").type(JsonFieldType.STRING).description("게시글 제목"),
                                fieldWithPath("content[].content").type(JsonFieldType.STRING).description("게시글 내용"),
                                fieldWithPath("content[].viewCount").type(JsonFieldType.NUMBER).description("조회수"),
                                fieldWithPath("content[].delYn").type(JsonFieldType.STRING).description("삭제 여부"),
                                fieldWithPath("content[].createdAt").type(JsonFieldType.STRING).description("생성 일시"),
                                fieldWithPath("content[].modifiedAt").type(JsonFieldType.STRING).description("수정 일시"),
                                fieldWithPath("pageable").type(JsonFieldType.STRING).description("페이지 정보"),
                                fieldWithPath("totalPages").type(JsonFieldType.NUMBER).description("총 페이지 수"),
                                fieldWithPath("totalElements").type(JsonFieldType.NUMBER).description("총 요소 수"),
                                fieldWithPath("last").type(JsonFieldType.BOOLEAN).description("마지막 페이지 여부"),
                                fieldWithPath("size").type(JsonFieldType.NUMBER).description("페이지 크기"),
                                fieldWithPath("number").type(JsonFieldType.NUMBER).description("현재 페이지 번호"),
                                fieldWithPath("sort.empty").type(JsonFieldType.BOOLEAN).description("정렬 정보가 비어있는지 여부"),
                                fieldWithPath("sort.sorted").type(JsonFieldType.BOOLEAN).description("정렬되었는지 여부"),
                                fieldWithPath("sort.unsorted").type(JsonFieldType.BOOLEAN).description("정렬되지 않았는지 여부"),
                                fieldWithPath("numberOfElements").type(JsonFieldType.NUMBER).description("현재 페이지의 요소 수"),
                                fieldWithPath("first").type(JsonFieldType.BOOLEAN).description("첫 페이지 여부"),
                                fieldWithPath("empty").type(JsonFieldType.BOOLEAN).description("빈 페이지 여부")
                        )
                ));
    }

    @Test
    void getPosts_Failure() throws Exception {
        given(postService.selectPosts(any(PostRequestDto.class), any(Pageable.class)))
                .willThrow(new CustomException("게시글 목록을 불러오는데 실패했습니다.", HttpStatus.INTERNAL_SERVER_ERROR));

        mockMvc.perform(get("/api/posts")
                        .param("page", "0")
                        .param("size", "10")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andDo(document("get-posts-failure",
                        queryParameters(
                                parameterWithName("page").description("페이지 번호"),
                                parameterWithName("size").description("페이지 크기")
                        ),
                        responseFields(
                                fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지"),
                                fieldWithPath("timestamp").type(JsonFieldType.STRING).description("에러 발생 시간"),
                                fieldWithPath("details").type(JsonFieldType.STRING).description("에러 세부 정보")
                        )
                ));
    }

    @Test
    void createPost_Success() throws Exception {
        PostRequestDto requestDto = PostRequestDto.builder()
                .boardId(1L)
                .title("새 게시글")
                .content("게시글 내용")
                .build();

        PostDto responseDto = PostDto.builder()
                .id(1L)
                .boardId(1L)
                .title("새 게시글")
                .content("게시글 내용")
                .viewCount(0L)
                .delYn("N")
                .createdAt(LocalDateTime.now())
                .modifiedAt(LocalDateTime.now())
                .build();

        given(postService.savePost(any(PostRequestDto.class))).willReturn(responseDto);

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isOk())
                .andDo(document("create-post-success",
                        requestFields(
                                fieldWithPath("id").type(JsonFieldType.NULL).description("게시글 ID (생성 시 null)").optional(),
                                fieldWithPath("boardId").type(JsonFieldType.NUMBER).description("게시판 ID"),
                                fieldWithPath("title").type(JsonFieldType.STRING).description("게시글 제목"),
                                fieldWithPath("content").type(JsonFieldType.STRING).description("게시글 내용")
                        ),
                        responseFields(
                                fieldWithPath("id").type(JsonFieldType.NUMBER).description("생성된 게시글 ID"),
                                fieldWithPath("boardId").type(JsonFieldType.NUMBER).description("게시판 ID"),
                                fieldWithPath("title").type(JsonFieldType.STRING).description("게시글 제목"),
                                fieldWithPath("content").type(JsonFieldType.STRING).description("게시글 내용"),
                                fieldWithPath("viewCount").type(JsonFieldType.NUMBER).description("조회수"),
                                fieldWithPath("delYn").type(JsonFieldType.STRING).description("삭제 여부"),
                                fieldWithPath("createdAt").type(JsonFieldType.STRING).description("생성 일시"),
                                fieldWithPath("modifiedAt").type(JsonFieldType.STRING).description("수정 일시")
                        )
                ));
    }

    @Test
    void createPost_Failure() throws Exception {
        PostRequestDto requestDto = PostRequestDto.builder()
                .boardId(1L)
                .title("")  // 빈 제목으로 실패 케이스 생성
                .content("게시글 내용")
                .build();

        given(postService.savePost(any(PostRequestDto.class)))
                .willThrow(new CustomException("게시글 제목은 비어있을 수 없습니다.", HttpStatus.BAD_REQUEST));

        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestDto)))
                .andExpect(status().isBadRequest())
                .andDo(document("create-post-failure",
                        requestFields(
                                fieldWithPath("id").type(JsonFieldType.NULL).description("게시글 ID (생성 시 null)").optional(),
                                fieldWithPath("boardId").type(JsonFieldType.NUMBER).description("게시판 ID"),
                                fieldWithPath("title").type(JsonFieldType.STRING).description("게시글 제목"),
                                fieldWithPath("content").type(JsonFieldType.STRING).description("게시글 내용")
                        ),
                        responseFields(
                                fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지"),
                                fieldWithPath("timestamp").type(JsonFieldType.STRING).description("에러 발생 시간"),
                                fieldWithPath("details").type(JsonFieldType.STRING).description("에러 세부 정보")
                        )
                ));
    }
}
