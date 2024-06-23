const reservationForm = document.getElementById('reservationForm');


const showReservationForm = () => {
    reservationForm.show();
    cover.show();

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
            for (let day = 0; day <= totalDays; day++) {
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

    reservationForm.querySelector('[rel="cancelButton"]').onclick = () => {
        reservationForm.hide();
        cover.hide();
    }
};
