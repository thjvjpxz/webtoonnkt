package com.thjvjpxx.backend_comic.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import com.thjvjpxx.backend_comic.model.Level;
import com.thjvjpxx.backend_comic.model.LevelType;
import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.LevelRepository;
import com.thjvjpxx.backend_comic.repository.LevelTypeRepository;
import com.thjvjpxx.backend_comic.repository.RoleRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AdminInitializer implements CommandLineRunner {

    UserRepository userRepository;
    RoleRepository roleRepository;
    BCryptPasswordEncoder passwordEncoder;
    LevelTypeRepository levelTypeRepository;
    LevelRepository levelRepository;

    @Override
    public void run(String... args) throws Exception {
        createFullLevel();

        createFullRole();

        Role adminRole = roleRepository.findByName("ADMIN").orElseGet(() -> createRole("ADMIN", "Quản trị viên"));
        createUser("admin", "admin@admin.com", "admin123", adminRole);

    }

    private LevelType createLevelType(String name) {
        return levelTypeRepository.findByName(name).orElseGet(() -> {
            LevelType levelType = new LevelType();
            levelType.setName(name);
            return levelTypeRepository.save(levelType);
        });
    }

    private void createFullLevel() {
        List<String> colors = Arrays.asList(
                "#f18121",
                "#2196f3",
                "#009688",
                "#9c27b0",
                "#e00b87",
                "#1af26e",
                "linear-gradient(90deg, #9C27B0 0%, #e822f2 100%)",
                "linear-gradient(90deg, #fdea0a 0%, #f8a50c 50%, #fd08ab 70%, #fd08ab 100%)",
                "linear-gradient(-100deg, #e23e57 0%, rgba(131, 58, 180, 1) 25%, #fd1d1d 100%)");

        List<String> urlGifs = Arrays.asList(
                "#0a86db",
                "static/gif/2.gif",
                "static/gif/3.gif",
                "static/gif/4.gif",
                "static/gif/5.gif",
                "static/gif/6.gif",
                "static/gif/7.gif",
                "static/gif/8.gif",
                "static/gif/9.gif");

        // Không chọn
        LevelType noSelect = createLevelType("Không chọn");
        createLevel("Cấp 1", urlGifs.get(0), colors.get(0), 1000, 1, noSelect);
        createLevel("Cấp 2", urlGifs.get(1), colors.get(1), 5000, 2, noSelect);
        createLevel("Cấp 3", urlGifs.get(2), colors.get(2), 11000, 3, noSelect);
        createLevel("Cấp 4", urlGifs.get(3), colors.get(3), 27000, 4, noSelect);
        createLevel("Cấp 5", urlGifs.get(4), colors.get(4), 65000, 5, noSelect);
        createLevel("Cấp 6", urlGifs.get(5), colors.get(5), 157000, 6, noSelect);
        createLevel("Cấp 7", urlGifs.get(6), colors.get(6), 379000, 7, noSelect);
        createLevel("Cấp 8", urlGifs.get(7), colors.get(7), 915000, 8, noSelect);
        createLevel("Cấp 9", urlGifs.get(8), colors.get(8), 2209000, 9, noSelect);

        // Tu tiên
        LevelType tuTien = createLevelType("Tu tiên");
        createLevel("Luyện Khí", urlGifs.get(0), colors.get(0), 1000, 1, tuTien);
        createLevel("Trúc Cơ", urlGifs.get(1), colors.get(1), 5000, 2, tuTien);
        createLevel("Kim Đan", urlGifs.get(2), colors.get(2), 11000, 3, tuTien);
        createLevel("Nguyên Anh", urlGifs.get(3), colors.get(3), 27000, 4, tuTien);
        createLevel("Hoá Thần", urlGifs.get(4), colors.get(4), 65000, 5, tuTien);
        createLevel("Luyện Hư", urlGifs.get(5), colors.get(5), 157000, 6, tuTien);
        createLevel("Hợp Thể", urlGifs.get(6), colors.get(6), 379000, 7, tuTien);
        createLevel("Đại Thừa", urlGifs.get(7), colors.get(7), 915000, 8, tuTien);
        createLevel("Độ Kiếp", urlGifs.get(8), colors.get(8), 2209000, 9, tuTien);

        // Game
        LevelType game = createLevelType("Game");
        createLevel("Nhựa", urlGifs.get(0), colors.get(0), 1000, 1, game);
        createLevel("Đồng", urlGifs.get(1), colors.get(1), 5000, 2, game);
        createLevel("Bạc", urlGifs.get(2), colors.get(2), 11000, 3, game);
        createLevel("Vàng", urlGifs.get(3), colors.get(3), 27000, 4, game);
        createLevel("Bạch Kim", urlGifs.get(4), colors.get(4), 65000, 5, game);
        createLevel("Kim Cương", urlGifs.get(5), colors.get(5), 157000, 6, game);
        createLevel("Tinh Anh", urlGifs.get(6), colors.get(6), 379000, 7, game);
        createLevel("Chiến Tướng", urlGifs.get(7), colors.get(7), 915000, 8, game);
        createLevel("Thách Đấu", urlGifs.get(8), colors.get(8), 2209000, 9, game);

        // Ma vương
        LevelType maVuong = createLevelType("Ma vương");
        createLevel("Linh Hồn", urlGifs.get(0), colors.get(0), 1000, 1, maVuong);
        createLevel("Quỷ Sai", urlGifs.get(1), colors.get(1), 5000, 2, maVuong);
        createLevel("Ma Nô", urlGifs.get(2), colors.get(2), 11000, 3, maVuong);
        createLevel("Hộ Vệ Địa Ngục", urlGifs.get(3), colors.get(3), 27000, 4, maVuong);
        createLevel("Thống Lĩnh Bóng Đêm", urlGifs.get(4), colors.get(4), 65000, 5, maVuong);
        createLevel("Ác Quỷ Đại Tướng", urlGifs.get(5), colors.get(5), 157000, 6, maVuong);
        createLevel("Lãnh Chúa Hắc Ám", urlGifs.get(6), colors.get(6), 379000, 7, maVuong);
        createLevel("Ma Vương Phụ", urlGifs.get(7), colors.get(7), 915000, 8, maVuong);
        createLevel("Ma Vương", urlGifs.get(8), colors.get(8), 2209000, 9, maVuong);
    }

    private Level createLevel(String name, String urlGif, String color, double expRequired, int levelNumber,
            LevelType levelType) {
        return levelRepository.findByName(name).orElseGet(() -> {
            Level level = new Level();
            level.setName(name);
            level.setUrlGif(urlGif);
            level.setColor(color);
            level.setExpRequired(expRequired);
            level.setLevelNumber(levelNumber);
            level.setLevelType(levelType);
            return levelRepository.save(level);
        });

    }

    private User createUser(String username, String email, String password, Role role) {
        return userRepository.findByUsername(username).orElseGet(() -> {
            return userRepository.findByEmail(email).orElseGet(() -> {
                User user = new User();
                user.setUsername(username);
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(password));
                user.setRole(role);
                user.setActive(true);
                return userRepository.save(user);
            });
        });
    }

    private void createFullRole() {
        createRole("ADMIN", "Quản trị viên");
        createRole("PUBLISHER", "Dịch giả");
        createRole("READER", "Độc giả");
    }

    private Role createRole(String name, String description) {
        return roleRepository.findByName(name)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name(name)
                            .description(description)
                            .build();
                    return roleRepository.save(newRole);
                });
    }
}