package com.jbw.reservation.mappers;

import com.jbw.reservation.entities.ParkingLotRegisterEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParkingLotAddMapper {

    int insertParkingLot(ParkingLotRegisterEntity parkingLotsRegister);

    ParkingLotRegisterEntity selectParkingLotByAddress(
            @Param("addressPostal") String addressPostal,
            @Param("addressPrimary") String addressPrimary);
}
