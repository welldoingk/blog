package com.kth.blog.user.dto;

import lombok.Data;

@Data
public class SignupRequest {
    private String username;
    private String password;
}