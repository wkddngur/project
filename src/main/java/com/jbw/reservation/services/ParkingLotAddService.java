package com.jbw.reservation.services;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ParkingLotImageEntity;
import com.jbw.reservation.mappers.ParkingLotAddMapper;
import com.jbw.reservation.regexes.ParkingLotRegex;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.contractorPage.ParkingLotAddResult;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Arrays;

@Service
public class ParkingLotAddService {
    private final ParkingLotAddMapper parkingLotAddMapper;

    @Autowired
    public ParkingLotAddService(ParkingLotAddMapper parkingLotAddMapper) {
        this.parkingLotAddMapper = parkingLotAddMapper;
    }

    @Transactional
    public Result parkingLotRegister(ContractorEntity contractor,
                                     MultipartFile[] images,
                                     ParkingLotEntity parkingLot) throws IOException {
        if (contractor == null) {
            return ParkingLotAddResult.FAILURE_NOT_CONTRACTOR_LOGIN;
        }

        if (!(images.length > 2)) {
            return ParkingLotAddResult.FAILURE_NOT_IMAGES_COUNT;
        }

        if (parkingLot == null ||
                !ParkingLotRegex._name.tests(parkingLot.getName()) ||
                !ParkingLotRegex.contactFirst.tests(parkingLot.getContactFirst()) ||
                !ParkingLotRegex.contactSecond.tests(parkingLot.getContactSecond()) ||
                !ParkingLotRegex.contactThird.tests(parkingLot.getContactThird()) ||
                !ParkingLotRegex.addressPostal.tests(parkingLot.getAddressPostal()) ||
                !ParkingLotRegex.addressPrimary.tests(parkingLot.getAddressPrimary()) ||
                !ParkingLotRegex.parkingCapacity.tests(parkingLot.getGeneralCarNumber()) ||
                !ParkingLotRegex.parkingCapacity.tests(parkingLot.getDpCarNumber()) ||
                !ParkingLotRegex.price.tests(parkingLot.getPrice()) ||
                !ParkingLotRegex.price.tests(parkingLot.getDayMaxPrice())) {
            return CommonResult.FAILURE;
        }

        if (this.parkingLotAddMapper.selectParkingLotByAddress(
                parkingLot.getAddressPostal(),
                parkingLot.getAddressPrimary()) != null) {
            return ParkingLotAddResult.FAILURE_DUPLICATE_ADDRESS;
        }

        if (!ParkingLotRegex.description.tests(parkingLot.getDescription())) {
            return ParkingLotAddResult.FAILURE_DUPLICATE_DESCRIPTION;
        }

        parkingLot.setCreatedAt(LocalDateTime.now());
        parkingLot.setModifiedAt(null);
        parkingLot.setDeleted(false);

        this.parkingLotAddMapper.insertParkingLot(parkingLot);

        for (int i = 0; i < images.length; i++) {
            ParkingLotImageEntity parkingLotImage = new ParkingLotImageEntity();
            parkingLotImage.setParkingLotIndex(parkingLot.getIndex());
            parkingLotImage.setData(images[i].getBytes());
            parkingLotImage.setName(images[i].getOriginalFilename());
            parkingLotImage.setContentType(images[i].getContentType());
            this.parkingLotAddMapper.insertParkingLotImage(parkingLotImage);
        }

        return CommonResult.SUCCESS;
    }

}
