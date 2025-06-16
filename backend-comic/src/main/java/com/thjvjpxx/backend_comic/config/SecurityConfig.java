package com.thjvjpxx.backend_comic.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.thjvjpxx.backend_comic.filter.JwtAuthenticationFilter;

import lombok.RequiredArgsConstructor;

/**
 * Cấu hình bảo mật
 */
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

	@Value("${app.cors.allowed-origins}")
	private String allowedOrigins;

	private final JwtAuthenticationFilter jwtAuthenticationFilter;
	private final AuthEntryPointJwt unauthorizedHandler;
	private final AccessDeniedHandlerImpl accessDeniedHandler;

	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		http
				.cors(cors -> cors.configurationSource(corsConfigurationSource()))
				.csrf(AbstractHttpConfigurer::disable)
				.exceptionHandling(exception -> exception
						.authenticationEntryPoint(unauthorizedHandler)
						.accessDeniedHandler(accessDeniedHandler))
				.authorizeHttpRequests(auth -> auth
						// .requestMatchers("/**").permitAll()
						// Các API công khai
						.requestMatchers(
								"/ocr-tts/**",
								"/test/**",
								"/public/**",
								"/auth/login",
								"/auth/register",
								"/auth/refresh-token",
								"/auth/verify",
								"/comic/*",
								"/comic/*/*",
								"/",
								"/category",
								"/search",
								"/category/*",
								"/comments/comic/*/count",
								"/comments/chapter/*/count",
								"/comments/comic/*/latest",
								"/comments/comic/*",
								"/comments/comic/*/parents",
								"/comments/chapter/*",
								"/comments/*/replies",
								"/topup/callback",
								"/transactions/webhook/**",
								"/webhook/payos/**")
						.permitAll()

						// Các API cần xác thực với vai trò ADMIN
						.requestMatchers("/admin/**").hasRole("ADMIN")
						.requestMatchers("/categories/**").hasRole("ADMIN")
						.requestMatchers("/comics/**").hasRole("ADMIN")
						.requestMatchers("/chapters/**").hasRole("ADMIN")
						.requestMatchers("/comments/*/block").hasRole("ADMIN")
						.requestMatchers("/comments/*/unblock").hasRole("ADMIN")
						.requestMatchers("/comments/user/*").hasRole("ADMIN")
						.requestMatchers("/comments?*").hasRole("ADMIN")
						.requestMatchers("/vip-packages/**").hasRole("ADMIN")
						.requestMatchers("/admin/statistics/**").hasRole("ADMIN")

						// Các API cần xác thực với vai trò PUBLISHER
						.requestMatchers("/publisher/**").hasAnyRole("PUBLISHER", "ADMIN")
						.requestMatchers("/publisher/stats/personal/**").hasAnyRole("PUBLISHER", "ADMIN")

						// Các API khác cần xác thực
						.anyRequest().authenticated())
				.sessionManagement(session -> session
						.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

		return http.build();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource() {
		CorsConfiguration configuration = new CorsConfiguration();
		configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));
		configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
		configuration.setAllowedHeaders(Arrays.asList("*"));
		configuration.setAllowCredentials(true);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/**", configuration);
		return source;
	}

	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}
}
