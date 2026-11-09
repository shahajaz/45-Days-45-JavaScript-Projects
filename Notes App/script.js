const notesContainer = document.getElementById("notesContainer");
const pinnedNotes = document.getElementById("pinnedNotes");
const pinnedSection = document.getElementById("pinnedSection");
const emptyState = document.getElementById("emptyState");

const modalOverlay = document.getElementById("modalOverlay");
const noteForm = document.getElementById("noteForm");

const noteIdInput = document.getElementById("noteId");
const noteTitleInput = document.getElementById("noteTitle");
const noteContentInput = document.getElementById("noteContent");
const noteCategoryInput = document.getElementById("noteCategory");
const noteTagInput = document.getElementById("noteTag");

const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

const toast = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");
const sidebar = document.getElementById("sidebar");

/* === APPLICATION STATE === */
const STORAGE_KEY = "smartNotesApp";
let notes = loadNotes();
let currentFilter = "all";
let searchQuery = "";
let isListView = false;
let toastTimer;

/* === LOCAL STORAGE === */
function loadNotes() {
    try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);

        if (!savedNotes) return [];

        const parsedNotes = JSON.parse(savedNotes);

        if (!Array.isArray(parsedNotes)) return [];

        return parsedNotes.filter(note =>
            note &&
            typeof note.id === "string" &&
            typeof note.title === "string" &&
            typeof note.content === "string"
        ).map(note => ({
            ...note,
            category: note.category || "Personal",
            tag: note.tag || "",
            color: note.color || "yellow",
            pinned: Boolean(note.pinned),
            createdAt: Number(note.createdAt) || Date.now(),
            updatedAt: Number(note.updatedAt) || Date.now()
        }));

    } catch (error) {
        console.error("Error loading notes:", error);
        return [];
    }
}

function saveNotes() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
        return true;
    } catch (error) {
        console.error("Error saving notes:", error);
        showToast("Unable to save notes. Storage may be full.");
        return false;
    }
}

/* === TOAST NOTIFICATION === */
function showToast(message, type = "success") {
    toastMessage.textContent = message;
    const icon = toast.querySelector("i");

    icon.className = type === "error"
        ? "fa-solid fa-circle-exclamation"
        : "fa-solid fa-circle-check";

    icon.style.color = type === "error" ? "#ff7777" : "#43d49b";
    toast.classList.add("show");
    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

/* === MODAL CONTROLS === */
function openModal(note = null) {
    noteForm.reset();
    if (note) {
        document.getElementById("modalTitle").textContent = "Edit Note";

        noteIdInput.value = note.id;
        noteTitleInput.value = note.title;
        noteContentInput.value = note.content;
        noteCategoryInput.value = note.category;
        noteTagInput.value = note.tag || "";

        const colorInput = document.querySelector(
            `input[name="noteColor"][value="${note.color}"]`
        );

        if (colorInput) {
            colorInput.checked = true;
        }

    } else {
        document.getElementById("modalTitle").textContent = "Create New Note";

        noteIdInput.value = "";
        document.querySelector(
            'input[name="noteColor"][value="yellow"]'
        ).checked = true;
    }
    modalOverlay.classList.add("active");
    setTimeout(() => noteTitleInput.focus(), 150);
}

function closeModal() {
    modalOverlay.classList.remove("active");
    noteForm.reset();
}

/* === CREATE AND UPDATE NOTES === */
noteForm.addEventListener("submit", function(event) {
    event.preventDefault();
    const title = noteTitleInput.value.trim();
    const content = noteContentInput.value.trim();

    if (!title || !content) {
        showToast("Please fill in all required fields.", "error");
        return;
    }

    const existingId = noteIdInput.value;
    const selectedColor = document.querySelector(
        'input[name="noteColor"]:checked'
    ).value;
    const now = Date.now();

    if (existingId) {
        const index = notes.findIndex(note => note.id === existingId);

        if (index !== -1) {
            const updatedNote = {
                ...notes[index],
                title,
                content,
                category: noteCategoryInput.value,
                tag: noteTagInput.value.trim(),
                color: selectedColor,
                updatedAt: now
            };

            notes[index] = updatedNote;

            if (!saveNotes()) {
                notes[index] = {
                    ...notes[index],
                    ...loadNotes().find(note => note.id === existingId)
                };
                return;
            }
            closeModal();
            renderNotes();
            showToast("Note updated successfully!");

        }
    } else {
        const newNote = {
            id: crypto.randomUUID(),
            title,
            content,
            category: noteCategoryInput.value,
            tag: noteTagInput.value.trim(),
            color: selectedColor,
            pinned: false,
            createdAt: now,
            updatedAt: now
        };
        notes.unshift(newNote);
        if (!saveNotes()) {
            notes = notes.filter(note => note.id !== newNote.id);
            return;
        }
        closeModal();
        renderNotes();
        showToast("Note created successfully!");
    }
});

/* === DELETE NOTE === */
function deleteNote(id) {
    const confirmed = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmed) return;

    const previousNotes = [...notes];

    notes = notes.filter(note => note.id !== id);

    if (!saveNotes()) {
        notes = previousNotes;
        return;
    }
    renderNotes();
    showToast("Note deleted successfully!");
}

