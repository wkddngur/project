const listAside = document.getElementById('listAside');
const loading = document.getElementById('loading');

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
                <div class="thumbnailInfo">
                    <img alt="" class="thumbnail" src="./parkingLot/thumbnail?index=${parkingLotObject['index']}">
                    
                    <a class="contact" href="tel:${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}">${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}</a>
                    
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
                <div class="info">
                    <h3 class="title">
                        <span class="parkingLotName">${parkingLotObject['name']}</span>
                        <span class="parkingLotCategory">${parkingLotObject['parkingLotCategoryText']}</span>
                    </h3>
                    
                    <div class="address">
                        <span class="addressPrimary">${parkingLotObject['addressPrimary']}</span>
                        <span class="addressSecondary">${parkingLotObject['addressSecondary']}</span>
                    </div>
                    
                    <span class="generalCarNumber">최대 일반 차량 주차 대수 : ${parkingLotObject['generalCarNumber']}</span>
                    
                    <span class="dpCarNumber">최대 장애인 차량 주차 대수 : ${parkingLotObject['dpCarNumber']}</span>
                    
                    <span class="price">기준 가격 (10분) : ${parkingLotObject['price']}원</span>
                    
                    <span class="dayMaxPrice">최대 요금 (24시간) : ${parkingLotObject['dayMaxPrice']}원</span>
                </div>
            </li>
            `, "text/html").querySelector('li.item');

            parkingLotEl.onclick = () => {
                map.instance.setCenter(new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude']));
                map.instance.setLevel(2);
                listAside.hide();
                showDetailAside(parkingLotObject['index'], () => listAside.show());
            };
            parkingLotsEl.append(parkingLotEl);

            const marker = new kakao.maps.Marker({
                map: map.instance,
                position: new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude'])
            });

            // 지도에 생성된 마커 클릭시 메서드
            kakao.maps.event.addListener(marker, 'click', function (e) {
                showDetailAside(parkingLotObject['index'], () => listAside.show())
                map.instance.setCenter(new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude']));
                map.instance.setLevel(2);
            });

            map.markers.push(marker);
        }
    }
    xhr.open('GET', `./parkingLot/byCoords?minLat=${swCoords.getLat()}&minLng=${swCoords.getLng()}&maxLat=${neCoords.getLat()}&maxLng=${neCoords.getLng()}`);
    xhr.send(formData);
};

const searchParkingLots = (keyword) => {


    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        searching = true;

        const searchClearContainerEl = listAside.querySelector(':scope > .searchClear-container');
        searchClearContainerEl.innerHTML = '';

        const searchClear = new DOMParser().parseFromString(`
            <li class="searchClear">
                <button class="_obj-button" rel="searchClearButton">검색 초기화</button>
            </li>
        `, 'text/html').querySelector('li.searchClear');

        searchClearContainerEl.append(searchClear);

        listAside.querySelector('[rel="searchClearButton"]').onclick = () => {
            location.href = '/';
        }

        const parkingLotsEl = listAside.querySelector(':scope > .parkingLots');
        const searchParkingLotArray = JSON.parse(xhr.responseText);
        parkingLotsEl.innerHTML = '';



        if (searchParkingLotArray.length === 0) {
            parkingLotsEl.innerHTML = '<li class="empty">검색된 주차장이 없습니다.<br><br>주차장 검색은 주차장 이름, 주소를 통해서 가능합니다.</li>';
            map.markers ??= [];
            map.markers.forEach(marker => marker.setMap(null));
            map.markers = [];
            return;
        }



        map.markers ??= [];
        map.markers.forEach(marker => marker.setMap(null));
        map.markers = [];

        for (let parkingLotObject of searchParkingLotArray) {
            const parkingLotEl = new DOMParser().parseFromString(`
            <li class="item">
                <div class="thumbnailInfo">
                    <img alt="" class="thumbnail" src="./parkingLot/thumbnail?index=${parkingLotObject['index']}">
                    
                    <a class="contact" href="tel:${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}">${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}</a>
                    
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
                <div class="info">
                    <h3 class="title">
                        <span class="parkingLotName">${parkingLotObject['name']}</span>
                        <span class="parkingLotCategory">${parkingLotObject['parkingLotCategoryText']}</span>
                    </h3>
                    
                    <div class="address">
                        <span class="addressPrimary">${parkingLotObject['addressPrimary']}</span>
                        <span class="addressSecondary">${parkingLotObject['addressSecondary']}</span>
                    </div>
                    
                    <span class="generalCarNumber">최대 일반 차량 주차 대수 : ${parkingLotObject['generalCarNumber']}</span>
                    
                    <span class="dpCarNumber">초대 장애인 차량 주차 대수 : ${parkingLotObject['dpCarNumber']}</span>
                    
                    <span class="price">기준 가격 (10분) : ${parkingLotObject['price']}원</span>
                    
                    <span class="dayMaxPrice">최대 요금 (24시간) : ${parkingLotObject['dayMaxPrice']}원</span>
                </div>
            </li>
            `, 'text/html').querySelector('li.item');

            parkingLotEl.onclick = () => {
                map.instance.setCenter(new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude']));
                map.instance.setLevel(2);
                listAside.hide();
                showDetailAside(parkingLotObject['index'], () => listAside.show());
            };

            parkingLotsEl.append(parkingLotEl);

            const marker = new kakao.maps.Marker({
                map: map.instance,
                position: new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude'])
            });

            kakao.maps.event.addListener(marker, 'click', function (e) {
                showDetailAside(parkingLotObject['index'], () => listAside.show())
                map.instance.setCenter(new kakao.maps.LatLng(parkingLotObject['latitude'], parkingLotObject['longitude']));
                map.instance.setLevel(2);
            });

            map.markers.push(marker);
        }

    }
    xhr.open('GET', `../search?keyword=${keyword}`);
    xhr.send();
    loading.show();
}