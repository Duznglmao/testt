const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/pages/login.html";
}

function logout() {
    localStorage.removeItem("currentUser");
    window.location.href = "/pages/login.html";
}

const showError = (selector, message, visible) => {
    const el = document.querySelector(selector);
    if (!el) return;
    el.textContent = message;
    el.style.display = visible ? "block" : "none";
};

let categories = JSON.parse(localStorage.getItem("categories"));
if (!categories) {
    categories = [
        { id: 1, name: "Lịch sử", emoji: "📚" },
        { id: 2, name: "Khoa học", emoji: "🧠" },
        { id: 3, name: "Giải trí", emoji: "🎤" },
        { id: 4, name: "Đời sống", emoji: "🏠" },
        { id: 5, name: "Địa lý", emoji: "🌍" },
        { id: 6, name: "Toán học", emoji: "🔢" }
    ];
    localStorage.setItem("categories", JSON.stringify(categories));
}

let editingId = null;
let deleteId = null;
let currentPage = 1;
const limit = 5;

const tableBody = document.getElementById("categoryTableBody");
const btnAdd = document.getElementById("btnAddCategory");
const editModal = document.querySelectorAll(".modal-overlay")[0];
const deleteModal = document.querySelectorAll(".modal-overlay")[1];
const inputName = document.getElementById("category-name");
const inputEmoji = document.getElementById("emoji");


const getProcessedCategories = () => {
    return categories.slice();
};

const renderPagination = () => {
    const totalPages = Math.max(1, Math.ceil(getProcessedCategories().length / limit));
    let html = `<button class="page-btn" onclick="goToPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;

    for (let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn" onclick="goToPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;
    document.querySelector('.pagination').innerHTML = html;
};

const goToPage = (page) => {
    const totalPages = Math.max(1, Math.ceil(getProcessedCategories().length / limit));
    if (page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
};

function renderTable() {
    const processed = getProcessedCategories();
    const start = (currentPage - 1) * limit;
    const pageData = processed.slice(start, start + limit);

    tableBody.innerHTML = pageData.map(cat => `
        <tr>
            <td>${cat.id}</td>
            <td>${cat.emoji} ${cat.name}</td>
            <td class="action-cell">
                <button class="btn-edit" onclick="openEditModal(${cat.id})">Sửa</button>
                <button class="btn-delete" onclick="openDeleteModal(${cat.id})">Xoá</button>
            </td>
        </tr>
    `).join('');

    localStorage.setItem("categories", JSON.stringify(categories));
    renderPagination();
}


function openAddModal() {
    editingId = null;
    editModal.querySelector("h2").innerText = "Thêm danh mục mới";
    inputName.value = "";
    inputEmoji.value = "";
    showError(".error-text", "", false);
    inputName.classList.remove("input-error");
    editModal.style.display = "flex";
}

function openEditModal(categoryId) {
    editingId = categoryId;
    editModal.querySelector("h2").innerText = "Chỉnh sửa danh mục";

    const foundCat = categories.find(cat => cat.id === categoryId);
    inputName.value = foundCat.name;
    inputEmoji.value = foundCat.emoji;

    showError(".error-text", "", false);
    inputName.classList.remove("input-error");
    editModal.style.display = "flex";
}

function closeEditModal() {
    editModal.style.display = "none";
}

function openDeleteModal(categoryId) {
    deleteId = categoryId;
    deleteModal.style.display = "flex";
}

function closeDeleteModal() {
    deleteModal.style.display = "none";
}


function validateForm() {
    const name = inputName.value.trim();
    const emoji = inputEmoji.value.trim();

    showError(".error-text", "", false);
    inputName.classList.remove("input-error");

    if (!name) {
        showError(".error-text", "Tên danh mục không được để trống", true);
        inputName.classList.add("input-error");
        return false;
    }

    if (name.length < 2 || name.length > 30) {
        showError(".error-text", "Tên danh mục phải từ 2 đến 30 ký tự", true);
        inputName.classList.add("input-error");
        return false;
    }

    if (!emoji) {
        showError(".error-text", "Bạn chưa nhập emoji", true);
        return false;
    }

    const isDuplicate = categories.some(cat => {
        if (editingId && cat.id === editingId) return false;
        return cat.name.toLowerCase() === name.toLowerCase();
    });

    if (isDuplicate) {
        showError(".error-text", "Tên danh mục đã tồn tại", true);
        inputName.classList.add("input-error");
        return false;
    }

    return true;
}


function saveCategory() {
    if (!validateForm()) return;

    const name = inputName.value.trim();
    const emoji = inputEmoji.value.trim();

    if (!editingId) {
        const maxId = categories.reduce((max, cat) => cat.id > max ? cat.id : max, 0);
        categories.push({
            id: maxId + 1,
            name: name,
            emoji: emoji
        });
        currentPage = Math.ceil(categories.length / limit);
    } else {
        const index = categories.findIndex(cat => cat.id === editingId);
        categories[index].name = name;
        categories[index].emoji = emoji;
    }

    closeEditModal();
    renderTable();
}


function confirmDeleteCategory() {
    const index = categories.findIndex(cat => cat.id === deleteId);
    if (index === -1) return;
    categories.splice(index, 1);

    const totalPages = Math.max(1, Math.ceil(categories.length / limit));
    if (currentPage > totalPages) currentPage = totalPages;

    closeDeleteModal();
    renderTable();
}


btnAdd.addEventListener("click", openAddModal);

editModal.querySelector(".close-btn").addEventListener("click", closeEditModal);
editModal.querySelector(".btn-cancel").addEventListener("click", closeEditModal);
deleteModal.querySelector(".close-btn").addEventListener("click", closeDeleteModal);
deleteModal.querySelector(".btn-cancel").addEventListener("click", closeDeleteModal);

editModal.querySelector(".btn-save").addEventListener("click", saveCategory);
deleteModal.querySelector(".btn-delete").addEventListener("click", confirmDeleteCategory);

window.addEventListener("click", e => {
    if (e.target === editModal) closeEditModal();
    if (e.target === deleteModal) closeDeleteModal();
})

renderTable();