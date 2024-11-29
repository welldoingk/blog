package com.kth.blog.user.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kth.blog.common.exception.CustomException;
import com.kth.blog.user.dto.AuthResponse;
import com.kth.blog.user.dto.LoginRequest;
import com.kth.blog.user.dto.SignupRequest;
import com.kth.blog.user.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.restdocs.AutoConfigureRestDocs;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.restdocs.payload.JsonFieldType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Date;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static com.epages.restdocs.apispec.MockMvcRestDocumentationWrapper.document;
import static org.springframework.restdocs.payload.PayloadDocumentation.*;
import static org.springframework.restdocs.mockmvc.RestDocumentationRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@WebMvcTest(AuthController.class)
@AutoConfigureRestDocs
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private AuthService authService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void login_SuccessfulAuthentication() throws Exception {
        // Arrange
        LoginRequest loginRequest = LoginRequest.builder()
                .username("test")
                .password("test")
                .build();

        String token = "test.jwt.token";
        Date expirationDate = new Date(System.currentTimeMillis() + 3600000);
        AuthResponse authResponse = AuthResponse.builder()
                .username(loginRequest.getUsername())
                .token(token)
                .expirationDate(expirationDate)
                .build();

        given(authService.login(any(LoginRequest.class))).willReturn(authResponse);
        // Act & Assert
        String content = objectMapper.writeValueAsString(loginRequest);
        System.out.println("Request JSON: " + content);
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(content))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.username").value(loginRequest.getUsername()))
                .andExpect(jsonPath("$.expirationDate").exists())
                .andDo(document("login-success",
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자 아이디"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("사용자 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("token").type(JsonFieldType.STRING).description("JWT 토큰"),
                                fieldWithPath("refreshToken").type(JsonFieldType.STRING).optional().description("리프레시 토큰"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자 이름"),
                                fieldWithPath("expirationDate").type(JsonFieldType.STRING).description("토큰 만료 일시")
                        )
                ));
    }

    @Test
    void login_FailedAuthentication() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .username("test")
                .password("wrongpassword")
                .build();

        given(authService.login(any(LoginRequest.class)))
                .willThrow(new CustomException("Invalid username or password", HttpStatus.UNAUTHORIZED));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid username or password"))
                .andDo(document("login-fail",
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자 아이디"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("사용자 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지"),
                                fieldWithPath("timestamp").type(JsonFieldType.STRING).description("에러 발생 시간"),
                                fieldWithPath("details").type(JsonFieldType.STRING).description("에러 세부 정보")
                        )
                ));
    }

    @Test
    void signup_SuccessfulRegistration() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .username("newuser")
                .password("newpassword")
                .build();

        String token = "new.user.token";
        Date expirationDate = new Date(System.currentTimeMillis() + 3600000);
        AuthResponse authResponse = AuthResponse.builder()
                .username(signupRequest.getUsername())
                .token(token)
                .expirationDate(expirationDate)
                .build();

        given(authService.signup(any(SignupRequest.class))).willReturn(authResponse);

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value(token))
                .andExpect(jsonPath("$.username").value(signupRequest.getUsername()))
                .andExpect(jsonPath("$.expirationDate").exists())
                .andDo(document("signup-success",
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("새 사용자 아이디"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("새 사용자 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("token").type(JsonFieldType.STRING).description("JWT 토큰"),
                                fieldWithPath("refreshToken").type(JsonFieldType.STRING).optional().description("리프레시 토큰"),
                                fieldWithPath("username").type(JsonFieldType.STRING).description("사용자 이름"),
                                fieldWithPath("expirationDate").type(JsonFieldType.STRING).description("토큰 만료 일시")
                        )
                ));
    }

    @Test
    void signup_FailedRegistration() throws Exception {
        SignupRequest signupRequest = SignupRequest.builder()
                .username("existinguser")
                .password("password")
                .build();

        given(authService.signup(any(SignupRequest.class)))
                .willThrow(new CustomException("Username is already taken", HttpStatus.BAD_REQUEST));

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signupRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Username is already taken"))
                .andDo(document("signup-fail",
                        requestFields(
                                fieldWithPath("username").type(JsonFieldType.STRING).description("새 사용자 아이디"),
                                fieldWithPath("password").type(JsonFieldType.STRING).description("새 사용자 비밀번호")
                        ),
                        responseFields(
                                fieldWithPath("message").type(JsonFieldType.STRING).description("에러 메시지"),
                                fieldWithPath("timestamp").type(JsonFieldType.STRING).description("에러 발생 시간"),
                                fieldWithPath("details").type(JsonFieldType.STRING).description("에러 세부 정보")
                        )
                ));
    }
}