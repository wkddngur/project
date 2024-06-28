package com.jbw.reservation.mappers;

import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.PaymentEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Mapper
public interface ReservationMapper {
    int insertPayment(PaymentEntity payment);

    int insertReservationHistory(ReservationHistoryEntity reservationHistory);

    int selectReservedCount(ReservationHistoryEntity reservationHistory);

    int selectRefundsCountByPIndex(int parkingLotIndex);

    int selectRefundsUnsolvedCountByPIndex(int parkingLotIndex);

    ReservationHistoryEntity[] selectReservedHistoryByNow(@Param("parkingLotIndex") int parkingLotIndex,
                                                          @Param("today") LocalDate reqDate);

    ReservationHistoryEntity selectReservedHistoryByPindexTime(
            @Param("parkingLotIndex") int parkingLotIndex,
            @Param("userEmail") String userEmail,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);

    ReservationHistoryDto[] getReservedHistoryByPIndex(int parkingLotIndex);
}
