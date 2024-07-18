const recoverDiv = document.getElementById('recoverDiv');
const loading = document.getElementById('loading');

// 로그인으로 돌아가기 버튼을 눌렀을 때의 메서드.
recoverDiv.querySelector('[rel="goLoginCaller"]').onclick = () => {
    location.href = '/access/';
}

// email 찾기 시 입력 내용 정규화를 위한 라벨링.
recoverDiv.emailForm = recoverDiv.querySelector('[rel="emailForm"]');
recoverDiv.emailForm.nameLabel = new LabelObj(recoverDiv.emailForm.querySelector('[rel="nameLabel"]'));
recoverDiv.emailForm.genderLabel = new LabelObj(recoverDiv.emailForm.querySelector('[rel="genderLabel"]'));
recoverDiv.emailForm.ssnBirthLabel = new LabelObj(recoverDiv.emailForm.querySelector('[rel="ssnBirthLabel"]'));

// email 변경 시 입력 내용 정규화를 위한 라벨링.
recoverDiv.passwordForm = recoverDiv.querySelector('[rel="passwordForm"]');
recoverDiv.passwordForm.emailLabel = new LabelObj(recoverDiv.passwordForm.querySelector('[rel="emailLabel"]'));
recoverDiv.passwordForm.passwordLabel = new LabelObj(recoverDiv.passwordForm.querySelector('[rel="passwordLabel"]'));


