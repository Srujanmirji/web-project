/**
 * SRUJAN MIRJI - CINEMATIC PORTFOLIO INTERACTIONS
 * Pure Vanilla JavaScript (No dependencies)
 */

document.addEventListener("DOMContentLoaded", () => {
    initHeroParticles();
    initStatsCounter();
    init3DTilt();
    initMobileNav();
    initModals();
    initThemeToggle();
    initSmoothScroll();
});

/* ==========================================================================
   1. HERO GOLDEN PARTICLES CANVAS
   ========================================================================== */
function initHeroParticles() {
    const canvas = document.getElementById("heroParticles");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = canvas.parentElement.offsetWidth);
    let height = (canvas.height = canvas.parentElement.offsetHeight);

    window.addEventListener("resize", () => {
        if (!canvas.parentElement) return;
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(width / 20), 45);

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 1.8 + 0.6,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35 - 0.15,
            alpha: Math.random() * 0.6 + 0.2,
            pulse: Math.random() * 0.02 + 0.01,
            pulseDir: 1
        });
    }

    let mouse = { x: -1000, y: -1000 };
    canvas.parentElement.addEventListener("mousemove", (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    canvas.parentElement.addEventListener("mouseleave", () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            // Soft screen boundary wrap
            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            // Twinkle pulse
            p.alpha += p.pulse * p.pulseDir;
            if (p.alpha > 0.8) p.pulseDir = -1;
            if (p.alpha < 0.2) p.pulseDir = 1;

            // Slight mouse repulsion
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                const force = (100 - dist) / 100;
                p.x += (dx / dist) * force * 1.5;
                p.y += (dy / dist) * force * 1.5;
            }

            // Draw glowing gold particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 200, 87, ${p.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = "#FFC857";
            ctx.fill();
            ctx.shadowBlur = 0; // reset
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/* ==========================================================================
   2. ANIMATED STATISTICS COUNTER
   ========================================================================== */
function initStatsCounter() {
    const statNumbers = document.querySelectorAll(".stat-number");
    if (!statNumbers.length) return;

    let animated = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    statNumbers.forEach((el) => {
                        const target = parseInt(el.getAttribute("data-target"), 10) || 0;
                        animateCount(el, target, 600);
                    });
                }
            });
        },
        { threshold: 0.05 }
    );

    const statsSection = document.querySelector(".stats-bar");
    if (statsSection) {
        observer.observe(statsSection);
    }
}

function animateCount(element, target, duration) {
    let startTimestamp = null;
    const startValue = 0;

    function step(timestamp) {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // Ease out quad
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(easeOut * (target - startValue) + startValue);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(step);
}

/* ==========================================================================
   3. 3D TILT EFFECT ON CARDS
   ========================================================================== */
function init3DTilt() {
    // Only apply on non-touch devices with fine pointers
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cards = document.querySelectorAll(".service-card, .project-card, .doc-card");

    cards.forEach((card) => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "";
        });
    });
}

/* ==========================================================================
   4. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById("mobileMenuBtn");
    const drawer = document.getElementById("mobileNavDrawer");
    if (!toggleBtn || !drawer) return;

    toggleBtn.addEventListener("click", () => {
        const isOpen = drawer.classList.toggle("open");
        toggleBtn.setAttribute("aria-expanded", isOpen);
        toggleBtn.classList.toggle("active", isOpen);
    });

    // Close when clicking any link
    drawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            drawer.classList.remove("open");
            toggleBtn.setAttribute("aria-expanded", "false");
            toggleBtn.classList.remove("active");
        });
    });
}

/* ==========================================================================
   5. MODALS (Watch Intro & Get in Touch)
   ========================================================================== */
function initModals() {
    // Watch Intro Modal
    setupModal("openIntroModal", "introModal", "closeIntroModal");

    // Get in Touch Modal
    setupModal("openContactBtn", "contactModal", "closeContactModal");
    setupModal("openContactBtnNav", "contactModal", "closeContactModal");

    // Close modals with Escape key
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".modal-overlay.open").forEach((m) => {
                m.classList.remove("open");
            });
        }
    });
}

function setupModal(triggerId, modalId, closeId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const close = document.getElementById(closeId);

    if (trigger && modal) {
        trigger.addEventListener("click", (e) => {
            e.preventDefault();
            modal.classList.add("open");
        });
    }

    if (close && modal) {
        close.addEventListener("click", () => {
            modal.classList.remove("open");
        });
    }

    if (modal) {
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.classList.remove("open");
            }
        });
    }
}

/* ==========================================================================
   6. THEME TOGGLE (Persistent)
   ========================================================================== */
function initThemeToggle() {
    const toggle = document.getElementById("themeToggle");
    if (!toggle) return;

    const currentTheme = localStorage.getItem("portfolio-theme") || "dark";
    if (currentTheme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    }

    toggle.addEventListener("click", () => {
        const isLight = document.documentElement.getAttribute("data-theme") === "light";
        const newTheme = isLight ? "dark" : "light";
        if (newTheme === "light") {
            document.documentElement.setAttribute("data-theme", "light");
        } else {
            document.documentElement.removeAttribute("data-theme");
        }
        localStorage.setItem("portfolio-theme", newTheme);
        showToast(newTheme === "light" ? "☀️ Switched to Light Mode" : "🌙 Switched to Dark Mode");
    });
}

/* ==========================================================================
   7. SMOOTH SCROLLING FOR INTERNAL ANCHORS
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (targetId === "#" || targetId.length <= 1) return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

/* ==========================================================================
   8. TOAST NOTIFICATION
   ========================================================================== */
function showToast(message) {
    let toast = document.querySelector(".toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "toast";
        toast.setAttribute("role", "status");
        document.body.append(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3200);
}

// Global hook for "Say Hello 👋"
function welcomeMessage() {
    showToast("👋 Hello! Thanks for visiting my portfolio. Feel free to connect!");
}

// Helper to copy email to clipboard
function copyEmail(e) {
    if (e) e.preventDefault();
    const email = "srujanmirji10@gmail.com";
    navigator.clipboard.writeText(email).then(() => {
        showToast("✉️ Copied srujanmirji10@gmail.com to clipboard!");
    }).catch(() => {
        window.location.href = `mailto:${email}`;
    });
}
