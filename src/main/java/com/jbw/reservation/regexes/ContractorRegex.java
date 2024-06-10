package com.jbw.reservation.regexes;

public class ContractorRegex {
    public static final Regex email = new Regex("^(?=.{5,50}$)([\\da-zA-Z_.]{4,})@([\\da-z\\-]+\\.)?([\\da-z\\-]+)\\.([a-z]{2,15})(\\.[a-z]{2})?$");
    public static final Regex password = new Regex("^([\\da-zA-Z`~!@#$%^&*()\\-_=+\\[{\\]}\\\\|;:\",<.>/?]{5,20})$");
    public static final Regex contractorName = new Regex("^([\\da-zA-Z가-힣]{2,10})$");
    public static final Regex contactFirst = new Regex("^(\\d{3,4})$");
    public static final Regex contactSecond = new Regex("^(\\d{3,4})$");
    public static final Regex contactThird = new Regex("(\\d{4})$");
    public static final Regex tinFirst = new Regex("(\\d{3})$");
    public static final Regex tinSecond = new Regex("(\\d{2})$");
    public static final Regex tinThird = new Regex("(\\d{5})$");


}

