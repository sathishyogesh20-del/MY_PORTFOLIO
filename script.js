const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");
const header = document.querySelector("header");
const subtitle = document.querySelector(".hero-left h3");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* Theme styles */
const themeStyles = document.createElement("style");

themeStyles.textContent = `
    body {
        transition:
            background .5s ease,
            color .4s ease;
    }

    body.blue-theme {
        --bg: #06121f;
        --bg-soft: #0b1d31;
        --surface: rgba(12, 34, 58, .9);
        --surface-solid: #0c223a;
        --input: #081827;

        --primary: #00bfff;
        --primary-light: #b9f2ff;
        --secondary: #0077ff;
        --accent: #43e6d0;

        --heading: #f2fcff;
        --text: #c6dce8;
        --muted: #91adbd;

        --border: rgba(0, 191, 255, .22);
        --border-hover: rgba(0, 191, 255, .85);
        --shadow: 0 24px 70px rgba(0, 18, 35, .5);

        background:
            radial-gradient(circle at 5% 0%, rgba(0, 191, 255, .2), transparent 30rem),
            radial-gradient(circle at 100% 45%, rgba(0, 119, 255, .18), transparent 32rem),
            radial-gradient(circle at 50% 100%, rgba(67, 230, 208, .1), transparent 30rem),
            linear-gradient(135deg, #06121f, #0a1c31 48%, #06121f);
    }

    body.blue-theme::before {
        background: #0077ff;
    }

    body.blue-theme::after {
        background: #00bfff;
    }

    body.blue-theme header {
        background: rgba(6, 18, 31, .74);
    }

    body.blue-theme header.scrolled {
        background: rgba(6, 18, 31, .96);
    }

    body.blue-theme .card,
    body.blue-theme .skill,
    body.blue-theme .project-card,
    body.blue-theme .contact-container {
        background: linear-gradient(
            145deg,
            rgba(12, 42, 70, .92),
            rgba(5, 20, 35, .98)
        );
    }

    body.blue-theme .logo::first-letter {
        color: var(--primary);
    }

    body.blue-theme .hero-left h1 span {
        color: var(--primary);
        text-shadow: 0 0 20px rgba(0, 191, 255, .7);
    }

    body.blue-theme .hero-right img {
        border-color: var(--primary);
        box-shadow:
            0 0 0 12px rgba(0, 191, 255, .1),
            0 0 55px rgba(0, 191, 255, .5);
    }

    body.blue-theme .hero-right img:hover {
        box-shadow:
            0 0 0 17px rgba(67, 230, 208, .12),
            0 0 75px rgba(0, 191, 255, .7);
    }

    body.blue-theme .project-card h3,
    body.blue-theme .achievement-card h3 {
        color: var(--primary-light);
    }

    body.blue-theme .project-card:hover h3 {
        color: var(--primary);
    }

    body.blue-theme .achievement-image {
        border-color: rgba(0, 191, 255, .35);
    }

    body.blue-theme .form-group label {
        color: var(--primary-light) !important;
    }

    body.blue-theme .form-group input:focus,
    body.blue-theme .form-group textarea:focus {
        border-color: var(--primary);
        box-shadow:
            0 0 0 4px rgba(0, 191, 255, .12),
            0 0 22px rgba(0, 191, 255, .2);
    }

    body.blue-theme .scroll-progress {
        background: linear-gradient(
            90deg,
            #0077ff,
            #00bfff,
            #43e6d0
        );
    }

    body.blue-theme .cursor-glow {
        background: radial-gradient(
            circle,
            rgba(0, 191, 255, .2),
            transparent 70%
        ) !important;
    }
`;

document.head.appendChild(themeStyles);

/* Theme switcher */
const themeButton = document.createElement("button");
themeButton.className = "theme-toggle";
themeButton.type = "button";
themeButton.setAttribute("aria-label", "Switch to blue theme");

const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "blue") {
    document.body.classList.add("blue-theme");
}

function updateThemeButton() {
    const blueThemeEnabled = document.body.classList.contains("blue-theme");

    themeButton.innerHTML = blueThemeEnabled
        ? '<i class="fa-solid fa-palette" aria-hidden="true"></i>'
        : '<i class="fa-solid fa-droplet" aria-hidden="true"></i>';

    themeButton.title = blueThemeEnabled
        ? "Switch to violet theme"
        : "Switch to blue theme";

    themeButton.setAttribute(
        "aria-label",
        blueThemeEnabled
            ? "Switch to violet theme"
            : "Switch to blue theme"
    );
}

