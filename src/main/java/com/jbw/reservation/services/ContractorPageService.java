package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.*;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.ParkingLotMapper;
import com.jbw.reservation.mappers.ReservationMapper;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.contractorPage.ParkingLotAddResult;
import com.jbw.reservation.results.contractorPage.ReservedPaymentStatusResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContractorPageService {
    private final ParkingLotMapper parkingLotMapper;
    private final ReservationMapper reservationMapper;
    private final AccessMapper accessMapper;

    @Autowired
    public ContractorPageService(ParkingLotMapper parkingLotMapper, ReservationMapper reservationMapper, AccessMapper accessMapper) {
        this.parkingLotMapper = parkingLotMapper;
        this.reservationMapper = reservationMapper;
        this.accessMapper = accessMapper;
    }

    public ParkingLotDto[] getParkingLotList(String contractorEmail) {
        return this.parkingLotMapper.selectParkingLotByContractorEmail(contractorEmail);
    }

    public ReservationHistoryDto[] getReservedHistoryDto(int parkingLotIndex) {
        return this.reservationMapper.getReservedHistoryByPIndex(parkingLotIndex);
    }

    public int getRefundsCountByPIndex(int parkingLotIndex) {
        return this.reservationMapper.selectRefundsCountByPIndex(parkingLotIndex);
    }

    public int getRefundsUnsolvedCountByIndex(int parkingLotIndex) {
        return this.reservationMapper.selectRefundsUnsolvedCountByPIndex(parkingLotIndex);
    }

    @Transactional
    public Result patchPaymentStatus(ContractorEntity contractor,
                                     Integer paymentIndex) {
        if (contractor == null) {
            return ParkingLotAddResult.FAILURE_NOT_CONTRACTOR_LOGIN;
        }

        if (paymentIndex == null || paymentIndex < 0) {
            return CommonResult.FAILURE;
        }

        ContractorEntity dbContractor = this.accessMapper.selectContractorByEmail(contractor.getEmail());
        PaymentEntity dbPayment = this.reservationMapper.selectPaymentByIndex(paymentIndex);
        ParkingLotEntity dbParkingLot = this.parkingLotMapper.selectParkingLotByIndex(dbPayment.getParkingLotIndex());

        if (!dbParkingLot.getContractorEmail().equals(dbContractor.getEmail())) {
            return ReservedPaymentStatusResult.FAILURE_NOT_SAME_CONTRACTOR_EMAIL;
        }

        if (dbPayment.isAgree()) {
            return ReservedPaymentStatusResult.FAILURE_REQUEST_ALREADY_PROCESSED;
        }

        dbPayment.setAgree(true);

        int updateResult = this.reservationMapper.updatePayment(dbPayment);

        if (updateResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

    @Transactional
    public Result patchRefundStatus(ContractorEntity contractor,
                                    Integer refundIndex) {
        if (contractor == null) {
            return ParkingLotAddResult.FAILURE_NOT_CONTRACTOR_LOGIN;
        }

        if (refundIndex == null || refundIndex < 0) {
            return CommonResult.FAILURE;
        }

        ContractorEntity dbContractor = this.accessMapper.selectContractorByEmail(contractor.getEmail());
        RefundEntity dbRefund = this.reservationMapper.selectRefundByIndex(refundIndex);
        ParkingLotEntity dbParkingLot = this.parkingLotMapper.selectParkingLotByIndex(dbRefund.getParkingLotIndex());

        if (!dbParkingLot.getContractorEmail().equals(dbContractor.getEmail())) {
            return ReservedPaymentStatusResult.FAILURE_NOT_SAME_CONTRACTOR_EMAIL;
        }

        if (dbRefund.isAgree()) {
            return ReservedPaymentStatusResult.FAILURE_REQUEST_ALREADY_PROCESSED;
        }

        dbRefund.setAgree(true);

        int updateResult = this.reservationMapper.updateRefund(dbRefund);

        if (updateResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }
}
