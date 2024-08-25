package com.kth.blog.user.service;

import com.kth.blog.common.exception.CustomException;
import com.kth.blog.security.entity.RefreshToken;
import com.kth.blog.security.jwt.JwtTokenProvider;
import com.kth.blog.security.repository.RefreshTokenRepository;
import com.kth.blog.user.dto.AuthResponse;
import com.kth.blog.user.dto.LoginRequest;
import com.kth.blog.user.dto.SignupRequest;
import com.kth.blog.user.entity.User;
import com.kth.blog.user.repository.UserRepository;
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
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.UUID;

@Slf4j
@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenRepository refreshTokenRepository;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider, AuthenticationManager authenticationManager,
                       RefreshTokenRepository refreshTokenRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.authenticationManager = authenticationManager;
        this.refreshTokenRepository = refreshTokenRepository;
    }

    @Transactional
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
        String accessToken = jwtTokenProvider.generateToken(user.getUsername());
        String refreshToken = createRefreshToken(user.getUsername());
        Date expirationDate = jwtTokenProvider.getExpirationDate(accessToken);
        return new AuthResponse(accessToken, refreshToken, user.getUsername(), expirationDate);
    }

    @Transactional
    public AuthResponse login(LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsername(),
                            loginRequest.getPassword()
                    )
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            refreshTokenRepository.deleteByUsername(loginRequest.getUsername());

            String accessToken = jwtTokenProvider.generateToken(authentication);
            String refreshToken = createRefreshToken(loginRequest.getUsername());

            Date expirationDate = jwtTokenProvider.getExpirationDate(accessToken);
            log.info("User logged in successfully: {}", loginRequest.getUsername());
            return new AuthResponse(accessToken, refreshToken, loginRequest.getUsername(), expirationDate);
        } catch (BadCredentialsException e) {
            log.warn("Login attempt failed for user: {}", loginRequest.getUsername());
            throw new CustomException("Invalid username or password", HttpStatus.UNAUTHORIZED);
        } catch (AuthenticationException e) {
            log.error("Authentication error: ", e);
            throw new CustomException("Authentication failed", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Transactional
    public String createRefreshToken(String username) {
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUsername(username);
        refreshToken.setToken(UUID.randomUUID().toString());
        refreshToken.setExpiryDate(LocalDateTime.now().plusDays(7)); // 7일 유효

        refreshTokenRepository.save(refreshToken);
        return refreshToken.getToken();
    }

    @Transactional
    public AuthResponse refreshToken(String refreshToken) {
        return refreshTokenRepository.findByToken(refreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUsername)
                .map(username -> {
                    String newAccessToken = jwtTokenProvider.generateToken(username);
                    String newRefreshToken = createRefreshToken(username);
                    return new AuthResponse(newAccessToken, newRefreshToken, username, jwtTokenProvider.getExpirationDate(newAccessToken));
                })
                .orElseThrow(() -> new RuntimeException("Refresh token is not in database!"));
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(LocalDateTime.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new RuntimeException("Refresh token was expired. Please make a new signin request");
        }
        return token;
    }
}