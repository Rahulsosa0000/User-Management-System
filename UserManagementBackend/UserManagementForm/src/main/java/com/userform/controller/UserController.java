package com.userform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.userform.authentcationEntrypoint.TokenRefreshException;
import com.userform.config.MyUserDetails;
import com.userform.model.JwtResponse;
import com.userform.model.RefreshToken;
import com.userform.model.TokenRefreshRequest;
import com.userform.model.TokenRefreshResponse;
import com.userform.model.Users;
import com.userform.service.JwtService;
import com.userform.service.RefreshTokenService;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtUtils;

    @Autowired
    private RefreshTokenService refreshTokenService;

    // Login and generate JWT + refresh token
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody Users loginRequest) {
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        MyUserDetails userDetails = (MyUserDetails) authentication.getPrincipal();

        String jwt = jwtUtils.generateJwtToken(userDetails);

        RefreshToken refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());

        System.out.println("JWT: " + jwt + " Refresh Token: " + refreshToken.getToken());
        return ResponseEntity.ok(new JwtResponse(jwt, refreshToken.getToken(), userDetails.getId(), userDetails.getUsername()));


    }

    // Refresh JWT using Refresh Token
    @PostMapping("/refreshtoken")
    public ResponseEntity<?> refreshtoken(@RequestBody TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenService.findByToken(requestRefreshToken)
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String token = jwtUtils.generateTokenFromUsername(user.getUsername());
                    return ResponseEntity.ok(new TokenRefreshResponse(token, requestRefreshToken));
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken,
                        "Refresh token is not in database!"));
    }
}
