package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.ReservationHistoryDto;
import com.jbw.reservation.entities.RefundEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.UserPageService;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/userPage")
public class userPageController {
    private final UserPageService userPageService;

    @Autowired
    public userPageController(UserPageService userPageService) {
        this.userPageService = userPageService;
    }

    // userpage를 보여주기 위한 GET 맵핑
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView get(HttpSession session) {
        ModelAndView modelAndView = new ModelAndView("user/userPage");

        return modelAndView;
    }

    @RequestMapping(value = "/reservedHistoryList", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ReservationHistoryDto[] getReservationList(@RequestParam("userEmail") String userEmail) {
        return this.userPageService.getReservationList(userEmail);
    }

    @RequestMapping(value = "/refund", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postInsertRefund(RefundEntity refund) {
        Result result = this.userPageService.insertRefund(refund);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }


}
