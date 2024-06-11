package com.jbw.reservation.controllers;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ParkingLotImageEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.contractorPage.ParkingLotAddResult;
import com.jbw.reservation.services.ParkingLotAddService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
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
                                         @RequestParam("_images") MultipartFile[] images,
                                         ParkingLotEntity parkingLot) throws IOException {
        parkingLot.setThumbnail(thumbnail.getBytes());
        parkingLot.setThumbnailFileName(thumbnail.getOriginalFilename());
        parkingLot.setThumbnailContentType(thumbnail.getContentType());

        JSONObject responseObject = new JSONObject();
        Result result = this.parkingLotAddService.parkingLotRegister(contractor, images, parkingLot);
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

}
