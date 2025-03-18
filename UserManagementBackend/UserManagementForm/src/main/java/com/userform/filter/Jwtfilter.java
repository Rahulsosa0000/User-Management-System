//package com.userform.filter;
//
//import java.io.IOException;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.context.ApplicationContext;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.core.context.SecurityContextHolder;
//import org.springframework.security.core.userdetails.UserDetails;
//import org.springframework.stereotype.Component;
//import org.springframework.web.filter.OncePerRequestFilter;
//
//import com.userform.config.MyUserDetailsService;
//import com.userform.service.JwtService;
//
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//
//@Component
//public class Jwtfilter extends OncePerRequestFilter {
//
//	@Autowired
//	private JwtService jwtService;
//
//	@Autowired
//	private MyUserDetailsService userService;
//
//	@Autowired
//	ApplicationContext context;
//
//	@Override
//	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
//			throws ServletException, IOException {
//		final String authorizationHeader = request.getHeader("Authorization");
//
//		System.out.println("Authorization Header: " + authorizationHeader); // <-- Add this line
//
//		String username = null;
//		String token = null;
//		
//		String requestURI = request.getRequestURI();
//
//		
//		if (requestURI.equals("/auth/login") || requestURI.equals("/api/files/upload") || requestURI.equals("/auth/refreshtoken"))
//	     {
//			filterChain.doFilter(request, response);
//	         return;
//	     }
//
//		if (authorizationHeader != null && authorizationHeader.startsWith("Bearer")) {
//			token = authorizationHeader.substring(7);
//			username = jwtService.getUserNameFromJwtToken(token);
//			System.out.println("Extracted Username: " + username); // Log it
//
//		}
//
//
//		// if username not null and context is null so set authentication
//		if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//
//			// fetch user detail from username
//			UserDetails userDetails = this.userService.loadUserByUsername(username);
//			
//
//			Boolean validateToken = this.jwtService.validateToken(token, userDetails);// to tell the helper check user
//																						// or token
//			if (validateToken) {
//
//				// set the authentication
//				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
//						userDetails, null, userDetails.getAuthorities());
//				
//				SecurityContextHolder.getContext().setAuthentication(authentication);
//
//				
//			}
//
//		}
//
//		filterChain.doFilter(request, response);
//	}
//
//}




package com.userform.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.userform.config.MyUserDetailsService;
import com.userform.service.JwtService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class Jwtfilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private MyUserDetailsService userService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");

        String username = null;
        String token = null;
        String requestURI = request.getRequestURI();

        // Skip authentication for certain endpoints
        if (requestURI.equals("/auth/login") || requestURI.equals("/api/files/upload") || requestURI.equals("/auth/refreshtoken")) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);
                username = jwtService.getUserNameFromJwtToken(token);
            } else {
                throw new Exception("Invalid token format.");
            }

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userService.loadUserByUsername(username);

                if (jwtService.validateToken(token, userDetails)) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    throw new Exception("Invalid token.");
                }
            }

            filterChain.doFilter(request, response);

        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired token, please login again.");
            response.getWriter().flush();
        }
    }
}
