package com.jbw.reservation.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ReservationRegex {
    // 사용자 전화번호 정규화
    public static final Regex userContact = new Regex("^\\d{3}-\\d{3,4}-\\d{4}$");
    // 자동차 번호 정규화
    public static final Regex carNumber = new Regex("^[0-9]{2,3}[가-힣][0-9]{4}$");

    public static final Regex bankAccountNumber = new Regex("^\\d{10,14}$");
}
