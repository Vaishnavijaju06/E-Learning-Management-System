package com.skillforge.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.skillforge.backend.entity.PasswordResetToken;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

	Optional<PasswordResetToken> findByToken(String token);

	@Modifying
	@Transactional
	@Query("update PasswordResetToken t " + "set t.used = true " + "where t.user.id = :userId and t.used = false")
	void invalidateActiveTokensForUser(Long userId);
}