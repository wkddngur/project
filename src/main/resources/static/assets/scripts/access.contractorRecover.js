const contractorRecoverDiv = document.getElementById('ContractorRecoverDiv');
const loading = document.getElementById('loading');

contractorRecoverDiv.querySelector('[rel="goLoginCaller"]').onclick = () => {
    location.href = '/access/';
}

// email 찾기 시 입력 내용 정규화를 위한 라벨링.
contractorRecoverDiv.emailForm = contractorRecoverDiv.querySelector('[rel="emailForm"]');
contractorRecoverDiv.emailForm.nameLabel = new LabelObj(contractorRecoverDiv.emailForm.querySelector('[rel="nameLabel"]'));
contractorRecoverDiv.emailForm.contactLabel = new LabelObj(contractorRecoverDiv.emailForm.querySelector('[rel="contactLabel"]'));
contractorRecoverDiv.emailForm.tinLabel = new LabelObj(contractorRecoverDiv.emailForm.querySelector('[rel="tinLabel"]'));

// email 변경 시 입력 내용 정규화를 위한 라벨링.
contractorRecoverDiv.passwordForm = contractorRecoverDiv.querySelector('[rel="passwordForm"]');
contractorRecoverDiv.passwordForm.emailLabel = new LabelObj(contractorRecoverDiv.passwordForm.querySelector('[rel="emailLabel"]'));
contractorRecoverDiv.passwordForm.passwordLabel = new LabelObj(contractorRecoverDiv.passwordForm.querySelector('[rel="passwordLabel"]'));