themeButton.addEventListener("click", () => {
    const blueThemeEnabled = document.body.classList.toggle("blue-theme");

    localStorage.setItem(
        "portfolio-theme",
        blueThemeEnabled ? "blue" : "violet"
    );

    updateThemeButton();
});

const navigation = document.querySelector("nav");

if (navigation) {
    navigation.appendChild(themeButton);
    updateThemeButton();
}

/* Dynamic animation styles */
const animationStyles = document.createElement("style");

animationStyles.textContent = `
    .reveal-item {
        opacity: 0;
        transform: translateY(35px) scale(.96);
        transition: opacity .7s ease,
            transform .7s cubic-bezier(.2,.8,.2,1);
    }

    .reveal-item.visible {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        background: rgba(255, 255, 255, .65);
        transform: scale(0);
        animation: rippleEffect .65s ease-out;
    }

    .tilt-card {
        will-change: transform;
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .reveal-item {
            opacity: 1;
            transform: none;
            transition: none;
        }
    }
`;

document.head.appendChild(animationStyles);

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
    }, {
        threshold: 0.18
    });

    sections.forEach((section) => sectionObserver.observe(section));
} else {
    sections.forEach((section) => section.classList.add("show"));
}

/* Header scroll state */
window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 80);
}, { passive: true });

/* Typing animation */
const text = [
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

    const currentText = text[textIndex];

    subtitle.textContent = deleting
        ? currentText.substring(0, characterIndex--)
        : currentText.substring(0, characterIndex++);

    if (!deleting && characterIndex === currentText.length + 1) {
        deleting = true;
        setTimeout(typeText, 1400);
        return;
    }

    if (deleting && characterIndex === 0) {
        deleting = false;
        textIndex = (textIndex + 1) % text.length;
    }

    setTimeout(typeText, deleting ? 55 : 110);
}

if (!prefersReducedMotion) {
    typeText();
} else if (subtitle) {
    subtitle.textContent = text[0];
}

/* Staggered card reveal */
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
    }, {
        threshold: 0.12
    });

    animatedItems.forEach((item) => itemObserver.observe(item));
} else {
    animatedItems.forEach((item) => item.classList.add("visible"));
}

/* Cursor glow */
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    Object.assign(cursorGlow.style, {
        position: "fixed",
        zIndex: "-1",
        width: "180px",
        height: "180px",
        borderRadius: "50%",
        pointerEvents: "none",
        background: "radial-gradient(circle, rgba(179, 136, 255, .16), transparent 70%)",
        transform: "translate(-50%, -50%)"
    });

    window.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

/* Card tilt */
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document.querySelectorAll(".skill, .project-card").forEach((card) => {
        card.classList.add("tilt-card");

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

/* Button ripple */
document.querySelectorAll(".btn").forEach((button) => {
    button.addEventListener("click", (event) => {
        const ripple = document.createElement("span");
        const bounds = button.getBoundingClientRect();
        const size = Math.max(bounds.width, bounds.height);

        ripple.className = "ripple";
        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${event.clientX - bounds.left - size / 2}px`;
        ripple.style.top = `${event.clientY - bounds.top - size / 2}px`;

        button.appendChild(ripple);

        setTimeout(() => ripple.remove(), 700);
    });
});

/* Contact form */
const contactForm = document.querySelector(".contact-form");

if (contactForm) {
    const statusMessage = document.createElement("p");

    statusMessage.setAttribute("role", "status");
    statusMessage.setAttribute("aria-live", "polite");
    statusMessage.style.textAlign = "center";
    statusMessage.style.marginTop = "20px";
    statusMessage.style.fontWeight = "500";

    contactForm.after(statusMessage);

    contactForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const button = contactForm.querySelector("button");
        const formData = new FormData(contactForm);

        formData.set("_replyto", formData.get("email"));

        button.disabled = true;
        button.textContent = "Sending...";
        statusMessage.textContent = "";

        try {
            const response = await fetch(contactForm.action, {
                method: "POST",
                body: formData,
                headers: {
                    Accept: "application/json"
                }
            });

            if (!response.ok) {
                throw new Error("Message could not be sent.");
            }

            contactForm.reset();
            statusMessage.textContent = "Your message was sent successfully.";
            statusMessage.style.color = "var(--accent)";
        } catch (error) {
            statusMessage.textContent =
                "The message could not be sent. Please try again.";
            statusMessage.style.color = "var(--danger, #ff6b6b)";
        } finally {
            button.disabled = false;
            button.textContent = "Send Message";
        }
    });
}
