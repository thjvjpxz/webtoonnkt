package com.thjvjpxx.backend_comic.service.impl;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.constant.PaymentConstants;
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse;
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse.MonthlyViewFollow;
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse.RevenueStats;
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse.TopChapterStats;
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse.TopComicStats;
import com.thjvjpxx.backend_comic.dto.response.PublisherPersonalStatsResponse.ViewFollowStats;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.ComicViewsHistoryRepository;
import com.thjvjpxx.backend_comic.repository.PurchasedChapterRepository;
import com.thjvjpxx.backend_comic.repository.UserFollowRepository;
import com.thjvjpxx.backend_comic.service.PublisherPersonalStatsService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class PublisherPersonalStatsServiceImpl implements PublisherPersonalStatsService {

	private final PurchasedChapterRepository purchasedChapterRepository;
	private final ComicViewsHistoryRepository comicViewsHistoryRepository;
	private final UserFollowRepository userFollowRepository;

	// ============================= PUBLIC METHODS ==============================

	@Override
	public PublisherPersonalStatsResponse getPersonalStats(User publisher) {
		log.info("Bắt đầu lấy thống kê cá nhân cho publisher: {}", publisher.getUsername());

		return PublisherPersonalStatsResponse.builder()
				.revenueStats(buildRevenueStats(publisher))
				.viewFollowStats(buildViewFollowStats(publisher))
				.topComics(buildTopComics(publisher))
				.topSellingChapters(buildTopSellingChapters(publisher))
				.build();
	}

	@Override
	public PublisherPersonalStatsResponse getPersonalStatsInDateRange(User publisher, LocalDateTime startDate,
			LocalDateTime endDate) {
		log.info("Lấy thống kê cá nhân cho publisher {} từ {} đến {}",
				publisher.getUsername(), startDate, endDate);

		return PublisherPersonalStatsResponse.builder()
				.revenueStats(buildRevenueStatsInRange(publisher, startDate, endDate))
				.viewFollowStats(buildViewFollowStatsInRange(publisher, startDate, endDate))
				.topComics(buildTopComics(publisher))
				.topSellingChapters(buildTopSellingChapters(publisher))
				.build();
	}

	// ============================= HELPER METHODS ==============================

	/**
	 * Tính toán thống kê doanh thu cá nhân của publisher
	 * 
	 * @param publisher
	 * @return RevenueStats
	 */
	private RevenueStats buildRevenueStats(User publisher) {
		LocalDateTime now = LocalDateTime.now();

		// Tính toán các khoảng thời gian
		LocalDateTime startOfMonth = now.with(TemporalAdjusters.firstDayOfMonth()).withHour(0).withMinute(0)
				.withSecond(0);
		LocalDateTime startOfWeek = now.minusDays(now.getDayOfWeek().getValue() - 1).withHour(0).withMinute(0)
				.withSecond(0);
		LocalDateTime startOfDay = now.withHour(0).withMinute(0).withSecond(0);

		Double totalRevenue = purchasedChapterRepository.getTotalRevenueByPublisher(publisher);
		Double monthlyRevenue = purchasedChapterRepository.getRevenueByPublisherBetweenDates(publisher,
				startOfMonth,
				now);
		Double weeklyRevenue = purchasedChapterRepository.getRevenueByPublisherBetweenDates(publisher,
				startOfWeek,
				now);
		Double dailyRevenue = purchasedChapterRepository.getRevenueByPublisherBetweenDates(publisher,
				startOfDay, now);
		Long totalPurchases = purchasedChapterRepository.getTotalPurchasesByPublisher(publisher);

		// Convert từ Linh Thạch sang VND
		return RevenueStats.builder()
				.totalRevenue(totalRevenue != null ? PaymentConstants.convertLinhThachToVnd(totalRevenue) : 0.0)
				.monthlyRevenue(monthlyRevenue != null ? PaymentConstants.convertLinhThachToVnd(monthlyRevenue) : 0.0)
				.weeklyRevenue(weeklyRevenue != null ? PaymentConstants.convertLinhThachToVnd(weeklyRevenue) : 0.0)
				.dailyRevenue(dailyRevenue != null ? PaymentConstants.convertLinhThachToVnd(dailyRevenue) : 0.0)
				.totalPurchases(totalPurchases != null ? totalPurchases : 0L)
				.build();
	}

	/**
	 * Tính toán thống kê doanh thu cá nhân của publisher trong khoảng thời gian
	 * 
	 * @param publisher
	 * @param startDate
	 * @param endDate
	 * @return RevenueStats
	 */
	private RevenueStats buildRevenueStatsInRange(User publisher, LocalDateTime startDate, LocalDateTime endDate) {
		Double totalRevenue = purchasedChapterRepository.getRevenueByPublisherBetweenDates(publisher, startDate,
				endDate);
		Long totalPurchases = purchasedChapterRepository.getPurchasesByPublisherBetweenDates(publisher,
				startDate,
				endDate);

		// Convert từ Linh Thạch sang VND
		return RevenueStats.builder()
				.totalRevenue(totalRevenue != null ? PaymentConstants.convertLinhThachToVnd(totalRevenue) : 0.0)
				.monthlyRevenue(totalRevenue != null ? PaymentConstants.convertLinhThachToVnd(totalRevenue) : 0.0)
				.weeklyRevenue(0.0)
				.dailyRevenue(0.0)
				.totalPurchases(totalPurchases != null ? totalPurchases : 0L)
				.build();
	}

	/**
	 * Tính toán thống kê lượt xem & theo dõi cá nhân của publisher
	 * 
	 * @param publisher
	 * @return ViewFollowStats
	 */
	private ViewFollowStats buildViewFollowStats(User publisher) {
		LocalDateTime now = LocalDateTime.now();
		LocalDateTime startOfYear = now.with(TemporalAdjusters.firstDayOfYear()).withHour(0).withMinute(0)
				.withSecond(0);

		Long totalViews = comicViewsHistoryRepository.getTotalViewsByPublisher(publisher);
		Long totalFollowers = userFollowRepository.countTotalFollowersByPublisher(publisher);

		// Lấy lịch sử theo tháng (12 tháng gần nhất)
		List<MonthlyViewFollow> monthlyHistory = buildMonthlyHistory(publisher, startOfYear, now);

		return ViewFollowStats.builder()
				.totalViews(totalViews != null ? totalViews : 0L)
				.totalFollowers(totalFollowers != null ? totalFollowers : 0L)
				.monthlyHistory(monthlyHistory)
				.build();
	}

	/**
	 * Tính toán thống kê lượt xem & theo dõi cá nhân của publisher trong khoảng
	 * thời gian
	 * 
	 * @param publisher
	 * @param startDate
	 * @param endDate
	 * @return ViewFollowStats
	 */
	private ViewFollowStats buildViewFollowStatsInRange(User publisher, LocalDateTime startDate,
			LocalDateTime endDate) {
		Long totalViews = comicViewsHistoryRepository.getTotalViewsByPublisher(publisher);
		Long totalFollowers = userFollowRepository.countTotalFollowersByPublisher(publisher);

		List<MonthlyViewFollow> monthlyHistory = buildMonthlyHistory(publisher, startDate, endDate);

		return ViewFollowStats.builder()
				.totalViews(totalViews != null ? totalViews : 0L)
				.totalFollowers(totalFollowers != null ? totalFollowers : 0L)
				.monthlyHistory(monthlyHistory)
				.build();
	}

	private List<MonthlyViewFollow> buildMonthlyHistory(User publisher, LocalDateTime startDate,
			LocalDateTime endDate) {
		List<Object[]> viewsData = comicViewsHistoryRepository.getMonthlyViewsByPublisher(publisher.getId(),
				startDate,
				endDate);
		List<Object[]> followsData = userFollowRepository.getMonthlyFollowsByPublisher(publisher.getId(),
				startDate,
				endDate);

		// Tạo map để merge dữ liệu
		Map<String, MonthlyViewFollow> monthlyMap = new HashMap<>();

		// Xử lý views data
		for (Object[] row : viewsData) {
			String month = (String) row[0];
			Long views = convertToLong(row[1]);

			monthlyMap.put(month, MonthlyViewFollow.builder()
					.month(month)
					.views(views)
					.follows(0L)
					.build());
		}

		// Xử lý follows data
		for (Object[] row : followsData) {
			String month = (String) row[0];
			Long follows = convertToLong(row[1]);

			MonthlyViewFollow existing = monthlyMap.get(month);
			if (existing != null) {
				existing.setFollows(follows);
			} else {
				monthlyMap.put(month, MonthlyViewFollow.builder()
						.month(month)
						.views(0L)
						.follows(follows)
						.build());
			}
		}

		return new ArrayList<>(monthlyMap.values());
	}

	private List<TopComicStats> buildTopComics(User publisher) {
		Pageable topThreePageable = PageRequest.of(0, 3);

		// Lấy top 3 comics theo views
		List<Object[]> topByViews = comicViewsHistoryRepository.getTopComicsByViewsForPublisher(publisher,
				topThreePageable);
		// Lấy top 3 comics theo follows
		List<Object[]> topByFollows = userFollowRepository.getTopComicsByFollowCount(publisher,
				topThreePageable);
		// Lấy top 3 comics theo revenue
		List<Object[]> topByRevenue = purchasedChapterRepository.getTopComicsByRevenueForPublisher(publisher,
				topThreePageable);

		Map<String, TopComicStats> comicsMap = new HashMap<>();

		// Xử lý views data
		for (Object[] row : topByViews) {
			Comic comic = (Comic) row[0];
			Long views = convertToLong(row[1]);

			comicsMap.put(comic.getId(), TopComicStats.builder()
					.comicId(comic.getId())
					.comicName(comic.getName())
					.comicSlug(comic.getSlug())
					.thumbUrl(comic.getThumbUrl())
					.totalViews(views)
					.totalFollowers(0L)
					.totalRevenue(0.0)
					.lastUpdated(comic.getUpdatedAt())
					.build());
		}

		// Merge follows data
		for (Object[] row : topByFollows) {
			Comic comic = (Comic) row[0];
			Long follows = convertToLong(row[1]);

			TopComicStats existing = comicsMap.get(comic.getId());
			if (existing != null) {
				existing.setTotalFollowers(follows);
			} else {
				comicsMap.put(comic.getId(), TopComicStats.builder()
						.comicId(comic.getId())
						.comicName(comic.getName())
						.comicSlug(comic.getSlug())
						.thumbUrl(comic.getThumbUrl())
						.totalViews(0L)
						.totalFollowers(follows)
						.totalRevenue(0.0)
						.lastUpdated(comic.getUpdatedAt())
						.build());
			}
		}

		// Merge revenue data
		for (Object[] row : topByRevenue) {
			Comic comic = (Comic) row[0];
			Double revenue = (Double) row[1];

			TopComicStats existing = comicsMap.get(comic.getId());
			if (existing != null) {
				existing.setTotalRevenue(revenue != null ? PaymentConstants.convertLinhThachToVnd(revenue) : 0.0);
			} else {
				comicsMap.put(comic.getId(), TopComicStats.builder()
						.comicId(comic.getId())
						.comicName(comic.getName())
						.comicSlug(comic.getSlug())
						.thumbUrl(comic.getThumbUrl())
						.totalViews(0L)
						.totalFollowers(0L)
						.totalRevenue(revenue != null ? PaymentConstants.convertLinhThachToVnd(revenue) : 0.0)
						.lastUpdated(comic.getUpdatedAt())
						.build());
			}
		}

		return new ArrayList<>(comicsMap.values());
	}

	private List<TopChapterStats> buildTopSellingChapters(User publisher) {
		Pageable topFivePageable = PageRequest.of(0, 5);
		List<Object[]> topChapters = purchasedChapterRepository.getTopSellingChaptersWithDetails(publisher,
				topFivePageable);

		List<TopChapterStats> result = new ArrayList<>();
		for (Object[] row : topChapters) {
			Chapter chapter = (Chapter) row[0];
			Long purchaseCount = convertToLong(row[1]);
			Double revenue = (Double) row[2];
			Comic comic = (Comic) row[3];

			result.add(TopChapterStats.builder()
					.chapterId(chapter.getId())
					.chapterTitle(chapter.getTitle())
					.chapterNumber(chapter.getChapterNumber())
					.comicName(comic.getName())
					.comicSlug(comic.getSlug())
					.purchaseCount(purchaseCount)
					.revenue(revenue != null ? PaymentConstants.convertLinhThachToVnd(revenue) : 0.0)
					.price(chapter.getPrice() != null ? PaymentConstants.convertLinhThachToVnd(chapter.getPrice())
							: 0.0)
					.publishedAt(chapter.getCreatedAt())
					.build());
		}

		return result;
	}

	/**
	 * Helper method để convert Object thành Long
	 * Xử lý các trường hợp BigInteger, BigDecimal, Long
	 */
	private Long convertToLong(Object value) {
		if (value == null) {
			return 0L;
		}
		if (value instanceof Long) {
			return (Long) value;
		}
		if (value instanceof BigInteger) {
			return ((BigInteger) value).longValue();
		}
		if (value instanceof BigDecimal) {
			return ((BigDecimal) value).longValue();
		}
		if (value instanceof Integer) {
			return ((Integer) value).longValue();
		}
		// Fallback: try to parse as string
		try {
			return Long.parseLong(value.toString());
		} catch (NumberFormatException e) {
			log.warn("Không thể convert {} thành Long, trả về 0", value);
			return 0L;
		}
	}
}