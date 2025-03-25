package com.project.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.project.model.Login;
import com.project.model.UserForm;

@Repository
public interface UserRepo extends JpaRepository<UserForm, Long> 
{
	
}