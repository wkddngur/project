package com.jbw.reservation.services;

import com.jbw.reservation.entities.ParkingLotEntity;
import com.jbw.reservation.entities.PaymentEntity;
import com.jbw.reservation.entities.ReservationHistoryEntity;
import com.jbw.reservation.entities.UserEntity;
import com.jbw.reservation.mappers.AccessMapper;
import com.jbw.reservation.mappers.ParkingLotMapper;
import com.jbw.reservation.mappers.ReservationMapper;
import com.jbw.reservation.regexes.ReservationRegex;
import com.jbw.reservation.results.Result;
import com.jbw.reservation.results.access.CommonResult;
import com.jbw.reservation.results.reservation.ReservationResult;
import org.apache.ibatis.cache.decorators.BlockingCache;
import org.json.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneOffset;
import java.util.*;

@Service
public class ReservationService {
    private final ReservationMapper reservationMapper;
    private final ParkingLotMapper parkingLotMapper;
    private final AccessMapper accessMapper;

    public ReservationService(ReservationMapper reservationMapper, ParkingLotMapper parkingLotMapper, AccessMapper accessMapper) {
        this.reservationMapper = reservationMapper;
        this.parkingLotMapper = parkingLotMapper;
        this.accessMapper = accessMapper;
    }

    @Transactional
    public Result postReservation(ReservationHistoryEntity reservationHistory) {
        if (reservationHistory == null ||
                reservationHistory.getUserEmail() == null ||
                reservationHistory.getStartDateTime() == null ||
                reservationHistory.getEndDateTime() == null) {
            return CommonResult.FAILURE;
        }

        // 입력값들 정규화 확인 필요(예약자 전화번호, 예약자 차량번호)
        if (reservationHistory.getUserContact() == null ||
        !ReservationRegex.userContact.tests(reservationHistory.getUserContact())) {
            return ReservationResult.FAILURE_MISS_MATCH_CONTACT;
        }

        if (reservationHistory.getCarNumber() == null ||
        !ReservationRegex.carNumber.tests(reservationHistory.getCarNumber())) {
            return ReservationResult.FAILURE_MISS_MATCH_CAR_NUMBER;
        }

        ParkingLotEntity dbParkingLotResult = this.parkingLotMapper.selectParkingLotByIndex(reservationHistory.getParkingLotIndex());

        if (dbParkingLotResult == null) {
            // 주차장 존재하지 않는 경우 리턴값(result) 만들어줘야함.
            return ReservationResult.FAILURE_PARKING_LOT_NOT_FOUND;
        }

        UserEntity dbUserResult = this.accessMapper.selectUserByEmail(reservationHistory.getUserEmail());

        if (dbUserResult == null) {
            // 예약자 이메일이 db에서 없을때 경우 리턴값(result) 만들어줘야함
            return ReservationResult.FAILURE_EMAIL_NOT_FOUND;
        }

        ReservationHistoryEntity dbCheckReserved = this.reservationMapper.selectReservedHistoryByPindexTime(
                reservationHistory.getParkingLotIndex(),
                reservationHistory.getUserEmail(),
                LocalDateTime.from(reservationHistory.getStartDateTime()),
                LocalDateTime.from(reservationHistory.getEndDateTime()));

        if (dbCheckReserved != null) {
            return ReservationResult.FAILURE_ALREADY_RESERVATION_HISTORY;
        }

        int numberOfReservedCount = this.reservationMapper.selectReservedCount(reservationHistory);

        if (numberOfReservedCount >= Integer.parseInt(dbParkingLotResult.getGeneralCarNumber())) {
            return ReservationResult.FAILURE_MAX_NUMBER_OF_PARKING_LOT_EXCEEDED;
        }

        LocalDateTime startDateTime = reservationHistory.getStartDateTime();
        long dateFormatRST = startDateTime.toEpochSecond(ZoneOffset.UTC);
        LocalDateTime endDateTime = reservationHistory.getEndDateTime();
        long dateFormatRET = endDateTime.toEpochSecond(ZoneOffset.UTC);

        if (startDateTime.isBefore(LocalDateTime.now())) {
            // 현재 시간보다 전 시간을 예약 하려고 하면 뜨는 리턴값 만들어줘야함.
            return ReservationResult.FAILURE_START_TIME_PASSED;
        }


        LocalDateTime midNightDate = startDateTime.with(LocalTime.MIN);
        long midNight = midNightDate.toEpochSecond(ZoneOffset.UTC);

        long tenMinutedUnit = 600;

        int dayMaxPrice = Integer.parseInt(dbParkingLotResult.getDayMaxPrice());
        int tenMinutePrice = Integer.parseInt(dbParkingLotResult.getPrice());
        int totalPrice = 0;

        long timeDifference = dateFormatRET - dateFormatRST;

        int reservationFormatTenMinuteResult = (int) (timeDifference / tenMinutedUnit);

        if (reservationFormatTenMinuteResult < 6) {
            // 기본 예약 가능 시간인 1시간 이상을 충족하지 못했다는 리턴값 필요.
            return ReservationResult.FAILURE_MINIMUM_RESERVATION_TIME;
        }

        if (reservationFormatTenMinuteResult < 145) {
            totalPrice = tenMinutePrice * reservationFormatTenMinuteResult;

            if (totalPrice >= dayMaxPrice) {
                totalPrice = dayMaxPrice;
            }
        } else {
            int oneDayFormatMilliSec = 24 * 60 * 60;
            int totalDays = (int) Math.ceil((double) timeDifference / oneDayFormatMilliSec);

            if (totalDays == 2) {
                int overTime = reservationFormatTenMinuteResult - 144;
                int overTimePrice = tenMinutePrice * overTime;

                if (overTimePrice >= dayMaxPrice) {
                    overTimePrice = dayMaxPrice;
                }
                totalPrice = dayMaxPrice + overTimePrice;
            } else {
                for (int day = 0; day <= totalDays; day++) {
                    if (day == 0) {
                        long endOfFirstDay = midNight + oneDayFormatMilliSec;
                        int firstDayTimeDifference = (int) ((endOfFirstDay - dateFormatRST) / tenMinutedUnit);

                        int firstDayPrice = 0;

                        if (tenMinutePrice * firstDayTimeDifference >= dayMaxPrice) {
                            firstDayPrice = dayMaxPrice;
                        } else {
                            firstDayPrice = tenMinutePrice * firstDayTimeDifference;
                        }

                        totalPrice = totalPrice + firstDayPrice;
                    } else if (day == totalDays) {
                        long startOfLastDay = midNight + (long) day * oneDayFormatMilliSec;
                        int lastDayTimeDifference = (int) ((dateFormatRET - startOfLastDay) / tenMinutedUnit);

                        int lastDayPrice = 0;

                        if (tenMinutePrice * lastDayTimeDifference >= dayMaxPrice) {
                            lastDayPrice = dayMaxPrice;
                        } else {
                            lastDayPrice = tenMinutePrice * lastDayTimeDifference;
                        }

                        totalPrice = totalPrice + lastDayPrice;
                    } else {
                        totalPrice = totalPrice + dayMaxPrice;
                    }
                }
            }
        }

        if (reservationHistory.getAmount() != totalPrice) {
            // js 에서 계산한 총금액과 서버에서 계산한 금액이 안맞을 시 리턴값 보내줘야함
            return ReservationResult.FAILURE_AMOUNT_MISS_MATCH;
        }

        PaymentEntity payment = new PaymentEntity();

        payment.setParkingLotIndex(reservationHistory.getParkingLotIndex());
        payment.setUserEmail(reservationHistory.getUserEmail());
        payment.setAmount(totalPrice);
        payment.setCreatedAt(LocalDateTime.now());
        payment.setAgree(false);

        int dbInsertPaymentResult = this.reservationMapper.insertPayment(payment);

        if (dbInsertPaymentResult < 1) {
            return CommonResult.FAILURE;
        }

        reservationHistory.setPaymentIndex(payment.getIndex());
        reservationHistory.setRefundIndex(null);
        reservationHistory.setAmount(totalPrice);
        reservationHistory.setCreatedAt(LocalDateTime.now());
        reservationHistory.setModifiedAt(null);
        reservationHistory.setDeleted(false);

        int dbInsertReservationHistoryResult = this.reservationMapper.insertReservationHistory(reservationHistory);

        if (dbInsertReservationHistoryResult > 0) {
            return CommonResult.SUCCESS;
        } else {
            return CommonResult.FAILURE;
        }
    }

