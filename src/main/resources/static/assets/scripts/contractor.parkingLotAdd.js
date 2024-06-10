const parkingLotAdd = document.getElementById('parkingLotAdd');
const addressFinder = document.getElementById('addressFinder');

parkingLotAdd.parkingLotAddForm = parkingLotAdd.querySelector('[rel="parkingLotAddForm"]');

addressFinder.show = (oncomplete) => {
    new daum.Postcode({
        width: '100%',
        height: '100%',
        oncomplete: oncomplete
    }).embed(addressFinder.querySelector(':scope > .dialog'));
    addressFinder.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
}

addressFinder.onclick = (e) => {
    if (e.target !== e.currentTarget) {
        return;
    }
    addressFinder.hide();
}

parkingLotAdd.parkingLotAddForm['addressFind'].onclick = () => {
    addressFinder.show((data) => {
        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(data['address'], (result, status) => {
            if (status !== kakao.maps.services.Status.OK) {
                return;
            }
            const coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            parkingLotAdd.parkingLotAddForm['latitude'].value = coords.getLat();
            parkingLotAdd.parkingLotAddForm['longitude'].value = coords.getLng();
        });

        parkingLotAdd.parkingLotAddForm['addressPostal'].value = data['zonecode'];
        parkingLotAdd.parkingLotAddForm['addressPrimary'].value = data['address'];
        addressFinder.hide();
    });
}

parkingLotAdd.parkingLotAddForm['thumbnail'].onchange = () => {
    const thumbnailLabel = parkingLotAdd.parkingLotAddForm.querySelector(':scope > .thumbnail');
    const imageWrapper = thumbnailLabel.querySelector(':scope > .image-wrapper');
    const empty = imageWrapper.querySelector(':scope > .empty');
    const image = imageWrapper.querySelector(':scope > .image');

    if (parkingLotAdd.parkingLotAddForm['thumbnail'].files.length === 0) {
        empty.style.display = 'flex';
        image.style.display = 'none';
        return;
    }

    const fileReader = new FileReader();

    fileReader.onload = () => {
        empty.style.display = 'none';
        image.style.display = 'flex';
        image.setAttribute('src', fileReader.result);
    };
    fileReader.readAsDataURL(parkingLotAdd.parkingLotAddForm['thumbnail'].files[0]);
}

parkingLotAdd.parkingLotAddForm.thumbnailLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="thumbnailLabel"]'));
parkingLotAdd.parkingLotAddForm.nameLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="nameLabel"]'));
parkingLotAdd.parkingLotAddForm.categoryLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="categoryLabel"]'));
parkingLotAdd.parkingLotAddForm.contactLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="contactLabel"]'));
parkingLotAdd.parkingLotAddForm.addressLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="addressLabel"]'));
parkingLotAdd.parkingLotAddForm.descriptionLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="descriptionLabel"]'));
parkingLotAdd.parkingLotAddForm.generalCarNumberLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="generalCarNumberLabel"]'));
parkingLotAdd.parkingLotAddForm.dpCarNumberLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="dpCarNumberLabel"]'));
parkingLotAdd.parkingLotAddForm.priceLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="priceLabel"]'));
parkingLotAdd.parkingLotAddForm.dayMaxPriceLabel = new LabelObj(parkingLotAdd.parkingLotAddForm.querySelector('[rel="dayMaxPriceLabel"]'));

