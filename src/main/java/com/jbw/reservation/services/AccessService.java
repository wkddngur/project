package com.jbw.reservation.services;

import com.jbw.reservation.entities.ContractorEntity;
import com.jbw.reservation.entities.EmailAuthEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.misc.MailSender;
import com.jbw.reservation.regexes.ContractorRegex;
import com.jbw.reservation.regexes.EmailAuthRegex;
import com.jbw.reservation.regexes.UserRegex;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.*;
import jakarta.mail.MessagingException;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.token.Sha512DigestUtils;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Objects;

@Service
public class AccessService {
    // 이메일 전송 시 랜덤 숫자 지정 및 sha512 암호화 과정을 따로 빼두어서 깔끔하게 사용하기 위해 뺴둠.
    private static void prepareEmailAuth(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException {
        emailAuth.setCode(RandomStringUtils.randomNumeric(6));
        emailAuth.setSalt(Sha512DigestUtils.shaHex(String.format("%s%s%f%f",
                emailAuth.getEmail(),
                emailAuth.getCode(),
                SecureRandom.getInstanceStrong().nextDouble(),
                SecureRandom.getInstanceStrong().nextDouble())));
        emailAuth.setCreatedAt(LocalDateTime.now());
        emailAuth.setExpiresAt(LocalDateTime.now().plusMinutes(3));
        emailAuth.setExpired(false);
        emailAuth.setVerified(false);
        emailAuth.setUsed(false);
    }

    private final AccessMapper accessMapper;
    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Autowired
    public AccessService(AccessMapper accessMapper, JavaMailSender mailSender, SpringTemplateEngine templateEngine) {
        this.accessMapper = accessMapper;
        this.mailSender = mailSender;
        this.templateEngine = templateEngine;
    }

    // 이메일 인증코드를 보내기 위한 메서드. db 결과 email 중복이 없을 때 사용하는 메서드.
    public Result sendEmailRegister(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.accessMapper.selectUserByEmail(emailAuth.getEmail()) != null) {
            return SendRegisterEmailResult.FAILURE_DUPLICATE_EMAIL;
        }

        prepareEmailAuth(emailAuth);

        if (this.accessMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }

        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("jbw5387@naver.com")
                .setSubject("[] 회원가입 인증번호")
                .setTo(emailAuth.getEmail())
                .setText(this.templateEngine.process("htmlMailSend/registerEmail", context), true)
                .send();

        return CommonResult.SUCCESS;
    }

    // 이메일 인증코드를 보내기 위한 메서드. db 결과 email 중복이 없을 때 사용하는 메서드.
    public Result sendEmailContractorRegister(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.accessMapper.selectContractorByEmail(emailAuth.getEmail()) != null) {
            return SendRegisterEmailResult.FAILURE_DUPLICATE_EMAIL;
        }

        prepareEmailAuth(emailAuth);

        if (this.accessMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }

        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("jbw5387@naver.com")
                .setSubject("[] 협력업체 회원가입 인증번호")
                .setTo(emailAuth.getEmail())
                .setText(this.templateEngine.process("htmlMailSend/contractorRegisterEmail", context), true)
                .send();

