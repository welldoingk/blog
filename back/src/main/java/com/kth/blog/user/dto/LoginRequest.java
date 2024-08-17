package com.kth.blog.user.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;
    private String password;
}