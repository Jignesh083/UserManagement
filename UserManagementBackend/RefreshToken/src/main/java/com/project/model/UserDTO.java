package com.project.model;

public class UserDTO 
{
	private Long id;
    private String name;
    private String email;
    private String phone;
    private String dob;
    private String gender;
    private String hobbies;
    private String address;
    private String state;
    private String district;
    private String taluka;
    private String village;
    private String extractedfolderPath;
    private String filePath;

    public UserDTO() {}

    public UserDTO(UserForm userForm)
    {
        this.id = userForm.getId();
        this.name = userForm.getName();
        this.email = userForm.getEmail();
        this.phone = userForm.getPhone();
        this.dob = userForm.getDob();
        this.gender = userForm.getGender();
        this.hobbies = userForm.getHobbies();
        this.address = userForm.getAddress();
        this.state = userForm.getState();
        this.district = userForm.getDistrict();
        this.taluka = userForm.getTaluka();
        this.village = userForm.getVillage();
        this.extractedfolderPath = userForm.getExtractedfolderPath();
        this.filePath = userForm.getFilePath();
    }

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
		this.hobbies = hobbies;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
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

	public void setExtractedfolderPath(String extractedfolderPath) {
		this.extractedfolderPath = extractedfolderPath;
	}

	public String getFilePath() {
		return filePath;
	}

	public void setFilePath(String filePath) {
		this.filePath = filePath;
	}

    
    
    
}