// 이름 성별 생년월일로 email 찾기 위한 메서드.
recoverDiv.emailForm.onsubmit = (e) => {
    e.preventDefault();

    recoverDiv.emailForm.nameLabel.setValid(recoverDiv.emailForm['name'].tests());
    recoverDiv.emailForm.genderLabel.setValid(recoverDiv.emailForm['gender'].value !== '-1');
    recoverDiv.emailForm.ssnBirthLabel.setValid(recoverDiv.emailForm['ssnBirth'].tests());


    if (!recoverDiv.emailForm.nameLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 이름을 입력해 주세요.', () => {
            recoverDiv.emailForm['name'].focus();
        }).show();

        return;
    }

    if (recoverDiv.emailForm['gender'].value === 'M' || recoverDiv.emailForm['gender'].value === 'F') {
    } else {
        MessageObj.createSimpleOk('경고', '성별을 확인해 주세요.', () => {
            recoverDiv.emailForm['gender'].focus();
        }).show();
        return;
    }

    if (!recoverDiv.emailForm.ssnBirthLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 8자리 생년월일을 입력해 주세요.', () => {
            recoverDiv.emailForm['ssnBirth'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    formData.append("name", recoverDiv.emailForm['name'].value);
    formData.append("gender", recoverDiv.emailForm['gender'].value);
    formData.append("ssnBirth", recoverDiv.emailForm['ssnBirth'].value);

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
                recoverDiv.emailForm['name'].value = '';
                recoverDiv.emailForm['name'].focus();
                recoverDiv.emailForm['gender'].value = '-1';
                recoverDiv.emailForm['ssnBirth'].value = '';
            }],
            success: ['알림', `회원님의 이메일은 <b>${responseObject['email']}</b>입니다. 확인 버튼을 클릭하면 로그인 페이지로 돌아갑니다.`, () => {
                location.href = '/access/';
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('POST', '/access/recover/emailFind');
    xhr.send(formData);
};

// 비밀번호 변경의 이메일 전송 버튼을 위한 메서드.
recoverDiv.passwordForm['emailSend'].onclick = () => {

    recoverDiv.passwordForm.emailLabel.setValid(recoverDiv.passwordForm['email'].tests());

    if (!recoverDiv.passwordForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 이메일을 입력해주세요.', () => {
            recoverDiv.passwordForm['email'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", recoverDiv.passwordForm['email'].value);
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
                recoverDiv.passwordForm['email'].value = '';
                recoverDiv.passwordForm['email'].focus()
            }],

            success: ['알림', '입력하신 이메일로 인증번호를 전송하였습니다. 인증번호는 발급 후 3분이 지나면 사용이 불가합니다.', () => {
                recoverDiv.passwordForm['emailSalt'].value = responseObject['salt'];
                recoverDiv.passwordForm['email'].disable();
                recoverDiv.passwordForm['emailSend'].disable();
                recoverDiv.passwordForm['emailCode'].enable();
                recoverDiv.passwordForm['emailCode'].focus();
                recoverDiv.passwordForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('POST', '/access/recover/resetPasswordEmailSend');
    xhr.send(formData);
    loading.show();
};

// 비밀번호 변경의 인증번호 확인 버튼을 위한 메서드.
recoverDiv.passwordForm['emailVerify'].onclick = () => {
    recoverDiv.passwordForm.emailLabel.setValid(recoverDiv.passwordForm['emailCode'].tests());

    if (!recoverDiv.passwordForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 인증번호를 입력해주세요.', () => {
            recoverDiv.passwordForm['emailCode'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", recoverDiv.passwordForm['email'].value);
    formData.append("code", recoverDiv.passwordForm['emailCode'].value);
    formData.append("salt", recoverDiv.passwordForm['emailSalt'].value);

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
                recoverDiv.passwordForm['emailCode'].value = '';
                recoverDiv.passwordForm['emailCode'].focus();
            }],
            failure_expired: ['경고', '인증번호가 만료되었습니다. 인증번호 전송을 다시 시도해 주세요.', () => {
                recoverDiv.passwordForm['emailSalt'].value = '';
                recoverDiv.passwordForm['email'].enable();
                recoverDiv.passwordForm['emailSend'].enable();
                recoverDiv.passwordForm['emailCode'].disable();
                recoverDiv.passwordForm['emailCode'].value = '';
                recoverDiv.passwordForm['emailVerify'].disable();
            }],
            success: ['경고', '이메일 인증이 완료되었습니다. 변경할 비밀번호를 입력해 주세요.', () => {
                recoverDiv.passwordForm['emailCode'].disable();
                recoverDiv.passwordForm['emailVerify'].disable();
                recoverDiv.passwordForm['password'].enable().focus();
                recoverDiv.passwordForm['passwordCheck'].enable();
            }],
        }[responseObject.result] || ['경고', '서버가 알수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('PATCH', '/access/recover/resetPasswordEmailCodeVerify');
    xhr.send(formData);
};

recoverDiv.passwordForm.onsubmit = (e) => {
    e.preventDefault();

    if (recoverDiv.passwordForm['emailSend'].isEnabled() || recoverDiv.passwordForm['emailVerify'].isEnabled()) {
        MessageObj.createSimpleOk('경고', '이메일 인증이 완료되지 않았습니다.').show();
    }

    recoverDiv.passwordForm.passwordLabel.setValid(recoverDiv.passwordForm['password'].tests());

    if (!recoverDiv.passwordForm.passwordLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 비밀번호를 입력해주세요.', () => {
            recoverDiv.passwordForm['password'].focus();
        }).show();
        return;
    }

    if (recoverDiv.passwordForm['password'].value !== recoverDiv.passwordForm['passwordCheck'].value) {
        MessageObj.createSimpleOk('경고', '입력하신 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', () => {
            recoverDiv.passwordForm['password'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email", recoverDiv.passwordForm['email'].value);
    formData.append("code", recoverDiv.passwordForm['emailCode'].value);
    formData.append("salt", recoverDiv.passwordForm['emailSalt'].value);
    formData.append("password", recoverDiv.passwordForm['password'].value);
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
            failure: ['경고', '비밀번호 변경에 실패하였습니다. 잠시 후 다시 시도해 주세요.', () => recoverDiv.passwordForm['password'].focus()],

            success: ['알림', '비밀번호 변경에 성공하였습니다. 확인 버튼을 클릭하면 로그인 페이지로 이동합니다.', () => location.href = '/access/']
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }
    xhr.open('PATCH', '/access/recover/resetPassword');
    xhr.send(formData);
}
