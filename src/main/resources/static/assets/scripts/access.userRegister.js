const userRegisterDiv = document.getElementById('userRegisterDiv');

userRegisterDiv.querySelector('[rel="goLoginCaller"]').onclick = () => {
    location.href = '/access/';
}


userRegisterDiv.userRegisterForm = userRegisterDiv.querySelector('[rel="userRegisterForm"]');

userRegisterDiv.userRegisterForm.nameLabel = new LabelObj(userRegisterDiv.userRegisterForm.querySelector('[rel="nameLabel"]'));
userRegisterDiv.userRegisterForm.emailLabel = new LabelObj(userRegisterDiv.userRegisterForm.querySelector('[rel="emailLabel"]'));
userRegisterDiv.userRegisterForm.passwordLabel = new LabelObj(userRegisterDiv.userRegisterForm.querySelector('[rel="passwordLabel"]'));
userRegisterDiv.userRegisterForm.genderLabel = new LabelObj(userRegisterDiv.userRegisterForm.querySelector('[rel="genderLabel"]'));
userRegisterDiv.userRegisterForm.nicknameLabel = new LabelObj(userRegisterDiv.userRegisterForm.querySelector('[rel="nicknameLabel"]'));
userRegisterDiv.userRegisterForm.ssnBirthLabel = new LabelObj(userRegisterDiv.userRegisterForm.querySelector(`[rel="ssnBirthLabel"]`));


