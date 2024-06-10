package com.jbw.reservation.services;

import com.jbw.reservation.entities.ParkingLotRegisterEntity;
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

    public ParkingLotRegisterEntity[] getByCoords(double minLat, double minLng, double maxLat, double maxLng) {
        return this.parkingLotMapper.selectParkingLotByCoords(minLat, minLng, maxLat, maxLng);
    }

    public ParkingLotRegisterEntity getThumbnail(int index) {
        return this.parkingLotMapper.selectParkingLotByIndex(index);
    }
}
