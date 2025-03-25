package com.project.service;

import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import com.project.config.JwtUtil;
import com.project.model.Login;
import com.project.model.RefreshToken;
import com.project.model.TokenHistory;
import com.project.repo.RepoClass;
import com.project.repo.TokenHistoryRepo;

@Service
public class JwtService {

    @Autowired
    private RepoClass repoClass;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;
    
    @Autowired
    private RefreshTokenService rts;
    
    @Autowired
    private TokenHistoryRepo thr;

    public Map<String, String> authenticate(String username, String password) 
    {
        authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));

        final UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        
        String token = jwtUtil.generateToken(userDetails);  
        
        RefreshToken refreshToken = rts.createRefreshToken(userDetails.getUsername());  
        
        Date issuedAt = jwtUtil.extractIssuedAt(token);
        Date expiresAt = jwtUtil.extractExpiration(token);
        
        Login login = repoClass.findByName(username)
                .orElseThrow(() -> new RuntimeException("User not found with username: " + username));
        
        TokenHistory th = new TokenHistory();
        
        th.setAccessToken(token);
        th.setRefreshToken(refreshToken.getRefreshToken());
        th.setIssuedAt(issuedAt.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        th.setExpiresAt(expiresAt.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
        th.setLogin(login);
        th.setRt(refreshToken);

        
        thr.save(th);
        
        System.out.println("Generated Token: " + token);
        System.out.println("Generated Refresh Token: " + refreshToken.getRefreshToken());
        
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("refreshToken", refreshToken.getRefreshToken()); // Add refresh token
        
        response.put("message", "Login Successful");
        
        return response;       
        
    }
}




