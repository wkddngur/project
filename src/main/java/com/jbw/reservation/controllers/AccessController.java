package com.jbw.reservation.controllers;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.EmailAuthEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.services.AccessService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpSession;
import org.apache.catalina.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.security.NoSuchAlgorithmException;

@Controller
@RequestMapping(value = "/access")
public class AccessController {

    private final AccessService accessService;

    @Autowired
    public AccessController(AccessService accessService) {
        this.accessService = accessService;
    }

    // 로그인 화면을 띄우기 위한 GET 맵핑.
    @RequestMapping(value = "/", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getLogin(@SessionAttribute(value = "contractor", required = false) ContractorEntity contractor,
                                 @SessionAttribute(value = "user", required = false) UserEntity user) {
        ModelAndView modelAndView = new ModelAndView("access/login");
        return modelAndView;
    }

    // 로그인 버튼 요청 맵핑 세션에 접속자 저장까지.
    @RequestMapping(value = "/userLogin", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postLogin(HttpSession session, UserEntity user) {
        Result result = this.accessService.userLogin(user);

        if (result == CommonResult.SUCCESS) {
            session.setAttribute("user", user);
        }
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    // 협력업체 로그인 버튼 요청 맵핑 접속자 저장까지.
    @RequestMapping(value = "/contractorLogin", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postContractorLogin(HttpSession session, ContractorEntity contractor) {
        Result result = this.accessService.contractorLogin(contractor);

        if (result == CommonResult.SUCCESS) {
            session.setAttribute("contractor", contractor);
        }

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    // 로그인 화면에서 회원가입으로 이동하기위한 GET 맵핑.
    @RequestMapping(value = "/register", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRegister() {
        ModelAndView modelAndView = new ModelAndView("access/register");
        return modelAndView;
    }

    // 회원가입 화면에서 개인 회원가입 페이지로 이동하기 위한 GET 맵핑.
    @RequestMapping(value = "/register/userRegister", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getUserRegister() {
        ModelAndView modelAndView = new ModelAndView("access/userRegister");
        return modelAndView;
    }

    // 회원가입에서 이메일로 인증번호 전송 버튼을 눌렀을 때의 맵핑.
    @RequestMapping(value = "/register/userRegisterEmailSend", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRegisterEmailSend(EmailAuthEntity emailAuth) throws MessagingException, NoSuchAlgorithmException {
        Result result = this.accessService.sendEmailRegister(emailAuth);

        JSONObject responseObject = new JSONObject();
        if (result == CommonResult.SUCCESS) {
            responseObject.put("result", result.name().toLowerCase());
            responseObject.put("salt", emailAuth.getSalt());
            return responseObject.toString();
        } else {
            responseObject.put("result", result.name().toLowerCase());
            responseObject.put("email", emailAuth.getEmail());
            return responseObject.toString();
        }
    }

    // 회원가입에서 인증번호 확인 버튼을 눌렀을 때의 맵핑.
    @RequestMapping(value = "/register/userRegisterEmailCodeVerify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRegisterEmailCodeVerify(EmailAuthEntity emailAuth) {
        Result result = this.accessService.verifyEmailCode(emailAuth);

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());

        return responseObject.toString();
    }

    // 회원가입 버튼을 눌렀을때의 POST 요청 메서드.
    @RequestMapping(value = "/register/userRegister/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postUserRegister(EmailAuthEntity emailAuth, UserEntity user) {
        Result result = this.accessService.userRegister(emailAuth, user);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    // 협력업체 회원가입 페이지를 위한 GET 맵핑.
    @RequestMapping(value = "/register/contractorRegister", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getContractorRegister() {
        ModelAndView modelAndView = new ModelAndView("access/contractorRegister");
        return modelAndView;
    }

    // 협력업체 회원가입에서 이메일로 인증번호 전송 버튼을 눌렀을 때의 맵핑.
    @RequestMapping(value = "/contractorRegisterEmailSend", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postContractorRegisterEmailSend(EmailAuthEntity emailAuth) throws MessagingException, NoSuchAlgorithmException {
        Result result = this.accessService.sendEmailContractorRegister(emailAuth);

        JSONObject responseObject = new JSONObject();
        if (result == CommonResult.SUCCESS) {
            responseObject.put("result", result.name().toLowerCase());
            responseObject.put("salt", emailAuth.getSalt());
            return responseObject.toString();
        } else {
            responseObject.put("result", result.name().toLowerCase());
            responseObject.put("email", emailAuth.getEmail());
            return responseObject.toString();
        }
    }

    // 협력업체 회원가입에서 인증번호 확인 버튼을 눌렀을 때의 맵핑.
    @RequestMapping(value = "/contractorRegisterEmailCodeVerify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchContractorEmailCodeVerify(EmailAuthEntity emailAuth) {
        Result result = this.accessService.verifyEmailCode(emailAuth);

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());

        return responseObject.toString();
    }

    // 협력업체 회원가입 버튼을 눌렀을때의 POST 요청 메서드.
    @RequestMapping(value = "/contractorRegister/", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postContractorRegister(EmailAuthEntity emailAuth, ContractorEntity contractor) {
        Result result = this.accessService.ContractorRegister(emailAuth, contractor);
        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }

    // 아이디 조회 및 비밀번호 변경할 수 있는 페이지로 이동하는 맵핑.
    @RequestMapping(value = "/recover", method = RequestMethod.GET, produces = MediaType.TEXT_HTML_VALUE)
    public ModelAndView getRecover() {
        ModelAndView modelAndView = new ModelAndView("access/recover");
        return modelAndView;
    }

    // 이름, 성별, 생년월일로 이메일 찾기를 위한 맵핑.
    @RequestMapping(value = "/recover/emailFind", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecoverEmailFind(@RequestParam(value = "name") String name,
                                       @RequestParam(value = "gender") String gender,
                                       @RequestParam(value = "ssnBirth") String ssnBirth) {

        JSONObject responseObject = new JSONObject();

        String userEmail = this.accessService.findEmail(name, gender, ssnBirth);

        if (userEmail == null) {
            responseObject.put("result", "failure");
            return responseObject.toString();
        } else {
            responseObject.put("result", "success");
            responseObject.put("email", userEmail);
            return responseObject.toString();
        }
    }

    // 비밀번호 재설정에서 이메일로 인증번호 전송 버튼을 눌렀을 때의 맵핑.
    @RequestMapping(value = "/recover/resetPasswordEmailSend", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String postRecoverResetPasswordEmailSend(EmailAuthEntity emailAuth) throws MessagingException, NoSuchAlgorithmException {
        Result result = this.accessService.sendEmailResetPassword(emailAuth);

        JSONObject responseObject = new JSONObject();
        if (result == CommonResult.SUCCESS) {
            responseObject.put("result", result.name().toLowerCase());
            responseObject.put("salt", emailAuth.getSalt());
            return responseObject.toString();
        } else {
            responseObject.put("result", result.name().toLowerCase());
            responseObject.put("email", emailAuth.getEmail());
            return responseObject.toString();
        }
    }

    // 비밀번호 재설정에서 인증번호 확인 버튼을 눌렀을 때의 맵핑.
    @RequestMapping(value = "/recover/resetPasswordEmailCodeVerify", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchRecoverResetPasswordEmailCodeVerify(EmailAuthEntity emailAuth) {
        Result result = this.accessService.verifyEmailCode(emailAuth);

        JSONObject responseObject = new JSONObject();
        responseObject.put("result", result.name().toLowerCase());

        return responseObject.toString();
    }

    // 비밀번호 재설정에서 비밀번호 재설정 버튼을 눌렀을 떄의 맵핑.
    @RequestMapping(value = "/recover/resetPassword", method = RequestMethod.PATCH, produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public String patchResetPassword(EmailAuthEntity emailAuth,
                                     UserEntity user) {
        Result result = this.accessService.resetPassword(emailAuth, user);

        JSONObject responseObject = new JSONObject();

        responseObject.put("result", result.name().toLowerCase());
        return responseObject.toString();
    }


}