parkingLotAdd.parkingLotAddForm.onsubmit = (e) => {
    e.preventDefault();

    parkingLotAdd.parkingLotAddForm.thumbnailLabel.setValid(parkingLotAdd.parkingLotAddForm['thumbnail'].files.length > 0);
    parkingLotAdd.parkingLotAddForm.nameLabel.setValid(parkingLotAdd.parkingLotAddForm['name'].tests());
    parkingLotAdd.parkingLotAddForm.categoryLabel.setValid(parkingLotAdd.parkingLotAddForm['categoryCode'].value !== '-1');
    parkingLotAdd.parkingLotAddForm.contactLabel.setValid(parkingLotAdd.parkingLotAddForm['contactFirst'].tests() && parkingLotAdd.parkingLotAddForm['contactSecond'].tests() && parkingLotAdd.parkingLotAddForm['contactThird'].tests());
    parkingLotAdd.parkingLotAddForm.addressLabel.setValid(parkingLotAdd.parkingLotAddForm['addressPostal'].tests() && parkingLotAdd.parkingLotAddForm['addressPrimary'].tests() && parkingLotAdd.parkingLotAddForm['addressSecondary'].tests());
    parkingLotAdd.parkingLotAddForm.descriptionLabel.setValid(parkingLotAdd.parkingLotAddForm['description'].tests());
    parkingLotAdd.parkingLotAddForm.generalCarNumberLabel.setValid(parkingLotAdd.parkingLotAddForm['generalCarNumber'].tests());
    parkingLotAdd.parkingLotAddForm.dpCarNumberLabel.setValid(parkingLotAdd.parkingLotAddForm['dpCarNumber'].tests());
    parkingLotAdd.parkingLotAddForm.priceLabel.setValid(parkingLotAdd.parkingLotAddForm['price'].tests());
    parkingLotAdd.parkingLotAddForm.dayMaxPriceLabel.setValid(parkingLotAdd.parkingLotAddForm['dayMaxPrice'].tests());

    if (parkingLotAdd.parkingLotAddForm['thumbnail'].files.length === 0) {
        MessageObj.createSimpleOk('경고', '대표 이미지를 선택해 주세요.').show();
        parkingLotAdd.scrollTop = 0;
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.nameLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 주차장 상호명을 입력해주세요.', () => {
            parkingLotAdd.parkingLotAddForm['name'].focus();
        }).show();
        return;
    }

    if (parkingLotAdd.parkingLotAddForm['categoryCode'].value === 'reserve' || parkingLotAdd.parkingLotAddForm['categoryCode'].value === 'fcfs') {

    } else {
        MessageObj.createSimpleOk('경고', '주차장 분류를 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['categoryCode'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.contactLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 연락처를 입력해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['contactFirst'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.addressLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '주차장 주소를 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['addressSecondary'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.generalCarNumberLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '일반 차량 주차가능 대수를 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['generalCarNumber'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.dpCarNumberLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '장애인 차량 주차가능 대수를 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['dpCarNumber'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.descriptionLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '주차장 안내사항을 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['description'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.priceLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '10분당 가격을 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['price'].focus();
        }).show();
        return;
    }

    if (!parkingLotAdd.parkingLotAddForm.dayMaxPriceLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '하루 최대 요금을 확인해 주세요.', () => {
            parkingLotAdd.parkingLotAddForm['dayMaxPrice'].focus();
        }).show();
        return;
    }
    
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append('contractorEmail', parkingLotAdd.parkingLotAddForm['contractorEmail'].value);
    formData.append('contractorName', parkingLotAdd.parkingLotAddForm['contractorName'].value);
    formData.append('_thumbnail', parkingLotAdd.parkingLotAddForm['thumbnail'].files[0]);
    formData.append('name', parkingLotAdd.parkingLotAddForm['name'].value);
    formData.append('categoryCode', parkingLotAdd.parkingLotAddForm['categoryCode'].value);
    formData.append('contactFirst', parkingLotAdd.parkingLotAddForm['contactFirst'].value);
    formData.append('contactSecond', parkingLotAdd.parkingLotAddForm['contactSecond'].value);
    formData.append('contactThird', parkingLotAdd.parkingLotAddForm['contactThird'].value);
    formData.append('addressPostal', parkingLotAdd.parkingLotAddForm['addressPostal'].value);
    formData.append('addressPrimary', parkingLotAdd.parkingLotAddForm['addressPrimary'].value);
    formData.append('addressSecondary', parkingLotAdd.parkingLotAddForm['addressSecondary'].value);
    formData.append('latitude', parkingLotAdd.parkingLotAddForm['latitude'].value);
    formData.append('longitude', parkingLotAdd.parkingLotAddForm['longitude'].value);
    formData.append('generalCarNumber', parkingLotAdd.parkingLotAddForm['generalCarNumber'].value);
    formData.append('dpCarNumber', parkingLotAdd.parkingLotAddForm['dpCarNumber'].value);
    formData.append('description', parkingLotAdd.parkingLotAddForm['description'].value);
    formData.append('price', parkingLotAdd.parkingLotAddForm['price'].value);
    formData.append('dayMaxPrice', parkingLotAdd.parkingLotAddForm['dayMaxPrice'].value);

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
            failure: ['경고', '알 수 없는 이유로 주차장을 등록하지 못하였습니다. 잠시 후 다시 시도해 주세요.'],

            failure_not_contractor_login: ['경고', '협력업체 로그인이 되어 있지 않습니다.', () => location.href = '/access/'],

            failure_duplicate_address: ['경고', '중복되는 주차장 주소가 존재합니다. 다른 주소를 입력해 주세요.', () => parkingLotAdd.parkingLotAddForm['addressPostal'].focus()],

            failure_duplicate_description: ['경고', '주차장 안내사항이 입력되지 않았습니다. 다시 확인해 주세요.', () => parkingLotAdd.parkingLotAddForm['description'].focus()],

            success: ['알림', '주차장을 성공적으로 등록하였습니다.', () => location.href = '/contractor/']
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        
    }
    xhr.open('POST', '/contractor/parkingLotAdd/');
    xhr.send(formData);

}