// 이름 성별 생년월일로 email 찾기 위한 메서드.
contractorRecoverDiv.emailForm.onsubmit = (e) => {
    e.preventDefault();

    contractorRecoverDiv.emailForm.nameLabel.setValid(contractorRecoverDiv.emailForm['name'].tests());
    contractorRecoverDiv.emailForm.contactLabel.setValid(contractorRecoverDiv.emailForm['contactFirst'].tests());
    contractorRecoverDiv.emailForm.contactLabel.setValid(contractorRecoverDiv.emailForm['contactSecond'].tests());
    contractorRecoverDiv.emailForm.contactLabel.setValid(contractorRecoverDiv.emailForm['contactThird'].tests());
    contractorRecoverDiv.emailForm.tinLabel.setValid(contractorRecoverDiv.emailForm['tinFirst'].tests());
    contractorRecoverDiv.emailForm.tinLabel.setValid(contractorRecoverDiv.emailForm['tinSecond'].tests());
    contractorRecoverDiv.emailForm.tinLabel.setValid(contractorRecoverDiv.emailForm['tinThird'].tests());

    if (!contractorRecoverDiv.emailForm.nameLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 협력업체 이름을 입력해 주세요.', () => {
            recoverDiv.emailForm['name'].focus();
        }).show();

        return;
    }

    if (!contractorRecoverDiv.emailForm.contactLabel.isValid()) {
        MessageObj.createSimpleOk('경고','올바른 협력업체 대표번호를 입력해 주세요.', ()=> {
            contractorRecoverDiv.emailForm['contactFirst'].focus();
        }).show();
        return;
    }

    if (!contractorRecoverDiv.emailForm.tinLabel.isValid()) {
        MessageObj.createSimpleOk('경고','올바른 사업자 번호를 입력해 주세요.', ()=> {
            contractorRecoverDiv.emailForm['tinFirst'].focus();
        }).show();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("name", contractorRecoverDiv.emailForm['name'].value);
    formData.append("contactFirst", contractorRecoverDiv.emailForm['contactFirst'].value);
    formData.append("contactSecond", contractorRecoverDiv.emailForm['contactSecond'].value);
    formData.append("contactThird", contractorRecoverDiv.emailForm['contactThird'].value);
    formData.append("tinFirst", contractorRecoverDiv.emailForm['tinFirst'].value);
    formData.append("tinSecond", contractorRecoverDiv.emailForm['tinSecond'].value);
    formData.append("tinThird", contractorRecoverDiv.emailForm['tinThird'].value);


    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);

        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '입력하신 이름으로 회원 정보를 찾을 수 없습니다. 다시 확인해 주세요.', () => {
                contractorRecoverDiv.emailForm['name'].focus();
            }],
            success: ['알림', `회원님의 협력업체 이메일은 <b>${responseObject['email']}</b>입니다. 확인 버튼을 클릭하면 로그인 페이지로 돌아갑니다.`, () => {
                location.href = '/access/';
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('POST', '/access/contractorRecover/emailFind');
    xhr.send(formData);
};

// 협력업체 비밀번호 변경의 이메일 전송 버튼을 위한 메서드.
contractorRecoverDiv.passwordForm['emailSend'].onclick = () => {

    contractorRecoverDiv.passwordForm.emailLabel.setValid(contractorRecoverDiv.passwordForm['email'].tests());

    if (!contractorRecoverDiv.passwordForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 협력업체 이메일을 입력해주세요.', () => {
            contractorRecoverDiv.passwordForm['email'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", contractorRecoverDiv.passwordForm['email'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);

        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', `입력하신 이메일 <b>${responseObject['email']}</b>을 확인할 수 없습니다. 다시 입력해 주세요.`, () => {
                contractorRecoverDiv.passwordForm['email'].value = '';
                contractorRecoverDiv.passwordForm['email'].focus()
            }],

            success: ['알림', '입력하신 이메일로 인증번호를 전송하였습니다. 인증번호는 발급 후 3분이 지나면 사용이 불가합니다.', () => {
                contractorRecoverDiv.passwordForm['emailSalt'].value = responseObject['salt'];
                contractorRecoverDiv.passwordForm['email'].disable();
                contractorRecoverDiv.passwordForm['emailSend'].disable();
                contractorRecoverDiv.passwordForm['emailCode'].enable();
                contractorRecoverDiv.passwordForm['emailCode'].focus();
                contractorRecoverDiv.passwordForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('POST', '/access/contractorRecover/resetPasswordEmailSend');
    xhr.send(formData);
    loading.show();
};

// 협력업체 비밀번호 변경의 인증번호 확인 버튼을 위한 메서드.
contractorRecoverDiv.passwordForm['emailVerify'].onclick = () => {
    contractorRecoverDiv.passwordForm.emailLabel.setValid(contractorRecoverDiv.passwordForm['emailCode'].tests());

    if (!contractorRecoverDiv.passwordForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 인증번호를 입력해주세요.', () => {
            contractorRecoverDiv.passwordForm['emailCode'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", contractorRecoverDiv.passwordForm['email'].value);
    formData.append("code", contractorRecoverDiv.passwordForm['emailCode'].value);
    formData.append("salt", contractorRecoverDiv.passwordForm['emailSalt'].value);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const responseObject = JSON.parse(xhr.responseText);

        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '인증번호가 올바르지 않습니다. 다시 확인해 주세요.', () => {
                contractorRecoverDiv.passwordForm['emailCode'].value = '';
                contractorRecoverDiv.passwordForm['emailCode'].focus();
            }],
            failure_expired: ['경고', '인증번호가 만료되었습니다. 인증번호 전송을 다시 시도해 주세요.', () => {
                contractorRecoverDiv.passwordForm['emailSalt'].value = '';
                contractorRecoverDiv.passwordForm['email'].enable();
                contractorRecoverDiv.passwordForm['emailSend'].enable();
                contractorRecoverDiv.passwordForm['emailCode'].disable();
                contractorRecoverDiv.passwordForm['emailCode'].value = '';
                contractorRecoverDiv.passwordForm['emailVerify'].disable();
            }],
            success: ['경고', '이메일 인증이 완료되었습니다. 변경할 비밀번호를 입력해 주세요.', () => {
                contractorRecoverDiv.passwordForm['emailCode'].disable();
                contractorRecoverDiv.passwordForm['emailVerify'].disable();
                contractorRecoverDiv.passwordForm['password'].enable().focus();
                contractorRecoverDiv.passwordForm['passwordCheck'].enable();
            }],
        }[responseObject.result] || ['경고', '서버가 알수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('PATCH', '/access/contractorRecover/resetPasswordEmailCodeVerify');
    xhr.send(formData);
};

contractorRecoverDiv.passwordForm.onsubmit = (e) => {
    e.preventDefault();

    if (contractorRecoverDiv.passwordForm['emailSend'].isEnabled() || contractorRecoverDiv.passwordForm['emailVerify'].isEnabled()) {
        MessageObj.createSimpleOk('경고', '이메일 인증이 완료되지 않았습니다.').show();
    }

    contractorRecoverDiv.passwordForm.passwordLabel.setValid(contractorRecoverDiv.passwordForm['password'].tests());

    if (!contractorRecoverDiv.passwordForm.passwordLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 비밀번호를 입력해주세요.', () => {
            contractorRecoverDiv.passwordForm['password'].focus();
        }).show();
        return;
    }

    if (contractorRecoverDiv.passwordForm['password'].value !== contractorRecoverDiv.passwordForm['passwordCheck'].value) {
        MessageObj.createSimpleOk('경고', '입력하신 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', () => {
            contractorRecoverDiv.passwordForm['password'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", contractorRecoverDiv.passwordForm['email'].value);
    formData.append("code", contractorRecoverDiv.passwordForm['emailCode'].value);
    formData.append("salt", contractorRecoverDiv.passwordForm['emailSalt'].value);
    formData.append("password", contractorRecoverDiv.passwordForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '비밀번호 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.', () => contractorRecoverDiv.passwordForm['password'].focus()],

            success: ['알림', '비밀번호 변경에 성공하였습니다. 확인 버튼을 클릭하면 로그인 페이지로 이동합니다.', () => location.href = '/access/']
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('PATCH', '/access/contractorRecover/resetPassword');
    xhr.send(formData);
}