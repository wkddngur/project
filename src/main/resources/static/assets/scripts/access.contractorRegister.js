const contractorRegisterDiv = document.getElementById('contractorRegisterDiv');
const loading = document.getElementById('loading');

contractorRegisterDiv.querySelector('[rel="goLoginCaller"]').onclick = () => {
    location.href = '/access/';
}

contractorRegisterDiv.contractorRegisterForm = contractorRegisterDiv.querySelector('[rel="contractorRegisterForm"]');

contractorRegisterDiv.contractorRegisterForm.emailLabel = new LabelObj(contractorRegisterDiv.contractorRegisterForm.querySelector('[rel="emailLabel"]'));
contractorRegisterDiv.contractorRegisterForm.passwordLabel = new LabelObj(contractorRegisterDiv.contractorRegisterForm.querySelector('[rel="passwordLabel"]'));
contractorRegisterDiv.contractorRegisterForm.nameLabel = new LabelObj(contractorRegisterDiv.contractorRegisterForm.querySelector('[rel="nameLabel"]'));
contractorRegisterDiv.contractorRegisterForm.contactLabel = new LabelObj(contractorRegisterDiv.contractorRegisterForm.querySelector('[rel="contactLabel"]'));
contractorRegisterDiv.contractorRegisterForm.tinLabel = new LabelObj(contractorRegisterDiv.contractorRegisterForm.querySelector('[rel="tinLabel"]'));

