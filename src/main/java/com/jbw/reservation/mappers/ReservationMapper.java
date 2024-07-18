package com.jbw.reservation.mappers;

import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.PaymentEntity;
import com.jbw.reservation.entities.RefundEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Mapper
public interface ReservationMapper {
    int insertPayment(PaymentEntity payment);

    int insertRefund(RefundEntity refund);

    int insertReservationHistory(ReservationHistoryEntity reservationHistory);

    int selectReservedCount(ReservationHistoryEntity reservationHistory);

    int selectRefundsCountByPIndex(@Param("parkingLotIndex") int parkingLotIndex);

    int selectRefundsUnsolvedCountByPIndex(@Param("parkingLotIndex") int parkingLotIndex);

    int updatePayment(PaymentEntity payment);

    int updateRefund(RefundEntity refund);

    int updateReservationHistory(ReservationHistoryEntity reservationHistory);

    ReservationHistoryEntity[] selectReservedHistoryByNow(@Param("parkingLotIndex") int parkingLotIndex,
                                                          @Param("today") LocalDate reqDate);

    ReservationHistoryEntity selectReservedHistoryByPIndexTime(
            @Param("parkingLotIndex") int parkingLotIndex,
            @Param("userEmail") String userEmail,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime);

    ReservationHistoryDto[] getReservedHistoryByPIndex(@Param("parkingLotIndex") int parkingLotIndex);

    ReservationHistoryDto[] selectReservedHistoryByUserEmail(@Param("userEmail") String userEmail);

    PaymentEntity selectPaymentByIndex(@Param("paymentIndex") Integer paymentIndex);

    RefundEntity selectRefundByIndex(@Param("refundIndex") Integer refundIndex);

    ReservationHistoryEntity selectReservedHistoryByPaymentIndex(@Param("paymentIndex") int paymentIndex);
}
