const userPage = document.getElementById('userPage');
const reservedHistoryDiv = document.getElementById('reservedHistory');

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

        for (let reservedHistoryObject of reservedHistoryArray) {

            let startDateTime = new Date(reservedHistoryObject['startDateTime']);
            let startDateTimeFormat = dateFormat(startDateTime);

            let endDateTime = new Date(reservedHistoryObject['endDateTime']);
            let endDateTimeFormat = dateFormat(endDateTime);

            let createdAtPayment = new Date(reservedHistoryObject['createdAtPayment']);
            let createdAtPaymentFormat = dateFormat(createdAtPayment);

            let paymentStatusText = reservedHistoryObject['agreePayment'] === true ? '결제 완료' : '입금 확인중';
            let refundStatusText = reservedHistoryObject['agreeRefund'] === true ? '환불 완료' : '환불 신청'
            // 여기서 false 일때 버튼 요소를 만들어서 넣어줌으로서 글 대신 환불 신청 버튼이 나오면 좋을듯 그 버튼을 환불신청하는 다이얼로그로 연결시켜서 다이얼로그에서 은행 및 계좌번호 등등 입력받고 환불신청하고 컨트롤러에서는 refunds 테이블에 삽입하고 삽입한 결제에 대해서 reservation 테이블에서 refund_index 행의 값이 잘 바뀌는 지 확인 까지 하면 될듯?

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
                <span class="text">${paymentStatusText}</span>
                <span class="text">${refundStatusText}</span>
            </div>
            `, 'text/html').querySelector('div.reservedHistory-list-tr');

            // 여기서 위에서 만들어준 버튼 오브젝트 클릭 이벤트 만들어서 환불 처리 POST 요청도 처리해주면 될듯

            reservedHistoryDiv.querySelector('[rel="reservedHistoryTbody"]').append(reservedHistoryEl);
        }

    }
    xhr.open('GET', `/userPage/reservedHistoryList?userEmail=${userPage.querySelector('[name="userEmail"]').value}`);
    xhr.send();
}