const generalBoardDialog = document.getElementById('generalBoardDialog');
const generalArticleWriteFormDialog = document.getElementById('generalArticleWriteFormDialog');
const generalArticleWriteForm = document.getElementById('generalArticleWriteForm');
const generalArticleReadDialog = document.getElementById('generalArticleReadDialog');
const generalArticleModifyFormDialog = document.getElementById('generalArticleModifyFormDialog');
const generalArticleModifyForm = document.getElementById('generalArticleModifyForm');

function loadGeneral(boardCode, boardTitle, page = 1) { // 게시글 목록
    generalBoardDialog.querySelector('[rel="generalBoardTbody"]').innerHTML = '';
    generalBoardDialog.querySelector('[rel="aTagContainer"]').innerHTML = '';
    generalBoardDialog.querySelector('[rel="boardTitle"]').innerText = boardTitle;
    generalBoardDialog.querySelector('[rel="empty"]').innerHTML = '';

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
        const articleArray = responseObject['generalArticles'];

        let maxPage = Number(responseObject['maxPage']);
        let minPage = Number(responseObject['minPage']);

        if (articleArray.length === 0) {
            generalBoardDialog.querySelector('[rel="empty"]').innerHTML = `<div style="width: 100%; font-size: 1.1rem; padding: 0.5rem; text-align: center;">등록된 게시글이 없습니다. 게시글을 작성해 보세요.</div>`;
        }

        for (let articleObject of articleArray) {
            let createdAt = new Date(articleObject['createdAt']);
            let createdAtFormat = dateFormatBySecond(createdAt);

            const articleEl = new DOMParser().parseFromString(`
            <div class="general-board-tr">
                <span class="text">${articleObject['index']}</span>
                <span class="text title" rel="GeneralArticleRead">${articleObject['title']}</span>
                <span class="text">${articleObject['userEmail']}</span>
                <span class="text">${articleObject['view']}</span>
                <span class="text">${createdAtFormat}</span>
            </div>`, "text/html").querySelector('div.general-board-tr');
            articleEl.querySelector('[rel="GeneralArticleRead"]').onclick = () => {
                showGeneralArticleRead(articleObject, createdAtFormat, boardCode, boardTitle);
                generalArticleReadDialog.show();
            }
            generalBoardDialog.querySelector('[rel="generalBoardTbody"]').append(articleEl);

        }

        for (let i = minPage; i <= maxPage; i++) {
            const pageSetEl = new DOMParser().parseFromString(`
            <a class="aTag" href="">${i}</a>
            `, "text/html").querySelector('.aTag');

            pageSetEl.onclick = (e) => {
                e.preventDefault();
                loadGeneral(boardCode, boardTitle, i);
            };

            generalBoardDialog.querySelector('[rel="aTagContainer"]').append(pageSetEl);
        }

    }
    xhr.open('GET', `/generalBoard/generalArticles?boardCode=${boardCode}&page=${page}`);
    xhr.send();
}

function showGeneralBoard(boardCode, boardTitle) {
    generalArticleReadDialog.hide();
    generalArticleWriteFormDialog.hide();
    generalArticleModifyFormDialog.hide();
    cover.show();
    generalBoardDialog.show();

    generalBoardDialog.querySelector('[rel="boardTitle"]').innerText = '';
    generalBoardDialog.querySelector('[rel="generalBoardTbody"]').innerHTML = '';
    generalBoardDialog.querySelector('[rel="aTagContainer"]').innerHTML = '';

    loadGeneral(boardCode, boardTitle);

    generalBoardDialog.querySelector('[rel="generalArticleWriteButton"]').onclick = () => {
        if (boardCode === 'notice' || boardCode === 'event') {
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
                const isAdmin = JSON.parse(xhr.responseText);

                if (isAdmin === false) {
                    MessageObj.createSimpleOk('경고', '공지사항, 이벤트 게시글은 관리자만 작성 가능합니다.', () => {
                        showGeneralBoard(boardCode, boardTitle);
                    }).show();
                } else {
                    generalBoardDialog.hide();
                    generalArticleWriteFormDialog.show();
                    generalBoardArticleWrite(boardCode, boardTitle);
                }
            }
            xhr.open('POST', '/generalBoard/generalArticleWriteCheck');
            xhr.send(formData);
        } else {
            generalBoardDialog.hide();
            generalArticleWriteFormDialog.show();
            generalBoardArticleWrite(boardCode, boardTitle);
        }
    }

    generalBoardDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        cover.hide();
        generalBoardDialog.hide();
    }

}

