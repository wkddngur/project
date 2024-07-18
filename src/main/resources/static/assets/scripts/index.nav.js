const nav = document.getElementById('nav');
const categoryDialog = document.getElementById('categoryDialog');
const buttonContainer = nav.querySelector('.button-container');

const categoryButton = buttonContainer.querySelector('[rel="categoryButton"]');

categoryButton.addEventListener('mouseenter', () => {
    categoryDialog.show();
});

document.addEventListener('DOMContentLoaded', () => {
    categoryButton.addEventListener('mouseleave', (e) => {
        if (!categoryDialog.contains(e.relatedTarget)) {
            categoryDialog.hide();
        }
    });

    categoryDialog.addEventListener('mouseenter', () => {
        categoryDialog.show();
    });

    categoryDialog.addEventListener('mouseleave', () => {
        categoryDialog.hide();
    });
});

const logoutButton = buttonContainer.querySelector('[rel="logoutButton"]');

logoutButton.onclick = () => {
    if (confirm('로그아웃 하시겠습니까?')) {
        location.href = '/access/userLogout';
    } else {
        return;
    }
}

nav.searchForm = document.getElementById('searchForm');

nav.searchForm.onsubmit = (e) => {
    e.preventDefault();

    const keyword = nav.searchForm.querySelector('[name="keyword"]').value;

    if (keyword === null || keyword.length > 255 || keyword.length < 1) {
        alert('검색어를 입력해 주세요.');
        return;
    }

    searchParkingLots(keyword);

}
