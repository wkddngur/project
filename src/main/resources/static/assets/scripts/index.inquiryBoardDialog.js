const inquiryBoardDialog = document.getElementById('inquiryBoardDialog');
const inquiryArticleWriteFormDialog = document.getElementById('inquiryArticleWriteFormDialog');
const inquiryArticleWriteForm = document.getElementById('inquiryArticleWriteForm');
const inquiryArticleReadDialog = document.getElementById('inquiryArticleReadDialog');
const inquiryArticleModifyFormDialog = document.getElementById('inquiryArticleModifyFormDialog');
const inquiryArticleModifyForm = document.getElementById('inquiryArticleModifyForm');

function loadInquiries(page = 1) {
    inquiryBoardDialog.querySelector('[rel="inquiryBoardTbody"]').innerHTML = '';
    inquiryBoardDialog.querySelector('[rel="aTagContainer"]').innerHTML = '';

    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const responseObject = JSON.parse(xhr.responseText);
        const articleArray = responseObject['inquireArticles'];
        let maxPage = Number(responseObject['maxPage']);
        let minPage = Number(responseObject['minPage']);

        if (articleArray.length === 0) {
            inquiryBoardDialog.querySelector('[rel="inquiryBoardTable"]').innerHTML = '';
            inquiryBoardDialog.querySelector('[rel="inquiryBoardTable"]').innerHTML = `<div style="width: 100%; font-size: 1.1rem; padding: 0.5rem; text-align: center;">등록된 문의 게시글이 없습니다. 문의 게시글을 작성해 보세요.</div>`;
            return;
        }

        for (let articleObject of articleArray) {

            let createdAt = new Date(articleObject['createdAt']);
            let createdAtFormat = dateFormatBySecond(createdAt);

            let inquiryArticleTitle = null;

            if (responseObject['admin'] === true || responseObject['accessorEmail'] === articleObject['userEmail'] || articleObject['agree'] === false) {
                // 관리자이거나 작성자이거나 사용자가 공개를 동의한 경우
                inquiryArticleTitle = `<span class="text title" rel="InquiryArticleRead">${articleObject['title']}</span>`;
            } else {
                // 관리자도 아니고 작성자도 아니며 사용자가 공개를 동의하지 않은 경우
                inquiryArticleTitle = `<span class="text" style="color: #0B005C; font-weight: 500">관리자만 접근 가능합니다.</span>`;
            }

            const articleEl = new DOMParser().parseFromString(`
            <div class="inquiry-board-tr">
                <span class="text">${articleObject['index']}</span>
                ${inquiryArticleTitle}
                <span class="text">${articleObject['userEmail']}</span>
                <span class="text">${articleObject['view']}</span>
                <span class="text">${createdAtFormat}</span>
            </div>
            `, 'text/html').querySelector('div.inquiry-board-tr');

            articleEl.querySelector('[rel="InquiryArticleRead"]')?.addEventListener('click', () => {
                showInquiryArticleRead(articleObject, createdAtFormat); // 글읽기로 넘어가는 곳 미완성.
            });

            inquiryBoardDialog.querySelector('[rel="inquiryBoardTbody"]').append(articleEl);
        }

        for (let i = minPage; i <= maxPage; i++) {
            const pageSetEl = new DOMParser().parseFromString(`
            <a class="aTag" href="">${i}</a>
            `, "text/html").querySelector('.aTag');

            pageSetEl.onclick = (e) => {
                e.preventDefault();
                loadInquiries(i);
            };

            inquiryBoardDialog.querySelector('[rel="aTagContainer"]').append(pageSetEl);
        }

    }
    xhr.open('GET', `/inquiryBoard/inquiryArticles?page=${page}`);
    xhr.send();
}

// 메인이 되는 함수
function showInquiryBoardDialog() {
    inquiryArticleReadDialog.hide();
    inquiryArticleWriteFormDialog.hide();
    inquiryArticleModifyFormDialog.hide();
    cover.show();
    inquiryBoardDialog.show();

    inquiryBoardDialog.querySelector('[rel="inquiryBoardTbody"]').innerHTML = '';
    inquiryBoardDialog.querySelector('[rel="aTagContainer"]').innerHTML = '';

    loadInquiries();

    inquiryBoardDialog.querySelector('[rel="inquiryArticleWriteButton"]').onclick = () => {
        inquiryBoardDialog.hide();
        inquiryArticleWriteFormDialog.show();
        inquiryBoardArticleWrite();
    }

    inquiryBoardDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        cover.hide();
        inquiryBoardDialog.hide();
    }
}

