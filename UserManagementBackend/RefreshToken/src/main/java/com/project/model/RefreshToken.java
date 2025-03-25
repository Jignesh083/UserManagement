package com.project.model;

import java.time.Instant;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "refresh_token")

public class RefreshToken
{
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int tokenId;
	
	private String refreshToken;

	private Instant expiry;

	@OneToOne
	private Login login;

	public RefreshToken() 
	{
		
	}

	public RefreshToken(String refreshToken, Instant expiry, Login login) {
		this.refreshToken = refreshToken;
		this.expiry = expiry;
		this.login = login;
	}

	public String getRefreshToken() {
		return refreshToken;
	}

	public void setRefreshToken(String refreshToken) {
		this.refreshToken = refreshToken;
	}

	public Instant getExpiry() {
		return expiry;
	}

	public void setExpiry(Instant expiry) {
		this.expiry = expiry;
	}

	public Login getLogin() {
		return login;
	}

	public void setLogin(Login login) {
		this.login = login;
	}

	@Override
	public String toString() {
		return "RefreshToken [refreshToken=" + refreshToken + ", expiry=" + expiry + ", login=" + login + "]";
	}
}