userRegisterDiv.userRegisterForm['emailSend'].onclick = () => {
    userRegisterDiv.userRegisterForm.emailLabel.setValid(userRegisterDiv.userRegisterForm['email'].tests());

    if (!userRegisterDiv.userRegisterForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 이메일을 입력해 주세요.', () => {
            userRegisterDiv.userRegisterForm['email'].focus();
        }).show();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', userRegisterDiv.userRegisterForm['email'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        loading.hide();
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 이용해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', `입력하신 이메일 <b>${responseObject['email']}</b>을 확인할 수 없습니다. 다시 입력해 주세요.`, () => userRegisterDiv.userRegisterForm['email'].focus()],
            failure_duplicate_email: ['경고', `입력하신 이메일 <b>${responseObject['email']}</b>은 이미 사용중입니다. 다른 이메일을 사용해주세요`, () => {
                userRegisterDiv.userRegisterForm['email'].value = '';
                userRegisterDiv.userRegisterForm['email'].focus();
            }],
            success: ['알림', '입력하신 이메일로 인증번호를 보냈습니다, 인증번호는 3분간 유효합니다.', () => {
                userRegisterDiv.userRegisterForm['emailSalt'].value = responseObject['salt'];
                userRegisterDiv.userRegisterForm['email'].disable();
                userRegisterDiv.userRegisterForm['emailSend'].disable()
                userRegisterDiv.userRegisterForm['emailCode'].enable();
                userRegisterDiv.userRegisterForm['emailCode'].focus();
                userRegisterDiv.userRegisterForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('POST', '/access/register/userRegisterEmailSend');
    xhr.send(formData);
    loading.show();
}

userRegisterDiv.userRegisterForm['emailVerify'].onclick = () => {
    userRegisterDiv.userRegisterForm.emailLabel.setValid(userRegisterDiv.userRegisterForm['emailCode'].tests());

    if (!userRegisterDiv.userRegisterForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 인증번호를 입력해 주세요.', () => {
            userRegisterDiv.userRegisterForm['emailCode'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', userRegisterDiv.userRegisterForm['email'].value);
    formData.append('code', userRegisterDiv.userRegisterForm['emailCode'].value);
    formData.append('salt', userRegisterDiv.userRegisterForm['emailSalt'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '인증번호가 올바르지 않습니다. 다시 확인해 주세요.', () => {
                userRegisterDiv.userRegisterForm['emailCode'].value = '';
                userRegisterDiv.userRegisterForm['emailCode'].focus();
            }],
            failure_expired: ['경고', '인증번호가 만료되었습니다. 인증번호 전송을 다시 시도해 주세요.', () => {
                userRegisterDiv.userRegisterForm['emailSalt'].value = '';
                userRegisterDiv.userRegisterForm['email'].enable();
                userRegisterDiv.userRegisterForm['emailSend'].enable();
                userRegisterDiv.userRegisterForm['emailCode'].disable();
                userRegisterDiv.userRegisterForm['emailCode'].value = '';
                userRegisterDiv.userRegisterForm['emailVerify'].disable();
            }],
            success: ['알림', '이메일 인증이 완료되었습니다. 회원가입을 계속해 주세요.', () => {
                userRegisterDiv.userRegisterForm['emailCode'].disable();
                userRegisterDiv.userRegisterForm['emailVerify'].disable();
                userRegisterDiv.userRegisterForm['password'].enable().focus();
                userRegisterDiv.userRegisterForm['passwordCheck'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('PATCH', '/access/register/userRegisterEmailCodeVerify');
    xhr.send(formData);
};

userRegisterDiv.userRegisterForm.onsubmit = (e) => {
    e.preventDefault();

    userRegisterDiv.userRegisterForm.nameLabel.setValid(userRegisterDiv.userRegisterForm['name'].tests());
    userRegisterDiv.userRegisterForm.passwordLabel.setValid(userRegisterDiv.userRegisterForm['password'].tests());
    userRegisterDiv.userRegisterForm.genderLabel.setValid(userRegisterDiv.userRegisterForm['gender'].value !== '-1');
    userRegisterDiv.userRegisterForm.nicknameLabel.setValid(userRegisterDiv.userRegisterForm['nickname'].tests());
    userRegisterDiv.userRegisterForm.ssnBirthLabel.setValid(userRegisterDiv.userRegisterForm['ssnBirth'].tests());

    if (userRegisterDiv.userRegisterForm['emailSend'].isEnabled() || userRegisterDiv.userRegisterForm['emailVerify'].isEnabled()) {
        MessageObj.createSimpleOk('경고', '이메일 인증이 완료되지 않았습니다.').show();
        return;
    }

    if (!userRegisterDiv.userRegisterForm.passwordLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 비밀번호를 입력해 주세요.', () => {
            userRegisterDiv.userRegisterForm['password'].focus();
        }).show();
        return;
    }

    if (userRegisterDiv.userRegisterForm['password'].value !== userRegisterDiv.userRegisterForm['passwordCheck'].value) {
        MessageObj.createSimpleOk('경고', '비밀번호가 일치 하지 않습니다. 다시 확인해 주세요.', () => {
            userRegisterDiv.userRegisterForm['passwordCheck'].focus();
        }).show();
        return;
    }
    
    if (!userRegisterDiv.userRegisterForm.nameLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 이름을 입력해 주세요.', () => {
            userRegisterDiv.userRegisterForm['name'].focus();
        }).show();
        return;
    }

    if (userRegisterDiv.userRegisterForm['gender'].value === 'M' || userRegisterDiv.userRegisterForm['gender'].value === 'F') {
    } else {
        MessageObj.createSimpleOk('경고', '성별을 확인해 주세요.', () => {
            userRegisterDiv.userRegisterForm['gender'].focus();
        }).show();
        return;
    }

    if (!userRegisterDiv.userRegisterForm.nicknameLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 닉네임을 입력해주세요.', () => {
            userRegisterDiv.userRegisterForm['nickname'].focus();
        }).show();
        return;
    }

    if (!userRegisterDiv.userRegisterForm.ssnBirthLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 8자리 생년월일을 입력해주세요.', () => {
            userRegisterDiv.userRegisterForm['ssnBirth'].focus();
        }).show();
        return;
    }

    if (!userRegisterDiv.userRegisterForm['agree'].checked) {
        MessageObj.createSimpleOk('경고', '약관에 동의해야 회웝가입이 가능합니다.').show()
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', userRegisterDiv.userRegisterForm['email'].value);
    formData.append('code', userRegisterDiv.userRegisterForm['emailCode'].value);
    formData.append('salt', userRegisterDiv.userRegisterForm['emailSalt'].value);
    formData.append('password', userRegisterDiv.userRegisterForm['password'].value);
    formData.append('name', userRegisterDiv.userRegisterForm['name'].value);
    formData.append('gender', userRegisterDiv.userRegisterForm['gender'].value);
    formData.append('nickname', userRegisterDiv.userRegisterForm['nickname'].value);
    formData.append('ssnBirth', userRegisterDiv.userRegisterForm['ssnBirth'].value);
    formData.append("agree", userRegisterDiv.userRegisterForm['agree'].checked);

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
            failure: ['경고', '알 수 없는 이유로 회원가입을 실패하였습니다 잠시 후 다시 시도해 주세요.'],

            failure_duplicate_email: ['경고', `입력하신 이메일 <b>${userRegisterDiv.userRegisterForm['email'].value}</b>는 이미 사용중 입니다, 다른 이메일을 사용해 주세요.`, () => {
                userRegisterDiv.userRegisterForm['emailSalt'].value = '';
                userRegisterDiv.userRegisterForm['email'].enable().focus();
                userRegisterDiv.userRegisterForm['emailSend'].enable();
                userRegisterDiv.userRegisterForm['emailCode'].disable().value = '';
                userRegisterDiv.userRegisterForm['emailVerify'].disable();
            }],

            failure_duplicate_nickname: ['경고', `입력하신 닉네임<b>${userRegisterDiv.userRegisterForm['nickname'].value}</b>은 이미 사용중 입니다, 다른 닉네임을 사용해 주세요.`, () => userRegisterDiv.userRegisterForm['nickname'].focus()],

            success: ['알림', '회원가입이 완료 되었습니다. 확인 버튼을 클릭하면 로그인 페이지로 이동합니다.', () => {
                location.href = '/access/';
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

    }

    xhr.open('POST', '/access/register/userRegister/');
    xhr.send(formData);
}