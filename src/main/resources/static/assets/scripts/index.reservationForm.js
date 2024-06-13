const reservationForm = document.getElementById('reservationForm');


const showReservationForm = () => {
    reservationForm.show();
    cover.show();

    // cover 를 누르면 취소가 되는 상황을 방지하고자 주석 처리. 취소 버튼을 눌렀을 때만 사라지도록 설정.
    // cover.show(() => {
    //     reservationForm.hide();
    //     cover.hide();
    // });
};

detailAside.querySelector('[rel="reservationButton"]').onclick = () => {
    showReservationForm();
}


reservationForm.querySelector('[rel="cancelButton"]').onclick = () => {
    reservationForm.hide();
    cover.hide();
}


// reservationForm.querySelectorAll('[rel="closer"]').forEach(closer => closer.onclick = () => {
//     reservationForm.hide();
// });

// reservationForm.phoneLabel = new LabelObj(reservationForm.querySelector('[rel="phoneLabel"]'));
// reservationForm.carLabel = new LabelObj(reservationForm.querySelector('[rel="carLabel"]'));
// reservationForm.dateLabel = new LabelObj(reservationForm.querySelector('[rel="dateLabel"]'));
// reservationForm.timeLabel = new LabelObj(reservationForm.querySelector('[rel="timeLabel"]'));

// reservationForm.onsubmit = e => {
//     e.preventDefault();
//     reservationForm.phoneLabel.setValid(reservationForm['phoneNumber']);
//     reservationForm.carLabel.setValid(reservationForm['carNumber']);
//     reservationForm.dateLabel.setValid(reservationForm['date']);
//     reservationForm.timeLabel.setValid(reservationForm['time']);
//     if (!reservationForm.phoneLabel.isValid()) {
//         MessageObj.createSimpleOk('경고', '올바른 휴대전화번호를 입력해 주세요.', () => {
//             reservationForm['phoneNumber'].focus();
//         }).show();
//         return;
//     }
//     const xhr = new XMLHttpRequest();
//     const formData = new FormData();
//     xhr.onreadystatechange = function () {
//         if (xhr.readyState !== XMLHttpRequest.DONE) {
//             return;
//         }
//         if (xhr.status < 200 || xhr.status >= 300) {
//             MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 이용해 주세요.').show();
//             return;
//         }
//         const responseObject = JSON.parse(xhr.responseText);
//         if (responseObject.result === 'success') {
//             location.href = '/';
//             return;
//         }
//         const [dTitle, dContent, dOnclick] = {
//             failure: ['경고', '입력하신 휴대전화 번호를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.', () => {
//                 reservationForm['phoneNumber'].focus();
//                 reservationForm['carNumber'].value = '';
//             }],
//             failure_suspended: ['경고', '이용이 일시적으로 정지된 계정입니다. 고객센터를 통해 문의해 주세요.', () => location.href = '/access']
//         }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
//         MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
//     }
//     xhr.open('POST', '/reservation');
//     xhr.send(formData);
// }