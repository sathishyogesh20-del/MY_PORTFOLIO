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

/* Enhanced motion graphics: canvas particles */
if (!prefersReducedMotion) {
    const canvas = document.createElement("canvas");
    canvas.id = "motion-graphics";
    Object.assign(canvas.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        zIndex: "-2",
        pointerEvents: "none",
        opacity: "0.35"
    });
    document.body.appendChild(canvas);

    const ctx = canvas.getContext("2d", { alpha: true });
    let particles = [];
    let w, h;

    function resizeCanvas() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 1.8 + 0.8;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "#b388ff";
            ctx.fill();
        }
    }

    function createParticles() {
        particles = [];
        const count = Math.min(70, Math.floor((w * h) / 18000));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();
    window.addEventListener("resize", createParticles, { passive: true });

    function drawConnections() {
        ctx.strokeStyle = "rgba(179,136,255,0.25)";
        ctx.lineWidth = 0.8;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateMotion() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateMotion);
    }
    animateMotion();
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

/* Contact form -> Google Apps Script -> Google Sheet */
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTqASoylpAQJ1Z1_NVonR7ns4lDghu8MbR8ekOrsXNzCQugfTtKRsrJ4rT88GpiJ-8/exec";

const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const button = contactForm.querySelector("button[type='submit']");
        const formData = new FormData(contactForm);

        if (button) {
            button.disabled = true;
            button.textContent = "Sending...";
        }

        fetch(WEB_APP_URL, {
            method: "POST",
            body: formData
        })
            .then(() => {
                if (button) button.textContent = "Message Sent ✔";
                contactForm.reset();
            })
            .catch(() => {
                if (button) button.textContent = "Something went wrong";
            })
            .finally(() => {
                setTimeout(() => {
                    if (button) {
                        button.disabled = false;
                        button.textContent = "Send Message";
                    }
                }, 3000);
            });
    });
}