function inquiryBoardArticleWrite() {
    inquiryArticleWriteForm['title'].value = '';
    inquiryArticleWriteForm['content'].value = '';
    inquiryArticleWriteForm['agree'].checked = false;

    inquiryArticleWriteForm.inquiryArticleWriteTitleLabel = new LabelObj(inquiryArticleWriteForm.querySelector('[rel="inquiryArticleWriteTitleLabel"]'));
    inquiryArticleWriteForm.inquiryArticleWriteContentLabel = new LabelObj(inquiryArticleWriteForm.querySelector('[rel="inquiryArticleWriteContentLabel"]'));

    inquiryArticleWriteForm.onsubmit = (e) => {
        e.preventDefault();

        inquiryArticleWriteForm.inquiryArticleWriteTitleLabel.setValid(inquiryArticleWriteForm['title'].value.length < 100 && inquiryArticleWriteForm['title'].value.length > 0);
        inquiryArticleWriteForm.inquiryArticleWriteContentLabel.setValid(inquiryArticleWriteForm['content'].value.length < 1000 && inquiryArticleWriteForm['content'].value.length > 0);

        if (!inquiryArticleWriteForm.inquiryArticleWriteTitleLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '제목은 1 ~ 100 글자까지만 허용됩니다.').show();
            return;
        }

        if (!inquiryArticleWriteForm.inquiryArticleWriteContentLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '내용은 1 ~ 1000 글자까지만 허용됩니다.').show();
            return;
        }

        if (!inquiryArticleWriteForm['agree'].checked) {
            MessageObj.createSimpleOk('경고', '관리자 외 접근 차단을 옵션을 선택하지 않으면 전체 공개 게시글로 작성됩니다.').show();
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('title', inquiryArticleWriteForm['title'].value);
        formData.append('content', inquiryArticleWriteForm['content'].value);
        formData.append('agree', inquiryArticleWriteForm['agree'].checked);
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
                failure: ['경고', '알 수 없는 이유로 문의 게시글 작성에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
                failure_email_not_found: ['경고', '작성자를 확인할 수 없습니다. 로그인 후 다시 시도해 주세요.', () => {
                    location.href = '/access/';
                }],
                failure_exceed_number_character: ['경고', '글자수 제한을 초과하였습니다. 다시 입력해 주세요.'],
                success: ['알림', '문의 게시글 작성에 성공하였습니다.', () => {
                    showInquiryBoardDialog();
                }]
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }
        xhr.open('POST', 'inquiryBoard/inquiryArticleWrite');
        xhr.send(formData);
    }

    inquiryArticleWriteFormDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        inquiryArticleWriteFormDialog.hide();
        showInquiryBoardDialog();
    }
}

function showInquiryArticleRead(articleObject, createdAtFormat) {
    inquiryBoardDialog.hide();
    inquiryArticleReadDialog.show();
    inquiryArticleReadDialog.querySelector('[rel="buttonContainer"]').innerHTML = '';

    InquiryArticleViewUpdate(articleObject['index']);
    
    let modifiedAtFormat = '수정되지 않음';

    if (articleObject['modifiedAt'] !== undefined) {
        let modifiedAt = new Date(articleObject['modifiedAt']);
        modifiedAtFormat = dateFormatBySecond(modifiedAt);
    }

    inquiryArticleReadDialog.querySelector('[name="inquiryArticleIndex"]').value = articleObject['index'];
    inquiryArticleReadDialog.querySelector('[name="inquiryArticleTitle"]').value = articleObject['title'];
    inquiryArticleReadDialog.querySelector('[name="inquiryArticleWriter"]').value = articleObject['userName'];
    inquiryArticleReadDialog.querySelector('[name="inquiryArticleView"]').value = articleObject['view'] + 1;
    inquiryArticleReadDialog.querySelector('[name="inquiryArticleDateTime"]').value = createdAtFormat + ' ' + '(' + modifiedAtFormat + ')';
    inquiryArticleReadDialog.querySelector('[name="inquiryArticleContent"]').value = articleObject['content'];

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    formData.append('userEmail', articleObject['userEmail']);
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

        const result = JSON.parse(xhr.responseText);

        if (result === true) {
            const modifyButtonEl = new DOMParser().parseFromString(`
            <button class="_obj-button" type="button" rel="inquiryArticleModifyButton">문의 게시글 수정하기</button>
            `, "text/html").querySelector('button._obj-button');

            const deleteButtonEl = new DOMParser().parseFromString(`
            <button class="_obj-button" type="button" rel="inquiryArticleDeleteButton">문의 게시글 삭제하기</button>
            `, "text/html").querySelector('button._obj-button');

            inquiryArticleReadDialog.querySelector('[rel="buttonContainer"]').append(modifyButtonEl);
            inquiryArticleReadDialog.querySelector('[rel="buttonContainer"]').append(deleteButtonEl);

            modifyButtonEl.addEventListener('click', () => {
                inquiryArticleModify(articleObject);
            });

            deleteButtonEl.addEventListener('click', () => {
                inquiryArticleDelete(articleObject);
            });
        }
    }
    xhr.open('POST', '/inquiryBoard/rightByDeleteModify');
    xhr.send(formData);

    inquiryArticleReadDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        inquiryArticleReadDialog.hide();
        showInquiryBoardDialog();
    }
}

