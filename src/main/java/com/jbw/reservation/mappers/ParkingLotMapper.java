package com.jbw.reservation.mappers;

import com.jbw.reservation.entities.ParkingLotRegisterEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParkingLotMapper {
    ParkingLotRegisterEntity[] selectParkingLotByCoords(@Param("minLat") double minLat,
                                                        @Param("minLng") double minLng,
                                                        @Param("maxLat") double maxLat,
                                                        @Param("maxLng") double maxLng);

    ParkingLotRegisterEntity selectParkingLotByIndex(@Param("index") int index);
}
