package com.examly.springapp.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.examly.springapp.security.JwtAuthenticationFilter;
import com.examly.springapp.security.JwtAuthenticationEntryPoint;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationEntryPoint unauthorizedHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            JwtAuthenticationEntryPoint unauthorizedHandler,
            JwtAuthenticationFilter jwtAuthenticationFilter) {

        this.unauthorizedHandler = unauthorizedHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            // Disable CSRF because this is a REST API
            .csrf(csrf -> csrf.disable())

            // Enable CORS configuration
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Handle unauthorized requests
            .exceptionHandling(exception ->
                exception.authenticationEntryPoint(unauthorizedHandler)
            )

            // Do not create HTTP sessions
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // API authorization rules
            .authorizeHttpRequests(auth -> auth

                // Authentication endpoints
                .requestMatchers(
                    "/auth/**",
                    "/register",
                    "/login",
                    "/api/register",
                    "/api/login"
                ).permitAll()

                // Swagger / OpenAPI
                .requestMatchers(
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/v3/api-docs/**",
                    "/v3/api-docs",
                    "/swagger-resources/**",
                    "/webjars/**"
                ).permitAll()

                // Public REST API read operations for restaurants & menus
                .requestMatchers(
                    org.springframework.http.HttpMethod.GET,
                    "/restaurants",
                    "/restaurants/**",
                    "/menus",
                    "/menus/**"
                ).permitAll()

                // Admin only endpoints
                .requestMatchers(
                    "/admins/**",
                    "/api/admin/**",
                    "/payments/**",
                    "/deliveries/**"
                ).hasRole("ADMIN")

                // Allow OPTIONS requests for CORS preflight
                .requestMatchers(
                    org.springframework.http.HttpMethod.OPTIONS,
                    "/**"
                ).permitAll()

                // Everything else requires authentication
                .anyRequest().authenticated()
            );

        // Add JWT filter before Spring's username/password filter
        http.addFilterBefore(
            jwtAuthenticationFilter,
            UsernamePasswordAuthenticationFilter.class
        );

        return http.build();
    }

    /**
     * CORS configuration
     *
     * React frontend:
     * http://localhost:8081
     *
     * Spring Boot backend:
     * http://localhost:8080
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(
            List.of("http://localhost:8081")
        );

        configuration.setAllowedMethods(
            List.of(
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "PATCH",
                "OPTIONS"
            )
        );

        configuration.setAllowedHeaders(
            List.of("*")
        );

        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source =
            new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
            "/**",
            configuration
        );

        return source;
    }

    /**
     * Password encoder
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Authentication manager
     */
    @Bean
    public AuthenticationManager authenticationManager(
            AuthenticationConfiguration authenticationConfiguration)
            throws Exception {

        return authenticationConfiguration.getAuthenticationManager();
    }
}