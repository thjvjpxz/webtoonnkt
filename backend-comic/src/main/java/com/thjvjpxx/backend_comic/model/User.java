package com.thjvjpxx.backend_comic.model;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Entity(name = "users")
@Table(indexes = {
        @Index(name = "idx_verification_token", columnList = "verification_token")
})
@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "VARCHAR(36)")
    String id;

    @Column(name = "username", nullable = false, unique = true)
    String username;

    @Column(name = "email", nullable = false, unique = true)
    String email;

    @Column(name = "password", nullable = false)
    @JsonIgnore
    String password;

    String imgUrl;

    Boolean vip = false;

    Boolean active = false;

    Boolean blocked = false;

    Boolean deleted = false;

    @Column(name = "verification_token")
    String verificationToken;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id", nullable = false)
    Role role;

    @Column(name = "balance", nullable = false)
    Double balance = 0.0; // Số linh thạch hiện có (1 linh thạch = 1000 VND)

    @ManyToOne
    @JoinColumn(name = "level_id")
    Level level;

    @Column(name = "current_exp", nullable = false)
    Integer currentExp = 0;

    @Column(name = "created_at")
    @CreationTimestamp
    LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    LocalDateTime updatedAt;
}
