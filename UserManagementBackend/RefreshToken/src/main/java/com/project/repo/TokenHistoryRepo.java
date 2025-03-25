package com.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.model.TokenHistory;

public interface TokenHistoryRepo extends JpaRepository<TokenHistory, Integer>
{
	long countByRefreshToken(String refreshToken);
}
