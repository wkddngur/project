package com.jbw.reservation;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// 세큐리티만 쓰고싶어서 로그인하는 기능을 비활성화한것.
@SpringBootApplication(exclude = SecurityAutoConfiguration.class)
public class ReservationApplication {

    public static void main(String[] args) {
        SpringApplication.run(ReservationApplication.class, args);
    }

}
