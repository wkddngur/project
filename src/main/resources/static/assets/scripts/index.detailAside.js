const detailAside = document.getElementById('detailAside');

detailAside.querySelectorAll('[rel="closer"]').forEach(closer => closer.onclick = () => {
    detailAside.hide();
    if (typeof onclose === 'function') {
        onclose();
    }
    listAside.show();
});