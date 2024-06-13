package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ParkingLotImageEntity;
import com.jbw.reservation.services.ParkingLotService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(value = "/parkingLot")
public class ParkingLotController {
    private final ParkingLotService parkingLotService;

    @Autowired
    public ParkingLotController(ParkingLotService parkingLotService) {
        this.parkingLotService = parkingLotService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ParkingLotDto getParkingLotDetailAside(@RequestParam("index") int index) {
        return this.parkingLotService.getParkingLotDetailAside(index);
    }

    @RequestMapping(value = "/image", method = RequestMethod.GET)
    @ResponseBody
    public ResponseEntity<byte[]> getParkingLotDetailAsideImage(@RequestParam(value = "index", required = false, defaultValue = "0") int parkingLotImageIndex) {
        ParkingLotImageEntity dbParkingLotImage = this.parkingLotService.getParkingLotDetailAsideImage(parkingLotImageIndex);

        if (dbParkingLotImage == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentLength(dbParkingLotImage.getData().length)
                .contentType(MediaType.parseMediaType(dbParkingLotImage.getContentType()))
                .body(dbParkingLotImage.getData());
    }

    @RequestMapping(value = "/byCoords", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ParkingLotDto[] getByCoords(@RequestParam("minLat") double minLat,
                                       @RequestParam("minLng") double minLng,
                                       @RequestParam("maxLat") double maxLat,
                                       @RequestParam("maxLng") double maxLng) {
        return this.parkingLotService.getByCoords(minLat, minLng, maxLat, maxLng);
    }

    @RequestMapping(value = "thumbnail", method = RequestMethod.GET)
    public ResponseEntity<byte[]> getThumbnail(@RequestParam("index") int index) {
        ParkingLotEntity parkingLot = this.parkingLotService.getThumbnail(index);

        if (parkingLot == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(parkingLot.getThumbnailContentType()))
                .contentLength(parkingLot.getThumbnail().length)
                .body(parkingLot.getThumbnail());
    }
}
