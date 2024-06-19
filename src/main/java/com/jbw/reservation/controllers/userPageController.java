package com.jbw.reservation.controllers;

import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/userPage")
public class userPageController {



    // userpage를 보여주기 위한 GET 맵핑
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView get() {
        ModelAndView modelAndView = new ModelAndView("user/userPage");
        return modelAndView;
    }
}
