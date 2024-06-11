package com.jbw.reservation.mappers;

import com.jbw.reservation.entities.ParkingLotEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParkingLotAddMapper {

    int insertParkingLot(ParkingLotEntity parkingLotsRegister);

    ParkingLotEntity selectParkingLotByAddress(
            @Param("addressPostal") String addressPostal,
            @Param("addressPrimary") String addressPrimary);
}
