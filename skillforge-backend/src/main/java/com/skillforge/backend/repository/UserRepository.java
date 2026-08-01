package com.skillforge.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.skillforge.backend.entity.User;
import com.skillforge.backend.enums.Role;
import com.skillforge.backend.enums.UserStatus;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    List<User> findByRoleOrderByCreatedAtDesc(Role role);

    long countByRole(Role role);

    long countByStatus(UserStatus status);
}
