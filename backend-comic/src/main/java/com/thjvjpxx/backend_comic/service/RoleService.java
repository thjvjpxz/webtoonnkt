package com.thjvjpxx.backend_comic.service;

import java.util.List;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.model.Role;

public interface RoleService {
    /**
     * Lấy danh sách role
     * GET /roles
     * 
     * @return
     */
    BaseResponse<List<Role>> getRoles();
}
