package com.jbw.reservation.services;

import com.jbw.reservation.dtos.InquiryArticleDto;
import com.jbw.reservation.dtos.PageSetDto;
import com.jbw.reservation.entities.InquiryArticleEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.InquiryBoardMapper;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.board.ArticleModifyResult;
import com.jbw.reservation.results.board.ArticleWriteResult;
import com.jbw.reservation.results.reservation.ReservationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.logging.StreamHandler;

@Service
public class InquiryBoardService {
    private final InquiryBoardMapper inquiryBoardMapper;
    private final AccessMapper accessMapper;

    @Autowired
    public InquiryBoardService(InquiryBoardMapper inquiryBoardMapper, AccessMapper accessMapper) {
        this.inquiryBoardMapper = inquiryBoardMapper;
        this.accessMapper = accessMapper;
    }

    @Transactional
    public Result inquiryArticleWrite(UserEntity user, InquiryArticleEntity inquiryArticle) {
        if (user == null || inquiryArticle == null) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null) {
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        if (inquiryArticle.getTitle() == null || inquiryArticle.getContent() == null ||
                inquiryArticle.getTitle().length() > 100 || inquiryArticle.getTitle().isEmpty() ||
                inquiryArticle.getContent().length() > 1000 || inquiryArticle.getContent().isEmpty()) {
            return ArticleWriteResult.FAILURE_EXCEED_NUMBER_CHARACTER;
        }

        inquiryArticle.setUserEmail(dbUser.getEmail());
        inquiryArticle.setView(0);
        inquiryArticle.setCreatedAt(LocalDateTime.now());
        inquiryArticle.setModifiedAt(null);
        inquiryArticle.setDeleted(false);

        int inquiryArticleInsertResult = this.inquiryBoardMapper.insertInquiryArticle(inquiryArticle);

        if (inquiryArticleInsertResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

    public InquiryArticleDto[] getInquiryArticles(PageSetDto pageSet) {
        pageSet.setTotalCount(this.inquiryBoardMapper.selectInquiryArticleCount());
        pageSet.setMaxPage((pageSet.getTotalCount()) / pageSet.getCountPerPage() + (pageSet.getTotalCount() % pageSet.getCountPerPage() == 0 ? 0 : 1));
        if (pageSet.getMaxPage() < 1) {
            pageSet.setMaxPage(1);
        }
        pageSet.setMinPage(1);
        pageSet.setOffset(pageSet.getCountPerPage() * (pageSet.getRequestPage() - 1));

        return this.inquiryBoardMapper.selectInquiryArticles(pageSet.getCountPerPage(), pageSet.getOffset());
    }

    public InquiryArticleEntity InquiryArticleViewUpdate(int index) {
        return this.InquiryArticleViewUpdate(index, true);
    }

    public InquiryArticleEntity InquiryArticleViewUpdate(int index, boolean addView) {
        InquiryArticleEntity dbInquiryArticle = this.inquiryBoardMapper.selectInquiryArticleByIAI(index);

        if (addView) {
            dbInquiryArticle.setView(dbInquiryArticle.getView() + 1);
            this.inquiryBoardMapper.updateInquiryArticle(dbInquiryArticle);
        }
        return dbInquiryArticle;
    }

    public boolean RightByDeleteModify(UserEntity user,
                                       String userEmail) {
        UserEntity dbUser = this.accessMapper.selectUserByEmail(userEmail);

        if (user == null || dbUser == null) {
            return false;
        }

        return user.getEmail().equals(userEmail);
    }

    @Transactional
    public Result inquiryArticleModify(UserEntity user,
                                       InquiryArticleEntity inquiryArticle) {
        if (user == null || inquiryArticle == null) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null) {
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        InquiryArticleEntity dbInquiryArticle = this.inquiryBoardMapper.selectInquiryArticleByIAI(inquiryArticle.getIndex());

        if (dbInquiryArticle == null) {
            return ArticleModifyResult.FAILURE_NOT_FOUND_ARTICLE; // 게시글을 찾을 수 없다 리턴
        }

        if (!dbUser.getEmail().equals(dbInquiryArticle.getUserEmail())) {
            return ArticleModifyResult.FAILURE_MISMATCH_USER_EMAIL; // 작성자와 접근자가 다르다 리턴
        }

        if (inquiryArticle.getTitle() == null || inquiryArticle.getContent() == null ||
                inquiryArticle.getTitle().length() > 100 || inquiryArticle.getTitle().isEmpty() ||
                inquiryArticle.getContent().length() > 1000 || inquiryArticle.getContent().isEmpty()) {
            return ArticleWriteResult.FAILURE_EXCEED_NUMBER_CHARACTER;
        }

        inquiryArticle.setUserEmail(dbInquiryArticle.getUserEmail());
        inquiryArticle.setView(dbInquiryArticle.getView());
        inquiryArticle.setCreatedAt(dbInquiryArticle.getCreatedAt());
        inquiryArticle.setModifiedAt(LocalDateTime.now());
        inquiryArticle.setDeleted(dbInquiryArticle.isDeleted());
        inquiryArticle.setAgree(dbInquiryArticle.isAgree());

        int modifyInquiryArticleResult = this.inquiryBoardMapper.updateInquiryArticle(inquiryArticle);

        if (modifyInquiryArticleResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

    @Transactional
    public Result inquiryArticleDelete(UserEntity user,
                                       Integer index) {
        if (user == null || index == null || index < 1) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null) {
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        InquiryArticleEntity dbInquiryArticle = this.inquiryBoardMapper.selectInquiryArticleByIAI(index);

        if (dbInquiryArticle == null) {
            return ArticleModifyResult.FAILURE_NOT_FOUND_ARTICLE; // 게시글을 찾을 수 없다 리턴
        }

        if (!dbUser.getEmail().equals(dbInquiryArticle.getUserEmail())) {
            return ArticleModifyResult.FAILURE_MISMATCH_USER_EMAIL;
        }

        dbInquiryArticle.setDeleted(true);

        int deleteInquiryArticleResult = this.inquiryBoardMapper.updateInquiryArticle(dbInquiryArticle);

        if (deleteInquiryArticleResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }
}
