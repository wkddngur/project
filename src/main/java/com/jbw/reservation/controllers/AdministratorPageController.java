package com.jbw.reservation.controllers;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.AdministratorPageService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
@RequestMapping(value = "/administratorPage")
public class AdministratorPageController {
    private final AdministratorPageService administratorPageService;

    @Autowired
    public AdministratorPageController(AdministratorPageService administratorPageService) {
        this.administratorPageService = administratorPageService;
    }

    @RequestMapping(value = "/userAdminCheck", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean postUserAdminCheck(@SessionAttribute("user") UserEntity user) {
        return user.isAdmin();
    }

    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getAdministratorPage() {
        ModelAndView modelAndView = new ModelAndView("administrator/administratorPage");
        return modelAndView;
    }

    @RequestMapping(value = "/contractorList", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ContractorEntity[] getContractorList(@SessionAttribute("user") UserEntity user) {
        return this.administratorPageService.ContractorList(user);
    }

    @RequestMapping(value = "/approvedConfirm", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchApprovedConfirm(@SessionAttribute("user") UserEntity user,
                                       @RequestParam("email") String email) {
        Result result = this.administratorPageService.ApprovedConfirm(user, email);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }
}
