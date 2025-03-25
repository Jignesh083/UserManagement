package com.project.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception
	{
		
		return http
					.csrf(customizer -> customizer.disable())
					.cors(Customizer.withDefaults()) 
					.authorizeHttpRequests(request -> request
						        .requestMatchers(HttpMethod.POST, "/api/auth/login", "/api/auth/refresh" ,"/api/users/register").permitAll()
					.anyRequest().authenticated())					
					.sessionManagement(session -> 
									   session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
					.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()))
					.addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
					
					.build();
	}
}    
   