/* === PIN / UNPIN NOTE === */
function togglePin(id) {
    const note = notes.find(note => note.id === id);

    if (!note) return;

    note.pinned = !note.pinned;
    note.updatedAt = Date.now();

    if (!saveNotes()) {
        note.pinned = !note.pinned;
        return;
    }
    renderNotes();
    showToast(
        note.pinned
            ? "Note pinned successfully!"
            : "Note unpinned successfully!"
    );
}

/* === COPY NOTE CONTENT === */
async function copyNote(id) {
    const note = notes.find(note => note.id === id);
    if (!note) return;

    try {
        await navigator.clipboard.writeText(
            `${note.title}\n\n${note.content}`
        );
        showToast("Note copied to clipboard!");

    } catch (error) {
        const textarea = document.createElement("textarea");
        textarea.value = `${note.title}\n\n${note.content}`;
        document.body.appendChild(textarea);
        textarea.select();
        const copied = document.execCommand("copy");
        textarea.remove();

        if (copied) {
            showToast("Note copied to clipboard!");
        } else {
            showToast("Unable to copy note.", "error");
        }
    }
}

/* === DATE FORMATTING === */
function formatDate(timestamp) {
    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    }).format(new Date(timestamp));
}

/* === CREATE NOTE CARD === */
function createNoteCard(note) {
    const card = document.createElement("article");

    card.className = `note-card note-${note.color}`;

    const top = document.createElement("div");
    top.className = "note-top";

    const category = document.createElement("span");
    category.className = "note-category";
    category.textContent = note.category;

    const actions = document.createElement("div");
    actions.className = "note-actions";

    const pinButton = document.createElement("button");
    pinButton.className = note.pinned ? "note-pin" : "";
    pinButton.title = note.pinned ? "Unpin note" : "Pin note";
    pinButton.innerHTML = '<i class="fa-solid fa-thumbtack"></i>';
    pinButton.addEventListener("click", () => togglePin(note.id));

    const editButton = document.createElement("button");
    editButton.title = "Edit note";
    editButton.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editButton.addEventListener("click", () => openModal(note));

    const deleteButton = document.createElement("button");
    deleteButton.title = "Delete note";
    deleteButton.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteButton.addEventListener("click", () => deleteNote(note.id));

    actions.append(pinButton, editButton, deleteButton);

    top.append(category, actions);

    const title = document.createElement("h3");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.className = "note-content";
    content.textContent = note.content;

    card.append(top, title, content);

    if (note.tag) {
        const tag = document.createElement("span");
        tag.className = "note-tag";
        tag.textContent = `# ${note.tag}`;
        card.appendChild(tag);
    }

    const footer = document.createElement("div");
    footer.className = "note-footer";

    const date = document.createElement("span");
    date.className = "note-date";

    date.textContent =
        `Updated ${formatDate(note.updatedAt)}`;

    const copyButton = document.createElement("button");
    copyButton.title = "Copy note";
    copyButton.innerHTML = '<i class="fa-regular fa-copy"></i>';
    copyButton.addEventListener("click", () => copyNote(note.id));
    footer.append(date, copyButton);
    card.appendChild(footer);
    return card;
}

/* === FILTER NOTES === */
function getFilteredNotes() {
    let filtered = [...notes];
    if (currentFilter === "pinned") {
        filtered = filtered.filter(note => note.pinned);

    } else if (currentFilter === "recent") {
        const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        filtered = filtered.filter(
            note => note.updatedAt >= sevenDaysAgo
        );

    } else if (currentFilter !== "all") {
        filtered = filtered.filter(
            note => note.category === currentFilter
        );
    }

    if (searchQuery) {
        filtered = filtered.filter(note => {
            const searchableText = [
                note.title,
                note.content,
                note.category,
                note.tag
            ].join(" ").toLowerCase();
            return searchableText.includes(searchQuery);
        });
    }
    return filtered;
}

/* === SORT NOTES === */
function sortNotes(noteList) {
    const sorted = [...noteList];
    switch (sortSelect.value) {
        case "created":
            sorted.sort((a, b) => b.createdAt - a.createdAt);
            break;

        case "title":
            sorted.sort((a, b) =>
                a.title.localeCompare(b.title)
            );
            break;

        case "updated":
        default:
            sorted.sort((a, b) => b.updatedAt - a.updatedAt);
    }
    return sorted;
}

