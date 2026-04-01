const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "/pages/login.html";
}

const logout = () => {
    localStorage.removeItem("currentUser");
}

const resultModal = document.getElementById("resultModal");
const resultCloseBtn = document.getElementById("resultCloseBtn");

if (resultCloseBtn) {
    resultCloseBtn.addEventListener("click", () => {
        resultModal.classList.remove("active");
    });
}
