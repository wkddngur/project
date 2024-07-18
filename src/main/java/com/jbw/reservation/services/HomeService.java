package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.SearchHistoryEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.ParkingLotMapper;
import com.jbw.reservation.mappers.SearchMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class HomeService {
    private final ParkingLotMapper parkingLotMapper;
    private final SearchMapper searchMapper;
    private final AccessMapper accessMapper;

    @Autowired
    public HomeService(ParkingLotMapper parkingLotMapper, SearchMapper searchMapper, AccessMapper accessMapper) {
        this.parkingLotMapper = parkingLotMapper;
        this.searchMapper = searchMapper;
        this.accessMapper = accessMapper;
    }

    public ParkingLotDto[] search(String userEmail, SearchHistoryEntity searchHistory) {
        searchHistory.setUserEmail(userEmail);
        searchHistory.setCreatedAt(LocalDateTime.now());

        this.searchMapper.insertSearchHistory(searchHistory);

        return this.parkingLotMapper.selectParkingLotDtoByKeyword(searchHistory.getKeyword());
    }
}