    public String getReservedHistory(int parkingLotIndex, LocalDate reqDate) {
//        LocalDateTime todayDateTime = LocalDateTime.now();


        ReservationHistoryEntity[] todayReservedTable = this.reservationMapper.selectReservedHistoryByNow(parkingLotIndex, reqDate);

        List<List<Integer>> allIndexes = new ArrayList<>();

        for (ReservationHistoryEntity todayReserved : todayReservedTable) {
//            LocalDate baseDate = LocalDate.from(todayDateTime);

            LocalDateTime reservedStart = todayReserved.getStartDateTime();
            LocalDateTime reservedEnd = todayReserved.getEndDateTime();

            List<Integer> indexes = getIndicesForDate(reqDate, reservedStart, reservedEnd);

            allIndexes.add(indexes);
        }
        return allIndexes.toString();
    }



    public List<Integer> getIndicesForDate(LocalDate baseDate, LocalDateTime reservedStart, LocalDateTime reservedEnd) {
        LocalDateTime dayStart = baseDate.atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);
        dayStart = dayStart.plusMinutes(10);


        LocalDateTime UseStartTime = null;
        LocalDateTime UseEndTime = null;

        if (reservedStart.isBefore(dayStart)) {
            UseStartTime = dayStart;
        } else {
            UseStartTime = reservedStart;
        }

        if (reservedEnd.isAfter(dayEnd)) {
            UseEndTime = dayEnd;
        } else {
            UseEndTime = reservedEnd;
        }

        int startIndex = getTimeIndex(UseStartTime.toLocalTime());
        int endIndex = getTimeIndex(UseEndTime.toLocalTime());
        List<Integer> indexes = new ArrayList<>();


        for (int i = startIndex; i <= endIndex; i++) {
            indexes.add(i);
        }
        return indexes;
    }

    public int getTimeIndex(LocalTime time) {
        int totalMinutes = time.getHour() * 60 + time.getMinute();
        int index = totalMinutes / 10;
        if (index == 0) {
            index = 144;
        }
        return index;
    }
}


