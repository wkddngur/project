package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.InquiryArticleDto;
import com.jbw.reservation.dtos.PageSetDto;
import com.jbw.reservation.entities.ArticleEntity;
import com.jbw.reservation.entities.InquiryArticleEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.InquiryBoardService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/inquiryBoard")
public class InquiryBoardController {

    private final InquiryBoardService inquiryBoardService;

    @Autowired
    public InquiryBoardController(InquiryBoardService inquiryBoardService) {
        this.inquiryBoardService = inquiryBoardService;
    }

    @RequestMapping(value = "/inquiryArticleWrite", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String inquiryArticleWrite(@SessionAttribute("user") UserEntity user,
                                      InquiryArticleEntity inquiryArticle) {
        Result result = this.inquiryBoardService.inquiryArticleWrite(user, inquiryArticle);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/inquiryArticles", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getInquiryArticles(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                     @SessionAttribute("user") UserEntity user) {
        PageSetDto pageSet = new PageSetDto();
        pageSet.setRequestPage(page);

        InquiryArticleDto[] inquiryArticles = this.inquiryBoardService.getInquiryArticles(pageSet);
        JSONObject responseObject = new JSONObject();
        responseObject.put("inquireArticles", inquiryArticles);
        responseObject.put("maxPage", pageSet.getMaxPage());
        responseObject.put("minPage", pageSet.getMinPage());
        responseObject.put("admin", user.isAdmin());
        responseObject.put("accessorEmail", user.getEmail());

        return responseObject.toString();
    }

    @RequestMapping(value = "/inquiryArticle", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public InquiryArticleEntity getInquiryArticleViewUpdate(@RequestParam("index") int index) {
        return this.inquiryBoardService.InquiryArticleViewUpdate(index);
    }

    @RequestMapping(value = "/rightByDeleteModify", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean postRightByDeleteModify(@SessionAttribute("user") UserEntity user,
                                           @RequestParam("userEmail") String userEmail) {
        return this.inquiryBoardService.RightByDeleteModify(user, userEmail);
    }

    @RequestMapping(value = "/inquiryArticleModify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String inquiryArticleModify(@SessionAttribute("user") UserEntity user,
                                       InquiryArticleEntity inquiryArticle) {
        Result result = this.inquiryBoardService.inquiryArticleModify(user, inquiryArticle);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/inquiryArticleDelete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String inquiryArticleDelete(@SessionAttribute("user") UserEntity user,
                                       @RequestParam("index") Integer index) {
        Result result = this.inquiryBoardService.inquiryArticleDelete(user, index);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }
}