function generalBoardArticleWrite(boardCode, boardTitle) { // 게시글 작성
    generalArticleWriteForm['title'].value = '';
    generalArticleWriteForm['content'].value = '';

    generalArticleWriteForm.generalArticleWriteTitleLabel = new LabelObj(generalArticleWriteForm.querySelector('[rel="generalArticleWriteTitleLabel"]'));
    generalArticleWriteForm.generalArticleWriteContentLabel = new LabelObj(generalArticleWriteForm.querySelector('[rel="generalArticleWriteContentLabel"]'));

    generalArticleWriteForm.onsubmit = (e) => {
        e.preventDefault();

        generalArticleWriteForm.generalArticleWriteTitleLabel.setValid(generalArticleWriteForm['title'].value.length < 100 && generalArticleWriteForm['title'].value.length > 0);
        generalArticleWriteForm.generalArticleWriteContentLabel.setValid(generalArticleWriteForm['content'].value.length < 1000 && generalArticleWriteForm['content'].value.length > 0);

        if (!generalArticleWriteForm.generalArticleWriteTitleLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '제목은 1 ~ 100 글자까지만 허용됩니다.').show();
            return;
        }

        if (!generalArticleWriteForm.generalArticleWriteContentLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '내용은 1 ~ 1000 글자까지만 허용됩니다.').show();
            return;
        }

        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('boardCode', boardCode)
        formData.append('title', generalArticleWriteForm['title'].value);
        formData.append('content', generalArticleWriteForm['content'].value);

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
                failure: ['경고', '알 수 없는 이유로 게시글 작성에 실패하였습니다. 잠시후 다시 시도해 주세요.'],
                failure_email_not_found: ['경고', '작성자를 확인할 수 없습니다. 로그인 후 다시 시도해 주세요.', () => {
                    location.href = '/access/';
                }],
                failure_exceed_number_character: ['경고', '글자수 제한을 초과하였습니다. 다시 입력해 주세요.'],
                success: ['알림', '게시글 작성에 성공하였습니다.', () => {
                    showGeneralBoard(boardCode, boardTitle);
                }]
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }
        xhr.open('POST', 'generalBoard/generalArticleWrite');
        xhr.send(formData);
    }
    generalArticleWriteFormDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        generalArticleWriteFormDialog.hide();
        showGeneralBoard(boardCode, boardTitle);
    }
}