/* === RENDER NOTES === */
function renderNotes() {
    const filteredNotes = getFilteredNotes();
    const sortedNotes = sortNotes(filteredNotes);
    notesContainer.innerHTML = "";
    pinnedNotes.innerHTML = "";

    const showPinnedSection =
        currentFilter === "all" &&
        !searchQuery;

    const pinned = showPinnedSection
        ? sortNotes(notes.filter(note => note.pinned))
        : [];

    const regularNotes = showPinnedSection
        ? sortedNotes.filter(note => !note.pinned)
        : sortedNotes;

    pinnedSection.hidden = pinned.length === 0;
    pinned.forEach(note => {
        pinnedNotes.appendChild(createNoteCard(note));
    });

    regularNotes.forEach(note => {
        notesContainer.appendChild(createNoteCard(note));
    });

    // Apply selected view
    notesContainer.classList.toggle("list-view", isListView);
    pinnedNotes.classList.toggle("list-view", isListView);

    // Empty state
    const hasNotes = pinned.length + regularNotes.length > 0;
    emptyState.hidden = hasNotes;

    // Notes count
    document.getElementById("notesCount").textContent =
        `${filteredNotes.length} ${filteredNotes.length === 1 ? "note" : "notes"}`;

    // Sidebar counts
    updateSidebarCounts();

    // Section title
    const titles = {
        all: "All Notes",
        pinned: "Pinned Notes",
        recent: "Recently Updated",
        Work: "Work Notes",
        Personal: "Personal Notes",
        Study: "Study Notes",
        Ideas: "Ideas"
    };
    document.getElementById("notesSectionTitle").textContent =
        titles[currentFilter] || "All Notes";
}

/* === UPDATE SIDEBAR COUNTS === */
function updateSidebarCounts() {
    document.getElementById("allCount").textContent = notes.length;
    document.getElementById("pinnedCount").textContent =
        notes.filter(note => note.pinned).length;
    ["Work", "Personal", "Study", "Ideas"].forEach(category => {
        const element = document.getElementById(
            `${category.toLowerCase()}Count`
        );
        element.textContent = notes.filter(
            note => note.category === category
        ).length;
    });
}

/* === SEARCH NOTES === */
searchInput.addEventListener("input", function() {
    searchQuery = this.value.trim().toLowerCase();
    renderNotes();
});

/* === FILTER NAVIGATION === */
document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", function() {
        currentFilter = this.dataset.filter;
        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.remove("active");
        });
        this.classList.add("active");
        const titles = {
            all: "All Notes",
            pinned: "Pinned Notes",
            recent: "Recently Updated",
            Work: "Work Notes",
            Personal: "Personal Notes",
            Study: "Study Notes",
            Ideas: "Ideas"
        };
        document.getElementById("pageTitle").textContent =
            titles[currentFilter] || "All Notes";
        renderNotes();
        sidebar.classList.remove("open");
    });
});


/* === SORTING === */
sortSelect.addEventListener("change", renderNotes);

/* === GRID / LIST VIEW === */
document.getElementById("gridViewBtn").addEventListener("click", function() {
    isListView = false;
    this.classList.add("active");
    document.getElementById("listViewBtn").classList.remove("active");
    renderNotes();

});
document.getElementById("listViewBtn").addEventListener("click", function() {
    isListView = true;
    this.classList.add("active");
    document.getElementById("gridViewBtn").classList.remove("active");
    renderNotes();
});

/* === CREATE NOTE BUTTONS === */
document.getElementById("addNoteBtn").addEventListener(
    "click", () => openModal()
);
document.getElementById("headerAddBtn").addEventListener(
    "click", () => openModal()
);
document.getElementById("emptyAddBtn").addEventListener(
    "click", () => openModal()
);

/* === CLOSE MODAL === */
document.getElementById("closeModal").addEventListener(
    "click", closeModal
);
document.getElementById("cancelBtn").addEventListener(
    "click", closeModal
);
modalOverlay.addEventListener("click", function(event) {
    if (event.target === modalOverlay) {
        closeModal();
    }
});


/* ===CLEAR ALL NOTES === */
document.getElementById("clearAllBtn").addEventListener("click", function() {
    if (notes.length === 0) {
        showToast("There are no notes to delete.");
        return;
    }
    const confirmed = confirm(
        "Are you sure you want to delete ALL notes? This action cannot be undone."
    );
    if (!confirmed) return;
    const previousNotes = [...notes];
    notes = [];

    if (!saveNotes()) {
        notes = previousNotes;
        return;
    }
    renderNotes();
    showToast("All notes deleted successfully!");

});

/* === SIDEBAR RESPONSIVENESS === */
document.getElementById("menuBtn").addEventListener("click", () => {
    sidebar.classList.add("open");

});

document.getElementById("closeSidebar").addEventListener("click", () => {
    sidebar.classList.remove("open");
});


/* === KEYBOARD SHORTCUTS === */
document.addEventListener("keydown", function(event) {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        searchInput.focus();
    }
    if (event.key === "Escape") {
        closeModal();
        sidebar.classList.remove("open");
    }

});

/* === INITIALIZE APPLICATION === */
renderNotes();
