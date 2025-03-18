package com.userform.service;



import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.userform.config.MyUserDetails;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.Keys;
	
@Service
public class JwtService {
	
	
	  private static final Logger logger = LoggerFactory.getLogger(JwtService.class);
	
	  
		private SecretKey jwtSecret =Keys.hmacShaKeyFor("afafasfafafasfasfasfafacasdasfasxASFACASDFACASDFASFASFDAFASFASDAADSCSDFADCVSGCFVADXCcadwavfsfarvf".getBytes());


	  @Value("${app.jwtExpirationMs}")
	  private int jwtExpirationMs;


   
// cryptographic algorithms work with byte data
	
	public String generateJwtToken(MyUserDetails userPrincipal) {
	    return generateTokenFromUsername(userPrincipal.getUsername());
	  }

    public String generateTokenFromUsername(String username) {
        Map<String, Object> claims = new HashMap<>();
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .and()
                .signWith(jwtSecret) // key use for token signing
                .compact();  // converts the token into a string format

    }
    
    
    public String getUserNameFromJwtToken(String token) {
        // retrieve username from jwt token
        return extractClaim(token, Claims::getSubject);
    }
  
   

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims); //A claim is a piece of information stored in a JWT token.
    }

    //getextractuserid
    private Claims extractAllClaims(String token) {
        return Jwts.parser() //A parser is used to decode and validate a JWT token.
                .verifyWith(jwtSecret) // verify secret key
                .build()  
                .parseSignedClaims(token) //header ,PayLoad, signature
                .getPayload();  // retrieves the PayLoad which contain actual claims (information like sub,iat, exp) 
    }


    
    public boolean validateToken(String token, UserDetails userDetails) {
        try {
            final String userName = getUserNameFromJwtToken(token);
            return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token));
        } catch (Exception e) {
            return false; //  Prevent crash if token is invalid
        }
    }


    // check if the token has expired
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // retrieve expiration date from jwt token
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
    
    
    

	




}