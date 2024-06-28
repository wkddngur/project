const contractorPageDiv = document.getElementById('contractorPage');
const contractorInfoDiv = document.getElementById('contractorInfo');
const parkingLotInfoDiv = document.getElementById('parkingLotInfo');

contractorPageDiv.querySelector('[rel="contractorLogout"]').onclick = () => {
    if (confirm('협력업체 로그아웃 하시겠습니까?')) {
        location.href = '/access/contractorLogout';
    } else {
        return;
    }
}


getParkingLotList();

function getParkingLotList() { // 협력업체 페이지 접근시 parkingLots 를 끌어와주는 get 메서드
    parkingLotInfoDiv.querySelector('[rel="parkingLotTbody"]').innerHTML = '';
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', () => location.reload()).show();
            return;
        }
        const parkingLotArray = JSON.parse(xhr.responseText);

        for (let parkingLotObject of parkingLotArray) {
            const parkingLotEl = new DOMParser().parseFromString(`
        <div class="parkingLot-list-tr">
            <span class="text index">${parkingLotObject['index']}</span>
            <span class="text title" rel="showReservedHistoryDialog">${parkingLotObject['name']}</span>
            <span class="text">${parkingLotObject['addressPrimary'] + ' ' + parkingLotObject['addressSecondary']}</span>
            <span class="text">${parkingLotObject['parkingLotCategoryText'] + '(' + parkingLotObject['categoryCode'] + ')'}</span>
            <span class="text">${parkingLotObject['contractorEmail']}</span>
        </div>
        `, "text/html").querySelector('div.parkingLot-list-tr');

            parkingLotEl.querySelector('[rel="showReservedHistoryDialog"]').onclick = () => {
                showParkingLotInfoDialog(parkingLotObject);
            };

            parkingLotInfoDiv.querySelector('[rel="parkingLotTbody"]').append(parkingLotEl);
        }

    }
    xhr.open('GET', `/contractor/parkingLotList?contractorEmail=${contractorInfoDiv.querySelector('[name="contractorEmail"]').value}`);
    xhr.send();
}

