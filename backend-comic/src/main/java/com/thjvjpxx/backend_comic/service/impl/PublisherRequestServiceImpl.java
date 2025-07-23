package com.thjvjpxx.backend_comic.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherRequestResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.enums.PublisherRequestStatus;
import com.thjvjpxx.backend_comic.enums.RoleEnum;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.PublisherRequest;
import com.thjvjpxx.backend_comic.model.Role;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.PublisherRequestRepository;
import com.thjvjpxx.backend_comic.repository.RoleRepository;
import com.thjvjpxx.backend_comic.service.PublisherRequestService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;

import jakarta.transaction.Transactional;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class PublisherRequestServiceImpl implements PublisherRequestService {

    PublisherRequestRepository publisherRequestRepo;
    RoleRepository roleRepo;

    @Override
    public BaseResponse<?> sendPublisherRequest(User user) {
        Role rolePublisher = roleRepo.findByName(RoleEnum.PUBLISHER.getName())
                .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
        Role roleAdmin = roleRepo.findByName(RoleEnum.ADMIN.getName())
                .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));

        if (user.getRole().equals(roleAdmin)) {
            // Nếu là admin
            throw new BaseException(ErrorCode.ALREADY_ADMIN);
        }

        if (user.getRole().equals(rolePublisher)) {
            // Nếu đã là publisher
            throw new BaseException(ErrorCode.ALREADY_PUBLISHER);
        }

        // Kiểm tra xem user đã gửi yêu cầu trước đó chưa
        publisherRequestRepo.findByUser(user)
                .ifPresent(existingRequest -> {
                    if (existingRequest.getStatus().equals(PublisherRequestStatus.PENDING)) {
                        throw new BaseException(ErrorCode.ALREADY_REQUESTED);
                    }
                });

        PublisherRequest publisherRequest = PublisherRequest.builder()
                .user(user)
                .status(PublisherRequestStatus.PENDING)
                .build();
        publisherRequestRepo.save(publisherRequest);

        return BaseResponse.success("Bạn đã gửi yêu cầu thành công, vui lòng chờ duyệt!");
    }

    @Override
    public BaseResponse<?> getPublisherRequests(int page, int size, String search, String status) {
        Pageable pageable = PaginationUtils.createPageableWithSort(page, size, "createdAt", Sort.Direction.DESC);
        int originalPage = page;

        Page<PublisherRequest> publisherRequests = null;

        Boolean hasStatus = status != null && !status.isEmpty();
        Boolean hasSearch = search != null && !search.isEmpty();

        if (hasSearch && hasStatus) {
            // Tìm kiếm theo username của user và trạng thái
            publisherRequests = publisherRequestRepo
                    .findByStatusAndUserUsernameContaining(PublisherRequestStatus.valueOf(status), search, pageable);
        } else if (hasSearch) {
            // Tìm kiếm theo username của user
            publisherRequests = publisherRequestRepo.findByUserUsernameContaining(search, pageable);
        } else if (hasStatus) {
            // Tìm kiếm theo trạng thái
            publisherRequests = publisherRequestRepo.findByStatus(PublisherRequestStatus.valueOf(status), pageable);
        } else {
            publisherRequests = publisherRequestRepo.findAll(pageable);
        }

        List<PublisherRequestResponse> publisherRequestResponses = publisherRequests.getContent().stream()
                .map(this::convertToPublisherRequestResponse)
                .collect(Collectors.toList());

        return BaseResponse.success(
                publisherRequestResponses,
                originalPage,
                (int) publisherRequests.getTotalElements(),
                size,
                publisherRequests.getTotalPages());
    }

    private PublisherRequestResponse convertToPublisherRequestResponse(PublisherRequest publisherRequest) {
        return PublisherRequestResponse.builder()
                .id(publisherRequest.getId())
                .userId(publisherRequest.getUser().getId())
                .username(publisherRequest.getUser().getUsername())
                .level(publisherRequest.getUser().getLevel())
                .status(publisherRequest.getStatus().name())
                .createdAt(publisherRequest.getCreatedAt())
                .updatedAt(publisherRequest.getUpdatedAt())
                .build();
    }

    @Override
    @Transactional
    public BaseResponse<?> updatePublisherRequestStatus(String id, PublisherRequestStatus status) {
        PublisherRequest publisherRequest = publisherRequestRepo.findById(id)
                .orElseThrow(() -> new BaseException(ErrorCode.PUBLISHER_REQUEST_NOT_FOUND));

        if (publisherRequest.getStatus().equals(status)) {
            throw new BaseException(ErrorCode.PUBLISHER_REQUEST_ALREADY_UPDATED);
        }

        if (status.equals(PublisherRequestStatus.APPROVED)) {
            Role rolePublisher = roleRepo.findByName(RoleEnum.PUBLISHER.getName())
                    .orElseThrow(() -> new BaseException(ErrorCode.ROLE_NOT_FOUND));
            publisherRequest.getUser().setRole(rolePublisher);
        }

        publisherRequest.setStatus(status);
        publisherRequestRepo.save(publisherRequest);
        return BaseResponse.success("Cập nhật trạng thái yêu cầu thành công");
    }
}
