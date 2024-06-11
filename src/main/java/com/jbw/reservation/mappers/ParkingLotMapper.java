package com.jbw.reservation.mappers;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.ParkingLotEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParkingLotMapper {
    ParkingLotDto[] selectParkingLotDtoByCoords(@Param("minLat") double minLat,
                                                @Param("minLng") double minLng,
                                                @Param("maxLat") double maxLat,
                                                @Param("maxLng") double maxLng);

    ParkingLotEntity selectParkingLotByIndex(@Param("index") int index);
}
