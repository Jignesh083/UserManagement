package com.project.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.project.model.UserDTO;
import com.project.model.UserForm;
import com.project.repo.UserRepo;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    // Get All Users
    public List<UserDTO> getAllUsers() 
    {
    	List<UserForm> users = userRepository.findAll();
    	return users.stream().map(UserDTO :: new).collect(Collectors.toList());
    }

    // Get User by ID
    public Optional<UserForm> getUserById(Long id) {
        return userRepository.findById(id).map(user -> {
            System.out.println("User Data: " + user); // Log the data
            return user;
        });
    }


    // Update User
    public UserForm updateUser(Long id, UserForm userDetails, MultipartFile file) {
    	UserForm user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(userDetails.getName());
        user.setEmail(userDetails.getEmail());
        user.setPhone(userDetails.getPhone());
        user.setDob(userDetails.getDob());
        user.setGender(userDetails.getGender());
        user.setHobbies(userDetails.getHobbies());
        user.setAddress(userDetails.getAddress());
        user.setState(userDetails.getState());
        user.setDistrict(userDetails.getDistrict());
        user.setTaluka(userDetails.getTaluka());
        user.setVillage(userDetails.getVillage());

        
      return userRepository.save(user);
    }

    // Delete User
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}
