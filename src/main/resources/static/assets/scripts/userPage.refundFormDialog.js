const refundFormDialog = document.getElementById('refundFormDialog');

function showRefundFormDialog(reservedHistoryObject) {
    cover.show();
    refundFormDialog.show();
    refundFormDialog.scrollTop = 0;

    refundFormDialog.bankCodeLabel = new LabelObj(refundFormDialog.querySelector('[rel="bankCodeLabel"]'));
    refundFormDialog.querySelector('[rel="bankCodeLabel"]').classList.remove(HTMLElement.INVALID_CLASS_NAME);
    refundFormDialog.bankAccountNumberLabel = new LabelObj(refundFormDialog.querySelector('[rel="bankAccountNumberLabel"]'));
    refundFormDialog.querySelector('[rel="bankAccountNumberLabel"]').classList.remove(HTMLElement.INVALID_CLASS_NAME);

    refundFormDialog.querySelector('[name="totalPlace"]').value = reservedHistoryObject['amount'] + ' ' + '원';
    refundFormDialog.querySelector('[name="userName"]').value = reservedHistoryObject['userName'];

    refundFormDialog.querySelector('[name="bankCode"]').value = '-1';
    refundFormDialog.querySelector('[name="bankAccountNumber"]').value = '';


    refundFormDialog.onsubmit = (e) => {
        e.preventDefault();

        refundFormDialog.bankCodeLabel.setValid(refundFormDialog['bankCode'].value !== '-1');

        refundFormDialog.bankAccountNumberLabel.setValid(refundFormDialog['bankAccountNumber'].tests());

        if (!refundFormDialog.bankCodeLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '환불받을 은행을 선택해 주세요.', () => {
                refundFormDialog.bankAccountNumberLabel['bankAccountNumber'].focus();
            }).show();
            return;
        }

        if (!refundFormDialog.bankAccountNumberLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '올바른 계좌번호를 입력해 주세요.', () => {
                refundFormDialog.bankAccountNumberLabel['bankAccountNumber'].focus();
            }).show();
            return;
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();

        formData.append('parkingLotIndex', reservedHistoryObject['parkingLotIndex']);
        formData.append('paymentIndex', reservedHistoryObject['paymentIndex'])
        formData.append('userEmail', reservedHistoryObject['userEmail']);
        formData.append('amount', reservedHistoryObject['amount']);
        formData.append('bankCode', refundFormDialog.querySelector('[name="bankCode"]').value);
        formData.append('bankAccountNumber', refundFormDialog.querySelector('[name="bankAccountNumber"]').value);
        xhr.onreadystatechange = function () {
            if (xhr.readyState !== XMLHttpRequest.DONE) {
                return;
            }
            if (xhr.status < 200 || xhr.status >= 300) {
                MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', () => location.reload()).show();
                return;
            }
            const responseObject = JSON.parse(xhr.responseText);
            const [dTitle, dContent, dOnclick] = {
                failure: ['경고', '알 수 없는 이유로 환불신청을 하지 못 하였습니다. 잠시 후 다시 시도해 주세요.'],
                failure_user_suspended_or_deleted:['경고', '정지되었거나 삭제된 이메일 입니다. 잠시 후 다시 시도해 주세요.'],
                failure_parking_lot_not_found: ['경고', '환불하려는 주차장이 존재하지 않습니다. 잠시 후 다시 시도해 주세요.'],
                failure_payment_not_found:['경고', '결제 내역이 존재하지 않습니다. 잠시 후 다시 시도해 주세요.'],
                failure_duplicate_refund: ['경고', '이미 환불 신청을 한 상태입니다. 잠시 후 다시 시도해 주세요.'],
                failure_user_email_mismatch:['경고', '예약한 이메일과 동일한 이메일이 아닙니다. 잠시 후 다시 시도해 주세요.', () => {
                    location.href = '/access/userLogout';
                }],
                success: ['알림', '환불신청을 완료 하였습니다.', () => {
                    location.href = '/userPage/';
                }]
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }
        xhr.open('POST', '/userPage/refund');
        xhr.send(formData);
    };

    refundFormDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        refundFormDialog.hide();
        cover.hide();
    }
}