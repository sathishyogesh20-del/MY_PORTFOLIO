const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");
const header = document.querySelector("header");
const subtitle = document.querySelector(".hero-left h3");

const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");

            navLinks.forEach((link) => {
                link.classList.toggle(
                    "active",
                    link.getAttribute("href") === `#${entry.target.id}`
                );
            });
        }
    });
}, {
    threshold: 0.18
});

sections.forEach((section) => observer.observe(section));

window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 80);
});

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

typeText();

const contactForm = document.querySelector(".contact-form");

contactForm.addEventListener("submit", () => {
    const button = contactForm.querySelector("button");
    button.textContent = "Opening Email...";
    button.style.opacity = "0.7";
});