        return CommonResult.SUCCESS;
    }

    // 이메일 인증코드를 보내기 위한 메서드. db 결과 email 중복이 있을 때 사용하는 메서드.(비밀번호 찾기)
    public Result sendEmailResetPassword(EmailAuthEntity emailAuth) throws NoSuchAlgorithmException, MessagingException {
        if (emailAuth == null || !EmailAuthRegex.email.tests(emailAuth.getEmail())) {
            return CommonResult.FAILURE;
        }
        if (this.accessMapper.selectUserByEmail(emailAuth.getEmail()) == null) {
            return CommonResult.FAILURE;
        }

        prepareEmailAuth(emailAuth);

        if (this.accessMapper.insertEmailAuth(emailAuth) != 1) {
            return CommonResult.FAILURE;
        }

        Context context = new Context();
        context.setVariable("code", emailAuth.getCode());
        new MailSender(this.mailSender)
                .setFrom("jbw5387@naver.com")
                .setSubject("[] 비밀번호 재설정 인증번호")
                .setTo(emailAuth.getEmail())
                .setText(this.templateEngine.process("htmlMailSend/resetPasswordEmail", context), true)
                .send();

        return CommonResult.SUCCESS;
    }

    // 이메일 인증번호 확인을 위한 메서드.
    public Result verifyEmailCode(EmailAuthEntity emailAuth) {
        if (emailAuth == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt())) {
            return CommonResult.FAILURE;
        }

        EmailAuthEntity dbEmailAuthResult = this.accessMapper.selectEmailAuthEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());

        if (dbEmailAuthResult == null || dbEmailAuthResult.isVerified() || dbEmailAuthResult.isUsed()) {
            return CommonResult.FAILURE;
        }

        if (dbEmailAuthResult.isExpired() || dbEmailAuthResult.getExpiresAt().isBefore(LocalDateTime.now())) {
            return VerifyEmailAuthResult.FAILURE_EXPIRED;
        }
        dbEmailAuthResult.setVerified(true);

        return this.accessMapper.updateEmailAuth(dbEmailAuthResult) > 0
                ? CommonResult.SUCCESS
                : CommonResult.FAILURE;
    }

    // 로그인을 위한 메서드.
    @Transactional
    public Result userLogin(UserEntity user) {
        //이메일과 password 검증 코드
        if (user == null ||
                !UserRegex.email.tests(user.getEmail()) ||
                !UserRegex.password.tests(user.getPassword())) {
            return CommonResult.FAILURE;
        }

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());
        //데이터 베이스에서 사용자가 없거나 삭제된 상태이면
        if (dbUser == null || dbUser.isDeleted()) {
            return CommonResult.FAILURE;
        }
        //사용자가 이용이 정지된 상태인가
        if (dbUser.isSuspended()) {
            return LoginResult.FAILURE_SUSPENDED;
        }

        //비밀번호 확인할때 복호화
        boolean passwordComparison = BCrypt.checkpw(user.getPassword(), dbUser.getPassword());

        if (!passwordComparison) {
            return CommonResult.FAILURE;
        }

        user.setSsnBirth(dbUser.getSsnBirth());
        user.setEmail(dbUser.getEmail());
        user.setPassword(dbUser.getPassword());
        user.setNickname(dbUser.getNickname());
        user.setCreatedAt(dbUser.getCreatedAt());
        user.setAdmin(dbUser.isAdmin());
        user.setDeleted(dbUser.isDeleted());
        user.setSuspended(dbUser.isSuspended());
        user.setAgree(dbUser.isAgree());

        return CommonResult.SUCCESS;
    }

    @Transactional
    public Result contractorLogin(ContractorEntity contractor) {
        // 이메일과 password 검증 코드
        if (contractor == null ||
                !UserRegex.email.tests(contractor.getEmail()) ||
                !UserRegex.password.tests(contractor.getPassword())) {
            return CommonResult.FAILURE;
        }
        // 데이터 베이스에서 사용자가 없거나 삭제된 상태이면
        ContractorEntity dbContractor = this.accessMapper.selectContractorByEmail(contractor.getEmail());
        if (dbContractor == null || dbContractor.isDeleted()) {
            return CommonResult.FAILURE;
        }
        // 사용자가 이용이 정지된 상태인가
        if (dbContractor.isSuspended()) {
            return LoginResult.FAILURE_SUSPENDED;
        }
        // 비밀번호 확인할때 복호화
        boolean passwordComparison = BCrypt.checkpw(contractor.getPassword(), dbContractor.getPassword());

        if (!passwordComparison) {
            return CommonResult.FAILURE;
        }

        contractor.setContractorName(dbContractor.getContractorName());
        contractor.setContactFirst(dbContractor.getContactFirst());
        contractor.setContactSecond(dbContractor.getContactSecond());
        contractor.setContactThird(dbContractor.getContactThird());
        contractor.setTinFirst(dbContractor.getTinFirst());
        contractor.setTinSecond(dbContractor.getTinSecond());
        contractor.setTinThird(dbContractor.getTinThird());
        contractor.setCreatedAt(dbContractor.getCreatedAt());
        contractor.setDeleted(dbContractor.isDeleted());
        contractor.setSuspended(dbContractor.isSuspended());
        contractor.setAgree(dbContractor.isAgree());

        return CommonResult.SUCCESS;
    }

    // 회원가입 수행을 위한 메서드.
    @Transactional
    public Result userRegister(EmailAuthEntity emailAuth, UserEntity user) {
        if (emailAuth == null || user == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
                !UserRegex.password.tests(user.getPassword()) ||
                !UserRegex.email.tests(user.getEmail()) ||
                !UserRegex._name.tests(user.getName()) ||
                !UserRegex.nickname.tests(user.getNickname()) ||
                !UserRegex.ssnBirth.tests(user.getSsnBirth())) {
            return CommonResult.FAILURE;
        }

        EmailAuthEntity dbEmailAuth = this.accessMapper.selectEmailAuthEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt()
        );

        if (dbEmailAuth == null || !dbEmailAuth.isVerified() || dbEmailAuth.isUsed()) {
            return CommonResult.FAILURE;
        }

        if (this.accessMapper.selectUserByEmail(user.getEmail()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_EMAIL;
        }

        if (this.accessMapper.selectUserByNickname(user.getNickname()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_NICKNAME;
        }

        user.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setDeleted(false);
        user.setSuspended(false);
        user.setAdmin(false);
        user.setAgree(user.isAgree());

        this.accessMapper.insertUser(user);

        dbEmailAuth.setUsed(true);
        this.accessMapper.updateEmailAuth(dbEmailAuth);

        return CommonResult.SUCCESS;
    }

    // 협력업체 회원가입을 위한 메서드.
    @Transactional
    public Result ContractorRegister(EmailAuthEntity emailAuth, ContractorEntity contractor) {
        if (emailAuth == null || contractor == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
                !ContractorRegex.email.tests(contractor.getEmail()) ||
                !ContractorRegex.password.tests(contractor.getPassword()) ||
                !ContractorRegex.contractorName.tests(contractor.getContractorName()) ||
                !ContractorRegex.contactFirst.tests(contractor.getContactFirst()) ||
                !ContractorRegex.contactSecond.tests(contractor.getContactSecond()) ||
                !ContractorRegex.contactThird.tests(contractor.getContactThird()) ||
                !ContractorRegex.tinFirst.tests(contractor.getTinFirst()) ||
                !ContractorRegex.tinSecond.tests(contractor.getTinSecond()) ||
                !ContractorRegex.tinThird.tests(contractor.getTinThird())) {
            return CommonResult.FAILURE;
        }

        EmailAuthEntity dbEmailAuth = this.accessMapper.selectEmailAuthEmailCodeSalt(emailAuth.getEmail(), emailAuth.getCode(), emailAuth.getSalt());

        if (dbEmailAuth == null || !dbEmailAuth.isVerified() || dbEmailAuth.isUsed()) {
            return CommonResult.FAILURE;
        }

        //중복검사
        if (this.accessMapper.selectContractorByEmail(contractor.getEmail()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_EMAIL;
        }

        if (this.accessMapper.selectContractorByContractorName(contractor.getContractorName()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_CONTRACTOR_NAME;
        }

        if (this.accessMapper.selectContractorByContact(contractor.getContactFirst(), contractor.getContactSecond(), contractor.getContactThird()) != null) {

            return RegisterResult.FAILURE_DUPLICATE_CONTACT;
        }

        if (this.accessMapper.selectContractorByTin(contractor.getTinFirst(), contractor.getTinSecond(), contractor.getTinThird()) != null) {
            return RegisterResult.FAILURE_DUPLICATE_TIN;
        }

        contractor.setPassword(new BCryptPasswordEncoder().encode(contractor.getPassword()));
        contractor.setCreatedAt(LocalDateTime.now());
        contractor.setDeleted(false);
        contractor.setSuspended(false);
        contractor.setAgree(contractor.isAgree());

        this.accessMapper.insertContractor(contractor);

        dbEmailAuth.setUsed(true);
        this.accessMapper.updateEmailAuth(dbEmailAuth);

        return CommonResult.SUCCESS;
    }

    // 이름, 성별, 생년월일로 이메일 찾기 위한 메서드.
    public String findEmail(String name, String gender, String ssnBirth) {
        if (name == null || !UserRegex._name.tests(name) ||
                ssnBirth == null || !UserRegex.ssnBirth.tests(ssnBirth)) {
            return null;
        }
        if (Objects.equals(gender, "M") || Objects.equals(gender, "F")) {
        } else {
            return null;
        }

        UserEntity dbUserResult = this.accessMapper.selectUserByNameGenderSsnBirth(name, gender, ssnBirth);

        if (dbUserResult == null) {
            return null;
        }

        return dbUserResult.getEmail();
    }

    // 비밀번호 변경을 위한 메서드.
    @Transactional
    public Result resetPassword(EmailAuthEntity emailAuth,
                                UserEntity user) {
        if (emailAuth == null || user == null ||
                !EmailAuthRegex.email.tests(emailAuth.getEmail()) ||
                !EmailAuthRegex.code.tests(emailAuth.getCode()) ||
                !EmailAuthRegex.salt.tests(emailAuth.getSalt()) ||
                !UserRegex.email.tests(user.getEmail()) ||
                !UserRegex.password.tests(user.getPassword())) {
            return CommonResult.FAILURE;
        }

        EmailAuthEntity dbEmailAuthResult = this.accessMapper.selectEmailAuthEmailCodeSalt(
                emailAuth.getEmail(),
                emailAuth.getCode(),
                emailAuth.getSalt());

        if (dbEmailAuthResult == null || !dbEmailAuthResult.isVerified() || dbEmailAuthResult.isUsed()) {
            return CommonResult.FAILURE;
        }

        dbEmailAuthResult.setUsed(true);
        this.accessMapper.updateEmailAuth(dbEmailAuthResult);

        UserEntity dbUser = this.accessMapper.selectUserByEmail(user.getEmail());

        if (dbUser == null || dbUser.isDeleted()) {
            return CommonResult.FAILURE;
        }

        dbUser.setPassword(new BCryptPasswordEncoder().encode(user.getPassword()));

        this.accessMapper.updateUser(dbUser);

        return CommonResult.SUCCESS;
    }
}
