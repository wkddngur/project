package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.mappers.ParkingLotMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ParkingLotService {
    private final ParkingLotMapper parkingLotMapper;

    @Autowired
    public ParkingLotService(ParkingLotMapper parkingLotMapper) {
        this.parkingLotMapper = parkingLotMapper;
    }

    public ParkingLotDto[] getByCoords(double minLat, double minLng, double maxLat, double maxLng) {
        return this.parkingLotMapper.selectParkingLotDtoByCoords(minLat, minLng, maxLat, maxLng);
    }

    public ParkingLotEntity getThumbnail(int index) {
        return this.parkingLotMapper.selectParkingLotByIndex(index);
    }
}
