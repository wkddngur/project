package com.jbw.reservation.controllers;

import com.jbw.reservation.dtos.ArticleDto;
import com.jbw.reservation.dtos.PageSetDto;
import com.jbw.reservation.entities.ArticleEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.services.GeneralBoardService;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping(value = "/generalBoard")
public class GeneralBoardController {

    private final GeneralBoardService generalBoardService;

    @Autowired
    public GeneralBoardController(GeneralBoardService generalBoardService) {
        this.generalBoardService = generalBoardService;
    }

    @RequestMapping(value = "/generalArticleWriteCheck", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean generalArticleWriteCheck(@SessionAttribute("user") UserEntity user) {
        return user.isAdmin();
    }

    @RequestMapping(value = "/generalArticleWrite", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String generalArticleWrite(@SessionAttribute("user") UserEntity user,
                                      ArticleEntity article) {
        Result result = this.generalBoardService.generalArticleWrite(user, article);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/generalArticles", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String getGeneralArticles(@RequestParam(value = "page", required = false, defaultValue = "1") int page,
                                     @RequestParam(value = "boardCode") String boardCode) {
        PageSetDto pageSet = new PageSetDto();
        pageSet.setRequestPage(page);

        ArticleDto[] generalArticles = this.generalBoardService.getGeneralArticles(pageSet, boardCode);
        JSONObject responseObject = new JSONObject();
        responseObject.put("generalArticles", generalArticles);
        responseObject.put("maxPage", pageSet.getMaxPage());
        responseObject.put("minPage", pageSet.getMinPage());
        return responseObject.toString();
    }

    @RequestMapping(value = "/generalArticleRead", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ArticleEntity generalArticleRead(int index) {
        return this.generalBoardService.getGeneralArticleRead(index);
    }

    @RequestMapping(value = "/rightByDeleteModify", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public boolean postRightByDeleteModify(@SessionAttribute("user") UserEntity user,
                                           @RequestParam("userEmail") String userEmail) {
        return this.generalBoardService.RightByDeleteModify(user, userEmail);
    }

    @RequestMapping(value = "/generalArticleModify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String generalArticleModify(@SessionAttribute("user") UserEntity user,
                                       ArticleEntity article) {
        Result result = this.generalBoardService.generalArticleModify(user, article);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    @RequestMapping(value = "/generalArticleDelete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String generalArticleDelete(@SessionAttribute("user") UserEntity user,
                                       @RequestParam("index") Integer index) {
        Result result = this.generalBoardService.generalArticleDelete(user, index);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }
}
