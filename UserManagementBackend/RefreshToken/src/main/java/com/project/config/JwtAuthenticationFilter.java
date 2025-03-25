package com.project.config;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.UnsupportedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter
{

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        System.out.println("Received Authorization Header: " + authHeader); // Debugging line


        String token = null;
        String username = null;
        
        String requestURI = request.getRequestURI();

     // Skip authentication for login and registration endpoints
     if (requestURI.equals("/api/auth/login") || requestURI.equals("/api/users/register") || requestURI.equals("/api/auth/refresh")) 
     {
         chain.doFilter(request, response);
         return;
     }
     try {
        if (authHeader != null && authHeader.startsWith("Bearer "))
        {
            token = authHeader.substring(7);

            try 
            {
                username = jwtUtil.extractUsername(token);
            } 
            catch (ExpiredJwtException e)
            {
                System.out.println("Expired Token: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.getWriter().write("Token Expired");
                return; // Stop filter chain here
            }
            
            catch (UnsupportedJwtException | MalformedJwtException e)
            {
                System.out.println("Invalid Token: " + e.getMessage());
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401
                response.getWriter().write("Invalid Token");
                return;
            }
        }

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null)
        {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            if (jwtUtil.validateToken(token, userDetails.getUsername())) 
            {
              UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());        
              authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
              SecurityContextHolder.getContext().setAuthentication(authentication);
              System.out.println("User authenticated successfully: " + username); // Debugging
            } 
            else 
            {
                System.out.println("Token validation failed for: " + username); // Debugging            
            }
        }
        chain.doFilter(request, response);
    }
     
    catch(Exception e)
     {
    	response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    	response.getWriter().write("Invalid token");
    	response.getWriter().flush();
     }
     
    }
    
}








