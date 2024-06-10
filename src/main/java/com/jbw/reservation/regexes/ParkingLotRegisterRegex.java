package com.jbw.reservation.regexes;

import lombok.experimental.UtilityClass;

@UtilityClass
public class ParkingLotRegisterRegex {
    public static final Regex contactFirst = new Regex("^(\\d{3,4})$");
    public static final Regex contactSecond = new Regex("^(\\d{3,4})$");
    public static final Regex contactThird = new Regex("(\\d{4})$");
    public static final Regex addressPostal = new Regex("(\\d{5})$");
    public static final Regex addressPrimary = new Regex("^([\\da-zA-Z가-힣()\\- ]{5,100})$");
    public static final Regex addressSecondary = new Regex("^([\\da-zA-Z가-힣()\\-\\[\\]'\",. ]{0,100})$");
    public static final Regex description = new Regex("^([\\s\\S]{1,10000})$");

    public static final Regex name = new Regex("^([\\da-zA-Z가-힣()\\-. ]{1,50})$");
    public static final Regex _name = name;

    public static final Regex parkingCapacity = new Regex("^(?:[1-9]?\\d|[1-4]\\d{2}|500)$");

    public static final Regex price = new Regex("^(?:[1-9]\\d{0,5})$");
}