package com.jbw.reservation.services;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ParkingLotImageEntity;
import com.jbw.reservation.mappers.ParkingLotMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class ParkingLotService {
    private final ParkingLotMapper parkingLotMapper;

    @Autowired
    public ParkingLotService(ParkingLotMapper parkingLotMapper) {
        this.parkingLotMapper = parkingLotMapper;
    }

    public ParkingLotDto getParkingLotDetailAside(int index) {
        if (index < 1) {
            return new ParkingLotDto();
        }

        ParkingLotDto dbParkingLot = this.parkingLotMapper.selectParkingLotDetailAsideByIndex(index);

        ParkingLotImageEntity[] dbParkingLotImages = this.parkingLotMapper.selectParkingLotImageByParkingLotIndex(index);
        ;

        int[] imageIndexes = new int[dbParkingLotImages.length];
        for (int i = 0; i < dbParkingLotImages.length; i++) {
            imageIndexes[i] = dbParkingLotImages[i].getIndex();
        }

        dbParkingLot.setImageIndexes(imageIndexes);
//        Arrays.stream(dbParkingLotImages).mapToInt(ParkingLotImageEntity::getIndex).toArray()

        return dbParkingLot;
    }

    public ParkingLotImageEntity getParkingLotDetailAsideImage(int parkingLotImageIndex) {
        if (parkingLotImageIndex < 1) {
            return null;
        }
        return this.parkingLotMapper.selectParkingLotImageByIndex(parkingLotImageIndex);
    }

    public ParkingLotDto[] getByCoords(double minLat, double minLng, double maxLat, double maxLng) {
        return this.parkingLotMapper.selectParkingLotDtoByCoords(minLat, minLng, maxLat, maxLng);
    }

    public ParkingLotEntity getThumbnail(int index) {
        return this.parkingLotMapper.selectParkingLotByIndex(index);
    }
}
