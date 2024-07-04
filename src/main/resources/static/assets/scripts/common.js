HTMLElement.VISIBLE_CLASS_NAME = '-visible';
HTMLElement.INVALID_CLASS_NAME = '-invalid';

class LabelObj {
    element;

    constructor(element) { // MVC 모델에서 생성자의 역할과 유사 입력되는 값으로 초기화해주는 역할.
        this.element = element;
    }

    isValid() {
        return !this.element.classList.contains(HTMLElement.INVALID_CLASS_NAME);
    }
    setValid(b) {
        if (b === true){
            this.element.classList.remove(HTMLElement.INVALID_CLASS_NAME);
        }
        if (b === false) {
            this.element.classList.add(HTMLElement.INVALID_CLASS_NAME);
        }
        return this;
    }
}

class MessageObj {
    static cover = null;
    static stack = [];

    static createSimpleOk = (title, content, onclick) => {
        return new MessageObj({
            title: title,
            content: content,
            buttons: [
                {
                    text: '확인',
                    onclick: (obj) => {
                        obj.hide();
                        if (typeof onclick === 'function') {
                            onclick(obj);
                        }
                    }
                }
            ]
        });
    }


    element;

    constructor(params) {
        if (MessageObj.cover === null) {
            const cover = document.createElement('div');
            cover.classList.add('_obj-message-cover');
            MessageObj.cover = cover;
            document.body.prepend(cover);
        }
        params.buttons ??= [];
        const element = new DOMParser().parseFromString(`
        <div class="_obj-message">
            <div class="__title">${params.title}</div>
            <div class="__content">${params.content}</div>
        </div>`, 'text/html').querySelector('._obj-message');

        if (params.buttons.length > 0){
            const buttonContainer = document.createElement('div');
            buttonContainer.classList.add('__button-container');
            buttonContainer.style.gridTemplateColumns = `repeat(${params.buttons.length}, minmax(0, 1fr))`;
            for (const buttonObject of params.buttons) {
                const button = document.createElement('button');
                button.classList.add('__button');
                button.setAttribute('type', 'button');
                button.innerText = buttonObject.text;
                if (typeof buttonObject.onclick === 'function'){
                    button.onclick = () => {
                        buttonObject.onclick(this);
                    };
                }
                buttonContainer.append(button);
            }
            element.append(buttonContainer);
        }
        document.body.prepend(element);
        this.element = element;
    }
    hide() {
        MessageObj.stack.splice(MessageObj.stack.indexOf(this.element), 1);
        setTimeout(() => {
            if (MessageObj.stack.length === 0){
                MessageObj.cover.hide();
            }
            this.element.hide();
        }, 100);
    }

    show() {
        MessageObj.stack.push(this.element);
        setTimeout(() => {
            MessageObj.cover.show();
            this.element.show(); // 이 쇼는 밑에 프로토차입에 만들어둔 show()임, 여기서 방금 만든 show() 를 쓰고 싶르면 this.show() 가 맞음.
        }, 100);
    }
}

HTMLElement.prototype.hide = function () {
    this.classList.remove(HTMLElement.VISIBLE_CLASS_NAME);
    return this;
}

HTMLElement.prototype.show = function () {
    this.classList.add(HTMLElement.VISIBLE_CLASS_NAME);
    return this;
}


HTMLElement.prototype.disable = function () {
    this.setAttribute('disabled', '');
    return this;
}
HTMLElement.prototype.enable = function () {
    this.removeAttribute('disabled');
    return this;
}

HTMLElement.prototype.isEnabled = function () {
    return !this.hasAttribute('disabled');
}


// input 태그에 대한 정규화 메서드
HTMLInputElement.prototype.tests = function () {
    if (typeof this.dataset.regex !== 'string'){
        return true;
    }
    if (typeof this._regExp === 'undefined') {
        this._regExp = new RegExp(this.dataset.regex);
    }
    return this._regExp.test(this.value);
}

// textarea 태그에 대한 정규화 메서드
HTMLTextAreaElement.prototype.tests = function () {
    if (typeof this.dataset.regex !== 'string'){
        return true;
    }
    if (typeof this._regExp === 'undefined') {
        this._regExp = new RegExp(this.dataset.regex);
    }
    return this._regExp.test(this.value);
}


function dateFormat(dateTime) {
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1;
    let date = dateTime.getDate();
    let hour = dateTime.getHours();
    let minute = dateTime.getMinutes();
    let second = dateTime.getSeconds();

    if (month < 10) {
        month = '0' + month;
    }
    if (date < 10) {
        date = '0' + date;
    }
    if (hour < 10) {
        hour = '0' + hour;
    }
    if (minute === 0 || minute < 10) {
        minute = '0' + minute;
    }
    if (second === 0 || second < 10) {
        second = '0' + second;
    }

    return year + '-' + month + '-' + date + ' ' + hour + ':' + minute + ':' + second;
    // YYYY-MM-DD HH:mm
}