package com.example.sensores.service;

import com.example.sensores.dto.auth.AuthResponse;
import com.example.sensores.dto.auth.LoginRequest;
import com.example.sensores.dto.auth.RegisterRequest;
import com.example.sensores.dto.auth.UserAuthResponse;
import com.example.sensores.model.Role;
import com.example.sensores.model.User;
import com.example.sensores.repository.RoleRepository;
import com.example.sensores.repository.UserRepository;
import com.example.sensores.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String DEFAULT_ROLE_NAME = "USER";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Ya existe un usuario con ese correo");
        }

        Role defaultRole = getOrCreateDefaultRole();

        User user = new User();
        user.setName(request.name());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setPhone(request.phone());
        user.setStatus("ACTIVE");
        user.setRole(defaultRole);

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new AuthResponse(
                token,
                "Bearer",
                toUserAuthResponse(savedUser)
        );
    }

    public AuthResponse login(LoginRequest request) {
        String email = normalizeEmail(request.email());

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Credenciales inválidas"
                ));

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        }

        if (user.getStatus() != null &&
                !user.getStatus().equalsIgnoreCase("ACTIVE") &&
                !user.getStatus().equalsIgnoreCase("ACTIVO")) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario inactivo");
        }

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                "Bearer",
                toUserAuthResponse(user)
        );
    }

    private Role getOrCreateDefaultRole() {
        return roleRepository.findByNameIgnoreCase(DEFAULT_ROLE_NAME)
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setName(DEFAULT_ROLE_NAME);
                    role.setDescription("Usuario estándar de AgriSense");
                    return roleRepository.save(role);
                });
    }

    private UserAuthResponse toUserAuthResponse(User user) {
        return new UserAuthResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getStatus()
        );
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase();
    }
}