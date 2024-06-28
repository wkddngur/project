package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.ParkingLotMapper;
import com.jbw.reservation.mappers.ReservationMapper;
import org.springframework.stereotype.Service;

@Service
public class ContractorPageService {
    private final ParkingLotMapper parkingLotMapper;
    private final ReservationMapper reservationMapper;

    public ContractorPageService(ParkingLotMapper parkingLotMapper, ReservationMapper reservationMapper) {
        this.parkingLotMapper = parkingLotMapper;
        this.reservationMapper = reservationMapper;
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
}
