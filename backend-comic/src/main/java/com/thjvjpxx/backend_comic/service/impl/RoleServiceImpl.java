package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.repository.RoleRepository;
import com.thjvjpxx.backend_comic.service.RoleService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RoleServiceImpl implements RoleService {
    RoleRepository roleRepository;

    @Override
    public BaseResponse<?> getAllRoles() {
        List<Role> roles = roleRepository.findAll();
        return BaseResponse.success(roles);
    }

}
