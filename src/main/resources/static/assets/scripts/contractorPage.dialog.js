const parkingLotInfoDialog = document.getElementById('parkingLotInfoDialog');
const parkingLotInfoPaymentHistoryDialog = document.getElementById('parkingLotInfoPaymentHistoryDialog');
const paymentHistoryTbody = parkingLotInfoPaymentHistoryDialog.querySelector('[rel="paymentHistoryTbody"]');
const parkingLotInfoRefundHistoryDialog = document.getElementById('parkingLotInfoRefundHistoryDialog');
const refundHistoryTbody = parkingLotInfoRefundHistoryDialog.querySelector('[rel="refundHistoryTbody"]');

function showParkingLotInfoDialog(parkingLotObject) {
    cover.show();
    parkingLotInfoDialog.show();
    parkingLotInfoDialog.scrollTop = 0;

    let createdAt = new Date(parkingLotObject['createdAt']);
    let createdAtFormat = dateFormat(createdAt);

    parkingLotInfoDialog.querySelector('[rel="parkingLotName"]').innerText = parkingLotObject['name'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotCategoryText"]').innerText = parkingLotObject['parkingLotCategoryText'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotContact"]').innerText = `${parkingLotObject['contactFirst']}` + '-' + `${parkingLotObject['contactSecond']}` + '-' + `${parkingLotObject['contactThird']}`;
    parkingLotInfoDialog.querySelector('[rel="parkingLotAddress"]').innerText = `${parkingLotObject['addressPrimary']}` + ' ' + `${parkingLotObject['addressSecondary']}`;
    parkingLotInfoDialog.querySelector('[rel="parkingLotGCN"]').innerText = parkingLotObject['generalCarNumber'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotDCN"]').innerText = parkingLotObject['dpCarNumber'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotDescription"]').innerText = parkingLotObject['description'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotPrice"]').innerText = parkingLotObject['price'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotDayMaxPrice"]').innerText = parkingLotObject['dayMaxPrice'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotCreatedAt"]').innerText = createdAtFormat;

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', () => location.reload()).show();
            return;
        }

        const responseObject = JSON.parse(xhr.responseText);

        let totalPaymentCount = 0;
        let totalPaymentUnsolvedCount = 0;
        let totalRefundCount = responseObject['totalRefundCount'];
        let totalRefundUnsolvedCount = responseObject['totalRefundUnsolvedCount'];

        for (let reservedHistoryEl of responseObject['reservedHistoryArray']) {
            totalPaymentCount = totalPaymentCount + 1;

            if (!reservedHistoryEl['agreePayment']) {
                totalPaymentUnsolvedCount = totalPaymentUnsolvedCount + 1;
            }

        }

        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedPaymentsHistory"]').innerText = `${totalPaymentUnsolvedCount}` + '(미해결)' + ' / ' + `${totalPaymentCount}` + '(총 결제내역)';
        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedRefundsHistory"]').innerText = `${totalRefundUnsolvedCount}` + '(미해결)' + ' / ' + `${totalRefundCount}` + '(총 환불내역)';

        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedPaymentHistoryButton"]').onclick = () => {
            showReservedHistoryByPayments(responseObject['reservedHistoryArray']);
        }

        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedRefundHistoryButton"]').onclick = () => {
            showReservedHistoryByRefunds(responseObject['reservedHistoryArray'], totalRefundCount);
        }

    }
    xhr.open('GET', `/contractor/reservedHistoryByPIndex?parkingLotIndex=${parkingLotObject['index']}`);
    xhr.send();

    parkingLotInfoDialog.querySelector('[rel="closeButton"]').onclick = () => {
        parkingLotInfoDialog.hide();
        cover.hide();
    }
}

