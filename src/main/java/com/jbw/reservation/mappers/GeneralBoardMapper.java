package com.jbw.reservation.mappers;

import com.jbw.reservation.dtos.ArticleDto;
import com.jbw.reservation.entities.ArticleEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface GeneralBoardMapper {

    int insertGeneralArticle(ArticleEntity article);

    int selectGeneralArticleCount(@Param("boardCode") String boardCode);

    int updateGeneralArticleView(ArticleEntity article);


    ArticleDto[] selectGeneralArticles(@Param("boardCode") String boardCode,
                                       @Param("countPerPage") int countPerPage,
                                       @Param("offset") int offset);

    ArticleEntity selectGeneralArticleReadIndex(@Param("index") int index);


}
