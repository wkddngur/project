const userPage = document.getElementById('userPage');
const reservedHistoryDiv = document.getElementById('reservedHistory');

const userInfoDiv = document.getElementById('userInfo');

if (userInfoDiv.querySelector('[rel="userInfoGender"]').innerText === 'M') {
    userInfoDiv.querySelector('[rel="userInfoGender"]').innerText = '남성';
}

if (userInfoDiv.querySelector('[rel="userInfoGender"]').innerText === 'F') {
    userInfoDiv.querySelector('[rel="userInfoGender"]').innerText = '여성';
}

userPage.querySelector('[rel="closer"]').onclick = () => {
    location.href = '../';
}

getReservedHistory();

function getReservedHistory() {
    reservedHistoryDiv.querySelector('[rel="reservedHistoryTbody"]').innerHTML = '';

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const reservedHistoryArray = JSON.parse(xhr.responseText);

        if (reservedHistoryArray.length === 0) {
            reservedHistoryDiv.querySelector('[rel="reservedHistoryTable"]').innerHTML = '';
            reservedHistoryDiv.querySelector('[rel="reservedHistoryTable"]').innerHTML = `<div style="width: 100%; font-size: 1.1rem; padding: 0.5rem; text-align: center;">등록된 예약 내역이 없습니다. 메인페이지에서 예약을 진행해 주세요.</div>`;
        }

        for (let reservedHistoryObject of reservedHistoryArray) {
            userInfoDiv.querySelector('[rel="totalReservationCount"]').innerText = reservedHistoryArray.length + ' 건';

            let startDateTime = new Date(reservedHistoryObject['startDateTime']);
            let startDateTimeFormat = dateFormat(startDateTime);

            let endDateTime = new Date(reservedHistoryObject['endDateTime']);
            let endDateTimeFormat = dateFormat(endDateTime);

            let createdAtPayment = new Date(reservedHistoryObject['createdAtPayment']);
            let createdAtPaymentFormat = dateFormat(createdAtPayment);

            const refundButtonEL = '<button class="_obj-button" rel="refundButton" type="button">환불 신청 하기</button>';

            let paymentStatusText = reservedHistoryObject['agreePayment'] === true ? '결제 완료' : '입금 확인 중';
            let refundStatusText = null;

            if (reservedHistoryObject['agreePayment'] === false) {
                // 결제 미완료
                refundStatusText = '결제 미완료';
            } else if (reservedHistoryObject['agreePayment'] === true && reservedHistoryObject['refundIndex'] === null) {
                // 결제 완료, 환불 신청 안 한 상태
                refundStatusText = refundButtonEL;
            } else if (reservedHistoryObject['refundIndex'] !== null && reservedHistoryObject['agreeRefund'] === false) {
                // 환불 신청한 상태 (환불 처리 중)
                refundStatusText = '환불 처리 중';
            } else if (reservedHistoryObject['refundIndex'] !== null && reservedHistoryObject['agreeRefund'] === true) {
                // 환불 완료된 상태
                refundStatusText = '환불 처리 완료';
            }

            const reservedHistoryEl = new DOMParser().parseFromString(`
            <div class="reservedHistory-list-tr">
                <span class="text">${reservedHistoryObject['index']}</span>
                <span class="text">${reservedHistoryObject['parkingLotName']}</span>
                <span class="text">${reservedHistoryObject['userEmail']}</span>
                <span class="text">${reservedHistoryObject['carNumber']}</span>
                <span class="text">${reservedHistoryObject['userContact']}</span>
                <span class="text">${startDateTimeFormat} ~ ${endDateTimeFormat}</span>
                <span class="text">${reservedHistoryObject['amount']}원</span>
                <span class="text">${createdAtPaymentFormat}</span>
                <span class="text" rel="paymentStatus">${paymentStatusText}</span>
                <span class="text" rel="refundStatus">${refundStatusText}</span>
            </div>
            `, 'text/html').querySelector('div.reservedHistory-list-tr');

            if (paymentStatusText === '결제 완료') {
                reservedHistoryEl.querySelector('[rel="paymentStatus"]').style.color = '#28b463';
            } else {
                reservedHistoryEl.querySelector('[rel="paymentStatus"]').style.color = 'red';
            }

            if (refundStatusText === '환불 처리 중') {
                reservedHistoryEl.querySelector('[rel="refundStatus"]').style.color = 'red';
            } else if (refundStatusText === '환불 처리 완료') {
                reservedHistoryEl.querySelector('[rel="refundStatus"]').style.color = '#28b463';
            }

            // 여기서 위에서 만들어준 버튼 오브젝트 클릭 이벤트 만들어서 환불 처리 POST 요청도 처리해주면 될듯
            reservedHistoryEl.querySelector('[rel="refundButton"]')?.addEventListener('click', () => {
               showRefundFormDialog(reservedHistoryObject);
            });

            reservedHistoryDiv.querySelector('[rel="reservedHistoryTbody"]').append(reservedHistoryEl);
        }

    }
    xhr.open('GET', `/userPage/reservedHistoryList?userEmail=${userPage.querySelector('[name="userEmail"]').value}`);
    xhr.send();
}