function showReservedHistoryByPayments(reservedHistoryArray) {
    parkingLotInfoDialog.hide();
    parkingLotInfoPaymentHistoryDialog.show();

    parkingLotInfoPaymentHistoryDialog.querySelector('[rel="paymentHistoryTable"]').show();
    parkingLotInfoPaymentHistoryDialog.querySelector('[rel="emptyDiv"]').innerText = '';
    parkingLotInfoPaymentHistoryDialog.querySelector('[rel="emptyDiv"]').hide();

    paymentHistoryTbody.innerHTML = '';

    if (reservedHistoryArray.length === 0) {
        parkingLotInfoPaymentHistoryDialog.querySelector('[rel="paymentHistoryTable"]').hide();
        parkingLotInfoPaymentHistoryDialog.querySelector('[rel="emptyDiv"]').innerText = '등록된 예약 내역이 없습니다.';
        parkingLotInfoPaymentHistoryDialog.querySelector('[rel="emptyDiv"]').show();
    }

    for (let reservedHistoryObject of reservedHistoryArray) {
        let startDateTime = new Date(reservedHistoryObject['startDateTime']);
        let startDateTimeFormat = dateFormat(startDateTime);

        let endDateTime = new Date(reservedHistoryObject['endDateTime']);
        let endDateTimeFormat = dateFormat(endDateTime);

        let createdAt = new Date(reservedHistoryObject['createdAt']);
        let createdAtFormat = dateFormat(createdAt);

        const confirmPaymentButtonEl = `<button class="_obj-button" rel="confirmPaymentButton" type="button">입금 확인 처리</button>`;

        let paymentStatusEl = reservedHistoryObject['agreePayment'] === true ? '입금 처리 완료' : confirmPaymentButtonEl;


        const reservedPaymentHistoryEl = new DOMParser().parseFromString(`
            <div class="payment-history-list-tr">
                <span class="text">${reservedHistoryObject['userName']}</span>
                <span class="text">${reservedHistoryObject['userContact']}</span>
                <span class="text">${reservedHistoryObject['carNumber']}</span>
                <span class="text">${startDateTimeFormat} ~ ${endDateTimeFormat}</span>
                <span class="text">${reservedHistoryObject['amount']} 원</span>
                <span class="text">${createdAtFormat}</span>
                <span class="text status" rel="status">${paymentStatusEl}</span>
            </div>
        `, 'text/html').querySelector('div.payment-history-list-tr');

       reservedPaymentHistoryEl.querySelector('[rel="confirmPaymentButton"]')?.addEventListener('click', () => {
           const xhr = new XMLHttpRequest();
           const formData = new FormData();
           formData.append("paymentIndex", reservedHistoryObject['paymentIndex']);
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
                   failure_request_already_processed:['경고', '이미 처리된 요청입니다.', () => {
                       location.reload();
                   }],
                   failure_not_contractor_login: ['경고', '협력업체 로그인 후 다시 시도해 주세요.', () => {
                       location.href = '/access/';
                   }],
                   failure_not_same_contractor_email: ['경고', '상태정보를 변경하려고 하는 결제 내역의 이메일과 주차장 소유 협력업체 이메일이 동일하지 않습니다.'],
                   failure: ['경고', '결제 상태 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
                   success: ['알림', `결제 상태 변경에 성공하였습니다.`, () => {
                       reservedPaymentHistoryEl.querySelector('[rel="status"]').innerHTML = '입금 확인 완료';
                   }]
               }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
               MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

           }
           xhr.open('PATCH', '/contractor/patchPaymentStatus');
           xhr.send(formData);
       });

        paymentHistoryTbody.append(reservedPaymentHistoryEl);
    }

    parkingLotInfoPaymentHistoryDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        parkingLotInfoPaymentHistoryDialog.hide();
        parkingLotInfoDialog.show();
    }
}

