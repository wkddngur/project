package com.jbw.reservation.results.contractorPage;

import com.jbw.reservation.results.Result;

public enum ParkingLotAddResult implements Result {
    FAILURE_NOT_CONTRACTOR_LOGIN,
    FAILURE_DUPLICATE_ADDRESS,
    FAILURE_DUPLICATE_DESCRIPTION
}
