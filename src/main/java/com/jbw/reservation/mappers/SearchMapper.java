package com.jbw.reservation.mappers;

import com.jbw.reservation.entities.SearchHistoryEntity;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface SearchMapper {

    int insertSearchHistory(SearchHistoryEntity searchHistory);
}
