package com.jbw.reservation.controllers;

import com.jbw.reservation.entities.ContractorEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.SessionAttribute;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/contractor")
public class ContractorPageController {

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getContractor(@SessionAttribute(value = "contractor", required = false) ContractorEntity contractor) {
        ModelAndView modelAndView = new ModelAndView("contractor/contractorPage");
        if (contractor == null) {
            modelAndView.addObject("result", null);
            return modelAndView;
        }
        modelAndView.addObject("contractor", contractor);
        return modelAndView;
    }
}
