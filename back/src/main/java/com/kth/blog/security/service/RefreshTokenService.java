package com.kth.blog.security.service;

import com.kth.blog.common.exception.TokenRefreshException;
import com.kth.blog.security.entity.RefreshToken;
import com.kth.blog.security.repository.RefreshTokenRepository;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Slf4j
@Service
public class RefreshTokenService {

    @Value("${jwt.refresh-token.expiration}")
    private Long refreshTokenDurationMs;

    private final RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(RefreshTokenRepository refreshTokenRepository) {
        this.refreshTokenRepository = refreshTokenRepository;
    }

    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    @Transactional
    public RefreshToken createRefreshToken(String username) {
        RefreshToken refreshToken = new RefreshToken();

        refreshToken.setUsername(username);
        refreshToken.setExpiryDate(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1000000)); // Convert ms to nanos
        refreshToken.setToken(UUID.randomUUID().toString());

        refreshToken = refreshTokenRepository.save(refreshToken);
        log.info("Created new refresh token for user: {}", username);
        return refreshToken;
    }

    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(token);
            log.warn("Refresh token was expired for user: {}", token.getUsername());
            throw new TokenRefreshException(token.getToken(),
                "Refresh token was expired. Please make a new signin request",
                token.getUsername());
        }

        return token;
    }

    @Transactional
    public int deleteByUsername(String username) {
        int deletedCount = refreshTokenRepository.deleteByUsername(username);
        log.info("Deleted {} refresh tokens for user: {}", deletedCount, username);
        return deletedCount;
    }
}