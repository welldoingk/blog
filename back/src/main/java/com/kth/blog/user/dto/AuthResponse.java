package com.kth.blog.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.Date;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private Date expirationDate;
}