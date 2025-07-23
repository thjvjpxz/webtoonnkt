package com.thjvjpxx.backend_comic.service.impl;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.thjvjpxx.backend_comic.dto.request.CommentRequest;
import com.thjvjpxx.backend_comic.dto.response.BaseResponse;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse.ChapterInfo;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse.ComicInfo;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse.LevelInfo;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse.ParentCommentInfo;
import com.thjvjpxx.backend_comic.dto.response.CommentResponse.UserInfo;
import com.thjvjpxx.backend_comic.enums.CommentStatus;
import com.thjvjpxx.backend_comic.enums.ErrorCode;
import com.thjvjpxx.backend_comic.exception.BaseException;
import com.thjvjpxx.backend_comic.model.Chapter;
import com.thjvjpxx.backend_comic.model.Comic;
import com.thjvjpxx.backend_comic.model.Comment;
import com.thjvjpxx.backend_comic.model.User;
import com.thjvjpxx.backend_comic.repository.ChapterRepository;
import com.thjvjpxx.backend_comic.repository.ComicRepository;
import com.thjvjpxx.backend_comic.repository.CommentRepository;
import com.thjvjpxx.backend_comic.repository.UserRepository;
import com.thjvjpxx.backend_comic.service.CommentService;
import com.thjvjpxx.backend_comic.utils.PaginationUtils;
import com.thjvjpxx.backend_comic.utils.SecurityUtils;
import com.thjvjpxx.backend_comic.utils.ValidationUtils;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class CommentServiceImpl implements CommentService {

	CommentRepository commentRepository;
	ComicRepository comicRepository;
	ChapterRepository chapterRepository;
	UserRepository userRepository;
	SecurityUtils securityUtils;

	@Override
	public BaseResponse<List<CommentResponse>> getAllComments(int page, int limit, String search,
			String comicId, String chapterId,
			String userId, CommentStatus status) {
		Pageable pageable = PaginationUtils.createPageable(page, limit);
		Page<Comment> comments = commentRepository.findCommentsByCriteria(
				comicId, chapterId, userId, status, search, pageable);

		List<CommentResponse> commentResponses = comments.getContent().stream()
				.map(this::convertToResponse)
				.collect(Collectors.toList());

		return BaseResponse.success(
				commentResponses,
				page,
				(int) comments.getTotalElements(),
				limit,
				comments.getTotalPages());
	}

	@Override
	public BaseResponse<List<CommentResponse>> getCommentsByChapter(String chapterId, int page, int limit) {
		ValidationUtils.checkNullId(chapterId);
		Pageable pageable = PaginationUtils.createPageable(page, limit);
		Page<Comment> comments = commentRepository.findByChapterIdAndStatus(chapterId, CommentStatus.ACTIVE,
				pageable);

		List<CommentResponse> commentResponses = comments.getContent().stream()
				.map(this::convertToResponse)
				.sorted(Comparator.comparing(CommentResponse::getCreatedAt).reversed())
				.collect(Collectors.toList());

		return BaseResponse.success(
				commentResponses,
				page,
				(int) comments.getTotalElements(),
				limit,
				comments.getTotalPages());
	}

	@Override
	public BaseResponse<List<CommentResponse>> getParentCommentsByComic(String comicId, int page, int limit) {
		ValidationUtils.checkNullId(comicId);
		Pageable pageable = PaginationUtils.createPageable(page, limit);
		Page<Comment> comments = commentRepository.findByComicIdAndParentIsNullAndStatus(
				comicId, CommentStatus.ACTIVE, pageable);

		List<CommentResponse> commentResponses = comments.getContent().stream()
				.map(comment -> {
					CommentResponse response = convertToResponse(comment);
					// Lấy replies cho mỗi parent comment
					List<Comment> replies = commentRepository.findByParentIdAndStatus(
							comment.getId(),
							CommentStatus.ACTIVE);
					List<CommentResponse> replyResponses = replies.stream()
							.map(this::convertToResponse)
							.collect(Collectors.toList());
					response.setReplies(replyResponses);
					response.setRepliesCount((long) replies.size());
					return response;
				})
				.sorted(Comparator.comparing(CommentResponse::getCreatedAt).reversed())
				.collect(Collectors.toList());

		return BaseResponse.success(
				commentResponses,
				page,
				(int) comments.getTotalElements(),
				limit,
				comments.getTotalPages());
	}

	@Override
	public BaseResponse<List<CommentResponse>> getRepliesByParentId(String parentId) {
		ValidationUtils.checkNullId(parentId);
		List<Comment> replies = commentRepository.findByParentIdAndStatus(parentId, CommentStatus.ACTIVE);

		List<CommentResponse> replyResponses = replies.stream()
				.map(this::convertToResponse)
				.collect(Collectors.toList());

		return BaseResponse.success(replyResponses);
	}

	@Override
	public BaseResponse<CommentResponse> getCommentById(String id) {
		ValidationUtils.checkNullId(id);
		Comment comment = commentRepository.findById(id)
				.orElseThrow(() -> new BaseException(ErrorCode.COMMENT_NOT_FOUND));

		CommentResponse response = convertToResponse(comment);
		// Lấy replies nếu đây là parent comment
		if (comment.getParent() == null) {
			List<Comment> replies = commentRepository.findByParentIdAndStatus(comment.getId(),
					CommentStatus.ACTIVE);
			List<CommentResponse> replyResponses = replies.stream()
					.map(this::convertToResponse)
					.collect(Collectors.toList());
			response.setReplies(replyResponses);
			response.setRepliesCount((long) replies.size());
		}

		return BaseResponse.success(response);
	}

	@Override
	public BaseResponse<CommentResponse> createComment(CommentRequest request, String userId) {
		// Validate user
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new BaseException(ErrorCode.USER_NOT_FOUND));

		// Validate comic
		Comic comic = comicRepository.findById(request.getComicId())
				.orElseThrow(() -> new BaseException(ErrorCode.COMIC_NOT_FOUND));

		// Validate chapter if provided
		Chapter chapter = null;
		if (request.getChapterId() != null) {
			chapter = chapterRepository.findById(request.getChapterId())
					.orElseThrow(() -> new BaseException(ErrorCode.CHAPTER_NOT_FOUND));
		}

		// Validate parent comment if provided
		Comment parentComment = null;
		if (request.getParentId() != null) {
			parentComment = commentRepository.findById(request.getParentId())
					.orElseThrow(() -> new BaseException(ErrorCode.COMMENT_PARENT_NOT_FOUND));

			// Kiểm tra parent comment phải thuộc cùng comic
			if (!parentComment.getComic().getId().equals(request.getComicId())) {
				throw new BaseException(ErrorCode.COMMENT_PARENT_INVALID);
			}
		}

		// Tạo comment mới
		Comment comment = new Comment();
		comment.setContent(request.getContent());
		comment.setStatus(CommentStatus.ACTIVE);
		comment.setUser(user);
		comment.setComic(comic);
		comment.setChapter(chapter);
		comment.setParent(parentComment);

		Comment savedComment = commentRepository.save(comment);
		CommentResponse response = convertToResponse(savedComment);

		return BaseResponse.success(response, "Tạo bình luận thành công!");
	}

	@Override
	public BaseResponse<String> deleteComment(String id, String userId) {
		ValidationUtils.checkNullId(id);

		Comment comment = commentRepository.findById(id)
				.orElseThrow(() -> new BaseException(ErrorCode.COMMENT_NOT_FOUND));

		// Kiểm tra quyền sở hữu hoặc quyền ADMIN
		if (!comment.getUser().getId().equals(userId) && !securityUtils.isCurrentUserAdmin()) {
			throw new BaseException(ErrorCode.COMMENT_ACCESS_DENIED);
		}

		// Soft delete - chuyển status thành DELETED
		comment.setStatus(CommentStatus.DELETED);
		commentRepository.save(comment);

		return BaseResponse.success("Xóa bình luận thành công!");
	}

	@Override
	public BaseResponse<String> blockComment(String id) {
		ValidationUtils.checkNullId(id);

		Comment comment = commentRepository.findById(id)
				.orElseThrow(() -> new BaseException(ErrorCode.COMMENT_NOT_FOUND));

		if (comment.getStatus() == CommentStatus.BLOCKED) {
			throw new BaseException(ErrorCode.COMMENT_ALREADY_BLOCKED);
		}

		comment.setStatus(CommentStatus.BLOCKED);
		commentRepository.save(comment);

		return BaseResponse.success("Chặn bình luận thành công!");
	}

	@Override
	public BaseResponse<String> unblockComment(String id) {
		ValidationUtils.checkNullId(id);

		Comment comment = commentRepository.findById(id)
				.orElseThrow(() -> new BaseException(ErrorCode.COMMENT_NOT_FOUND));

		comment.setStatus(CommentStatus.ACTIVE);
		commentRepository.save(comment);

		return BaseResponse.success("Bỏ chặn bình luận thành công!");
	}

	@Override
	public BaseResponse<Long> countCommentsByComic(String comicId) {
		ValidationUtils.checkNullId(comicId);
		long count = commentRepository.countByComicIdAndStatus(comicId, CommentStatus.ACTIVE);
		return BaseResponse.success(count);
	}

	@Override
	public BaseResponse<Long> countCommentsByChapter(String chapterId) {
		ValidationUtils.checkNullId(chapterId);
		long count = commentRepository.countByChapterIdAndStatus(chapterId, CommentStatus.ACTIVE);
		return BaseResponse.success(count);
	}

	/**
	 * Chuyển đổi Comment entity thành CommentResponse DTO
	 */
	private CommentResponse convertToResponse(Comment comment) {
		if (comment == null) {
			return null;
		}

		LevelInfo levelInfo = comment.getUser().getLevel() != null ? LevelInfo.builder()
				.id(comment.getUser().getLevel().getId())
				.levelNumber(comment.getUser().getLevel().getLevelNumber())
				.name(comment.getUser().getLevel().getName())
				.color(comment.getUser().getLevel().getColor())
				.urlGif(comment.getUser().getLevel().getUrlGif())
				.build() : null;

		UserInfo userInfo = comment.getUser() != null ? UserInfo.builder()
				.id(comment.getUser().getId())
				.username(comment.getUser().getUsername())
				.imgUrl(comment.getUser().getImgUrl())
				.vip(comment.getUser().getVip())
				.level(levelInfo)
				.build() : null;

		ComicInfo comicInfo = comment.getComic() != null ? ComicInfo.builder()
				.id(comment.getComic().getId())
				.name(comment.getComic().getName())
				.slug(comment.getComic().getSlug())
				.thumbUrl(comment.getComic().getThumbUrl())
				.build() : null;

		ChapterInfo chapterInfo = comment.getChapter() != null ? ChapterInfo.builder()
				.id(comment.getChapter().getId())
				.title(comment.getChapter().getTitle())
				.chapterNumber(comment.getChapter().getChapterNumber())
				.build() : null;

		UserInfo parentUserInfo = comment.getParent() != null ? UserInfo.builder()
				.id(comment.getParent().getUser().getId())
				.username(comment.getParent().getUser().getUsername())
				.imgUrl(comment.getParent().getUser().getImgUrl())
				.vip(comment.getParent().getUser().getVip())
				.build() : null;

		ParentCommentInfo parentInfo = comment.getParent() != null ? ParentCommentInfo.builder()
				.id(comment.getParent().getId())
				.content(comment.getParent().getContent())
				.user(parentUserInfo)
				.build() : null;

		return CommentResponse.builder()
				.id(comment.getId())
				.content(comment.getContent())
				.status(comment.getStatus())
				.createdAt(comment.getCreatedAt())
				.updatedAt(comment.getUpdatedAt())
				.user(userInfo)
				.comic(comicInfo)
				.chapter(chapterInfo)
				.parent(parentInfo)
				.build();
	}
}