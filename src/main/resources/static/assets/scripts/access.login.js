const loginDiv = document.getElementById('loginDiv');

loginDiv.loginForm = loginDiv.querySelector('[rel="loginForm"]');
loginDiv.contractorLoginForm = loginDiv.querySelector('[rel="contractorLoginForm"]');

loginDiv.loginForm.emailLabel = new LabelObj(loginDiv.querySelector('[rel="emailLabel"]'));
loginDiv.loginForm.passwordLabel = new LabelObj(loginDiv.querySelector('[rel="passwordLabel"]'));
loginDiv.contractorLoginForm.emailLabel = new LabelObj(loginDiv.querySelector('[rel="emailLabel"]'));
loginDiv.contractorLoginForm.passwordLabel = new LabelObj(loginDiv.querySelector('[rel="passwordLabel"]'));


// user 로그인
loginDiv.loginForm.onsubmit = (e) => {
    e.preventDefault();
    loginDiv.loginForm.emailLabel.setValid(loginDiv.loginForm['email'].tests());
    loginDiv.loginForm.passwordLabel.setValid(loginDiv.loginForm['password'].tests());
    if (!loginDiv.loginForm.emailLabel.isValid() || !loginDiv.loginForm.passwordLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '입력하신 이메일과 비밀번호를 확인해주세요.', () => {
            loginDiv.loginForm['email'].focus();
            loginDiv.loginForm['password'].value = '';
        }).show();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginDiv.loginForm['email'].value);
    formData.append('password', loginDiv.loginForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        if (responseObject.result === 'success') {
            location.href = '/';
            return;
        }
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.', () => {
                loginDiv.loginForm['email'].focus();
                loginDiv.loginForm['password'].value = '';
            }],
            failure_suspended: ['경고', '이용이 일시적으로 정지된 계정입니다. 고객센터를 통해 문의해 주세요.', () => location.href = '/access']
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('POST', '/access/userLogin');
    xhr.send(formData);
}

// contractor 로그인
loginDiv.contractorLoginForm.onsubmit = (e) => {
    e.preventDefault();
    loginDiv.contractorLoginForm.emailLabel.setValid(loginDiv.contractorLoginForm['email'].tests());
    loginDiv.contractorLoginForm.passwordLabel.setValid(loginDiv.contractorLoginForm['password'].tests());
    if (!loginDiv.contractorLoginForm.emailLabel.isValid() || !loginDiv.contractorLoginForm.passwordLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '입력하신 이메일과 비밀번호를 확인해주세요.', () => {
            loginDiv.contractorLoginForm['email'].focus();
            loginDiv.contractorLoginForm['password'].value = '';
        }).show();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', loginDiv.contractorLoginForm['email'].value);
    formData.append('password', loginDiv.contractorLoginForm['password'].value);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        if (responseObject.result === 'success') {
            location.href = '/contractor/';
            return;
        }
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '이메일 혹은 비밀번호가 올바르지 않습니다. 다시 확인해 주세요.', () => {
                loginDiv.contractorLoginForm['email'].focus();
                loginDiv.contractorLoginForm['password'].value = '';
            }],
            failure_suspended: ['경고', '이용이 일시적으로 정지된 계정입니다. 고객센터를 통해 문의해 주세요.', () => location.href = '/access/']
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }
    xhr.open('POST', '/access/contractorLogin'); // AccessController.postContractorLogin
    xhr.send(formData);
}