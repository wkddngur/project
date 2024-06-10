package com.jbw.reservation.misc;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

public class MailSender {
    // 메일 보내는 부분을 간소화 하기 위해 따로 빼서 사용.

//        Context context = new Context();
//        context.setVariable("code", emailAuth.getCode());
//        new MailSender(this.mailSender)
//                .setFrom("jbw5387@naver.com")
//                .setSubject("[맛집] 비밀번호 재설정 인증번호")
//                .setTo(emailAuth.getEmail())
//            .setText(this.templateEngine.process("user/resetPasswordEmail", context), true)
//            .send();
    // 결과적으로 요런식으로 사용 가능.

    private final JavaMailSender mailSender;
    private final MimeMessage mimeMessage;
    private final MimeMessageHelper mimeMessageHelper;

    public MailSender(JavaMailSender mailSender) throws MessagingException {
        this(mailSender, false);
    }

    public MailSender(JavaMailSender mailSender, boolean multipart) throws MessagingException {
        this.mailSender = mailSender;
        this.mimeMessage = mailSender.createMimeMessage();
        this.mimeMessageHelper = new MimeMessageHelper(this.mimeMessage, multipart);
    }

    public MailSender setFrom(String from) throws MessagingException {
        this.mimeMessageHelper.setFrom(from);
        return this;
    }

    public MailSender setSubject(String subject) throws MessagingException {
        this.mimeMessageHelper.setSubject(subject);
        return this;
    }

    public MailSender setText(String text, boolean isHtml) throws MessagingException {
        this.mimeMessageHelper.setText(text, isHtml);
        return this;
    }

    public MailSender setTo(String to) throws MessagingException {
        this.mimeMessageHelper.setTo(to);
        return this;
    }

    public void send() {
        this.mailSender.send(this.mimeMessage);
    }
}
