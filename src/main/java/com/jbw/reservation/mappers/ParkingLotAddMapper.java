package com.jbw.reservation.mappers;

import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ParkingLotImageEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParkingLotAddMapper {

    int insertParkingLot(ParkingLotEntity parkingLotsRegister);

    int insertParkingLotImage(ParkingLotImageEntity parkingLotImage);

//    int deleteParkingLot(int index);

    ParkingLotEntity selectParkingLotByAddress(
            @Param("addressPostal") String addressPostal,
            @Param("addressPrimary") String addressPrimary);
}
