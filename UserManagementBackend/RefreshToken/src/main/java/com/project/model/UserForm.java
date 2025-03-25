package com.project.model;

import jakarta.persistence.*;

@Entity
@Table(name = "user_details")
public class UserForm {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;
	private String email;
	

	private String password;
	private String phone;
	private String dob;
	private String gender;
	private String hobbies;
	private String address;
	private String state;
	private String district;
	private String taluka;
	private String village;
	@Column(name="unzippedFileName")
	private String extractedfolderPath;

	@Column(name = "fileName")
	private String filePath;

	// Constructors
	public UserForm() {
	}

	public UserForm(Long id, String name, String email, String password, String phone, String dob, String gender,
			String hobbies, String address, String state, String district, String taluka, String village,
			String extractedfolderPath, String filePath) {
		super();
		this.id = id;
		this.name = name;
		this.email = email;
		this.password = password;
		this.phone = phone;
		this.dob = dob;
		this.gender = gender;
		this.hobbies = hobbies;
		this.address = address;
		this.state = state;
		this.district = district;
		this.taluka = taluka;
		this.village = village;
		this.extractedfolderPath = extractedfolderPath;
		this.filePath = filePath;
	}

	// Getters and Setters
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getDob() {
		return dob;
	}

	public void setDob(String dob) {
		this.dob = dob;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getHobbies() {
		return hobbies;
	}

	public void setHobbies(String hobbies) {
	    this.hobbies = hobbies != null ? hobbies : "";
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getDistrict() {
		return district;
	}

	public void setDistrict(String district) {
		this.district = district;
	}

	public String getTaluka() {
		return taluka;
	}

	public void setTaluka(String taluka) {
		this.taluka = taluka;
	}

	public String getVillage() {
		return village;
	}

	public void setVillage(String village) {
		this.village = village;
	}

	public String getExtractedfolderPath() {
		return extractedfolderPath;
	}

	public void setExtractedFolderPath(String extractedfolderPath) {
		this.extractedfolderPath = extractedfolderPath;
	}

	@Override
	public String toString() {
		return "UserForm [id=" + id + ", name=" + name + ", email=" + email + ", password=" + password + ", phone="
				+ phone + ", dob=" + dob + ", gender=" + gender + ", hobbies=" + hobbies + ", address=" + address
				+ ", state=" + state + ", district=" + district + ", taluka=" + taluka + ", village=" + village
				+ ", extractedfolderPath=" + extractedfolderPath + ", filePath=" + filePath + "]";
	}

}
