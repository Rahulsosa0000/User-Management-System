package com.userform.model;


import jakarta.persistence.*;
import java.time.LocalDate;

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
    private LocalDate dob;
    private String gender;
    private String address;
    private String userType;
    private String zipfile;
    private String state;
    private String district;
    private String taluka;
    private String village;
    
    private String extractedFilePath; // Stores extracted file path
   
    
	public UserForm() {
		super();
		// TODO Auto-generated constructor stub
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
	public LocalDate getDob() {
		return dob;
	}
	public void setDob(LocalDate dob) {
		this.dob = dob;
	}
	public String getGender() {
		return gender;
	}
	public void setGender(String gender) {
		this.gender = gender;
	}
	public String getAddress() {
		return address;
	}
	public void setAddress(String address) {
		this.address = address;
	}
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}


	public String getZipfile() {
		return zipfile;
	}


	public void setZipfile(String zipfile) {
		this.zipfile = zipfile;
	}
	
	public String getExtractedFilePath() {
        return extractedFilePath;
    }

    public void setExtractedFilePath(String extractedFilePath) {
        this.extractedFilePath = extractedFilePath;
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




	
    
    
}
