package com.jbw.reservation.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class UserRegex {
    public static final Regex email = new Regex("^(?=.{5,50}$)([\\da-zA-Z_.]{4,})@([\\da-z\\-]+\\.)?([\\da-z\\-]+)\\.([a-z]{2,15})(\\.[a-z]{2})?$");
    public static final Regex password = new Regex("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\",<.>/?]{5,20})$");
    public static final Regex nickname = new Regex("^([\\da-zA-Z가-힣]{2,10})$");
    public static final Regex ssnBirth = new Regex("^(19[0-9][0-9]|20\\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$");

    public static final Regex name = new Regex("^(?=.*[가-힣])[가-힣]{2,}$");

    public static final Regex _name = name;
}
