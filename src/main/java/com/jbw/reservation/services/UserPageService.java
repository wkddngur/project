package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.mappers.ReservationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserPageService {
    private final ReservationMapper reservationMapper;

    @Autowired
    public UserPageService(ReservationMapper reservationMapper) {
        this.reservationMapper = reservationMapper;
    }

    public ReservationHistoryDto[] getReservationList(String userEmail) {
        return this.reservationMapper.selectReservedHistoryByUserEmail(userEmail);
    }
}
