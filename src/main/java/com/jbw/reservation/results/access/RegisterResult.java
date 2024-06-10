package com.jbw.reservation.results.access;

import com.jbw.reservation.results.Result;

public enum RegisterResult implements Result {
    FAILURE_DUPLICATE_EMAIL,
    FAILURE_DUPLICATE_NICKNAME,
    FAILURE_DUPLICATE_CONTRACTOR_NAME,
    FAILURE_DUPLICATE_CONTACT,
    FAILURE_DUPLICATE_TIN
}
