package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.services.ContractorPageService;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/contractor")
public class ContractorPageController {
    private final ContractorPageService contractorPageService;

    public ContractorPageController(ContractorPageService contractorPageService) {
        this.contractorPageService = contractorPageService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getContractorPage(@SessionAttribute(value = "contractor", required = false) ContractorEntity contractor) {
        ModelAndView modelAndView = new ModelAndView("contractor/contractorPage");
        if (contractor == null) {
            modelAndView.addObject("result", null);
            return modelAndView;
        }
        modelAndView.addObject("contractor", contractor);
        return modelAndView;
    }

    @RequestMapping(value = "/parkingLotList", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ParkingLotDto[] getParkingLotList(@RequestParam("contractorEmail") String contractorEmail) {
        return this.contractorPageService.getParkingLotList(contractorEmail);
    }

    @RequestMapping(value = "/reservedHistoryByPIndex", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getReservedHistory(@RequestParam("parkingLotIndex") int parkingLotIndex) {
        ReservationHistoryDto[] reservedHistoryArray = this.contractorPageService.getReservedHistoryDto(parkingLotIndex);
        int totalRefundCount = this.contractorPageService.getRefundsCountByPIndex(parkingLotIndex);
        int totalRefundUnsolvedCount = this.contractorPageService.getRefundsUnsolvedCountByIndex(parkingLotIndex);
        JSONObject responseObject = new JSONObject();
        responseObject.put("reservedHistoryArray", reservedHistoryArray);
        responseObject.put("totalRefundCount" ,totalRefundCount);
        responseObject.put("totalRefundUnsolvedCount", totalRefundUnsolvedCount);

        return responseObject.toString();
    }

}
