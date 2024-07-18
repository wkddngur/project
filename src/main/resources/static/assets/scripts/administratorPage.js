const administratorPage = document.getElementById('administratorPage');
const contractorInfoDiv = document.getElementById('contractorInfoDiv');

administratorPage.querySelector('[rel="closer"]').onclick = () => {
    location.href = '../';
}

getContractorInfo();

function getContractorInfo() {
    contractorInfoDiv.querySelector('[rel="contractorInfoTbody"]').innerHTML = '';

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const contractorArray = JSON.parse(xhr.responseText);

        if (contractorArray.length === 0) {
            contractorInfoDiv.querySelector('[rel="contractorInfoTable"]').innerHTML = '';
            contractorInfoDiv.querySelector('[rel="contractorInfoTable"]').innerHTML = `<div style="width: 100%; font-size: 1.1rem; padding: 0.5rem; text-align: center;">등록된 협력업체가 없습니다.</div>`
        }

        for (let contractorObject of contractorArray) {
            let createdAt = new Date(contractorObject['createdAt']);
            let createdAtFormat = dateFormat(createdAt);

            let suspendedStatus = '정상';
            if (contractorObject['suspended']) {
                suspendedStatus = '정지됨'
            }

            let deleteStatus = '정상';
            if (contractorObject['deleted']) {
                deleteStatus = '삭제됨'
            }

            let approvedStatus = '정상';
            if (!contractorObject['approved']) {
                approvedStatus = `<button class="_obj-button" rel="approvedConfirmButton" type="button">가입 승인</button>`
            }

            const contractorEl = new DOMParser().parseFromString(`
            <div class="contractor-info-tr">
                <span class="text">${contractorObject['email']}</span>
                <span class="text">${contractorObject['name']}</span>
                <span class="text">${contractorObject['contactFirst']}-${contractorObject['contactSecond']}-${contractorObject['contactThird']}</span>
                <span class="text">${contractorObject['tinFirst']}-${contractorObject['tinSecond']}-${contractorObject['tinThird']}</span>
                <span class="text">${createdAtFormat}</span>
                <span class="text" rel="suspendedStatus">${suspendedStatus}</span>
                <span class="text" rel="deleteStatus">${deleteStatus}</span>
                <span class="text" rel="approvedStatus">${approvedStatus}</span>
            </div>
            `, "text/html").querySelector('div.contractor-info-tr');

            if (suspendedStatus === '정상') {
                contractorEl.querySelector('[rel="suspendedStatus"]').style.color = 'green';
            } else {
                contractorEl.querySelector('[rel="suspendedStatus"]').style.color = 'red';
            }

            if (deleteStatus === '정상') {
                contractorEl.querySelector('[rel="deleteStatus"]').style.color = 'green';
            } else {
                contractorEl.querySelector('[rel="deleteStatus"]').style.color = 'red';
            }

            if (approvedStatus === '정상') {
                contractorEl.querySelector('[rel="approvedStatus"]').style.color = 'green';
            }

            contractorEl.querySelector('[rel="approvedConfirmButton"]')?.addEventListener('click', () => {
                approvedConfirm(contractorObject);
            });

            contractorInfoDiv.querySelector('[rel="contractorInfoTbody"]').append(contractorEl);
        }

    }
    xhr.open('GET', '/administratorPage/contractorList');
    xhr.send();
}

function approvedConfirm(contractorObject) {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", contractorObject['email']);
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
            failure: ['경고', '알 수 없는 이유로 가입 승인에 실패하였습니다. 입력값 또는 로직을 다시 확인해 주세요.'],
            success: ['알림', '가입 승인에 성공하였습니다.', () => {
                location.reload();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('PATCH', '/administratorPage/approvedConfirm');
    xhr.send(formData);
}