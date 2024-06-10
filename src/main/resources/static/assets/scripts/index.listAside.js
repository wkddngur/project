const listAside = document.getElementById('listAside');

const loadParkingLots = () => {
    const mapBounds = map.instance.getBounds();
    const swCoords = mapBounds.getSouthWest();
    const neCoords = mapBounds.getNorthEast();

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const parkingLotsEl = listAside.querySelector(':scope > .parkingLots');
        const parkingLotArray = JSON.parse(xhr.responseText);

        parkingLotsEl.innerHTML = '';

        if (parkingLotArray.length === 0) {
            parkingLotsEl.innerHTML = '<li class="empty">현재 위치에 등록된 주차장이 없습니다.<br><br>지도 위치를 옮겨보세요.</li>';
            return;
        }

        map.markers ??= [];
        map.markers.forEach(marker => marker.setMap(null));
        map.markers = [];

        for (let parkingLotObject of parkingLotArray) {
            const parkingLotEl = new DOMParser().parseFromString(`
            <li class="item">
                <img alt="" class="thumbnail" src="./parkingLot/thumbnail?index=${parkingLotObject['index']}">
                <div class="info">
                    <h3 class="title">
                        <span class="title">${parkingLotObject['name']}</span>
                        <span class="category">${parkingLotObject['categoryCode']}</span>
                    </h3>
                    <span class="address">${parkingLotObject['addressPrimary']} ${parkingLotObject['addressSecondary']}</span>
                    <a class="contact" href="tel:${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}">${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}</a>
                    <span class="generalCarNumber">일반 차량 주차가능 대수 : ${parkingLotObject['reserveGeneralCarNumber']} / ${parkingLotObject['generalCarNumber']}</span>
                    <span class="dpCarNumber">장애인 차량 주차가능 대수 : ${parkingLotObject['reserveDpCarNumber']} / ${parkingLotObject['dpCarNumber']}</span>
                    <span class="price">기준가격(10분) : ${parkingLotObject['price']}</span>
                    <span class="dayMaxPrice">하루 최대 요금(24시간) : ${parkingLotObject['dayMaxPrice']}</span>
                    <ul class="menu">
                        <li class="item favorite">
                            <i class="icon fa-solid fa-star"></i>
                            <span class="text">${parkingLotObject['favoriteCount']}</span>
                        </li>
                        <li class="item review">
                            <i class="icon fa-solid fa-comments"></i>
                            <span class="text">${parkingLotObject['reviewCount']}</span>
                        </li>
                    </ul>
                </div>
            </li>
            `, "text/html").querySelector('li.item');

            parkingLotEl.onclick = () => {
                map.instance.setCenter(new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude']));
                map.instance.setLevel(2);
                listAside.hide();
                detailAside.show();
            };
            parkingLotsEl.append(parkingLotEl);

            const marker = new kakao.maps.Marker({
                map: map.instance,
                position: new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude'])
            });
            map.markers.push(marker);
        }
    }
    xhr.open('GET', `./parkingLot/byCoords?minLat=${swCoords.getLat()}&minLng=${swCoords.getLng()}&maxLat=${neCoords.getLat()}&maxLng=${neCoords.getLng()}`);
    xhr.send(formData);
};