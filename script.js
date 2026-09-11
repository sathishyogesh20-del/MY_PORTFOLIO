// Mark JavaScript as available without making the page depend on it.
document.documentElement.classList.add("js-enabled");

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

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) closeNavMenu();
    }, { passive: true });
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

let scrollTicking = false;

function handleScroll() {
    if (scrollTicking) return;
    scrollTicking = true;

    requestAnimationFrame(() => {
        updateScrollProgress();

        const currentScrollY = window.scrollY;
        if (header) {
            header.classList.toggle("scrolled", currentScrollY > 80);

            const scrollingDown = currentScrollY > lastScrollY;
            const pastNavHeight = currentScrollY > 160;
            const mobileMenuOpen = navList && navList.classList.contains("open");

            header.classList.toggle(
                "nav-hidden",
                scrollingDown && pastNavHeight && !mobileMenuOpen
            );
        }
        lastScrollY = currentScrollY;
        scrollTicking = false;
    });
}

window.addEventListener("scroll", handleScroll, { passive: true });
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

/* Header scroll state is batched with scroll-progress updates above. */
let lastScrollY = window.scrollY;

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
    let shootingStars = [];
    let w, h;

    let animationFrameId;
    let canvasVisible = true;
    let deviceScale = Math.min(window.devicePixelRatio || 1, 1.5);

    function resizeCanvas() {
        deviceScale = Math.min(window.devicePixelRatio || 1, 1.5);
        w = window.innerWidth;
        h = window.innerHeight;
        canvas.width = Math.floor(w * deviceScale);
        canvas.height = Math.floor(h * deviceScale);
        ctx.setTransform(deviceScale, 0, 0, deviceScale, 0, 0);
    }

    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    document.addEventListener("visibilitychange", () => {
        canvasVisible = !document.hidden;
        if (canvasVisible && !animationFrameId) animateMotion();
    });

    let pointerX = 0;
    let pointerY = 0;
    let pointerTargetX = 0;
    let pointerTargetY = 0;

    // Pointer parallax is desktop-only; touch scrolling should stay lightweight.
    if (window.matchMedia("(pointer: fine)").matches) {
        window.addEventListener("pointermove", (event) => {
            pointerTargetX = (event.clientX / Math.max(w, 1) - 0.5) * 2;
            pointerTargetY = (event.clientY / Math.max(h, 1) - 0.5) * 2;
        }, { passive: true });
    }

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.depth = Math.random() * 0.85 + 0.15;
            this.vx = (Math.random() - 0.5) * (0.12 + this.depth * 0.3);
            this.vy = (Math.random() - 0.5) * (0.12 + this.depth * 0.3);
            this.radius = Math.random() * (1.2 + this.depth) + 0.35;
            this.phase = Math.random() * Math.PI * 2;
            this.twinkleSpeed = Math.random() * 0.025 + 0.008;
            this.color = Math.random() > 0.78 ? "84, 230, 194" : "228, 213, 255";
        }

        update() {
            this.x += this.vx + pointerX * this.depth * 0.018;
            this.y += this.vy + pointerY * this.depth * 0.012;
            this.phase += this.twinkleSpeed;

            if (this.x < -10) this.x = w + 10;
            if (this.x > w + 10) this.x = -10;
            if (this.y < -10) this.y = h + 10;
            if (this.y > h + 10) this.y = -10;
        }

        draw() {
            const pulse = 0.35 + (Math.sin(this.phase) + 1) * 0.28;
            const alpha = pulse * (0.45 + this.depth * 0.55);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${alpha})`;
            ctx.shadowBlur = this.depth > 0.7 ? 10 : 4;
            ctx.shadowColor = this.color === "84, 230, 194" ? "#54e6c2" : "#b388ff";
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    function createParticles() {
        particles = [];
        const pixelArea = w * h;
        const maxParticles = window.innerWidth < 600 ? 55 : 125;
        const count = Math.min(maxParticles, Math.max(28, Math.floor(pixelArea / 11000)));
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }

    class ShootingStar {
        constructor() {
            this.reset(true);
        }
        reset(initial = false) {
            this.x = Math.random() * w;
            this.y = initial ? Math.random() * h : -20;
            this.length = Math.random() * 70 + 45;
            this.speed = Math.random() * 7 + 8;
            this.opacity = 1;
        }
        update() {
            this.x += this.speed;
            this.y += this.speed * 0.45;
            this.opacity -= 0.012;
            if (this.x > w + this.length || this.y > h + this.length || this.opacity <= 0) {
                this.reset();
            }
        }
        draw() {
            const gradient = ctx.createLinearGradient(
                this.x, this.y,
                this.x - this.length, this.y - this.length * 0.45
            );
            gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
            gradient.addColorStop(1, "rgba(179, 136, 255, 0)");
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x - this.length, this.y - this.length * 0.45);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
    }

    function createShootingStars() {
        const count = window.innerWidth < 600 ? 1 : 2;
        shootingStars = Array.from({ length: count }, () => new ShootingStar());
    }

    createParticles();
    createShootingStars();
    window.addEventListener("resize", createParticles, { passive: true });
    window.addEventListener("resize", createShootingStars, { passive: true });

    function drawConnections() {
        ctx.lineWidth = 0.7;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 115) {
                    const alpha = (1 - dist / 115) * 0.16;
                    ctx.strokeStyle = `rgba(179, 136, 255, ${alpha})`;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function drawAmbientGlow() {
        const glow = ctx.createRadialGradient(
            w * 0.5 + pointerX * 45, h * 0.42 + pointerY * 25, 0,
            w * 0.5 + pointerX * 45, h * 0.42 + pointerY * 25, Math.max(w, h) * 0.55
        );
        glow.addColorStop(0, "rgba(179, 136, 255, 0.045)");
        glow.addColorStop(0.55, "rgba(84, 230, 194, 0.018)");
        glow.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, w, h);
    }

    function animateMotion() {
        animationFrameId = requestAnimationFrame(animateMotion);
        if (!canvasVisible) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
            return;
        }

        ctx.clearRect(0, 0, w, h);
        pointerX += (pointerTargetX - pointerX) * 0.035;
        pointerY += (pointerTargetY - pointerY) * 0.035;
        drawAmbientGlow();
        particles.forEach((p) => {
            p.update();
            p.draw();
        });
        shootingStars.forEach((star) => {
            star.update();
            star.draw();
        });
        drawConnections();
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

    let glowFrame;
    let pointerX = 0;
    let pointerY = 0;

    window.addEventListener("mousemove", (event) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (glowFrame) return;

        glowFrame = requestAnimationFrame(() => {
            cursorGlow.style.left = `${pointerX}px`;
            cursorGlow.style.top = `${pointerY}px`;
            glowFrame = null;
        });
    }, { passive: true });
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

/* Contact form -> Google Apps Script -> Google Sheet with Google Auth verification */
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyTqASoylpAQJ1Z1_NVonR7ns4lDghu8MbR8ekOrsXNzCQugfTtKRsrJ4rT88GpiJ-8/exec";

const contactForm = document.getElementById("contactForm");
const contactSubmitBtn = document.getElementById("contactSubmitBtn");

function submitVerifiedContactForm() {
    if (!contactForm) return;

    const formData = new FormData(contactForm);
    if (contactSubmitBtn) {
        contactSubmitBtn.disabled = true;
        contactSubmitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    }

    fetch(WEB_APP_URL, {
        method: "POST",
        body: formData
    })
        .then(() => {
            if (contactSubmitBtn) {
                contactSubmitBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent ✔';
            }
            const msgField = document.getElementById("message");
            if (msgField) msgField.value = "";
        })
        .catch(() => {
            if (contactSubmitBtn) {
                contactSubmitBtn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Something went wrong';
            }
        })
        .finally(() => {
            setTimeout(() => {
                if (contactSubmitBtn) {
                    contactSubmitBtn.disabled = false;
                    contactSubmitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Message';
                }
            }, 3500);
        });
}

if (contactForm) {
    // When visitor attempts to submit the contact form
    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Verify if user is signed in with Google
        if (typeof window.isUserAuthenticated === "function" && window.isUserAuthenticated()) {
            submitVerifiedContactForm();
        } else if (typeof window.openAuthModal === "function") {
            window.openAuthModal(() => {
                submitVerifiedContactForm();
            }, "Sign in with Google to send a verified message to Yogesh.");
        } else {
            // Fallback if auth is unavailable
            submitVerifiedContactForm();
        }
    });

    // When clicking into the message field while signed out, prompt them nicely
    const msgInput = document.getElementById("message");
    if (msgInput) {
        msgInput.addEventListener("focus", () => {
            if (typeof window.isUserAuthenticated === "function" && !window.isUserAuthenticated()) {
                if (typeof window.openAuthModal === "function") {
                    window.openAuthModal(null, "Sign in with Google to pre-fill your info and send a verified message.");
                }
            }
        }, { once: true });
    }
}

/* ==========================================================
   Certificate Lightbox Modal
   ========================================================== */
const certLightbox = document.getElementById("cert-lightbox");
const lightboxOverlay = document.getElementById("lightbox-overlay");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxIssuer = document.getElementById("lightbox-issuer");
const lightboxDesc = document.getElementById("lightbox-desc");
const lightboxLink = document.getElementById("lightbox-link");

function openCertLightbox(triggerEl) {
    if (!certLightbox || !triggerEl) return;

    const title = triggerEl.getAttribute("data-cert-title") || "Certificate";
    const issuer = triggerEl.getAttribute("data-cert-issuer") || "Verified Issuer";
    const desc = triggerEl.getAttribute("data-cert-desc") || "";
    const imgSrc = triggerEl.getAttribute("data-cert-img") || "";

    if (lightboxImg) lightboxImg.src = imgSrc;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxIssuer) {
        lightboxIssuer.textContent = issuer;
        lightboxIssuer.className = "cert-badge " +
            (issuer.includes("Google") ? "google-badge" :
             issuer.includes("OpenAI") ? "openai-badge" :
             issuer.includes("Anthropic") ? "anthropic-badge" : "cloud-badge");
    }
    if (lightboxLink) lightboxLink.href = imgSrc;

    certLightbox.removeAttribute("hidden");
    document.body.classList.add("modal-open");
}

function closeCertLightbox() {
    if (certLightbox) {
        certLightbox.setAttribute("hidden", "");
        document.body.classList.remove("modal-open");
    }
}

document.querySelectorAll(".cert-card-trigger").forEach((card) => {
    card.addEventListener("click", () => openCertLightbox(card));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openCertLightbox(card);
        }
    });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeCertLightbox);
if (lightboxOverlay) lightboxOverlay.addEventListener("click", closeCertLightbox);

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeCertLightbox();
        if (typeof window.closeAuthModal === "function") window.closeAuthModal();
    }
});

/* ==========================================================
   Project Category Filter Tabs
   ========================================================== */
const filterButtons = document.querySelectorAll(".project-filter-tabs .filter-btn");
const projectCards = document.querySelectorAll(".rich-project-card");

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => {
            b.classList.remove("active");
            b.setAttribute("aria-selected", "false");
        });
        btn.classList.add("active");
        btn.setAttribute("aria-selected", "true");

        const filter = btn.getAttribute("data-filter") || "all";

        projectCards.forEach((card) => {
            const category = card.getAttribute("data-category");
            if (filter === "all" || category === filter) {
                card.classList.remove("filter-hidden");
            } else {
                card.classList.add("filter-hidden");
            }
        });
    });
});

/* ==========================================================
   "Ask Yogesh AI" Interactive Floating Chatbot
   ========================================================== */
const chatbotToggle = document.getElementById("chatbot-toggle");
const chatbotWindow = document.getElementById("chatbot-window");
const chatbotClose = document.getElementById("chatbot-close");
const chatbotMinimize = document.getElementById("chatbot-minimize");
const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");

let chatInitialized = false;

function toggleChatbot() {
    if (!chatbotWindow) return;
    const isHidden = chatbotWindow.hasAttribute("hidden");

    if (isHidden) {
        chatbotWindow.removeAttribute("hidden");
        if (chatbotToggle) chatbotToggle.setAttribute("aria-expanded", "true");
        if (!chatInitialized) {
            initChatbotGreeting();
            chatInitialized = true;
        }
        if (chatInput) chatInput.focus();
    } else {
        chatbotWindow.setAttribute("hidden", "");
        if (chatbotToggle) chatbotToggle.setAttribute("aria-expanded", "false");
    }
}

if (chatbotToggle) chatbotToggle.addEventListener("click", toggleChatbot);
if (chatbotClose) chatbotClose.addEventListener("click", toggleChatbot);
if (chatbotMinimize) chatbotMinimize.addEventListener("click", toggleChatbot);

function appendUserMessage(text) {
    if (!chatMessages) return;
    const msgEl = document.createElement("div");
    msgEl.className = "chat-msg user";
    msgEl.innerHTML = `<div class="chat-bubble">${escapeHtml(text)}</div>`;
    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function showTypingIndicator() {
    if (!chatMessages) return null;
    const typingEl = document.createElement("div");
    typingEl.className = "chat-msg bot";
    typingEl.id = "chat-typing-indicator";
    typingEl.innerHTML = `
        <div class="typing-indicator">
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        </div>
    `;
    chatMessages.appendChild(typingEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return typingEl;
}

function removeTypingIndicator() {
    const indicator = document.getElementById("chat-typing-indicator");
    if (indicator) indicator.remove();
}

function appendBotMessage(text, actions = []) {
    removeTypingIndicator();
    if (!chatMessages) return;

    const msgEl = document.createElement("div");
    msgEl.className = "chat-msg bot";

    let actionsHtml = "";
    if (actions && actions.length > 0) {
        actionsHtml = `<div class="chat-actions-container">` +
            actions.map((act) => {
                if (act.url.startsWith("#")) {
                    return `<button type="button" class="chat-action-link" data-scroll="${act.url}">
                        <i class="fa-solid fa-arrow-down" aria-hidden="true"></i> ${escapeHtml(act.label)}
                    </button>`;
                }
                return `<a href="${act.url}" target="_blank" rel="noopener noreferrer" class="chat-action-link">
                    <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ${escapeHtml(act.label)}
                </a>`;
            }).join("") +
        `</div>`;
    }

    msgEl.innerHTML = `
        <div class="chat-bubble">${text}</div>
        ${actionsHtml}
    `;

    chatMessages.appendChild(msgEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Attach click listeners to in-chat scroll buttons
    msgEl.querySelectorAll("button[data-scroll]").forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-scroll");
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                targetEl.scrollIntoView({ behavior: "smooth" });
                // Minimize chat on small screens so visitor sees the section
                if (window.innerWidth < 768) {
                    chatbotWindow.setAttribute("hidden", "");
                }
            }
        });
    });
}

function escapeHtml(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function initChatbotGreeting() {
    appendBotMessage(
        "Hi there! 👋 I'm <b>Yogesh's AI Assistant</b>. I can tell you about his AI certifications, the <b>COSMOS Ecosystem</b>, robotics projects, or help you connect with him!",
        [
            { label: "View Certifications", url: "#achievements" },
            { label: "Explore COSMOS", url: "#projects" },
            { label: "Contact Yogesh", url: "#contact" }
        ]
    );
}

// Knowledge Base & Intent Matching
function getBotAnswer(query) {
    const q = query.toLowerCase().trim();

    if (q.includes("who is") || q.includes("about") || q.includes("background") || q.includes("school") || q.includes("age") || q.includes("grade") || q.includes("student")) {
        return {
            text: "<b>Yogesh</b> is a passionatee student and AI developer from <b>Madurai, Tamil Nadu</b>, currently studying in the 9th standard at <b>Seventh Day Adventist English Higher Secondary School</b>. He is the solo architect of the COSMOS Ecosystem, building futuristic web apps, intelligent tools, and robotics controllers!",
            actions: [
                { label: "About Section", url: "#about" },
                { label: "View Skills", url: "#skills" }
            ]
        };
    }

    if (q.includes("cert") || q.includes("gemini") || q.includes("openai") || q.includes("claude") || q.includes("anthropic") || q.includes("credential")) {
        return {
            text: "Yogesh holds <b>6+ prestigious AI certifications</b>, including:<br>• <b>Google Gemini AI for Students</b> (University Category)<br>• <b>Google Gemini Certification for Educator</b><br>• <b>OpenAI ChatGPT Prompt Engineering Certificate</b><br>• <b>Anthropic Claude AI Fluency</b><br>• <b>Google Cloud Fundamentals</b> from Simplilearn.",
            actions: [
                { label: "Inspect Certificates", url: "#achievements" }
            ]
        };
    }

    if (q.includes("cosmos-hand") || q.includes("hand") || q.includes("gesture") || q.includes("robot")) {
        return {
            text: "<b>cosmos-hand</b> is Yogesh's computer-vision powered hand-tracking and gesture recognition project. It translates real-time hand movements into interactive digital and hardware control actions!",
            actions: [
                { label: "Launch cosmos-hand Demo", url: "https://sathishyogesh20-del.github.io/cosmos-hand/" },
                { label: "Robotics Projects", url: "#projects" }
            ]
        };
    }

    if (q.includes("controller") || q.includes("cosmos-controller")) {
        return {
            text: "<b>cosmos-controller</b> is a web-based remote controller application designed to interface with and command automated COSMOS hardware and software modules.",
            actions: [
                { label: "Open Controller Live", url: "https://sathishyogesh20-del.github.io/cosmos-controller/" }
            ]
        };
    }

    if (q.includes("book") || q.includes("ebook") || q.includes("flip") || q.includes("code the cosmos")) {
        return {
            text: "Yogesh authored <b>'Code the Cosmos'</b>, an interactive 3D flip-book guide that breaks down computer programming, AI architectures, and intelligent ecosystem design for aspiring learners!",
            actions: [
                { label: "Read 3D Flip-Book", url: "https://heyzine.com/flip-book/9df7afbf55.html" }
            ]
        };
    }

    if (q.includes("cosmos") || q.includes("ecosystem")) {
        return {
            text: "The <b>COSMOS Ecosystem</b> is Yogesh's flagship multi-service platform. It unifies conversational AI assistants (<b>cosmos-ai</b>, <b>cosmos-129</b>), hardware robotics (<b>cosmos-hand</b>, <b>cosmos-controller</b>), and educational knowledge hubs (<b>cosmos.128</b>, <b>cosmos-128.v1</b>).",
            actions: [
                { label: "Browse All COSMOS Projects", url: "#projects" },
                { label: "COSMOS AI App", url: "https://yogeshcosmos20.lovable.app" }
            ]
        };
    }

    if (q.includes("contact") || q.includes("email") || q.includes("message") || q.includes("hire") || q.includes("collaborate") || q.includes("reach")) {
        return {
            text: "You can send Yogesh a direct message using the <b>verified contact form</b> below (with quick Google sign-in), or email him directly at <b>sathishyogesh20@gmail.com</b>!",
            actions: [
                { label: "Go to Contact Form", url: "#contact" }
            ]
        };
    }

    if (q.includes("skill") || q.includes("python") || q.includes("code") || q.includes("prompt") || q.includes("stack")) {
        return {
            text: "Yogesh's core skillset includes <b>Artificial Intelligence & LLMs</b>, <b>Python Programming</b>, <b>Prompt Engineering</b>, <b>Full-Stack Web & App Development</b>, and <b>Research Analysis</b>.",
            actions: [
                { label: "View Skills Grid", url: "#skills" },
                { label: "GitHub Profile", url: "https://github.com/sathishyogesh20-del" }
            ]
        };
    }

    // Default conversational response
    return {
        text: `Thanks for asking! Yogesh is an AI developer and creator of the COSMOS Ecosystem. Feel free to explore his projects, inspect his certifications, or send him a message!`,
        actions: [
            { label: "Browse Projects", url: "#projects" },
            { label: "View Certifications", url: "#achievements" },
            { label: "Contact Yogesh", url: "#contact" }
        ]
    };
}

function handleUserQuery(queryText) {
    if (!queryText.trim()) return;

    appendUserMessage(queryText);
    if (chatInput) chatInput.value = "";

    showTypingIndicator();

    setTimeout(() => {
        const response = getBotAnswer(queryText);
        appendBotMessage(response.text, response.actions);
    }, 450);
}

if (chatForm) {
    chatForm.addEventListener("submit", (e) => {
        e.preventDefault();
        if (chatInput) {
            handleUserQuery(chatInput.value);
        }
    });
}

// Quick Suggestion Chips
document.querySelectorAll(".quick-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
        const question = chip.getAttribute("data-question");
        if (question) {
            handleUserQuery(question);
        }
    });
});
