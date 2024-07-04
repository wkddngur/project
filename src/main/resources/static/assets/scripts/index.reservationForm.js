const reservationForm = document.getElementById('reservationForm');


const showReservationForm = () => {
    reservationForm.show();
    cover.show();

    reservationForm.scrollTop = 0;
    reservationForm.querySelector('[name="userContact"]').value = '';
    reservationForm.querySelector('[name="carNumber"]').value = '';

    // reservationForm.querySelector('[name="userEmail"]').value =
    reservationForm.querySelector('[name="name"]').value = parkingLotObject['name'];
    reservationForm.querySelector('[name="addressPrimary"]').value = parkingLotObject['addressPrimary'];
    reservationForm.querySelector('[name="addressSecondary"]').value = parkingLotObject['addressSecondary'];
    reservationForm.querySelector('[name="parkingLotIndex"]').value = parkingLotObject['index'];

    // 밑에서 초기화를 위한 내부 변수
    let reservationStartTime = '';
    let reservationEndTime = '';

    if (typeof sessionStorage.getItem('startDateTime') === 'string' && typeof sessionStorage.getItem('endDateTime') === 'string') {
        reservationStartTime = sessionStorage.getItem('startDateTime');
        reservationEndTime = sessionStorage.getItem('endDateTime');
        reservationForm.querySelector('[name="startDateTime"]').value = reservationStartTime;
        reservationForm.querySelector('[name="endDateTime"]').value = reservationEndTime;
    } else {
        reservationStartTime = dateFormat(nowDateTime);
        reservationEndTime = dateFormat(endDateTime);
        reservationForm.querySelector('[name="startDateTime"]').value = reservationStartTime;
        reservationForm.querySelector('[name="endDateTime"]').value = reservationEndTime;
    }


    // 요금 계산
    reservationForm.querySelector('[name="totalPrice"]').value = '';
    const dateFormatRST = new Date(reservationStartTime);
    const dateFormatRET = new Date(reservationEndTime);
    const dayMaxPrice = parseInt(parkingLotObject['dayMaxPrice'].toString());
    const tenMinutePrice = parseInt(parkingLotObject['price'].toString());
    const timeDifference = dateFormatRET - dateFormatRST;
    const midNight = new Date(dateFormatRST);
    midNight.setHours(0, 0, 0, 0);

    const tenMinutedUnit = 10 * 60 * 1000;

    let totalPrice = null;

    const reservationFormatTenMinuteResult = timeDifference / tenMinutedUnit; // 145 (1450분)

    if (reservationFormatTenMinuteResult < 145) {
        // 그냥 하루 최대
        totalPrice = tenMinutePrice * reservationFormatTenMinuteResult;

        if (totalPrice >= dayMaxPrice) {
            totalPrice = dayMaxPrice;
        }
        reservationForm.querySelector('[name="totalPrice"]').value = totalPrice;
    }

    if (reservationFormatTenMinuteResult > 144) {
        const oneDayFormatMilliSec = 24 * 60 * 60 * 1000;
        let totalDays = Math.ceil(timeDifference/oneDayFormatMilliSec);

        if (totalDays === 2) {
            const overTime = reservationFormatTenMinuteResult - 144;
            let overTimePrice = tenMinutePrice * overTime;

            if (overTimePrice >= dayMaxPrice) {
                overTimePrice = dayMaxPrice;
            }
            totalPrice = dayMaxPrice + overTimePrice;
        } else {
            // for (let day = 0; day <= totalDays; day++) {
            for (let day = 0; day < totalDays; day++) {
                if (day === 0) {
                    const endOfFirstDay = new Date(midNight.getTime() + oneDayFormatMilliSec);
                    const firstDayTimeDifference = (endOfFirstDay - dateFormatRST) / tenMinutedUnit;
                    let firstDayPrice = null;

                    if (tenMinutePrice * firstDayTimeDifference >= dayMaxPrice) {
                        firstDayPrice = dayMaxPrice;
                    } else {
                        firstDayPrice = tenMinutePrice * firstDayTimeDifference;
                    }
                    totalPrice = totalPrice + firstDayPrice;
                } else if (day === totalDays) {
                    const startOfLastDay = new Date(midNight.getTime() + day * oneDayFormatMilliSec);
                    const lastDayTimeDifference = (dateFormatRET - startOfLastDay) / tenMinutedUnit;

                    let lastDayPrice = null;

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

        reservationForm.querySelector('[name="totalPrice"]').value = totalPrice;
    }

    reservationForm.contactLabel = new LabelObj(reservationForm.querySelector('[rel="contactLabel"]'));
    reservationForm.carNumberLabel = new LabelObj(reservationForm.querySelector('[rel="carNumberLabel"]'));

    reservationForm.onsubmit = (e) => {
        e.preventDefault();

        // 예약자 전화번호(0000(3~4)-0000(3~4)-0000), 예약자 차량번호(000(2~3)ㅁ(한글 한글자)0000) 두가지 정규화 및 제대로 된 값입력 안되면 빨간색 되고 알림 뜨도록 처리.
        reservationForm.contactLabel.setValid(reservationForm['userContact'].tests());
        reservationForm.carNumberLabel.setValid(reservationForm['carNumber'].tests());

        if (!reservationForm.contactLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '올바른 전화번호를 입력해 주세요.').show();
            return;
        }

        if (!reservationForm.carNumberLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '올바른 차량번호를 입력해 주세요.').show();
            return;
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append('parkingLotIndex', reservationForm.querySelector('[name="parkingLotIndex"]').value);
        formData.append('userEmail', reservationForm.querySelector('[name="userEmail"]').value);
        formData.append('userContact', reservationForm.querySelector('[name="userContact"]').value);
        formData.append('amount', reservationForm.querySelector('[name="totalPrice"]').value);
        formData.append('carNumber', reservationForm.querySelector('[name="carNumber"]').value);
        formData.append('startDateTimeString', reservationForm.querySelector('[name="startDateTime"]').value);
        formData.append('endDateTimeString', reservationForm.querySelector('[name="endDateTime"]').value);

        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
                return;
            }

            const responseObject = JSON.parse(xhr.responseText);
            const [dTitle, dContent, dOnclick] = {
                // 해당 사용자가 이미 해당시간에 예약이 있다면 불가능. 예약 내역에서 삭제 신청 후 다시 시도해 달라 해야함.
                failure_miss_match_contact: ['경고', '입력하신 전화번호에 문제가 있습니다. 다시 확인해 주세요.'],
                failure_miss_match_car_number: ['경고', '입력하신 차량번호에 문제가 있습니다. 다시 확인해 주세요.'],
                failure_email_not_found: ['경고', '회원목록에서 검색되지 않는 이메일 입니다. 잠시 후 다시 시도해 주세요.'],
                failure_amount_miss_match: ['경고', '결제 금액에 문제가 발생하였습니다. 문제가 지속되면 문의 게시판에 문의해 주세요.'],
                failure_parking_lot_not_found: ['경고', '예약하려는 주차장이 존재하지 않습니다. 잠시 후 다시 시도해 주세요.'],
                failure_start_time_passed: ['경고', '현재 시간보다 전 시간은 예약 할 수 없습니다. 잠시 후 다시 시도해 주세요.'],
                failure_minimum_reservation_time:['경고', '기본 예약 가능 시간인 1시간을 충족하지 못 하였습니다. 잠시 후 다시 시도해 주세요'],
                failure_already_reservation_history: ['경고', '선택하신 기준시간에 이미 예약이 되어 있습니다. 예약 내역에서 기존 예약을 취소 후 다시 시도해 주세요.', () => {
                    location.href = '/userPage/';
                }],
                failure_max_number_of_parking_lot_exceeded: ['경고', '최대 예약 가능한 주차 대수를 초과하였습니다. 기준 시간을 변경해 주세요.'],
                failure: ['경고', '알 수 없는 이유로 예약하지 못 하였습니다. 잠시 후 다시 시도해 주세요.'],
                success: ['알림', '예약을 완료하였습니다. 확인 버튼을 클릭하면 마이페이지로 이동합니다.', () => {
                    location.href = '/userPage/';
                }]
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

        }
        xhr.open('POST', '/reservation/');
        xhr.send(formData);
    }

    reservationForm.querySelector('[rel="cancelButton"]').onclick = () => {
        reservationForm.hide();
        cover.hide();
    }
};
