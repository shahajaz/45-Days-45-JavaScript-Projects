
// ==========================================
// 1. HAMBURGER MENU
// ==========================================

const navLinks = document.getElementById("navLinks");
const openMenu = document.getElementById("openMenu");
const closeMenu = document.getElementById("closeMenu");

if (navLinks && openMenu && closeMenu) {

    // Reusable Toggle Function
    const toggleMenu = (isOpen) => {

        navLinks.classList.toggle("active", isOpen);

        openMenu.classList.toggle("hidden", isOpen);
        closeMenu.classList.toggle("hidden", !isOpen);

        openMenu.setAttribute("aria-expanded", String(isOpen));
    };

    // Open Menu
    openMenu.addEventListener("click", () => {
        toggleMenu(true);
    });

    // Close Menu
    closeMenu.addEventListener("click", () => {
        toggleMenu(false);
    });

    // Close Menu After Clicking Navigation Link
    navLinks.querySelectorAll("a").forEach((link) => {

        link.addEventListener("click", () => {
            toggleMenu(false);
        });

    });

    // Close Menu On Escape Key
    document.addEventListener("keydown", (event) => {

        if (event.key === "Escape" && navLinks.classList.contains("active")) {
            toggleMenu(false);
            openMenu.focus();
        }

    });
}


// ==========================================
// 2. TESTIMONIAL SLIDER
// ==========================================

const wrapper = document.querySelector(".wrapper");
const indicators = document.querySelectorAll(".indicators button");

let currentTestimonial = 0;

if (wrapper && indicators.length > 0) {

    // Reusable Slider Function
    const showTestimonial = (index) => {

        // Validate Index
        if (index < 0 || index >= indicators.length) return;

        // Remove Previous Active Class
        indicators[currentTestimonial].classList.remove("active");

        // Update Slider Position
        wrapper.style.transform = `translateX(-${index * 100}%)`;

        // Update Active Indicator
        indicators[index].classList.add("active");

        // Update Current Testimonial
        currentTestimonial = index;
    };

    // Indicator Click Events
    indicators.forEach((indicator, index) => {

        indicator.addEventListener("click", () => {
            showTestimonial(index);
        });

    });

}
