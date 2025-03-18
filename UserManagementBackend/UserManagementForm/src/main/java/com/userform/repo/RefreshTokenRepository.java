package com.userform.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.userform.model.RefreshToken;
import com.userform.model.Users;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
  
  Optional<RefreshToken> findByToken(String token);

  Optional<RefreshToken> findByUserId(Long userId);  // Added method to find by user ID

  int deleteByUserId(Users users);
}
