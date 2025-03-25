package com.project.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.project.model.Login;
import com.project.repo.RepoClass;

@Service
public class ServiceClass 
{
	@Autowired
	private RepoClass rc;
	
	public Login validateuser(String name,String password)
	{
		return rc.findByName(name)
				.filter(user -> user.getPassword().equals(password))
				.orElse(null);
	}
}



