const currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (!currentUser) {
    window.location.href = "/pages/login.html";
}

const logout = () => {
    localStorage.removeItem("currentUser");
};

const ITEMS_PER_PAGE = 8;
let currentPage = 1;
let sortOrder = "asc"; // 'asc' hoặc 'desc'
let searchQuery = "";

const defaultQuizzes = [
    { id: 1, category: "📚 Kiến thức tổng quát", title: "Sử - Địa - GDCD mix", questionsCount: 25, playCount: 12, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 2, category: "🔬 Khoa học", title: "Tự nhiên và công nghệ", questionsCount: 20, playCount: 35, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 3, category: "🧠 IQ", title: "Thử thách logic", questionsCount: 15, playCount: 8, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 4, category: "🌍 Địa lý", title: "Thiên nhiên và con người", questionsCount: 18, playCount: 22, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 5, category: "🎨 Văn hoá", title: "Nghệ thuật Việt Nam", questionsCount: 16, playCount: 16, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 6, category: "🎬 Giải trí", title: "Phim ảnh Hollywood", questionsCount: 12, playCount: 40, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 7, category: "⚽ Thể thao", title: "Bóng đá thế giới", questionsCount: 14, playCount: 29, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 8, category: "📱 Công nghệ", title: "Internet và mạng xã hội", questionsCount: 20, playCount: 19, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 9, category: "🎵 Âm nhạc", title: "Pop và Rock", questionsCount: 17, playCount: 24, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" },
    { id: 10, category: "🥗 Đời sống", title: "Kỹ năng sống hằng ngày", questionsCount: 22, playCount: 10, imageUrl: "/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png" }
];

function getQuizzes() {
    const saved = localStorage.getItem("quizList");
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
            console.warn("Failed to parse quizList, using defaults", e);
        }
    }
    localStorage.setItem("quizList", JSON.stringify(defaultQuizzes));
    return defaultQuizzes;
}

function getFilteredAndSorted() {
    const raw = getQuizzes();
    const filtered = raw.filter((quiz) => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return true;
        return quiz.title.toLowerCase().includes(query) || quiz.category.toLowerCase().includes(query);
    });

    const sorted = filtered.sort((a, b) => {
        if (sortOrder === "asc") return a.playCount - b.playCount;
        return b.playCount - a.playCount;
    });

    return sorted;
}

function renderCards() {
    const container = document.querySelector(".card-container");
    if (!container) return;

    const quizzes = getFilteredAndSorted();
    const totalPages = Math.max(1, Math.ceil(quizzes.length / ITEMS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const pageItems = quizzes.slice(start, start + ITEMS_PER_PAGE);

    container.innerHTML = pageItems.map((quiz) => {
        return `
            <div class="card" data-quiz-id="${quiz.id}">
                <img src="${quiz.imageUrl || '/assets/images/8160b25e90a83127a613c90527e7cea2365c88ea.png'}" alt="${quiz.title}">
                <div class="card-content">
                    <p class="category">${quiz.category}</p>
                    <p class="title">${quiz.title}</p>
                    <p class="stats">${quiz.questionsCount} câu hỏi - ${quiz.playCount} lượt chơi</p>
                    <button class="play-btn">Chơi</button>
                </div>
            </div>
        `;
    }).join("");

    if (pageItems.length === 0) {
        container.innerHTML = "<p>Không có bài test nào. Vui lòng thêm dữ liệu.</p>";
    }

    container.querySelectorAll(".play-btn").forEach((btn) => {
        btn.addEventListener("click", (event) => {
            const card = event.target.closest(".card");
            const id = card?.dataset?.quizId;
            if (id) {
                const selected = quizzes.find((q) => q.id.toString() === id.toString());
                if (selected) {
                    localStorage.setItem("currentQuizId", id);
                    localStorage.setItem("currentQuiz", JSON.stringify(selected));
                    window.location.href = "/pages/take-quiz.html";
                }
            }
        });
    });

    renderPagination(quizzes.length);
}

function renderPagination(totalItems) {
    const pagination = document.querySelector(".pagination");
    if (!pagination) return;

    const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
    pagination.innerHTML = "";

    const createBtn = (text, isActive, disabled = false) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        if (isActive) btn.classList.add("active");
        if (disabled) btn.disabled = true;
        return btn;
    };

    const prevBtn = createBtn("<", false, currentPage === 1);
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage -= 1;
            renderCards();
        }
    });
    pagination.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = createBtn(i.toString(), currentPage === i);
        pageBtn.addEventListener("click", () => {
            if (currentPage !== i) {
                currentPage = i;
                renderCards();
            }
        });
        pagination.appendChild(pageBtn);
    }

    const nextBtn = createBtn(">", false, currentPage === totalPages);
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage += 1;
            renderCards();
        }
    });
    pagination.appendChild(nextBtn);
}

function bindSortButtons() {
    const [ascBtn, descBtn] = document.querySelectorAll(".sortByPlay button");
    if (!ascBtn || !descBtn) return;

    const refreshSortActive = () => {
        ascBtn.classList.toggle("active", sortOrder === "asc");
        descBtn.classList.toggle("active", sortOrder === "desc");
    };

    ascBtn.addEventListener("click", () => {
        sortOrder = "asc";
        currentPage = 1;
        refreshSortActive();
        renderCards();
    });

    descBtn.addEventListener("click", () => {
        sortOrder = "desc";
        currentPage = 1;
        refreshSortActive();
        renderCards();
    });

    refreshSortActive();
}

function bindSearchBar() {
    const searchInput = document.querySelector("header .search-bar input");
    if (!searchInput) return;

    searchInput.addEventListener("input", (event) => {
        searchQuery = event.target.value || "";
        currentPage = 1;
        renderCards();
    });
}

function initDashboard() {
    getQuizzes();
    bindSortButtons();
    bindSearchBar();
    renderCards();
}

initDashboard();