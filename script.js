const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");
const header = document.querySelector("header");
const subtitle = document.querySelector(".hero-left h3");
const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
).matches;

/* Extra animation styles */
const animationStyles = document.createElement("style");

animationStyles.textContent = `
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1001;
        width: 0;
        height: 4px;
        background: linear-gradient(90deg, #00d4ff, #8a2be2);
        box-shadow: 0 0 15px #00d4ff;
        transition: width .15s ease-out;
    }

    .reveal-item {
        opacity: 0;
        transform: translateY(35px) scale(.96);
        transition:
            opacity .7s ease,
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

    .btn {
        position: relative;
        overflow: hidden;
    }

    .cursor-glow {
        position: fixed;
        z-index: -1;
        width: 180px;
        height: 180px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(
            circle,
            rgba(0, 212, 255, .18),
            transparent 70%
        );
        transform: translate(-50%, -50%);
        transition: left .12s ease, top .12s ease;
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

    @keyframes pulseGlow {
        0%, 100% {
            box-shadow: 0 0 10px rgba(0, 212, 255, .15);
        }
        50% {
            box-shadow: 0 0 30px rgba(0, 212, 255, .4);
        }
    }

    .skill,
    .project-card,
    .achievement-card {
        animation: pulseGlow 4s ease-in-out infinite;
    }

    .skill:nth-child(2),
    .project-card:nth-child(2) {
        animation-delay: .4s;
    }

    .skill:nth-child(3),
    .project-card:nth-child(3) {
        animation-delay: .8s;
    }

    .skill:nth-child(4),
    .project-card:nth-child(4) {
        animation-delay: 1.2s;
    }

    @media (prefers-reduced-motion: reduce) {
        .reveal-item {
            opacity: 1;
            transform: none;
            transition: none;
        }

        .skill,
        .project-card,
        .achievement-card {
            animation: none;
        }

        .cursor-glow {
            display: none;
        }
    }
`;

document.head.appendChild(animationStyles);

/* Scroll progress bar */
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

/* Header animation while scrolling */
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

/* Staggered animation for cards and skills */
const animatedItems = document.querySelectorAll(
    ".card, .skill, .project-card, .contact-container"
);

animatedItems.forEach((item, index) => {
    item.classList.add("reveal-item");
    item.style.transitionDelay = `${(index % 5) * 100}ms`;
});

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

/* Cursor glow */
if (!prefersReducedMotion && window.matchMedia("(pointer: fine)").matches) {
    const cursorGlow = document.createElement("div");
    cursorGlow.className = "cursor-glow";
    document.body.appendChild(cursorGlow);

    window.addEventListener("mousemove", (event) => {
        cursorGlow.style.left = `${event.clientX}px`;
        cursorGlow.style.top = `${event.clientY}px`;
    });
}

/* 3D tilt effect for cards */
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

/* Button ripple effect */
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
        statusMessage.style.color = "#d5d5d5";

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
            statusMessage.textContent =
                "Your message was sent successfully.";
            statusMessage.style.color = "#00ff99";
        } catch (error) {
            statusMessage.textContent =
                "The message could not be sent. Please try again.";
            statusMessage.style.color = "#ff6b6b";
        } finally {
            button.disabled = false;
            button.textContent = "Send Message";
        }
    });
}