function showGeneralArticleRead(articleObject, createdAtFormat, boardCode, boardTitle) {
    generalBoardDialog.hide();
    generalArticleReadDialog.show();
    generalArticleReadDialog.querySelector('[rel="buttonContainer"]').innerHTML = '';

    generalArticleViewUpdate(articleObject['index']);

    let modifiedAtFormat = '수정되지 않음';

    if (articleObject['modifiedAt'] !== undefined) {
        let modifiedAt = new Date(articleObject['modifiedAt']);
        modifiedAtFormat = dateFormatBySecond(modifiedAt);
    }
    generalArticleReadDialog.querySelector('[name="generalArticleIndex"]').value = articleObject['index'];
    generalArticleReadDialog.querySelector('[name="generalArticleTitle"]').value = articleObject['title'];
    generalArticleReadDialog.querySelector('[name="generalArticleUserEmail"]').value = articleObject['userName'];
    generalArticleReadDialog.querySelector('[name="generalArticleView"]').value = articleObject['view'] + 1;
    generalArticleReadDialog.querySelector('[name="generalArticleDateTime"]').value = createdAtFormat + ' ' + '(' + modifiedAtFormat + ')';
    generalArticleReadDialog.querySelector('[name="generalArticleContent"]').value = articleObject['content'];

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
            <button class="_obj-button" type="button" rel="generalArticleModifyButton">게시글 수정하기</button>
            `, "text/html").querySelector('button._obj-button');

            const deleteButtonEl = new DOMParser().parseFromString(`
            <button class="_obj-button" type="button" rel="generalArticleDeleteButton">게시글 삭제하기</button>
            `, "text/html").querySelector('button._obj-button');

            generalArticleReadDialog.querySelector('[rel="buttonContainer"]').append(modifyButtonEl);
            generalArticleReadDialog.querySelector('[rel="buttonContainer"]').append(deleteButtonEl);
            modifyButtonEl.addEventListener('click', () => {
                generalArticleModify(articleObject, boardCode, boardTitle);
            });
            deleteButtonEl.addEventListener('click', () => {
                generalArticleDelete(articleObject, boardCode, boardTitle);
            });
        }
    }
    xhr.open('POST', '/generalBoard/rightByDeleteModify');
    xhr.send(formData);

    generalArticleReadDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        generalArticleReadDialog.hide();
        showGeneralBoard(boardCode, boardTitle)
    }
}

function generalArticleModify(articleObject, boardCode, boardTitle) {
    generalArticleReadDialog.hide();
    generalArticleModifyFormDialog.show();

    generalArticleModifyForm['title'].value = articleObject['title'];
    generalArticleModifyForm['content'].value = articleObject['content'];

    generalArticleModifyForm.generalArticleModifyTitleLabel = new LabelObj(generalArticleModifyForm.querySelector('[rel="generalArticleModifyTitleLabel"]'));
    generalArticleModifyForm.generalArticleModifyContentLabel = new LabelObj(generalArticleModifyForm.querySelector('[rel="generalArticleModifyContentLabel"]'));


    generalArticleModifyForm.onsubmit = (e) => {
        e.preventDefault();

        generalArticleModifyForm.generalArticleModifyTitleLabel.setValid(generalArticleModifyForm['title'].value.length < 100 && generalArticleModifyForm['title'].value.length > 0);

        generalArticleModifyForm.generalArticleModifyContentLabel.setValid(generalArticleModifyForm['content'].value.length < 1000 && generalArticleModifyForm['content'].value.length > 0);

        if (!generalArticleModifyForm.generalArticleModifyTitleLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '제목은 1 ~ 100 글자까지만 허용됩니다.').show();
            return;
        }
        if (!generalArticleModifyForm.generalArticleModifyContentLabel.isValid()) {
            MessageObj.createSimpleOk('경고', '내용은 1 ~ 1000 글자까지만 허용됩니다.').show();
            return;
        }
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append('index', articleObject['index']);
        formData.append('title', generalArticleModifyForm['title'].value);
        formData.append('content', generalArticleModifyForm['content'].value);
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
                    showGeneralBoard(boardCode, boardTitle);
                }],
                failure_mismatch_user_email: ['경고', '문의 게시글 작성자와 수정 요청자가 일치하지 않습니다. 다시 시도해 주세요.', () => {
                    location.href = '/access/userLogout';
                }],
                failure_exceed_number_character: ['경고', '글자수 제한을 초과하였습니다. 다시 입력해 주세요.'],
                success: ['알림', '문의 게시글 수정에 성공하였습니다.', () => {
                    showGeneralBoard(boardCode, boardTitle);
                }]
            }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
            MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
        }
        xhr.open('PATCH', '/generalBoard/generalArticleModify');
        xhr.send(formData);
    }
    generalArticleModifyFormDialog.querySelector('[rel="cancelButton"]').onclick = () => {
        generalArticleModifyFormDialog.hide();
        generalArticleReadDialog.show();
    };
}

function generalArticleDelete(articleObject, boardCode, boardTitle) {
    new MessageObj({
        title: '삭제',
        content: '정말로 게시글을 삭제하시겠습니까? 삭제된 게시글은 복구할 수 없습니다.',
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
                                showGeneralBoard(boardCode, boardTitle);
                            }],
                            failure_mismatch_user_email: ['경고', '문의 게시글 작성자와 삭제 요청자가 일치하지 않습니다. 다시 시도해 주세요.', () => {
                                location.href = '/access/userLogout';
                            }],
                            success: ['알림', '문의 게시글 삭제에 성공하였습니다.', () => {
                                showGeneralBoard(boardCode, boardTitle);
                            }]
                        }[responseObject.result] || ['경고', '서버가 알 수 없는 응답을 반환하였습니다. 잠시 후 다시 시도해 주세요.'];
                        MessageObj.createSimpleOk(dTitle, dContent, dOnclick).show();
                    }
                    xhr.open('DELETE', '/generalBoard/generalArticleDelete');
                    xhr.send(formData);
                }
            }
        ]
    }).show();
}

function generalArticleViewUpdate(generalArticleIndex) {
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
    xhr.open('GET', `/generalBoard/generalArticleRead?index=${generalArticleIndex}`);
    xhr.send(formData);
}