function showReservedHistoryByRefunds(reservedHistoryArray, totalRefundCount) {
    parkingLotInfoDialog.hide();
    parkingLotInfoRefundHistoryDialog.show();

    parkingLotInfoRefundHistoryDialog.querySelector('[rel="refundHistoryTable"]').show();
    parkingLotInfoRefundHistoryDialog.querySelector('[rel="emptyDiv"]').innerText = '';
    parkingLotInfoRefundHistoryDialog.querySelector('[rel="emptyDiv"]').hide();

    refundHistoryTbody.innerHTML = '';

    if (totalRefundCount === 0) {
        parkingLotInfoRefundHistoryDialog.querySelector('[rel="refundHistoryTable"]').hide();
        parkingLotInfoRefundHistoryDialog.querySelector('[rel="emptyDiv"]').innerText = '등록된 환불 내역이 없습니다.';
        parkingLotInfoRefundHistoryDialog.querySelector('[rel="emptyDiv"]').show();
    }

    for (let reservedHistoryObject of reservedHistoryArray) {
        if (reservedHistoryObject['refundIndex'] != null){
            let startDateTime = new Date(reservedHistoryObject['startDateTime']);
            let startDateTimeFormat = dateFormat(startDateTime);

            let endDateTime = new Date(reservedHistoryObject['endDateTime']);
            let endDateTimeFormat = dateFormat(endDateTime);

            let refundCreatedAt = new Date(reservedHistoryObject['createdAtRefund']);
            let refundCreatedAtFormat = dateFormat(refundCreatedAt);

            const confirmRefundButtonEl = `<button class="_obj-button" rel="confirmRefundButton" type="button">환불 확인 처리</button>`;

            let refundStatusEl = reservedHistoryObject['agreeRefund'] === true ? '환불 처리 완료' : confirmRefundButtonEl;


            const reservedRefundHistoryEl = new DOMParser().parseFromString(`
                <div class="refund-history-list-tr">
                    <span class="text">${reservedHistoryObject['userName']}</span>
                    <span class="text">${reservedHistoryObject['userContact']}</span>
                    <span class="text">${reservedHistoryObject['carNumber']}</span>
                    <span class="text">${startDateTimeFormat} ~ ${endDateTimeFormat}</span>
                    <span class="text">${reservedHistoryObject['amount']} 원</span>
                    <span class="text">${reservedHistoryObject['bankCodeText']}</span>
                    <span class="text">${reservedHistoryObject['bankAccountNumber']}</span>
                    <span class="text">${refundCreatedAtFormat}</span>
                    <span class="text status" rel="status">${refundStatusEl}</span>
                </div>
            `, 'text/html').querySelector('div.refund-history-list-tr');

            reservedRefundHistoryEl.querySelector('[rel="confirmRefundButton"]')?.addEventListener('click', () => {
               const xhr = new XMLHttpRequest();
               const formData = new FormData();
               formData.append("refundIndex", reservedHistoryObject['refundIndex']);
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
                       failure_request_already_processed:['경고', '이미 처리된 요청입니다.', () => {
                          location.reload();
                       }],
                       failure_not_contractor_login: ['경고', '협력업체 로그인 후 다시 시도해 주세요.', () => {
                           location.href = '/access/';
                       }],
                       failure_not_same_contractor_email: ['경고', '상태정보를 변경하려고 하는 환불 내역의 이메일과 주차장 소유 협력업체 이메일이 동일하지 않습니다.'],
                       failure: ['경고', '환불 상태 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
                       success: ['알림', `환불 상태 변경에 성공하였습니다.`, () => {
                           reservedRefundHistoryEl.querySelector('[rel="status"]').innerHTML = '환불 확인 완료';
                       }]
                   }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                   MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

               }
               xhr.open('PATCH', '/contractor/patchRefundStatus');
               xhr.send(formData);
            });

            refundHistoryTbody.append(reservedRefundHistoryEl);
        }
    }

    parkingLotInfoRefundHistoryDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        parkingLotInfoRefundHistoryDialog.hide();
        parkingLotInfoDialog.show();
    }
}