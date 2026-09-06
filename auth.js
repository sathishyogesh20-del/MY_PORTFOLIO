/**
 * Firebase Authentication — Public portfolio with contact-form gating.
 * The portfolio remains fully visible to all visitors and search engines.
 * Google sign-in is triggered only when a visitor attempts to interact with or submit
 * the contact form, ensuring verified messages.
 */

const firebaseConfig = {
    apiKey: "AIzaSyBsfYQgGbFEEWPk-hN2hf862orcc8IHI7k",
    authDomain: "portfolio-4164e.firebaseapp.com",
    projectId: "portfolio-4164e",
    storageBucket: "portfolio-4164e.firebasestorage.app",
    messagingSenderId: "389561066374",
    appId: "1:389561066374:web:3572b1c6e5eff95ffd8207"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

let currentUser = null;
let pendingActionCallback = null;

// UI Elements
const authModal = document.getElementById("auth-modal") || document.getElementById("auth-gate");
const authModalOverlay = document.getElementById("auth-modal-overlay");
const authModalClose = document.getElementById("auth-modal-close");
const signInBtn = document.getElementById("google-signin-btn");
const authError = document.getElementById("auth-error");

// Nav badges
const userBadge = document.getElementById("user-badge");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const signOutBtn = document.getElementById("signout-btn");

// Contact form elements
const contactAuthBanner = document.getElementById("contact-auth-banner");
const contactSignedIn = document.getElementById("contact-signed-in");
const contactSignedOut = document.getElementById("contact-signed-out");
const contactUserAvatar = document.getElementById("contact-user-avatar");
const contactUserName = document.getElementById("contact-user-name");
const contactSignOutBtn = document.getElementById("contact-signout-btn");
const contactSignInTrigger = document.getElementById("contact-signin-trigger");
const firstNameInput = document.getElementById("first-name");
const lastNameInput = document.getElementById("last-name");
const emailInput = document.getElementById("email");

/**
 * Open the Google Sign In modal dialog
 */
function openAuthModal(callback, customMessage) {
    pendingActionCallback = typeof callback === "function" ? callback : null;

    if (customMessage) {
        const descEl = document.getElementById("auth-modal-desc");
        if (descEl) descEl.textContent = customMessage;
    }

    if (authModal) {
        authModal.removeAttribute("hidden");
        authModal.classList.add("open");
        document.body.classList.add("modal-open");
    }
}

/**
 * Close the Google Sign In modal dialog
 */
function closeAuthModal() {
    if (authModal) {
        authModal.classList.remove("open");
        authModal.setAttribute("hidden", "");
        document.body.classList.remove("modal-open");
    }
    if (authError) authError.hidden = true;
}

/**
 * Update UI for authenticated user
 */
function handleUserSignedIn(user) {
    currentUser = user;

    // Update Nav Badge
    if (userBadge) {
        userBadge.hidden = false;
        if (userAvatar) userAvatar.src = user.photoURL || "";
        if (userName) userName.textContent = user.displayName || user.email || "";
    }

    // Update Contact Section
    if (contactSignedIn) contactSignedIn.hidden = false;
    if (contactSignedOut) contactSignedOut.hidden = true;
    if (contactUserAvatar) contactUserAvatar.src = user.photoURL || "";
    if (contactUserName) contactUserName.textContent = user.displayName || user.email || "Verified User";

    // Auto-fill form fields
    if (user.displayName) {
        const parts = user.displayName.trim().split(" ");
        if (firstNameInput && !firstNameInput.value) {
            firstNameInput.value = parts[0] || "";
        }
        if (lastNameInput && !lastNameInput.value) {
            lastNameInput.value = parts.slice(1).join(" ") || "";
        }
    }
    if (emailInput && !emailInput.value && user.email) {
        emailInput.value = user.email;
    }

    closeAuthModal();

    if (pendingActionCallback) {
        const cb = pendingActionCallback;
        pendingActionCallback = null;
        cb(user);
    }
}

/**
 * Update UI for unauthenticated state
 */
function handleUserSignedOut() {
    currentUser = null;

    // Update Nav Badge
    if (userBadge) userBadge.hidden = true;

    // Update Contact Section
    if (contactSignedIn) contactSignedIn.hidden = true;
    if (contactSignedOut) contactSignedOut.hidden = false;
}

// Observe Firebase Auth state
auth.onAuthStateChanged((user) => {
    if (user) {
        handleUserSignedIn(user);
    } else {
        handleUserSignedOut();
    }
});

// Sign-In button click
if (signInBtn) {
    signInBtn.addEventListener("click", () => {
        signInBtn.disabled = true;
        signInBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i> Signing in...';
        if (authError) authError.hidden = true;

        auth.signInWithPopup(googleProvider)
            .then((result) => {
                handleUserSignedIn(result.user);
            })
            .catch((error) => {
                if (authError) {
                    authError.hidden = false;
                    authError.textContent = error.message || "Sign-in failed. Please try again.";
                }
            })
            .finally(() => {
                signInBtn.disabled = false;
                signInBtn.innerHTML = '<i class="fa-brands fa-google" aria-hidden="true"></i> Sign in with Google';
            });
    });
}

// Sign-Out handlers
function doSignOut() {
    auth.signOut().then(() => {
        handleUserSignedOut();
    });
}

if (signOutBtn) {
    signOutBtn.addEventListener("click", doSignOut);
}
if (contactSignOutBtn) {
    contactSignOutBtn.addEventListener("click", doSignOut);
}

// Modal close handlers
if (authModalClose) {
    authModalClose.addEventListener("click", closeAuthModal);
}
if (authModalOverlay) {
    authModalOverlay.addEventListener("click", closeAuthModal);
}
if (contactSignInTrigger) {
    contactSignInTrigger.addEventListener("click", () => {
        openAuthModal(null, "Sign in with Google to send a verified message to Yogesh.");
    });
}

// Expose helpers globally
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.isUserAuthenticated = () => !!currentUser;
window.getCurrentUser = () => currentUser;
