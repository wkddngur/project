package com.jbw.reservation.results.contractorPage;

import com.jbw.reservation.results.Result;

public enum ReservedPaymentStatusResult implements Result {
    FAILURE_NOT_SAME_CONTRACTOR_EMAIL,
    FAILURE_REQUEST_ALREADY_PROCESSED
}
