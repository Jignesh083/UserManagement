package com.project.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class TokenHistory 
{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;
	
	private String accessToken;
	private String refreshToken;
	private LocalDateTime issuedAt;
	private LocalDateTime expiresAt;
	
	@ManyToOne
    @JoinColumn(name = "login_id")
    private Login login;
	
	 @ManyToOne
	 @JoinColumn(name = "refresh_token_id")
	 private RefreshToken rt;

	

	public TokenHistory(int id, String accessToken, String refreshToken, LocalDateTime issuedAt,
			LocalDateTime expiresAt, Login login, RefreshToken rt)
	{
		this.id = id;
		this.accessToken = accessToken;
		this.refreshToken = refreshToken;
		this.issuedAt = issuedAt;
		this.expiresAt = expiresAt;
		this.login = login;
		this.rt = rt;
	}

	public TokenHistory() 
	{	}

	public int getId()
	{
		return id;
	}

	public void setId(int id) 
	{
		this.id = id;
	}

	public String getAccessToken() 
	{
		return accessToken;
	}

	public void setAccessToken(String accessToken)
	{
		this.accessToken = accessToken;
	}

	public String getRefreshToken() 
	{
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken)
	{
		this.refreshToken = refreshToken;
	}

	public LocalDateTime getIssuedAt()
	{
		return issuedAt;
	}

	public void setIssuedAt(LocalDateTime localDateTime) 
	{
		this.issuedAt = localDateTime;
	}

	public LocalDateTime getExpiresAt()
	{
		return expiresAt;
	}

	public void setExpiresAt(LocalDateTime localDateTime)
	{
		this.expiresAt = localDateTime;
	}

	public Login getLogin() {
		return login;
	}

	public void setLogin(Login login) {
		this.login = login;
	}
	
	public RefreshToken getRt() 
	{
		return rt;
	}

	public void setRt(RefreshToken rt)
	{
		this.rt = rt;
	}

	@Override
	public String toString() 
	{
		return "TokenHistory [id=" + id + ", accessToken=" + accessToken + ", refreshToken=" + refreshToken
				+ ", issuedAt=" + issuedAt + ", expiresAt=" + expiresAt + ", login=" + login + ", rt=" + rt + "]";
	}	
}
