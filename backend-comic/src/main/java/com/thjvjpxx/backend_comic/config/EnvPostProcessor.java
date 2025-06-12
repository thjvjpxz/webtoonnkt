package com.thjvjpxx.backend_comic.config;

import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.env.EnvironmentPostProcessor;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import io.github.cdimascio.dotenv.Dotenv;

public class EnvPostProcessor implements EnvironmentPostProcessor {
	@Override
	public void postProcessEnvironment(ConfigurableEnvironment env, SpringApplication application) {
		Dotenv dotenv = Dotenv
				.configure()
				.ignoreIfMissing()
				.load();

		Map<String, Object> map = dotenv.entries()
				.stream()
				.collect(Collectors.toMap(
						entry -> entry.getKey(),
						entry -> entry.getValue()));

		// Đưa lên đầu property sources để override
		env.getPropertySources()
				.addFirst(new MapPropertySource("dotenvProperties", map));
	}
}
