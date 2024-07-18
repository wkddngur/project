package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.ParkingLotDto;
import com.jbw.reservation.entities.SearchHistoryEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.services.HomeService;
import jakarta.servlet.http.HttpSession;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/")
public class HomeController {
    private final HomeService homeService;

    @Autowired
    public HomeController(HomeService homeService) {
        this.homeService = homeService;
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getIndex() {
        return new ModelAndView("home/index");
    }

    @RequestMapping(value = "/search", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ParkingLotDto[] getSearch(@SessionAttribute("user") UserEntity user,
                                     SearchHistoryEntity searchHistory) {
        return this.homeService.search(user.getEmail(), searchHistory);
    }
}
