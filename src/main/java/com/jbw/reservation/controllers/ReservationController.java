package com.jbw.reservation.controllers;

import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.ReservationService;
import org.json.JSONObject;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;

@Controller
@RequestMapping(value = "/reservation")
public class ReservationController {
    private final ReservationService reservationService;

    public ReservationController(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // 세션에서 userEmail 끌어와야댐
    @RequestMapping(value = "/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postReservation(@RequestParam(value = "startDateTimeString") String startDateTimeString,
                                  @RequestParam(value = "endDateTimeString") String endDateTimeString,
                                  ReservationHistoryEntity reservationHistory) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        LocalDateTime startDateTime = LocalDateTime.parse(startDateTimeString, formatter);
        LocalDateTime endDateTime = LocalDateTime.parse(endDateTimeString, formatter);

        reservationHistory.setStartDateTime(startDateTime);
        reservationHistory.setEndDateTime(endDateTime);

        Result result = this.reservationService.postReservation(reservationHistory);

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/reservedHistory", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getReservedHistory(@RequestParam("parkingLotIndex") int parkingLotIndex,
                                     @RequestParam("date") String date) {
        LocalDate reqDate = LocalDate.parse(date);

        String reservedAllIndexes = this.reservationService.getReservedHistory(parkingLotIndex, reqDate);
        JSONObject responseObject = new JSONObject();
        responseObject.put("reservedAllIndexes", reservedAllIndexes);
        return responseObject.toString();
    }
}
