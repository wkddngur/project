package com.jbw.reservation.mappers;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ParkingLotImageEntity;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ParkingLotMapper {

    ParkingLotDto selectParkingLotDetailAsideByIndex(@Param("index") int index);

    ParkingLotDto[] selectParkingLotDtoByCoords(@Param("minLat") double minLat,
                                                @Param("minLng") double minLng,
                                                @Param("maxLat") double maxLat,
                                                @Param("maxLng") double maxLng);

    ParkingLotDto[] selectParkingLotDtoByKeyword(@Param("keyword") String keyword);

    ParkingLotImageEntity selectParkingLotImageByIndex(@Param("index") int index);

    ParkingLotImageEntity[] selectParkingLotImageByParkingLotIndex(@Param("parkingLotIndex") int parkingLotIndex);

    ParkingLotEntity selectParkingLotByIndex(@Param("index") int index);
}
