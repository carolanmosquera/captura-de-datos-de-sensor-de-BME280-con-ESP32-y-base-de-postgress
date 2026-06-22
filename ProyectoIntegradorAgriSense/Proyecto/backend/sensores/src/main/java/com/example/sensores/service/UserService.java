package com.example.sensores.service;

import com.example.sensores.dto.UserRequestDTO;
import com.example.sensores.dto.UserResponseDTO;
import java.util.List;

public interface UserService {

    List<UserResponseDTO> getAllUsers();
    UserResponseDTO getUserById(Long id);
    UserResponseDTO updateUser(Long id, UserRequestDTO dto);
    void deleteUser(Long id);
}