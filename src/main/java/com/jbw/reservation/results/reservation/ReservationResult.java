package com.jbw.reservation.results.reservation;

import com.jbw.reservation.results.Result;

public enum ReservationResult implements Result {
    FAILURE_EMAIL_NOT_FOUND, // 예약자 이메일이 데이터베이스에 존재하지 않는 경우.
    FAILURE_AMOUNT_MISS_MATCH, // 예약 요청에서 계산된 총 금액과 js에서 계산된 금액이 일치하지 않는 경우.
    FAILURE_PARKING_LOT_NOT_FOUND, // 주차장이 존재하지 않는 경우.
    FAILURE_MAX_NUMBER_OF_PARKING_LOT_EXCEEDED, // 최대 주차 가능 대수 초과일떄.
    FAILURE_START_TIME_PASSED, // 예약 시작 시간이 현재 시간보다 이전인 경우.
    FAILURE_MINIMUM_RESERVATION_TIME, //  최소 예약 가능 시간 조건을 충족하지 못한 경우.
    FAILURE_MISS_MATCH_CONTACT,
    FAILURE_MISS_MATCH_CAR_NUMBER,
    FAILURE_ALREADY_RESERVATION_HISTORY,
    FAILURE_PAYMENT_NOT_FOUND, // 결제내역이 존재하지 않는 경우
    FAILURE_USER_SUSPENDED_OR_DELETED, //   // 사용자 이메일이 정지 되었거나 삭제된 경우
    FAILURE_DUPLICATE_REFUND, // 환불 내역이 중복일 경우
    FAILURE_USER_EMAIL_MISMATCH // // 환불 신청을 하는 사용자가 예약한 사용자와 다른 사용자일 경우
}
