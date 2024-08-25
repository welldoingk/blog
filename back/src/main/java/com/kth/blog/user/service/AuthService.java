package com.kth.blog.user.service;

import com.kth.blog.security.jwt.JwtTokenProvider;
import com.kth.blog.user.dto.AuthResponse;
import com.kth.blog.user.dto.LoginRequest;
import com.kth.blog.user.dto.SignupRequest;
import com.kth.blog.user.entity.User;
import com.kth.blog.user.repository.UserRepository;
import com.kth.blog.common.exception.CustomException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
    }

    public AuthResponse signup(SignupRequest signupRequest) {
        if (userRepository.existsByUsername(signupRequest.getUsername())) {
            throw new RuntimeException("Username is already taken!");
        }
        User user = User.builder()
                .username(signupRequest.getUsername())
                .password(passwordEncoder.encode(signupRequest.getPassword()))
                .role(User.Role.USER)
                .build();
        userRepository.save(user);
        String token = jwtTokenProvider.generateToken(user.getUsername());
        Date expirationDate = jwtTokenProvider.getExpirationDate(token);
        return new AuthResponse(token, user.getUsername(), expirationDate);
    }

    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtTokenProvider.generateToken(authentication);
            Date expirationDate = jwtTokenProvider.getExpirationDate(token);
            log.info("User logged in successfully: {}", loginRequest.getUsername());
            return new AuthResponse(token, loginRequest.getUsername(), expirationDate);
        } catch (BadCredentialsException e) {
            log.warn("Login attempt failed for user: {}", loginRequest.getUsername());
            throw new CustomException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        } catch (AuthenticationException e) {
            log.error("Authentication error: ", e);
            throw new CustomException("Authentication failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}