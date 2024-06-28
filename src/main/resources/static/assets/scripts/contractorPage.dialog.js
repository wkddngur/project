const parkingLotInfoDialog = document.getElementById('parkingLotInfoDialog');

function showParkingLotInfoDialog(parkingLotObject) {
    cover.show();
    parkingLotInfoDialog.show();
    parkingLotInfoDialog.scrollTop = 0;

    parkingLotInfoDialog.querySelector('[rel="parkingLotName"]').innerText = parkingLotObject['name'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotCategoryText"]').innerText = parkingLotObject['parkingLotCategoryText'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotContact"]').innerText = `${parkingLotObject['contactFirst']}` + '-' + `${parkingLotObject['contactSecond']}` + '-' + `${parkingLotObject['contactThird']}`;
    parkingLotInfoDialog.querySelector('[rel="parkingLotAddress"]').innerText = `${parkingLotObject['addressPrimary']}` + ' ' + `${parkingLotObject['addressSecondary']}`;
    parkingLotInfoDialog.querySelector('[rel="parkingLotGCN"]').innerText = parkingLotObject['generalCarNumber'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotDCN"]').innerText = parkingLotObject['dpCarNumber'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotDescription"]').innerText = parkingLotObject['description'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotPrice"]').innerText = parkingLotObject['price'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotDayMaxPrice"]').innerText = parkingLotObject['dayMaxPrice'];
    parkingLotInfoDialog.querySelector('[rel="parkingLotCreatedAt"]').innerText = parkingLotObject['createdAt'];

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

        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedPaymentsHistory"]').innerText = `${totalPaymentUnsolvedCount}` + '(미해결)' + ' / ' + `${totalPaymentCount}` + '(결제완료)';
        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedRefundsHistory"]').innerText = `${totalRefundUnsolvedCount}` + '(미해결)' + ' / ' + `${totalRefundCount}` + '(환불완료)';

        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedPaymentHistoryButton"]').onclick = () => {
            showReservedHistoryByPayments(responseObject['reservedHistoryArray']);
        }

        parkingLotInfoDialog.querySelector('[rel="parkingLotReservedRefundHistoryButton"]').onclick = () => {
            showReservedHistoryByRefunds(responseObject['reservedHistoryArray']);
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
    console.log(reservedHistoryArray);
    alert('ddd');
}

function showReservedHistoryByRefunds(reservedHistoryArray) {
    console.log(reservedHistoryArray);
    alert('dddddd');
}