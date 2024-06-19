const reservationForm = document.getElementById('reservationForm');


const showReservationForm = () => {
    reservationForm.show();
    cover.show();

    reservationForm.querySelector('[rel="cancelButton"]').onclick = () => {
        reservationForm.hide();
        cover.hide();
    }
};
