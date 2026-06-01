const bookingForm = document.querySelector("#booking-form");
const formNext = document.querySelector("#form-next");

if (bookingForm && formNext) {
  bookingForm.addEventListener("submit", () => {
    const currentPath = window.location.pathname;
    const siteFolder = currentPath.slice(0, currentPath.lastIndexOf("/") + 1);
    formNext.value = `${window.location.origin}${siteFolder}merci.html`;
  });
}
