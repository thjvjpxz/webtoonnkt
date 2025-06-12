package com.thjvjpxx.backend_comic.service.impl;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.VipSubscriptionResponse;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.enums.TransactionStatus;
import com.thjvjpxx.backend_comic.enums.VipSubscriptionStatus;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.PurchasedChapter;
import com.thjvjpxx.backend_comic.model.Transaction;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.model.UserVipSubscription;
import com.thjvjpxx.backend_comic.model.VipPackage;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.PurchasedChapterRepository;
import com.thjvjpxx.backend_comic.repository.TransactionRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.repository.UserVipSubscriptionRepository;
import com.thjvjpxx.backend_comic.repository.VipPackageRepository;
import com.thjvjpxx.backend_comic.service.PurchaseService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PurchaseServiceImpl implements PurchaseService {

    VipPackageRepository vipPackageRepository;
    UserVipSubscriptionRepository userVipSubscriptionRepository;
    ChapterRepository chapterRepository;
    PurchasedChapterRepository purchasedChapterRepository;
    TransactionRepository transactionRepository;
    UserRepository userRepository;

    @Override
    public BaseResponse<?> getMyPurchasedVipPackage(User user) {
        LocalDateTime now = LocalDateTime.now();
        Optional<UserVipSubscription> userVipSubscription = userVipSubscriptionRepository.findByUserAndActive(user,
                now);

        if (userVipSubscription.isPresent()) {
            UserVipSubscription subscription = userVipSubscription.get();

            // Tính số ngày còn lại
            long daysRemaining = 0;
            if (!subscription.isExpired()) {
                LocalDateTime endDate = subscription.getEndDate();
                daysRemaining = java.time.Duration.between(now, endDate).toDays();
            }

            VipSubscriptionResponse response = VipSubscriptionResponse.builder()
                    .startDate(subscription.getStartDate())
                    .endDate(subscription.getEndDate())
                    .daysRemaining(daysRemaining)
                    .isActive(!subscription.isExpired())
                    .build();

            return BaseResponse.success(response);
        }

        return BaseResponse.success(null, "Bạn chưa mua gói VIP nào hoặc VIP đã hết hạn");
    }

    @Override
    @Transactional
    public BaseResponse<?> purchaseVipPackage(String vipPackageId, User user) {
        // Tìm gói VIP
        VipPackage vipPackage = vipPackageRepository.findById(vipPackageId)
                .orElseThrow(() -> new BaseException(ErrorCode.VIP_PACKAGE_NOT_FOUND));

        // Kiểm tra gói VIP có còn được bán không
        if (!vipPackage.isAvailableForPurchase()) {
            throw new BaseException(ErrorCode.VIP_PACKAGE_INVALID);
        }

        // Tính giá hiện tại của gói VIP
        Double currentPrice = vipPackage.getCurrentPrice();

        // Kiểm tra số dư user
        if (user.getBalance() < currentPrice) {
            throw new BaseException(ErrorCode.TRANSACTION_INSUFFICIENT_BALANCE);
        }

        // Tạo transaction cho việc mua VIP
        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(currentPrice * -1) // Số âm vì đây là chi tiêu
                .status(TransactionStatus.COMPLETED)
                .description("Mua gói VIP: " + vipPackage.getName())
                .paymentMethod("BALANCE") // Thanh toán bằng số dư
                .durationDays(vipPackage.getDurationDays())
                .build();

        transaction = transactionRepository.save(transaction);

        // Trừ số dư user
        user.setBalance(user.getBalance() - currentPrice);
        user.setVip(true); // Cập nhật trạng thái VIP
        userRepository.save(user);

        // Tìm subscription hiện tại (nếu có)
        LocalDateTime now = LocalDateTime.now();
        var currentSubscription = userVipSubscriptionRepository.findActiveSubscriptionByUser(user, now);

        UserVipSubscription vipSubscription;

        if (currentSubscription.isPresent()) {
            // Nếu đã có VIP, gia hạn thêm
            vipSubscription = currentSubscription.get();
            vipSubscription.extendSubscription(vipPackage.getDurationDays());
        } else {
            // Tạo subscription mới
            vipSubscription = new UserVipSubscription();
            vipSubscription.setUser(user);
            vipSubscription.setStartDate(now);
            vipSubscription.setEndDate(now.plusDays(vipPackage.getDurationDays()));
            vipSubscription.setStatus(VipSubscriptionStatus.ACTIVE);
        }

        userVipSubscriptionRepository.save(vipSubscription);

        log.info("User {} đã mua gói VIP {} với giá {} linh thạch",
                user.getUsername(), vipPackage.getName(), currentPrice);

        String message = "Mua gói VIP thành công! VIP của bạn có hiệu lực đến " +
                vipSubscription.getEndDate().toLocalDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        return BaseResponse.success(message);
    }

    @Override
    @Transactional
    public BaseResponse<?> purchaseChapter(String chapterId, User user) {
        // Tìm chapter
        Chapter chapter = chapterRepository.findById(chapterId)
                .orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));

        // Kiểm tra chapter có phải trả phí không
        if (chapter.getPrice() == null || chapter.getPrice() <= 0) {
            throw new BaseException(ErrorCode.CHAPTER_IS_FREE);
        }

        // Kiểm tra user đã mua chapter chưa
        if (purchasedChapterRepository.existsByUserAndChapter(user, chapter)) {
            throw new BaseException(ErrorCode.CHAPTER_ALREADY_PURCHASED);
        }

        // Kiểm tra số dư user
        if (user.getBalance() < chapter.getPrice()) {
            throw new BaseException(ErrorCode.TRANSACTION_INSUFFICIENT_BALANCE);
        }

        // Tạo transaction cho việc mua chapter
        Transaction transaction = Transaction.builder()
                .user(user)
                .amount(chapter.getPrice() * -1) // Số âm vì đây là chi tiêu
                .status(TransactionStatus.COMPLETED)
                .description(
                        "Mua chương: " + chapter.getChapterNumber() + " của truyện: " + chapter.getComic().getName())
                .paymentMethod("BALANCE") // Thanh toán bằng số dư
                .build();

        transaction = transactionRepository.save(transaction);

        // Trừ số dư user
        user.setBalance(user.getBalance() - chapter.getPrice());
        userRepository.save(user);

        // Tạo record mua chapter
        PurchasedChapter purchasedChapter = PurchasedChapter.builder()
                .user(user)
                .chapter(chapter)
                .transaction(transaction)
                .purchasePrice(chapter.getPrice())
                .build();

        purchasedChapterRepository.save(purchasedChapter);

        log.info("User {} đã mua chapter {} với giá {} linh thạch",
                user.getUsername(), chapter.getTitle(), chapter.getPrice());

        return BaseResponse.success("Mua chapter thành công! Bạn có thể đọc chapter ngay bây giờ.");
    }

}