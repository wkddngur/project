package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.ContractorPageService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/contractor")
public class ContractorPageController {
    private final ContractorPageService contractorPageService;

    @Autowired
    public ContractorPageController(ContractorPageService contractorPageService) {
        this.contractorPageService = contractorPageService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getContractorPage(
            @SessionAttribute(value = "user", required = false) UserEntity user,
            @SessionAttribute(value = "contractor", required = false) ContractorEntity contractor) {
        ModelAndView modelAndView = new ModelAndView("contractor/contractorPage");

        modelAndView.addObject("contractor", contractor);
        return modelAndView;
    }

    @RequestMapping(value = "/parkingLotList", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ParkingLotDto[] getParkingLotList(@SessionAttribute("contractor") ContractorEntity contractor) {
        return this.contractorPageService.getParkingLotList(contractor.getEmail());
    }

    @RequestMapping(value = "/reservedHistoryByPIndex", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getReservedHistory(@RequestParam("parkingLotIndex") int parkingLotIndex) {
        ReservationHistoryDto[] reservedHistoryArray = this.contractorPageService.getReservedHistoryDto(parkingLotIndex);
        int totalRefundCount = this.contractorPageService.getRefundsCountByPIndex(parkingLotIndex);
        int totalRefundUnsolvedCount = this.contractorPageService.getRefundsUnsolvedCountByIndex(parkingLotIndex);
        JSONObject responseObject = new JSONObject();
        responseObject.put("reservedHistoryArray", reservedHistoryArray);
        responseObject.put("totalRefundCount", totalRefundCount);
        responseObject.put("totalRefundUnsolvedCount", totalRefundUnsolvedCount);

        return responseObject.toString();
    }

    @RequestMapping(value = "/patchPaymentStatus", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchPaymentStatus(@SessionAttribute(value = "contractor") ContractorEntity contractor,
                                     @RequestParam("paymentIndex") int paymentIndex) {
        Result result = this.contractorPageService.patchPaymentStatus(contractor, paymentIndex);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/patchRefundStatus", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRefundStatus(@SessionAttribute(value = "contractor") ContractorEntity contractor,
                                    @RequestParam("refundIndex") int refundIndex) {
        Result result = this.contractorPageService.patchRefundStatus(contractor, refundIndex);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

}
