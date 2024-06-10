package com.jbw.reservation.controllers;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotRegisterEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.ParkingLotAddService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Controller
@RequestMapping(value = "/contractor/parkingLotAdd")
public class ParkingLotAddController {

    private final ParkingLotAddService parkingLotAddService;

    @Autowired
    public ParkingLotAddController(ParkingLotAddService parkingLotAddService) {
        this.parkingLotAddService = parkingLotAddService;
    }

    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postParkingLotRegister(@SessionAttribute(value = "contractor") ContractorEntity contractor,
                                         @RequestParam("_thumbnail") MultipartFile thumbnail,
                                         ParkingLotRegisterEntity parkingLotRegister) throws IOException {
        parkingLotRegister.setThumbnail(thumbnail.getBytes());
        parkingLotRegister.setThumbnailFileName(thumbnail.getOriginalFilename());
        parkingLotRegister.setThumbnailContentType(thumbnail.getContentType());

        JSONObject responseObject = new JSONObject();
        Result result = this.parkingLotAddService.parkingLotRegister(contractor, parkingLotRegister);
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

}
