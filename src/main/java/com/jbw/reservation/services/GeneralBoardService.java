package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ArticleDto;
import com.jbw.reservation.dtos.PageSetDto;
import com.jbw.reservation.entities.ArticleEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.GeneralBoardMapper;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.board.ArticleModifyResult;
import com.jbw.reservation.results.board.ArticleWriteResult;
import com.jbw.reservation.results.reservation.ReservationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class GeneralBoardService {

    private final GeneralBoardMapper generalBoardMapper;
    private final AccessMapper accessMapper;

    @Autowired
    public GeneralBoardService(GeneralBoardMapper generalBoardMapper, AccessMapper accessMapper) {
        this.generalBoardMapper = generalBoardMapper;
        this.accessMapper = accessMapper;
    }

    @Transactional
    public Result generalArticleWrite(UserEntity user, ArticleEntity article) {
        if (user == null || article == null) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null) {
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        if (article.getTitle() == null || article.getContent() == null ||
            article.getTitle().length() > 100 || article.getTitle().isEmpty() ||
            article.getContent().length() > 1000 || article.getContent().isEmpty()) {
            return ArticleWriteResult.FAILURE_EXCEED_NUMBER_CHARACTER;
        }

        article.setUserEmail(dbUser.getEmail());
        article.setView(0);
        article.setCreatedAt(LocalDateTime.now());
        article.setModifiedAt(null);
        article.setDeleted(false);

        int generalArticleInsertResult = this.generalBoardMapper.insertGeneralArticle(article);

        if (generalArticleInsertResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

    public ArticleDto[] getGeneralArticles(PageSetDto pageSet, String boardCode) {
        pageSet.setTotalCount(this.generalBoardMapper.selectGeneralArticleCount(boardCode));
        pageSet.setMaxPage((pageSet.getTotalCount()) / pageSet.getCountPerPage() + (pageSet.getTotalCount() % pageSet.getCountPerPage() == 0 ? 0 : 1));
        if (pageSet.getMaxPage() < 1) {
            pageSet.setMaxPage(1);
        }
        pageSet.setMinPage(1);
        pageSet.setOffset(pageSet.getCountPerPage() * (pageSet.getRequestPage() - 1));

        return this.generalBoardMapper.selectGeneralArticles(boardCode, pageSet.getCountPerPage(), pageSet.getOffset());
    }

    public ArticleEntity getGeneralArticleRead(int index) {
        return getGeneralArticleRead(index, true);
    }

    public ArticleEntity getGeneralArticleRead(int index, boolean addView) {
        ArticleEntity updateView = this.generalBoardMapper.selectGeneralArticleReadIndex(index);

        if (addView) {
            updateView.setView(updateView.getView() + 1);
            this.generalBoardMapper.updateGeneralArticleView(updateView);
        }
        return updateView;
    }

    public boolean RightByDeleteModify(UserEntity user, String userEmail) {

        UserEntity dbUser = this.accessMapper.selectUserByEmail(userEmail);

        if (user == null || dbUser == null) {
            return false;
        }

        return user.getEmail().equals(userEmail);
    }

    @Transactional
    public Result generalArticleModify(UserEntity user, ArticleEntity article) {
        if (user == null || article == null) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());
        if (dbUser == null) {
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        ArticleEntity dbArticle = this.generalBoardMapper.selectGeneralArticleReadIndex(article.getIndex());

        if (dbArticle == null) {
            return ArticleModifyResult.FAILURE_NOT_FOUND_ARTICLE; // 게시글을 찾을 수 없다 리턴
        }

        if (!dbUser.getEmail().equals(dbArticle.getUserEmail())) {
            return ArticleModifyResult.FAILURE_MISMATCH_USER_EMAIL; // 작성자와 접근자가 다르다 리턴
        }

        if (article.getTitle() == null || article.getContent() == null ||
            article.getTitle().length() > 100 || article.getTitle().isEmpty() ||
            article.getContent().length() > 1000 || article
                    .getContent().isEmpty()) {
            return ArticleWriteResult.FAILURE_EXCEED_NUMBER_CHARACTER;
        }

        article.setBoardCode(dbArticle.getBoardCode());
        article.setUserEmail(dbArticle.getUserEmail());
        article.setView(dbArticle.getView());
        article.setCreatedAt(dbArticle.getCreatedAt());
        article.setModifiedAt(LocalDateTime.now());
        article.setDeleted(dbArticle.isDeleted());

        int modifyGeneralArticleResult = this.generalBoardMapper.updateGeneralArticleView(article);

        if (modifyGeneralArticleResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

    @Transactional
    public Result generalArticleDelete(UserEntity user,
                                       Integer index) {
        if (user == null || index == null || index < 1) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null) {
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        ArticleEntity dbArticle = this.generalBoardMapper.selectGeneralArticleReadIndex(index);

        if (dbArticle == null) {
            return ArticleModifyResult.FAILURE_NOT_FOUND_ARTICLE; // 게시글을 찾을 수 없다 리턴
        }

        if (!dbUser.getEmail().equals(dbArticle.getUserEmail())) {
            return ArticleModifyResult.FAILURE_MISMATCH_USER_EMAIL;
        }

        dbArticle.setDeleted(true);

        int deleteGeneralArticleResult = this.generalBoardMapper.updateGeneralArticleView(dbArticle);

        if (deleteGeneralArticleResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }
}
