const map = document.getElementById('map');
const cover = document.getElementById('cover');

let searching = false; // 검색한 상황인지에 대한 판단을 위한 변수.

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
        if (searching === true) return;
        loadParkingLots();
    });

    kakao.maps.event.addListener(map.instance, 'zoom_changed', () => {
        if (searching === true) return;
        loadParkingLots();
    });

    kakao.maps.event.addListener(map.instance, 'tilesloaded', () => {
        if (searching === true) return;
        loadParkingLots();
    });
}

// 기본적으로 cover 를 보여주는 역할을 하지만 show() 사용 시 괄호안에 클릭 이벤트가 들어왔을 때 행할 함수들을 지정해 줄수 있다는 메서드.
cover.show = (onclick) => {
    cover.onclick = onclick;
    cover.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
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


function dateFormat(dateTime) {
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let date = dateTime.getDate();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute === 0) {
        minute = '0' + minute;
    }

    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute;
    // YYYY-MM-DD HH:mm
}

function onlyDateFormat(dateTime) {
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let date = dateTime.getDate();

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }

    return year + '-' + month + '-' + date;
    // YYYY-MM-DD
}

function dateFormatBySecond(dateTime) {
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let date = dateTime.getDate();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let second = dateTime.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute === 0 || minute < 10) {
        minute = '0' + minute;
    }
    if (second === 0 || second < 10) {
        second = '0' + second;
    }

    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    // YYYY-MM-DD HH:mm
}