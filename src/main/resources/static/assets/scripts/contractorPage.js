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

        if (parkingLotArray.length === 0) {
            parkingLotInfoDiv.querySelector('[rel="parkingLotTable"]').innerHTML = '';
            parkingLotInfoDiv.querySelector('[rel="parkingLotTable"]').innerHTML = `<div style="width: 100%; font-size: 1.1rem; padding: 0.5rem; text-align: center;">등록된 주차장이 없습니다. 주차장 등록 카테고리로 이동하여 주차장 등록을 진행해 주세요.</div>`
            return;
        }

        for (let parkingLotObject of parkingLotArray) {

            contractorInfoDiv.querySelector('[rel="totalParkingLotCount"]').innerText = parkingLotArray.length + ' 개';

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

