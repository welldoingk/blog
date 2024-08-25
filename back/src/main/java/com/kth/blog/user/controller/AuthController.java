package com.kth.blog.user.controller;

import com.kth.blog.user.dto.AuthResponse;
import com.kth.blog.user.dto.LoginRequest;
import com.kth.blog.user.dto.RefreshTokenRequest;
import com.kth.blog.user.dto.SignupRequest;
import com.kth.blog.user.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(authService.signup(signupRequest));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        AuthResponse authResponse = authService.login(loginRequest);
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(authService.refreshToken(request.getRefreshToken()));
    }
}