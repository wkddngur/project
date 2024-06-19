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
})

