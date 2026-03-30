const formLogin = document.getElementById("formLogin");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");

const showError = (selector, message, display) => {
    const el = document.querySelector(selector);
    if (el) {
        el.textContent = message;
        el.style.display = display;
    }
};

formLogin.addEventListener("submit", (e) => {
    e.preventDefault();

    const emailValue = userEmail.value.trim();
    const passwordValue = userPassword.value.trim();

    if (emailValue.length === 0) {
        showError(".error-email", "Vui lòng nhập địa chỉ email", "block");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailValue)) {
        showError(".error-email", "Email không đúng định dạng", "block");
        return;
    }
    showError(".error-email", "", "none");

    if (passwordValue.length === 0) {
        showError(".error-password", "Vui lòng nhập mật khẩu", "block");
        return;
    }
    showError(".error-password", "", "none");

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const userFound = users.find((user) => user.email === emailValue && user.password === passwordValue);

    if (userFound) {
        alert(`Chào mừng ${userFound.name} quay trở lại!`);
        localStorage.setItem("currentUser", JSON.stringify(userFound));
        window.location.href = "/pages/dashboard.html";
    } else {
        showError(".error-email", "Email hoặc mật khẩu không chính xác", "block");
        userEmail.classList.add("input-error");
        userPassword.classList.add("input-error");
    }
});