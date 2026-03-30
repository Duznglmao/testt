const users = JSON.parse(localStorage.getItem("users")) || [];

const formRegi = document.getElementById("formRegi");
const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const userRePassword = document.getElementById("userRePassword");

const showError = (selector, message, display) => {
    const el = document.querySelector(selector);
    if (el) {
        el.textContent = message;
        el.style.display = display;
    }
};

const createId = () => {
    let id = 1;
    while (users.find(user => user.id === id)) {
        id++;
    }
    return id;
}

formRegi.addEventListener("submit", (e) => {
    e.preventDefault();

    const nameValue = userName.value.trim();
    const emailValue = userEmail.value.trim();
    const passwordValue = userPassword.value.trim();
    const rePasswordValue = userRePassword.value.trim();

    let isValid = true;

    if (nameValue === "") {
        showError(".error-name", "Họ và tên không được để trống", "block");
        isValid = false;
    } else {
        showError(".error-name", "", "none");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailExist = users.some(user => user.email === emailValue);

    if (emailValue === "") {
        showError(".error-email", "Email không được để trống", "block");
        isValid = false;
    } else if (!emailRegex.test(emailValue)) {
        showError(".error-email", "Email phải đúng định dạng", "block");
        isValid = false;
    } else if (isEmailExist) {
        showError(".error-email", "Email đã tồn tại trên hệ thống", "block");
        isValid = false;
    } else {
        showError(".error-email", "", "none");
    }

    if (passwordValue === "") {
        showError(".error-password", "Mật khẩu không được để trống", "block");
        isValid = false;
    } else if (passwordValue.length < 8) {
        showError(".error-password", "Mật khẩu phải có tối thiểu 8 ký tự", "block");
        isValid = false;
    } else {
        showError(".error-password", "", "none");
    }

    if (rePasswordValue === "") {
        showError(".error-repassword", "Mật khẩu xác nhận không được để trống", "block");
        isValid = false;
    } else if (rePasswordValue !== passwordValue) {
        showError(".error-repassword", "Mật khẩu xác nhận phải trùng với mật khẩu", "block");
        isValid = false;
    } else {
        showError(".error-repassword", "", "none");
    }

    if (isValid) {
        const newUser = {
            id: createId(), 
            name: nameValue,
            email: emailValue,
            password: passwordValue
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Đăng ký thành công!");
        window.location.href = "/pages/login.html";
    }
});