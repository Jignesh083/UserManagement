package com.project.config;

import java.util.ArrayList;

import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.project.model.Login;
import com.project.repo.RepoClass;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final RepoClass repoClass;

    public CustomUserDetailsService(RepoClass repoClass) {
        this.repoClass = repoClass;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Login user = repoClass.findByName(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new User(user.getName(), user.getPassword(), new ArrayList<>());
    }
}
