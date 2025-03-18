package com.userform.service;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.userform.authentcationEntrypoint.TokenRefreshException;
import com.userform.model.RefreshToken;
import com.userform.repo.RefreshTokenRepository;
import com.userform.repo.UserRepository;
import com.userform.model.Users;

@Service
public class RefreshTokenService {

    @Value("${app.jwtRefreshExpirationMs}")
    private Long refreshTokenDurationMs;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserRepository userRepository;

    // Method to find a refresh token by token string
    public Optional<RefreshToken> findByToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    // Method to create a refresh token for a user
    public RefreshToken createRefreshToken(Long userId) {
        // Check if a refresh token already exists for the user
        Optional<RefreshToken> existingToken = refreshTokenRepository.findByUserId(userId);
        if (existingToken.isPresent()) {
            // Delete the old token if it exists
            refreshTokenRepository.delete(existingToken.get());
        }

        // Create and save the new refresh token
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found")));
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    // Method to verify expiration of the refresh token
    public RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request.");
        }

        return token;
    }

    // Transactional method to delete the refresh token associated with a user
    @Transactional
    public int deleteByUserId(Long userId) {
        Users user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        return refreshTokenRepository.deleteByUserId(user);
    }
}
