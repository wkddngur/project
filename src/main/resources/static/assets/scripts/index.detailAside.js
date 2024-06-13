const detailAside = document.getElementById('detailAside');

const showDetailAside = (parkingLotIndex, onclose) => {

    // loadReviews 들어올 자리

    // review 불러오기 위한 parkingLotIndex 찍어줄 자리.

    detailAside.scrollTop = 0;

    detailAside.querySelectorAll('[rel="closer"]').forEach(closer => closer.onclick = () => {
        detailAside.hide();
        if (typeof onclose === 'function') {
            onclose();
        }
    });

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.', () => location.reload()).show();
            return;
        }
        const parkingLotObject = JSON.parse(xhr.responseText);

        detailAside.querySelector('[rel="name"]').innerText = parkingLotObject['name'];
        detailAside.querySelector('[rel="parkingLotCategoryText"]').innerText = parkingLotObject['parkingLotCategoryText'];
        detailAside.querySelector('[rel="favoriteCount"]').innerText = parkingLotObject['favoriteCount'];
        detailAside.querySelector('[rel="reviewCount"]').innerText = parkingLotObject['reviewCount'];
        detailAside.querySelector('[rel="address"]').innerText = `${parkingLotObject['addressPrimary']} ${parkingLotObject['addressSecondary']}`;
        detailAside.querySelector('[rel="contact"]').href = `tel:${parkingLotObject['contactFirst']} ${parkingLotObject['contactSecond']} ${parkingLotObject['contactThird']}`;
        detailAside.querySelector('[rel="contact"]').innerText = `${parkingLotObject['contactFirst']}-${parkingLotObject['contactSecond']}-${parkingLotObject['contactThird']}`;
        detailAside.querySelector('[rel="generalCarNumber"]').innerText = parkingLotObject['generalCarNumber'];
        detailAside.querySelector('[rel="dpCarNumber"]').innerText = parkingLotObject['dpCarNumber'];
        detailAside.querySelector('[rel="price"]').innerText = parkingLotObject['price'];
        detailAside.querySelector('[rel="dayMaxPrice"]').innerText = parkingLotObject['dayMaxPrice'];
        detailAside.querySelector('[rel="description"]').innerText = parkingLotObject['description'];
        detailAside.querySelector('[rel="contractorName"]').innerText = parkingLotObject['contractorName'];

        if (parkingLotObject['saved'] === true) {
            detailAside.querySelector('[rel="saveButton"]').classList.add('-saved');
        } else {
            detailAside.querySelector('[rel="saveButton"]').classList.remove('-saved');
        }

        const imageContainerEl = detailAside.querySelector('[rel="imageContainer"]');
        imageContainerEl.querySelectorAll('.image').forEach(image => image.remove());
        for (const imageIndex of parkingLotObject['imageIndexes']) {
            const imageEl = document.createElement('img');
            imageEl.setAttribute('alt', '');
            imageEl.setAttribute('class', 'image');
            imageEl.setAttribute('src', `/parkingLot/image?index=${imageIndex}`);
            imageContainerEl.append(imageEl);
        }


        applyFlickity(detailAside.querySelector('[rel="imageContainer"]'));




        detailAside.show();
    }
    xhr.open('GET', `/parkingLot/?index=${parkingLotIndex}`);
    xhr.send(formData);
}


const applyFlickity = (imageContainer) => {
        new Flickity(imageContainer, {
            cellAlign: 'left',
            contain: true,
            pageDots: false,
            wrapAround: true
        });
};

