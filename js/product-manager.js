const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/pages/login.html";
}

const logout = () => {
    localStorage.removeItem("currentUser");
    window.location.href = "/pages/login.html";
};

const changePage = () => {
    window.location.href = "/pages/quiz-builder.html";
};


let tests = JSON.parse(localStorage.getItem("tests"));
if(!tests) {
    tests = [
        {id: 1, name: "History Quiz", categoryEmoji: "📚", categoryName: "Lịch sử", questionCount: 15, time: 10},
        {id: 2, name: "Science Challenge", categoryEmoji: "🧠", categoryName: "Khoa học", questionCount: 20, time: 15},
        {id: 3, name: "Entertainment Trivia", categoryEmoji: "🎤", categoryName: "Giải trí", questionCount: 10, time: 5},
        {id: 4, name: "Geography Master", categoryEmoji: "🌍", categoryName: "Địa lý", questionCount: 25, time: 20},
        {id: 5, name: "Math Quiz Basic", categoryEmoji: "🔢", categoryName: "Toán học", questionCount: 12, time: 8},
        {id: 6, name: "Art Knowledge Test", categoryEmoji: "🎨", categoryName: "Nghệ thuật", questionCount: 18, time: 12},
        {id: 7, name: "Music Trivia", categoryEmoji: "🎵", categoryName: "Âm nhạc", questionCount: 30, time: 25},
        {id: 8, name: "Sport Quiz", categoryEmoji: "⚽", categoryName: "Thể thao", questionCount: 15, time: 10},
        {id: 9, name: "Computer Science Test", categoryEmoji: "💻", categoryName: "Công nghệ", questionCount: 22, time: 18},
        {id: 10, name: "General Knowledge", categoryEmoji: "🌐", categoryName: "Chung", questionCount: 40, time: 30}
    ];
    localStorage.setItem("tests", JSON.stringify(tests));
}

let currentPage = 1;
const limit = 5;
let sortBy = "";
let searchKeyword = "";
let deleteId = null;

const tableBody = document.getElementById("testTableBody");
const sortSelect = document.getElementById("sortSelect");
const searchInput = document.getElementById("searchInput");
const deleteModal = document.getElementById("quizDeleteModal");
const deleteBtn = document.getElementById("deleteQuizBtn");
const quizEditModal = document.getElementById("quizEditModal");
const saveQuizBtn = document.getElementById("saveQuizBtn");
const questionNameInput = document.getElementById("quiz-question-name");
let editingTestId = null;


const getProcessedTests = () => {
    let result = tests.slice();

    if(searchKeyword) {
        result = result.filter(test => test.name.toLowerCase().includes(searchKeyword.toLowerCase()));
    }

    if(sortBy === "name-asc") result.sort((a,b) => a.name.localeCompare(b.name));
    else if(sortBy === "name-desc") result.sort((a,b) => b.name.localeCompare(a.name));
    else if(sortBy === "time-asc") result.sort((a,b) => a.time - b.time);
    else if(sortBy === "time-desc") result.sort((a,b) => b.time - a.time);

    return result;
};


const renderTable = () => {
    const processed = getProcessedTests();
    const start = (currentPage -1) * limit;
    const pageData = processed.slice(start, start + limit);

    tableBody.innerHTML = pageData.map(test => `
        <tr>
            <td>${test.id}</td>
            <td>${test.name}</td>
            <td>${test.categoryEmoji} ${test.categoryName}</td>
            <td>${test.questionCount}</td>
            <td>${test.time} min</td>
            <td class="action-cell">
                <button class="btn-edit" onclick="openEditTest(${test.id})">Sửa</button>
                <button class="btn-delete" onclick="openDeleteModal(${test.id})">Xoá</button>
            </td>
        </tr>
    `).join('');

    renderPagination();
};


const renderPagination = () => {
    const processed = getProcessedTests();
    const totalPages = Math.ceil(processed.length / limit);

    let html = `<button class="page-btn" onclick="goToPage(${currentPage -1})" ${currentPage === 1 ? 'disabled' : ''}>&lt;</button>`;

    for(let i = 1; i <= totalPages; i++) {
        html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
    }

    html += `<button class="page-btn" onclick="goToPage(${currentPage +1})" ${currentPage === totalPages ? 'disabled' : ''}>&gt;</button>`;

    document.querySelector(".pagination").innerHTML = html;
};


const goToPage = (page) => {
    const totalPages = Math.ceil(getProcessedTests().length / limit);
    if(page < 1 || page > totalPages) return;
    currentPage = page;
    renderTable();
};


const openDeleteModal = (testId) => {
    deleteId = testId;
    deleteModal.classList.add("active");
};

const closeDeleteModal = () => {
    deleteId = null;
    deleteModal.classList.remove("active");
};

const confirmDelete = () => {
    const index = tests.findIndex(test => test.id === deleteId);
    tests.splice(index, 1);
    localStorage.setItem("tests", JSON.stringify(tests));
    closeDeleteModal();
    renderTable();
};

const openEditTest = (testId) => {
    editingTestId = testId;
    const test = tests.find(t => t.id === testId);
    if (!test) return;

    questionNameInput.value = test.name;
    quizEditModal.classList.add("active");
};

const closeQuizEditModal = () => {
    editingTestId = null;
    quizEditModal.classList.remove("active");
};

const saveEditedTest = () => {
    const updatedName = questionNameInput.value.trim();
    if (!updatedName) {
        alert("Tên câu hỏi không được để trống");
        return;
    }

    const index = tests.findIndex(t => t.id === editingTestId);
    if (index === -1) return;

    tests[index].name = updatedName;
    localStorage.setItem("tests", JSON.stringify(tests));

    closeQuizEditModal();
    renderTable();
};

sortSelect.addEventListener("change", e => {
    sortBy = e.target.value;
    currentPage = 1;
    renderTable();
});

searchInput.addEventListener("input", e => {
    searchKeyword = e.target.value.trim();
    currentPage = 1;
    renderTable();
});

deleteBtn.addEventListener("click", confirmDelete);

quizEditModal.querySelector(".close-btn").addEventListener("click", closeQuizEditModal);
quizEditModal.querySelector(".btn-cancel").addEventListener("click", closeQuizEditModal);
saveQuizBtn.addEventListener("click", saveEditedTest);

window.addEventListener("click", e => {
    if (e.target === deleteModal) closeDeleteModal();
    if (e.target === quizEditModal) closeQuizEditModal();
});

renderTable();