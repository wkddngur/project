package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.*;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.ParkingLotMapper;
import com.jbw.reservation.mappers.ReservationMapper;
import com.jbw.reservation.regexes.ReservationRegex;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.reservation.ReservationResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class UserPageService {
    private final ReservationMapper reservationMapper;
    private final AccessMapper accessMapper;
    private final ParkingLotMapper parkingLotMapper;

    @Autowired
    public UserPageService(ReservationMapper reservationMapper, AccessMapper accessMapper, ParkingLotMapper parkingLotMapper) {
        this.reservationMapper = reservationMapper;
        this.accessMapper = accessMapper;
        this.parkingLotMapper = parkingLotMapper;
    }

    public ReservationHistoryDto[] getReservationList(String userEmail) {
        return this.reservationMapper.selectReservedHistoryByUserEmail(userEmail);
    }

    @Transactional
    public Result insertRefund(RefundEntity refund) {
        if (refund == null ||
                refund.getBankCode() == null ||
                (!refund.getBankCode().equals("NHN") && !refund.getBankCode().equals("DGB"))) {
            return CommonResult.FAILURE;
        }

        if (refund.getBankAccountNumber() == null ||
        !ReservationRegex.bankAccountNumber.tests(refund.getBankAccountNumber())) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(refund.getUserEmail());

        if (dbUser == null || dbUser.isSuspended() || dbUser.isDeleted()) {
            return ReservationResult.FAILURE_USER_SUSPENDED_OR_DELETED;
        }

        ParkingLotEntity dbParkingLot = this.parkingLotMapper.selectParkingLotByIndex(refund.getParkingLotIndex());

        if (dbParkingLot == null) {
            return ReservationResult.FAILURE_PARKING_LOT_NOT_FOUND;
        }

        PaymentEntity dbPayment = this.reservationMapper.selectPaymentByIndex(refund.getPaymentIndex());

        if (dbPayment == null) {
            return ReservationResult.FAILURE_PAYMENT_NOT_FOUND;
        }

        ReservationHistoryEntity dbReservedHistory = this.reservationMapper.selectReservedHistoryByPaymentIndex(dbPayment.getIndex());

        if (!dbReservedHistory.getUserEmail().equals(refund.getUserEmail())) {
            return ReservationResult.FAILURE_USER_EMAIL_MISMATCH;
        }

        if (dbReservedHistory.getRefundIndex() != null) {
            return ReservationResult.FAILURE_DUPLICATE_REFUND;
        }

        refund.setParkingLotIndex(dbPayment.getParkingLotIndex());
        refund.setPaymentIndex(dbPayment.getIndex());
        refund.setAmount(dbPayment.getAmount());
        refund.setCreatedAt(LocalDateTime.now());
        refund.setAgree(false);

        this.reservationMapper.insertRefund(refund);

        dbReservedHistory.setRefundIndex(refund.getIndex());

        if (this.reservationMapper.updateReservationHistory(dbReservedHistory) > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }
}
