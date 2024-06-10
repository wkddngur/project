package com.jbw.reservation.services;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotRegisterEntity;
import com.jbw.reservation.mappers.ParkingLotAddMapper;
import com.jbw.reservation.regexes.ParkingLotRegisterRegex;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.contractorPage.ParkingLotAddResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class ParkingLotAddService {
    private final ParkingLotAddMapper parkingLotAddMapper;

    @Autowired
    public ParkingLotAddService(ParkingLotAddMapper parkingLotAddMapper) {
        this.parkingLotAddMapper = parkingLotAddMapper;
    }

    @Transactional
    public Result parkingLotRegister(ContractorEntity contractor,
                                     ParkingLotRegisterEntity parkingLotRegister) {
        if (contractor == null) {
            return ParkingLotAddResult.FAILURE_NOT_CONTRACTOR_LOGIN;
        }

        if (parkingLotRegister == null ||
                !ParkingLotRegisterRegex.name.tests(parkingLotRegister.getName()) ||
                !ParkingLotRegisterRegex.contactFirst.tests(parkingLotRegister.getContactFirst()) ||
                !ParkingLotRegisterRegex.contactSecond.tests(parkingLotRegister.getContactSecond()) ||
                !ParkingLotRegisterRegex.contactThird.tests(parkingLotRegister.getContactThird()) ||
                !ParkingLotRegisterRegex.addressPostal.tests(parkingLotRegister.getAddressPostal()) ||
                !ParkingLotRegisterRegex.addressPrimary.tests(parkingLotRegister.getAddressPrimary())) {
            return CommonResult.FAILURE;
        }

        if (this.parkingLotAddMapper.selectParkingLotByAddress(
                parkingLotRegister.getAddressPostal(),
                parkingLotRegister.getAddressPrimary()) != null) {
            return ParkingLotAddResult.FAILURE_DUPLICATE_ADDRESS;
        }

        if (!ParkingLotRegisterRegex.description.tests(parkingLotRegister.getDescription())) {
            return ParkingLotAddResult.FAILURE_DUPLICATE_DESCRIPTION;
        }

        parkingLotRegister.setCreatedAt(LocalDateTime.now());
        parkingLotRegister.setModifiedAt(null);

        int parkingLotRegisterResult = this.parkingLotAddMapper.insertParkingLot(parkingLotRegister);

        if (parkingLotRegisterResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

}
