 package com.project.controller;

import java.time.ZoneId;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.config.JwtUtil;
import com.project.model.RefreshToken;
import com.project.model.TokenHistory;
import com.project.repo.TokenHistoryRepo;
import com.project.service.JwtService;
import com.project.service.RefreshTokenService;
import com.project.service.ServiceClass;


@RestController
@RequestMapping("/api/auth")
public class ControllerClass 
{
	@Autowired
	private ServiceClass sc;
	
	@Autowired
    private JwtService jwtService;
	
	@Autowired
	private RefreshTokenService rts;
	
	@Autowired
	private TokenHistoryRepo thr;
	
	@Autowired
	private JwtUtil jwt;
	
	@PostMapping("/login")
	public ResponseEntity<?> login(@RequestBody Map<String, String> credentials) 
	{  
		String name = credentials.get("name");
		String password = credentials.get("password");
		
		System.out.println("Received login request for: " + name);
		
		 try 
		 {
	            Map<String, String> response = jwtService.authenticate(name, password);
	            return ResponseEntity.ok(response); // Return token and success message
	     }
		 catch (Exception e) 
		 {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid credentials"));
	     }		
	}
	
	@PostMapping("/refresh")
	public ResponseEntity<?> refreshAccessToken(@RequestBody Map<String, String> request)
	{
		
		System.out.println("In refresh controller!");
		String refreshToken = request.get("refreshToken");
		
		try
		{
	        // Verify refresh token
			RefreshToken verifiedToken = rts.verifyRefreshToken(refreshToken);	
			
			// Generate new access token
			String newAccessToken = jwt.generateToken(verifiedToken.getLogin().getName());
			
			    Date issuedAt = jwt.extractIssuedAt(newAccessToken);
		        Date expiresAt = jwt.extractExpiration(newAccessToken);
		        
		        TokenHistory th = new TokenHistory();
		        
		        th.setAccessToken(newAccessToken);
		        th.setRefreshToken(refreshToken);
		        th.setIssuedAt(issuedAt.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
		        th.setExpiresAt(expiresAt.toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime());
		        
		        th.setLogin(verifiedToken.getLogin());
		        th.setRt(verifiedToken);

		        thr.save(th);
			
	        // Prepare response
			Map<String, String> response = new HashMap<>();
			response.put("token", newAccessToken);
			response.put("refreshToken", refreshToken);
			
			return ResponseEntity.ok(response);

		}
		
		catch(Exception e)
		{
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
		}
	}
}



