package com.project.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.model.Login;
import com.project.model.RefreshToken;

@Repository
public interface RefreshTokenRepo extends JpaRepository<RefreshToken, Integer>
{

	Optional<RefreshToken> findByLogin(Login login);
    Optional<RefreshToken> findByRefreshToken(String refreshToken); 
}
