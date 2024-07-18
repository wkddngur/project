const showFreeArticleSpan = categoryDialog.querySelector('[rel="showFreeArticleSpan"]');
const showNoticeArticleSpan = categoryDialog.querySelector('[rel="showNoticeArticleSpan"]');
const showEventArticleSpan = categoryDialog.querySelector('[rel="showEventArticleSpan"]');
const showInquiryArticleSpan = categoryDialog.querySelector(`[rel="showInquiryArticleSpan"]`);

categoryDialog.querySelector('[rel="goUserPageCaller"]').onclick = () => {

    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    xhr.onreadystatechange = function () {
        if (xhr.readyState !== XMLHttpRequest.DONE) {
            return;
        }
        if (xhr.status < 200 || xhr.status >= 300) {
            MessageObj.createSimpleOk('오류', '요청을 전송하는 도중 오류가 발생하였습니다. 잠시 후 이용해 주세요.').show();
            return;
        }
        const responseObject = JSON.parse(xhr.responseText);

        if (responseObject) {
            location.href = '/administratorPage/';
        } else {
            location.href = '/userPage/';
        }
    }
    xhr.open('POST', '/administratorPage/userAdminCheck');
    xhr.send(formData);
}

showFreeArticleSpan.onclick = () => {
    showGeneralBoard('free', '자유 게시판');
}

showNoticeArticleSpan.onclick = () => {
    showGeneralBoard('notice', '공지사항 게시판');
}


showEventArticleSpan.onclick = () => {
    showGeneralBoard('event', '이벤트 게시판');
}


showInquiryArticleSpan.onclick = () => {
    showInquiryBoardDialog();
}