function inquiryArticleModify(articleObject) {
    inquiryArticleReadDialog.hide();
    inquiryArticleModifyFormDialog.show();

    inquiryArticleModifyForm['title'].value = articleObject['title'];
    inquiryArticleModifyForm['content'].value = articleObject['content'];

    inquiryArticleModifyForm.inquiryArticleModifyTitleLabel = new LabelObj(inquiryArticleModifyForm.querySelector('[rel="inquiryArticleModifyTitleLabel"]'));
    inquiryArticleModifyForm.inquiryArticleModifyContentLabel = new LabelObj(inquiryArticleModifyForm.querySelector('[rel="inquiryArticleModifyContentLabel"]'));

    inquiryArticleModifyForm.onsubmit = (e) => {
        e.preventDefault();

        inquiryArticleModifyForm.inquiryArticleModifyTitleLabel.setValid(inquiryArticleModifyForm['title'].value.length < 100 && inquiryArticleModifyForm['title'].value.length > 0);
        inquiryArticleModifyForm.inquiryArticleModifyContentLabel.setValid(inquiryArticleModifyForm['content'].value.length < 1000 && inquiryArticleModifyForm['content'].value.length > 0);

        if (!inquiryArticleModifyForm.inquiryArticleModifyTitleLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '제목은 1 ~ 100 글자까지만 허용됩니다.').show();
            return;
        }

        if (!inquiryArticleModifyForm.inquiryArticleModifyContentLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '내용은 1 ~ 1000 글자까지만 허용됩니다.').show();
            return;
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('index', articleObject['index']);
        formData.append('title', inquiryArticleModifyForm['title'].value);
        formData.append('content', inquiryArticleModifyForm['content'].value);
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
                failure: ['경고', '알 수 없는 이유로 문의 게시글 수정에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
                failure_email_not_found: ['경고', '작성자를 확인할 수 없습니다. 로그인 후 다시 시도해 주세요.', () => {
                    location.href = '/access/';
                }],
                failure_not_found_article: ['경고', '문의 게시글을 찾을 수 없습니다. 다시 시도해 주세요.', () => {
                    showInquiryBoardDialog();
                }],
                failure_mismatch_user_email: ['경고', '문의 게시글 작성자와 수정 요청자가 일치하지 않습니다. 다시 시도해 주세요.', () => {
                    location.href = '/access/userLogout';
                }],
                failure_exceed_number_character: ['경고', '글자수 제한을 초과하였습니다. 다시 입력해 주세요.'],
                success: ['알림', '문의 게시글 수정에 성공하였습니다.', () => {
                    showInquiryBoardDialog();
                }]
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();

        }
        xhr.open('PATCH', '/inquiryBoard/inquiryArticleModify');
        xhr.send(formData);
    }

    inquiryArticleModifyFormDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        inquiryArticleModifyFormDialog.hide();
        inquiryArticleReadDialog.show();
    };
}

function inquiryArticleDelete(articleObject) {
    new MessageObj({
        title: '삭제',
        content: '정말로 문의 게시글을 삭제하시겠습니까? 삭제된 문의게시글은 복구할 수 없습니다.',
        buttons: [
            {text: '취소', onclick: instance => instance.hide()},
            {
                text: '삭제하기', onclick: instance => {
                    instance.hide();
                    
                    const xhr = new XMLHttpRequest();
                    const formData = new FormData();
                    formData.append('index', articleObject['index']);
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
                            failure: ['경고', '알 수 없는 이유로 문의 게시글 삭제에 실패하였습니다. 잠시 후 다시 시도해 주세요.'],
                            failure_email_not_found: ['경고', '작성자를 확인할 수 없습니다. 로그인 후 다시 시도해 주세요.', () => {
                                location.href = '/access/';
                            }],
                            failure_not_found_article: ['경고', '문의 게시글을 찾을 수 없습니다. 다시 시도해 주세요.', () => {
                                showInquiryBoardDialog();
                            }],
                            failure_mismatch_user_email: ['경고', '문의 게시글 작성자와 삭제 요청자가 일치하지 않습니다. 다시 시도해 주세요.', () => {
                                location.href = '/access/userLogout';
                            }],
                            success: ['알림', '문의 게시글 삭제에 성공하였습니다.', () => {
                                showInquiryBoardDialog();
                            }]
                        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                    }
                    xhr.open('DELETE', '/inquiryBoard/inquiryArticleDelete');
                    xhr.send(formData);
                }
            }
        ]
    }).show();
}

function InquiryArticleViewUpdate(inquiryArticleIndex) {

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onreadystatechange = function () { 
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.').show();
            return;
        }

    }
    xhr.open('GET', `/inquiryBoard/inquiryArticle?index=${inquiryArticleIndex}`);
    xhr.send(formData);
}