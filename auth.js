/**
 * Firebase Authentication — Google sign-in gate.
 * The entire site (#site-content) stays hidden until the visitor
 * signs in with Google; #auth-gate shows the sign-in screen.
 *
 * SETUP
 * 1. Go to https://console.firebase.google.com and create a project
 *    (or reuse one you already have).
 * 2. In the project, click the Web icon (</>) to register a web app.
 * 3. Copy the firebaseConfig object Firebase shows you and paste its
 *    values into the object below.
 * 4. In the console: Authentication > Sign-in method > enable "Google".
 * 5. In the console: Authentication > Settings > Authorized domains >
 *    add your GitHub Pages domain (e.g. sathishyogesh20-del.github.io).
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

const authGate = document.getElementById("auth-gate");
const siteContent = document.getElementById("site-content");
const signInBtn = document.getElementById("google-signin-btn");
const authError = document.getElementById("auth-error");
const userBadge = document.getElementById("user-badge");
const userAvatar = document.getElementById("user-avatar");
const userName = document.getElementById("user-name");
const signOutBtn = document.getElementById("signout-btn");

function showGate() {
    if (authGate) authGate.style.display = "flex";
    if (siteContent) siteContent.setAttribute("hidden", "");
    if (userBadge) userBadge.hidden = true;
    document.body.style.overflow = "hidden";
}

function showSite(user) {
    if (authGate) authGate.style.display = "none";
    if (siteContent) siteContent.removeAttribute("hidden");
    document.body.style.overflow = "";

    if (userBadge) {
        userBadge.hidden = false;
        if (userAvatar) userAvatar.src = user.photoURL || "";
        if (userName) userName.textContent = user.displayName || user.email || "";
    }
}

auth.onAuthStateChanged((user) => {
    if (user) {
        showSite(user);
    } else {
        showGate();
    }
});

if (signInBtn) {
    signInBtn.addEventListener("click", () => {
        signInBtn.disabled = true;
        signInBtn.textContent = "Signing in...";
        if (authError) authError.hidden = true;

        auth.signInWithPopup(googleProvider).catch(() => {
            if (authError) {
                authError.hidden = false;
                authError.textContent = "Sign-in failed. Please try again.";
            }
        }).finally(() => {
            signInBtn.disabled = false;
            signInBtn.innerHTML =
                '<i class="fa-brands fa-google" aria-hidden="true"></i> Sign in with Google';
        });
    });
}

if (signOutBtn) {
    signOutBtn.addEventListener("click", () => {
        auth.signOut();
    });
}