contractorRegisterDiv.contractorRegisterForm['emailSend'].onclick = () => {
    contractorRegisterDiv.contractorRegisterForm.emailLabel.setValid(contractorRegisterDiv.contractorRegisterForm['email'].tests);

    if (!contractorRegisterDiv.contractorRegisterForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 이메일을 입력해 주세요.', () => {
            contractorRegisterDiv.contractorRegisterForm['email'].focus();
        }).show();
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', contractorRegisterDiv.contractorRegisterForm['email'].value);
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
            failure: ['경고', `입력하신 이메일 <b>${responseObject['email']}</b>을 확인할 수 없습니다. 다시 입력해 주세요.`, () => contractorRegisterDiv.contractorRegisterForm['email'].focus()],
            failure_duplicate_email: ['경고', `입력하신 이메일 <b>${responseObject['email']}</b>은 이미 사용중입니다. 다른 이메일을 사용해주세요`, () => {
                contractorRegisterDiv.contractorRegisterForm['email'].value = '';
                contractorRegisterDiv.contractorRegisterForm['email'].focus();
            }],
            success: ['알림', '입력하신 이메일로 인증번호를 보냈습니다, 인증번호는 3분간 유효합니다.', () => {
                contractorRegisterDiv.contractorRegisterForm['emailSalt'].value = responseObject['salt'];
                contractorRegisterDiv.contractorRegisterForm['email'].disable();
                contractorRegisterDiv.contractorRegisterForm['emailSend'].disable()
                contractorRegisterDiv.contractorRegisterForm['emailCode'].enable();
                contractorRegisterDiv.contractorRegisterForm['emailCode'].focus();
                contractorRegisterDiv.contractorRegisterForm['emailVerify'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('POST', '/access/contractorRegisterEmailSend');
    xhr.send(formData);
    loading.show();
}

contractorRegisterDiv.contractorRegisterForm['emailVerify'].onclick = () => {
    contractorRegisterDiv.contractorRegisterForm.emailLabel.setValid(contractorRegisterDiv.contractorRegisterForm['emailCode'].tests());

    if (!contractorRegisterDiv.contractorRegisterForm.emailLabel.isValid()) {
        MessageObj.createSimpleOk('경고', '올바른 인증번호를 입력해 주세요.', () => {
            contractorRegisterDiv.contractorRegisterForm['emailCode'].focus();
        }).show();
        return;
    }

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('email', contractorRegisterDiv.contractorRegisterForm['email'].value);
    formData.append('code', contractorRegisterDiv.contractorRegisterForm['emailCode'].value);
    formData.append('salt', contractorRegisterDiv.contractorRegisterForm['emailSalt'].value);
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
                contractorRegisterDiv.contractorRegisterForm['emailCode'].value = '';
                contractorRegisterDiv.contractorRegisterForm['emailCode'].focus();
            }],
            failure_expired: ['경고', '인증번호가 만료되었습니다. 인증번호 전송을 다시 시도해 주세요.', () => {
                contractorRegisterDiv.contractorRegisterForm['emailSalt'].value = '';
                contractorRegisterDiv.contractorRegisterForm['email'].enable();
                contractorRegisterDiv.contractorRegisterForm['emailSend'].enable();
                contractorRegisterDiv.contractorRegisterForm['emailCode'].disable();
                contractorRegisterDiv.contractorRegisterForm['emailCode'].value = '';
                contractorRegisterDiv.contractorRegisterForm['emailVerify'].disable();
            }],
            success: ['알림', '이메일 인증이 완료되었습니다. 회원가입을 계속해 주세요.', () => {
                contractorRegisterDiv.contractorRegisterForm['emailCode'].disable();
                contractorRegisterDiv.contractorRegisterForm['emailVerify'].disable();
                contractorRegisterDiv.contractorRegisterForm['password'].enable().focus();
                contractorRegisterDiv.contractorRegisterForm['passwordCheck'].enable();
            }]
        }[responseObject.result] || ['경고', '서버가 알수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
    }

    xhr.open('PATCH', '/access/contractorRegisterEmailCodeVerify');
    xhr.send(formData);
}
contractorRegisterDiv.contractorRegisterForm.onsubmit = (e) => {
    e.preventDefault();

    contractorRegisterDiv.contractorRegisterForm.emailLabel.setValid(contractorRegisterDiv.contractorRegisterForm['email'].tests());
    contractorRegisterDiv.contractorRegisterForm.passwordLabel.setValid(contractorRegisterDiv.contractorRegisterForm['password'].tests());
    contractorRegisterDiv.contractorRegisterForm.nameLabel.setValid(contractorRegisterDiv.contractorRegisterForm['name'].tests());
    contractorRegisterDiv.contractorRegisterForm.contactLabel.setValid(contractorRegisterDiv.contractorRegisterForm['contactFirst'].tests());
    contractorRegisterDiv.contractorRegisterForm.contactLabel.setValid(contractorRegisterDiv.contractorRegisterForm['contactSecond'].tests());
    contractorRegisterDiv.contractorRegisterForm.contactLabel.setValid(contractorRegisterDiv.contractorRegisterForm['contactThird'].tests());
    contractorRegisterDiv.contractorRegisterForm.tinLabel.setValid(contractorRegisterDiv.contractorRegisterForm['tinFirst'].tests());
    contractorRegisterDiv.contractorRegisterForm.tinLabel.setValid(contractorRegisterDiv.contractorRegisterForm['tinSecond'].tests());
    contractorRegisterDiv.contractorRegisterForm.tinLabel.setValid(contractorRegisterDiv.contractorRegisterForm['tinThird'].tests());

    if(contractorRegisterDiv.contractorRegisterForm['emailSend'].isEnabled() || contractorRegisterDiv.contractorRegisterForm['emailVerify'].isEnabled()) {
        MessageObj.createSimpleOk('경고','이메일 인증이 완료되지 않았습니다.').show();
        return
    }
    if (!contractorRegisterDiv.contractorRegisterForm.passwordLabel.isValid()) {
        MessageObj.createSimpleOk('경고','올바른 비밀번호를 입력해 주세요.', () => {
            contractorRegisterDiv.contractorRegisterForm['password'].focus();
        }).show();
        return;
    }
    if(contractorRegisterDiv.contractorRegisterForm['password'].value !== contractorRegisterDiv.contractorRegisterForm['passwordCheck'].value) {
        MessageObj.createSimpleOk('경고', '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.', () => {
            contractorRegisterDiv.contractorRegisterForm['passwordCheck'].focus();
        }).show();
        return;
    }
    if(!contractorRegisterDiv.contractorRegisterForm.nameLabel.isValid()) {
        MessageObj.createSimpleOk('경고','올바른 협력업체 이름을 입력해 주세요.', () => {
            contractorRegisterDiv.contractorRegisterForm['name'].focus();
        }).show();
        return;
    }
    if (!contractorRegisterDiv.contractorRegisterForm.contactLabel.isValid()) {
        MessageObj.createSimpleOk('경고','올바른 협력업체 대표번호를 입력해 주세요.', ()=> {
            contractorRegisterDiv.contractorRegisterForm['contactFirst'].focus();
        }).show();
        return;
    }
    if (!contractorRegisterDiv.contractorRegisterForm.tinLabel.isValid()) {
        MessageObj.createSimpleOk('경고','올바른 사업자 번호를 입력해 주세요.', ()=> {
            contractorRegisterDiv.contractorRegisterForm['tinFirst'].focus();
        }).show();
        return;
    }
    if (!contractorRegisterDiv.contractorRegisterForm['agree'].checked) {
        MessageObj.createSimpleOk('경고', '약관에 동의해야 회웝가입이 가능합니다.').show()
        return;
    }
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append("email",contractorRegisterDiv.contractorRegisterForm['email'].value);
    formData.append("code",contractorRegisterDiv.contractorRegisterForm['emailCode'].value);
    formData.append("salt",contractorRegisterDiv.contractorRegisterForm['emailSalt'].value);
    formData.append("password",contractorRegisterDiv.contractorRegisterForm['password'].value);
    formData.append("name",contractorRegisterDiv.contractorRegisterForm['name'].value);
    formData.append("contactFirst",contractorRegisterDiv.contractorRegisterForm['contactFirst'].value);
    formData.append("contactSecond",contractorRegisterDiv.contractorRegisterForm['contactSecond'].value);
    formData.append("contactThird",contractorRegisterDiv.contractorRegisterForm['contactThird'].value);
    formData.append("tinFirst",contractorRegisterDiv.contractorRegisterForm['tinFirst'].value);
    formData.append("tinSecond",contractorRegisterDiv.contractorRegisterForm['tinSecond'].value);
    formData.append("tinThird",contractorRegisterDiv.contractorRegisterForm['tinThird'].value);
    formData.append("agree",contractorRegisterDiv.contractorRegisterForm['agree'].checked);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE){
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);
        const [dTitle, dContent, dOnclick] = {
            failure: ['경고', '알 수 없는 이유로 회원가입을 실패하였습니다. 잠시후 다시 시도해 주세요.'],
            failure_duplicate_email: ['경고',`입력하신 이메일  <b>${contractorRegisterDiv.contractorRegisterForm['email'].value}</b> 는 이미 사용중 입니다, 다른 이메일을 사용해 주세요.`, () => {
                contractorRegisterDiv.contractorRegisterForm['emailSalt'].value = '';
                contractorRegisterDiv.contractorRegisterForm['email'].enable().focus();
                contractorRegisterDiv.contractorRegisterForm['emailSend'].enable();
                contractorRegisterDiv.contractorRegisterForm['emailCode'].disable().value='';
                contractorRegisterDiv.contractorRegisterForm['emailVerify'].disable();
            }],
            failure_duplicate_contractor_name: ['경고',`입력하신 협력업체 이름<b>${contractorRegisterDiv.contractorRegisterForm['name'].value}</b>은 이미 사용중 입니다, 다른 협력업체 이름을 사용해 주세요.`,() => {
                contractorRegisterDiv.contractorRegisterForm['name'].value = '';
                contractorRegisterDiv.contractorRegisterForm['name'].focus();
            }],
            failure_duplicate_contact: ['경고', '입력하신 협력업체 대표번호는 이미 사용중 입니다. 다시 확인해 주세요.', () => contractorRegisterDiv.contractorRegisterForm['contactFirst'].focus()],

            failure_duplicate_tin: ['경고', '입력하신 사업자 번호는 이미 사용 중입니다. 다시 확인해 주세요.', () => contractorRegisterDiv.contractorRegisterForm['tinFirst'].focus()],

            success: ['알림', '협력업체 회원가입 요청이 완료되었습니다. 관리자 승인 후 접속이 가능합니다.', () => {
                location.href = '/access/';
            }]
        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }

    xhr.open('POST', '/access/contractorRegister/');
    xhr.send(formData);
}
