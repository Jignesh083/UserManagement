package com.project.repo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.model.Login;

@Repository
public interface RepoClass extends JpaRepository<Login, Integer> 
{
	Optional<Login> findByName(String name);
}
