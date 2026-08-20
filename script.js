const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");
const header = document.querySelector("header");
const subtitle = document.querySelector(".hero-left h2");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* Mobile hamburger menu */
const navToggle = document.querySelector(".nav-toggle");
const navList = document.querySelector(".nav-links");

function closeNavMenu() {
    if (!navToggle || !navList) return;
    navList.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
}

if (navToggle && navList) {
    navToggle.addEventListener("click", () => {
        const isOpen = navList.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
        navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    });

    navLinks.forEach((link) => {
        link.addEventListener("click", closeNavMenu);
    });

    document.addEventListener("click", (event) => {
        const clickedInsideNav = event.target.closest("nav");
        if (!clickedInsideNav) closeNavMenu();
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNavMenu();
    });
}

/* Theme switcher */
const themeButton = document.createElement("button");
themeButton.className = "theme-toggle";
themeButton.type = "button";

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "blue") {
    document.body.classList.add("blue-theme");
}

function updateThemeButton() {
    const isBlue = document.body.classList.contains("blue-theme");

    themeButton.innerHTML = isBlue
        ? '<i class="fa-solid fa-palette" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-droplet" aria-hidden="true"></i>';

    themeButton.title = isBlue
        ? "Switch to violet theme"
        : "Switch to blue theme";

    themeButton.setAttribute(
        "aria-label",
        isBlue ? "Switch to violet theme" : "Switch to blue theme"
    );
}

themeButton.addEventListener("click", () => {
    document.body.classList.toggle("blue-theme");

    localStorage.setItem(
        "portfolio-theme",
        document.body.classList.contains("blue-theme")
            ? "blue"
            : "violet"
    );

    updateThemeButton();
});

const navigation = document.querySelector("nav");

if (navigation) {
    navigation.appendChild(themeButton);
    updateThemeButton();
}

/* Scroll progress */
const progressBar = document.createElement("div");
progressBar.className = "scroll-progress";
document.body.appendChild(progressBar);

function updateScrollProgress() {
    const pageHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress = pageHeight > 0
        ? (window.scrollY / pageHeight) * 100
        : 0;

    progressBar.style.width = `${progress}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

/* Section reveal and active navigation */
if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            entry.target.classList.add("show");

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        });
    }, { threshold: 0.18 });

    sections.forEach((section) => {
        sectionObserver.observe(section);
    });
} else {
    sections.forEach((section) => {
        section.classList.add("show");
    });
}

/* Header scroll state */
window.addEventListener("scroll", () => {
    if (header) {
        header.classList.toggle("scrolled", window.scrollY > 80);
    }
}, { passive: true });

/* Typing animation */
const typingTexts = [
    "AI Developer",
    "Research Analyst",
    "Python Learner",
    "Creator of COSMOS",
    "Web Developer"
];

let textIndex = 0;
let characterIndex = 0;
let deleting = false;

function typeText() {
    if (!subtitle) return;

    const currentText = typingTexts[textIndex];

    subtitle.textContent = deleting
        ? currentText.substring(0, characterIndex--)
        : currentText.substring(0, characterIndex++);

    if (!deleting && characterIndex > currentText.length) {
        deleting = true;
        setTimeout(typeText, 1400);
        return;
    }

    if (deleting && characterIndex < 0) {
        deleting = false;
        characterIndex = 0;
        textIndex = (textIndex + 1) % typingTexts.length;
    }

    setTimeout(typeText, deleting ? 55 : 110);
}

if (!prefersReducedMotion) {
    typeText();
} else if (subtitle) {
    subtitle.textContent = typingTexts[0];
}

/* Card reveal */
const animatedItems = document.querySelectorAll(
    ".card, .skill, .project-card, .contact-container"
);

animatedItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.transitionDelay = `${(index % 5) * 100}ms`;
});

if ("IntersectionObserver" in window) {
    const itemObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                itemObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    animatedItems.forEach((item) => {
        itemObserver.observe(item);
    });
} else {
    animatedItems.forEach((item) => {
        item.classList.add("visible");
    });
}

/* Cursor glow */
if (
    !prefersReducedMotion &&
    window.matchMedia("(pointer: fine)").matches
) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";

    Object.assign(cursorGlow.style, {
        position: "fixed",
        zIndex: "-1",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        pointerEvents: "none",
        background:
            "radial-gradient(circle, rgba(179, 136, 255, .16), transparent 70%)",
        transform: "translate(-50%, -50%)"
    });

    document.body.appendChild(cursorGlow);

    window.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

/* Card tilt */
if (
    !prefersReducedMotion &&
    window.matchMedia("(pointer: fine)").matches
) {
    document.querySelectorAll(".skill, .project-card").forEach((card) => {
        card.addEventListener("mousemove", (event) => {
            const bounds = card.getBoundingClientRect();
            const x = event.clientX - bounds.left;
            const y = event.clientY - bounds.top;

            const rotateX = ((y / bounds.height) - 0.5) * -8;
            const rotateY = ((x / bounds.width) - 0.5) * 8;

            card.style.transform =
                `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* Contact form */
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    const emailInput = contactForm.querySelector('input[name="email"]');

    contactForm.addEventListener("submit", () => {
        if (emailInput) {
            let replyToInput = contactForm.querySelector(
                'input[name="_replyto"]'
            );

            if (!replyToInput) {
                replyToInput = document.createElement("input");
                replyToInput.type = "hidden";
                replyToInput.name = "_replyto";
                contactForm.appendChild(replyToInput);
            }

            replyToInput.value = emailInput.value;
        }

        const button = contactForm.querySelector("button[type='submit']");

        if (button) {
            button.disabled = true;
            button.textContent = "Sending...";
        }
    });
}
