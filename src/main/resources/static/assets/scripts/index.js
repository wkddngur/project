const map = document.getElementById('map');

const loadMap = (lat, lng, lv) => {
    lat ??= 35.8715411;
    lng ??= 128.601505;
    lv ??= 3;
    map.instance = new kakao.maps.Map(map, {
        center: new kakao.maps.LatLng(lat, lng),
        level: lv
    });

    kakao.maps.event.addListener(map.instance, 'bounds_changed', () => {
        const mapCenter = map.instance.getCenter();
        localStorage.setItem('mapLastLat', mapCenter.getLat());
        localStorage.setItem('mapLastLng', mapCenter.getLng());
        localStorage.setItem('mapLastLv', map.instance.getLevel());
    });

    kakao.maps.event.addListener(map.instance, 'dragend', () => {
        loadParkingLots();
    });

    kakao.maps.event.addListener(map.instance, 'zoom_changed', () => {
        loadParkingLots();
    });

    kakao.maps.event.addListener(map.instance, 'tilesloaded', () => {
        loadParkingLots();
    });
}


if (!isNaN(parseFloat(localStorage.getItem('mapLastLat'))) &&
    !isNaN(parseFloat(localStorage.getItem('mapLastLng'))) &&
    !isNaN(parseFloat(localStorage.getItem('mapLastLv')))) {

    loadMap(
        parseFloat(localStorage.getItem('mapLastLat')),
        parseFloat(localStorage.getItem('mapLastLng')),
        parseInt(localStorage.getItem('mapLastLv')),
    )
} else {
    // 비동기식으로 위치 확인 동의 안내문구 띄우는거. 크롬 우측 위에서 차단 동의 하면서 먹히는지 확인가능.
    navigator.geolocation.getCurrentPosition((data) => {
        loadMap(data.coords.latitude, data.coords.longitude);
    }, () => {
        loadMap();
    });
}