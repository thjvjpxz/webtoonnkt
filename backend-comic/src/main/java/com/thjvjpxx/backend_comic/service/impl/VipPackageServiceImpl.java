package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thjvjpxx.backend_comic.dto.request.VipPackageRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.VipPackage;
import com.thjvjpxx.backend_comic.repository.VipPackageRepository;
import com.thjvjpxx.backend_comic.service.VipPackageService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class VipPackageServiceImpl implements VipPackageService {

    VipPackageRepository vipPackageRepository;

    @Override
    public BaseResponse<List<VipPackage>> getAllVipPackages(int page, int limit, String search, Boolean isActive) {
        Pageable pageable = PaginationUtils.createPageableWithSort(page, limit, "updatedAt", Sort.Direction.DESC);

        Page<VipPackage> vipPackagePage = null;

        // Kiểm tra xem có tìm kiếm hay không
        boolean hasSearch = search != null && !search.isEmpty();

        if (!hasSearch && isActive == null) {
            // Không có tìm kiếm và không lọc theo trạng thái
            vipPackagePage = vipPackageRepository.findAll(pageable);
        } else if (hasSearch && isActive != null) {
            // Có tìm kiếm và lọc theo trạng thái
            vipPackagePage = vipPackageRepository.findBySearchTermAndStatus(search, isActive, pageable);
        } else if (isActive != null) {
            // Chỉ lọc theo trạng thái (không tìm kiếm)
            vipPackagePage = vipPackageRepository.findByIsActive(isActive, pageable);
        } else {
            // Chỉ tìm kiếm (không lọc theo trạng thái)
            vipPackagePage = vipPackageRepository.findBySearchTerm(search, pageable);
        }

        return BaseResponse.success(
                vipPackagePage.getContent(),
                page,
                (int) vipPackagePage.getTotalElements(),
                limit,
                vipPackagePage.getTotalPages());

    }

    @Override
    public BaseResponse<VipPackage> getVipPackageById(String id) {
        VipPackage vipPackage = vipPackageRepository.findById(id)
                .orElse(null);

        if (vipPackage == null) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_NOT_FOUND);
        }

        return BaseResponse.success(vipPackage);
    }

    @Override
    @Transactional
    public BaseResponse<VipPackage> createVipPackage(VipPackageRequest request) {
        // Validate request
        if (!request.isDiscountValid()) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_INVALID);
        }

        // Kiểm tra tên gói VIP đã tồn tại
        if (vipPackageRepository.existsByNameIgnoreCase(request.getName())) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_NAME_EXISTS);
        }

        // Tạo gói VIP mới
        VipPackage vipPackage = VipPackage.builder()
                .name(request.getName())
                .description(request.getDescription())
                .originalPrice(request.getOriginalPrice())
                .discountedPrice(request.getDiscountedPrice())
                .discountStartDate(request.getDiscountStartDate())
                .discountEndDate(request.getDiscountEndDate())
                .durationDays(request.getDurationDays())
                .isActive(true)
                .build();

        vipPackageRepository.save(vipPackage);

        return BaseResponse.success("Tạo gói VIP thành công");
    }

    @Override
    @Transactional
    public BaseResponse<VipPackage> updateVipPackage(String id, VipPackageRequest request) {
        // Validate request
        if (!request.isDiscountValid()) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_INVALID);
        }

        VipPackage existingVipPackage = vipPackageRepository.findById(id)
                .orElse(null);

        if (existingVipPackage == null) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_NOT_FOUND);
        }

        // Kiểm tra tên gói VIP đã tồn tại (trừ gói hiện tại)
        if (vipPackageRepository.existsByNameIgnoreCaseAndIdNot(request.getName(), id)) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_NAME_EXISTS);
        }

        // Cập nhật thông tin
        existingVipPackage.setName(request.getName());
        existingVipPackage.setDescription(request.getDescription());
        existingVipPackage.setOriginalPrice(request.getOriginalPrice());
        existingVipPackage.setDiscountedPrice(request.getDiscountedPrice());
        existingVipPackage.setDiscountStartDate(request.getDiscountStartDate());
        existingVipPackage.setDiscountEndDate(request.getDiscountEndDate());
        existingVipPackage.setDurationDays(request.getDurationDays());

        vipPackageRepository.save(existingVipPackage);

        return BaseResponse.success("Cập nhật gói VIP thành công");
    }

    @Override
    @Transactional
    public BaseResponse<VipPackage> deleteVipPackage(String id) {
        VipPackage vipPackage = vipPackageRepository.findById(id)
                .orElse(null);

        if (vipPackage == null) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_NOT_FOUND);
        }

        // Soft delete - chuyển thành inactive
        vipPackage.setIsActive(false);
        vipPackageRepository.save(vipPackage);

        return BaseResponse.success("Đã vô hiệu hóa gói VIP");
    }

    @Override
    @Transactional
    public BaseResponse<String> permanentDeleteVipPackage(String id) {
        VipPackage vipPackage = vipPackageRepository.findById(id)
                .orElse(null);

        if (vipPackage == null) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_NOT_FOUND);
        }

        vipPackageRepository.delete(vipPackage);

        return BaseResponse.success("Đã xóa gói VIP vĩnh viễn");
    }

    @Override
    public BaseResponse<List<VipPackage>> getPublicVipPackages() {
        List<VipPackage> activePackages = vipPackageRepository.findByIsActive(true);

        return BaseResponse.success(activePackages);
    }
}