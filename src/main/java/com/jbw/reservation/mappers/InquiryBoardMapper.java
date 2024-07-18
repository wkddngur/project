package com.jbw.reservation.mappers;

import com.jbw.reservation.dtos.InquiryArticleDto;
import com.jbw.reservation.entities.InquiryArticleEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface InquiryBoardMapper {
    int insertInquiryArticle(InquiryArticleEntity inquiryArticle);

    int selectInquiryArticleCount();

    int updateInquiryArticle(InquiryArticleEntity inquiryArticle);

    InquiryArticleDto[] selectInquiryArticles(@Param("countPerPage") int countPerPage,
                                              @Param("offset") int offset);

    InquiryArticleEntity selectInquiryArticleByIAI(@Param("index") int index);
}
