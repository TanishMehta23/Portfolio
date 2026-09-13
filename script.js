if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.toggle("hidden");
        const icon = menuBtn.querySelector("i");
        if (icon) {
            if (mobileMenu.classList.contains("hidden")) {
                icon.className = "fa-solid fa-bars";
            } else {
                icon.className = "fa-solid fa-xmark";
            }
        }
    });

    mobileMenu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.add("hidden");
            const icon = menuBtn.querySelector("i");
            if (icon) icon.className = "fa-solid fa-bars";
        });
    });
}

const terminal = document.getElementById("terminal-content");

const commands = [
    {
        cmd: "pwd",
        output: "/home/tanish"
    },
    {
        cmd: "ls projects/",
        output: "Xplorism\nFinPulseAI\nFocusoraHQ\nFitness Planet\nSpamShield\nNexus AI\nQuizoraAI"
    },
    {
        cmd: "git status",
        output: "On branch main\nYour portfolio is up to date."
    },
    {
        cmd: "cat mission.txt",
        output: "Building modern web applications and exploring AI."
    },
    {
        cmd: "echo $GOAL",
        output: "Software Engineer"
    }
];

let index = 0;
let terminalInstanceId = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, minSpeed = 38, maxSpeed = 65) {
    element.textContent = "";
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        const delay = Math.floor(Math.random() * (maxSpeed - minSpeed + 1)) + minSpeed;
        await sleep(delay);
    }
}

async function runTerminal() {
    if (!terminal) return;
    const myInstanceId = ++terminalInstanceId;
    window.terminalInstance = myInstanceId;

    while (true) {
        if (window.terminalInstance !== myInstanceId) return;

        const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        terminal.innerHTML = "";

        const current = commands[index];

        // Terminal Prompt Line
        const promptLine = document.createElement("div");
        promptLine.className = "terminal-line";

        const dollar = document.createElement("span");
        dollar.className = "prompt";
        dollar.textContent = "$";

        const typing = document.createElement("span");
        typing.className = "command";

        const cursor = document.createElement("span");
        cursor.className = "cursor";

        promptLine.appendChild(dollar);
        promptLine.appendChild(typing);
        if (!prefersReducedMotion) {
            promptLine.appendChild(cursor);
        }
        terminal.appendChild(promptLine);

        if (prefersReducedMotion) {
            typing.textContent = current.cmd;
            await sleep(200);
        } else {
            await typeText(typing, current.cmd);
            if (window.terminalInstance !== myInstanceId) return;
            await sleep(280);
            if (window.terminalInstance !== myInstanceId) return;
            cursor.remove();
        }

        // Output Container
        const outputWrap = document.createElement("div");
        outputWrap.className = "output";
        terminal.appendChild(outputWrap);

        const lines = current.output.split("\n");
        if (prefersReducedMotion || lines.length === 1) {
            outputWrap.innerHTML = current.output.replace(/\n/g, "<br>");
        } else {
            for (let l = 0; l < lines.length; l++) {
                if (window.terminalInstance !== myInstanceId) return;
                const lineSpan = document.createElement("div");
                lineSpan.textContent = lines[l];
                outputWrap.appendChild(lineSpan);
                await sleep(75);
            }
        }

        if (window.terminalInstance !== myInstanceId) return;

        // Reading pause based on length
        const readingTime = Math.max(2200, 1400 + lines.length * 150);
        await sleep(readingTime);
        if (window.terminalInstance !== myInstanceId) return;

        // Type clear command
        const clearLine = document.createElement("div");
        clearLine.className = "terminal-line";

        const clearDollar = document.createElement("span");
        clearDollar.className = "prompt";
        clearDollar.textContent = "$";

        const clearTyping = document.createElement("span");
        clearTyping.className = "command";

        const clearCursor = document.createElement("span");
        clearCursor.className = "cursor";

        clearLine.appendChild(clearDollar);
        clearLine.appendChild(clearTyping);
        if (!prefersReducedMotion) clearLine.appendChild(clearCursor);
        terminal.appendChild(clearLine);

        if (prefersReducedMotion) {
            clearTyping.textContent = "clear";
            await sleep(300);
        } else {
            await typeText(clearTyping, "clear", 45, 75);
            if (window.terminalInstance !== myInstanceId) return;
            await sleep(350);
            if (window.terminalInstance !== myInstanceId) return;
            clearCursor.remove();
        }

        // Clean fade out and loop
        terminal.style.opacity = "0";
        await sleep(220);
        if (window.terminalInstance !== myInstanceId) return;

        terminal.innerHTML = "";
        terminal.style.opacity = "1";
        await sleep(150);
        if (window.terminalInstance !== myInstanceId) return;

        index = (index + 1) % commands.length;
    }
}

runTerminal();

window.addEventListener("scroll", () => {

    const scrollTop = window.scrollY;

    const height =
        document.documentElement.scrollHeight -
        window.innerHeight;

    const progress = (scrollTop / height) * 100;

    document.getElementById("progress-bar").style.width =
        progress + "%";

});

function animateCountUp(element, targetValue) {
    let count = 0;
    const duration = 1000; // ms
    const stepTime = 15;
    const steps = duration / stepTime;
    const increment = targetValue / steps;
    const timer = setInterval(() => {
        count += increment;
        if (count >= targetValue) {
            element.textContent = targetValue + "+";
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(count) + "+";
        }
    }, stepTime);
}



const galaxy = document.getElementById("galaxy");
const planets = [...document.querySelectorAll(".planet")];

if (galaxy && planets.length > 0) {
    let W;
    let H;

    function updateGalaxySize() {
        if (galaxy) {
            W = galaxy.clientWidth;
            H = galaxy.clientHeight;
        }
    }
    updateGalaxySize();

    window.addEventListener("resize", () => {
        updateGalaxySize();
        // Keep planets in bounds and update radius immediately on resize
        objects.forEach(p => {
            p.r = p.el.offsetWidth / 2;
            if (p.x < p.r) p.x = p.r;
            if (p.x > W - p.r) p.x = W - p.r;
            if (p.y < p.r) p.y = p.r;
            if (p.y > H - p.r) p.y = H - p.r;
        });
    });

    const objects = [];

    // Generate random position without overlapping
    function randomPosition(radius) {
        let x, y, valid = false;
        let attempts = 0;

        while (!valid && attempts < 150) {
            attempts++;
            x = radius + Math.random() * (W - radius * 2);
            y = radius + Math.random() * (H - radius * 2);
            valid = true;

            for (const p of objects) {
                const dx = x - p.x;
                const dy = y - p.y;
                if (Math.sqrt(dx * dx + dy * dy) < radius + p.r + 25) {
                    valid = false;
                    break;
                }
            }
        }

        if (!valid) {
            x = radius + Math.random() * (W - radius * 2);
            y = radius + Math.random() * (H - radius * 2);
        }

        return { x, y };
    }

    // Create objects
    planets.forEach(el => {
        let r = el.offsetWidth / 2;
        const pos = randomPosition(r);
        objects.push({
            el,
            x: pos.x,
            y: pos.y,
            r,
            vx: (Math.random() - .5) * 0.4,
            vy: (Math.random() - .5) * 0.4
        });
    });

    const mouse = {
        x: -9999,
        y: -9999
    };

    // Mouse position
    galaxy.addEventListener("mousemove", (e) => {
        const rect = galaxy.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    // Mouse leaves galaxy
    galaxy.addEventListener("mouseleave", () => {
        mouse.x = -9999;
        mouse.y = -9999;
    });

    function animateGalaxy() {
        // MOVE PLANETS
        objects.forEach(p => {
            const dx = mouse.x - p.x;
            const dy = mouse.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180 && dist > 5) {
                const force = (180 - dist) / 180;
                p.vx += (dx / dist) * force * 0.04;
                p.vy += (dy / dist) * force * 0.04;
            }

            p.vx *= 0.985;
            p.vy *= 0.985;

            const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (currentSpeed < 0.25) {
                const angle = Math.random() * Math.PI * 2;
                p.vx += Math.cos(angle) * 0.08;
                p.vy += Math.sin(angle) * 0.08;
            }

            p.x += p.vx;
            p.y += p.vy;

            if (p.x < p.r) {
                p.x = p.r;
                p.vx *= -1;
            }
            if (p.x > W - p.r) {
                p.x = W - p.r;
                p.vx *= -1;
            }
            if (p.y < p.r) {
                p.y = p.r;
                p.vy *= -1;
            }
            if (p.y > H - p.r) {
                p.y = H - p.r;
                p.vy *= -1;
            }
        });

        // COLLISION
        for (let i = 0; i < objects.length; i++) {
            for (let j = i + 1; j < objects.length; j++) {
                let a = objects[i];
                let b = objects[j];
                let dx = b.x - a.x;
                let dy = b.y - a.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                let min = a.r + b.r + 8;

                if (dist < min) {
                    let angle = Math.atan2(dy, dx);
                    let targetX = a.x + Math.cos(angle) * min;
                    let targetY = a.y + Math.sin(angle) * min;
                    let ax = (targetX - b.x) * 0.05;
                    let ay = (targetY - b.y) * 0.05;

                    a.vx -= ax;
                    a.vy -= ay;
                    b.vx += ax;
                    b.vy += ay;
                }
            }
        }

        // DRAW
        objects.forEach(p => {
            p.el.style.left = (p.x - p.r) + "px";
            p.el.style.top = (p.y - p.r) + "px";
        });

        requestAnimationFrame(animateGalaxy);
    }

    animateGalaxy();
}


const achievementCounters = document.querySelectorAll(".achievement-number");

const achievementObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = parseInt(counter.getAttribute("data-target")) || parseInt(counter.innerText) || 400;

        counter.innerText = "0+";

        let count = 0;
        const duration = 1200; // ms
        const frameTime = 20; // ms
        const totalSteps = duration / frameTime;
        const increment = target / totalSteps;

        const timer = setInterval(() => {

            count += increment;

            if (count >= target) {

                counter.innerText = target + "+";

                clearInterval(timer);

            } else {

                counter.innerText = Math.floor(count) + "+";

            }

        }, frameTime);

        achievementObserver.unobserve(counter);

    });

}, {
    threshold: 0.2
});

achievementCounters.forEach(counter => {

    achievementObserver.observe(counter);

});
const cards = document.querySelectorAll(".achievement-card");

const cardObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            entry.target.classList.add("show-card");

        }

    });

}, {
    threshold: .2
});

cards.forEach(card => {

    cardObserver.observe(card);

});

const ring = document.querySelector(".cursor-ring");

if (ring) {

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove", (e) => {

        mouseX = e.clientX;
        mouseY = e.clientY;

    });

    function animateCursor() {

        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;

        ring.style.left = ringX + "px";
        ring.style.top = ringY + "px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

    document.querySelectorAll(
        "a,button,.project-card,.planet,.achievement-card,.profile-card"
    ).forEach(item => {

        item.addEventListener("mouseenter", () => {

            ring.style.width = "60px";
            ring.style.height = "60px";
            ring.style.background = "rgba(124, 140, 248, 0.12)";

        });

        item.addEventListener("mouseleave", () => {

            ring.style.width = "34px";
            ring.style.height = "34px";
            ring.style.background = "transparent";

        });

    });

}

/* ============================
    GITHUB CONTRIBUTION GRID
============================ */

const grid = document.getElementById("github-contributions-grid");
const months = document.getElementById("github-months-container");

// Render mock grid immediately
function renderMockContributions() {
    if (grid && grid.children.length === 0) {
        const totalDays = 371;
        for (let i = 0; i < totalDays; i++) {
            const box = document.createElement("span");
            box.classList.add("github-box");
            const level = Math.floor(Math.random() * 5);
            box.classList.add(`level-${level}`);
            grid.appendChild(box);
        }

        // Render mock months aligned to approximate column positions (53 columns total)
        if (months && months.children.length === 0) {
            const labels = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun"];
            labels.forEach((month, idx) => {
                const span = document.createElement("span");
                span.textContent = month;
                span.style.gridColumnStart = Math.floor(idx * 4.4) + 1;
                months.appendChild(span);
            });
        }
    }
}
renderMockContributions();

async function fetchGithubContributions() {
    try {
        const response = await fetch("https://github-contributions-api.jogruber.de/v4/TanishMehta23");
        if (!response.ok) throw new Error("Failed to fetch contributions");
        const data = await response.json();

        if (data && data.contributions) {
            // Filter out future dates
            const todayStr = new Date().toISOString().split('T')[0];
            const validContributions = data.contributions.filter(d => d.date <= todayStr);

            // Sort contributions chronologically by date (since the API returns years in reverse order)
            validContributions.sort((a, b) => new Date(a.date) - new Date(b.date));

            // Filter to last 371 days (53 weeks) to show only the last year
            const contributions = validContributions.slice(-371);

            if (grid) {
                grid.innerHTML = "";
            }
            if (months) {
                months.innerHTML = "";
            }

            // Calculate total contributions (all-time total)
            let totalContributions = 0;
            if (data.total) {
                totalContributions = Object.values(data.total).reduce((sum, val) => sum + val, 0);
            } else {
                contributions.forEach(d => totalContributions += d.count);
            }

            // Pad grid start to align the first week days
            const firstDate = new Date(contributions[0].date);
            const startDay = firstDate.getDay(); // 0 (Sunday) to 6 (Saturday)

            if (grid) {
                for (let i = 0; i < startDay; i++) {
                    const placeholder = document.createElement("span");
                    placeholder.classList.add("github-box");
                    placeholder.style.visibility = "hidden";
                    grid.appendChild(placeholder);
                }
            }

            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let lastMonthNum = -1;

            contributions.forEach((day, index) => {
                const dateObj = new Date(day.date);
                const monthNum = dateObj.getMonth();
                const weekIndex = Math.floor((index + startDay) / 7);

                // Dynamically append month labels at the start of each month
                if (monthNum !== lastMonthNum) {
                    if (months) {
                        const span = document.createElement("span");
                        span.textContent = monthNames[monthNum];
                        span.style.gridColumnStart = weekIndex + 1;
                        months.appendChild(span);
                    }
                    lastMonthNum = monthNum;
                }

                if (grid) {
                    const box = document.createElement("span");
                    box.classList.add("github-box");
                    box.classList.add(`level-${day.level}`);
                    box.setAttribute("title", `${day.count} contributions on ${day.date}`);
                    grid.appendChild(box);
                }
            });

            const totalText = document.querySelector(".github-total-contributions");
            if (totalText && totalContributions > 0) {
                let current = 0;
                const duration = 1200;
                const frameRate = 1000 / 60;
                const totalFrames = duration / frameRate;
                const inc = totalContributions / totalFrames;
                totalText.textContent = "0";
                const countTimer = setInterval(() => {
                    current += inc;
                    if (current >= totalContributions) {
                        totalText.textContent = totalContributions;
                        clearInterval(countTimer);
                    } else {
                        totalText.textContent = Math.floor(current);
                    }
                }, frameRate);
            }
        }
    } catch (error) {
        console.error("Error loading GitHub contributions:", error);
    }
}

fetchGithubContributions();

/* ====================================================
   INTERACTIVE TECH BRIDGE (Static cards <-> Galaxy)
   ==================================================== */
const techCards = document.querySelectorAll(".tech-card");

// 1. Static cards hover highlights planets in galaxy
techCards.forEach(card => {
    const category = card.getAttribute("data-category");
    if (!category) return;

    card.addEventListener("mouseenter", () => {
        planets.forEach(planet => {
            if (planet.classList.contains(category)) {
                planet.classList.add("highlighted");
            }
        });
    });

    card.addEventListener("mouseleave", () => {
        planets.forEach(planet => {
            planet.classList.remove("highlighted");
        });
    });
});

// 2. Planets hover highlights static cards
planets.forEach(planet => {
    const categories = ["programming", "frontend", "backend", "ai", "database", "platform"];
    let planetCategory = null;
    for (const cat of categories) {
        if (planet.classList.contains(cat)) {
            planetCategory = cat;
            break;
        }
    }

    if (!planetCategory) return;

    const matchingCard = document.querySelector(`.tech-card[data-category="${planetCategory}"]`);
    if (!matchingCard) return;

    planet.addEventListener("mouseenter", () => {
        matchingCard.classList.add("highlighted-card");
    });

    planet.addEventListener("mouseleave", () => {
        matchingCard.classList.remove("highlighted-card");
    });
});

/* ====================================================
   CONTACT FORM SUBMISSION (Web3Forms API)
   ==================================================== */
// Form submission logic removed (form replaced by direct mailto link)

/* ====================================================
   PROJECTS DATA DICTIONARY FOR MODAL POPUP
   ==================================================== */
const PROJECTS_DATA = {
    focusora: {
        title: "FocusoraHQ",
        category: "Full-Stack",
        categoryClass: "badge-fullstack",
        logo: "assets/images/Logo/Focusora-logo.png",
        image: "assets/images/FocusoraHQ/img-1.png",
        gallery: [
            "assets/images/FocusoraHQ/img-1.png",
            "assets/images/FocusoraHQ/img-2.png",
            "assets/images/FocusoraHQ/img-3.png",
            "assets/images/FocusoraHQ/img-4.png",
            "assets/images/FocusoraHQ/img-5.png",
            "assets/images/FocusoraHQ/img-6.png",
            "assets/images/FocusoraHQ/img-7.png",
            "assets/images/FocusoraHQ/img-8.png",
            "assets/images/FocusoraHQ/img-9.png",
            "assets/images/FocusoraHQ/img-10.png",
            "assets/images/FocusoraHQ/img-11.png",
            "assets/images/FocusoraHQ/img-12.png",
            "assets/images/FocusoraHQ/img-13.png",
            "assets/images/FocusoraHQ/img-14.png",
            "assets/images/FocusoraHQ/img-15.png",
            "assets/images/FocusoraHQ/img-16.png",
            "assets/images/FocusoraHQ/img-17.png",
            "assets/images/FocusoraHQ/img-18.png",
            "assets/images/FocusoraHQ/img-19.png",
            "assets/images/FocusoraHQ/img-20.png"
        ],
        desc: "A modern collaborative productivity workspace engineering real-time study rooms, synchronized Pomodoro sessions, shared document notes, and gamified progress tracking to enhance focus and team accountability.",
        highlights: [
            "Real-time synchronized study rooms powered by Socket.io",
            "Gamified leagues, XP leaderboards & focus metrics",
            "Collaborative live markdown note-taking & task management",
            "Responsive minimalist UI with dark-mode aesthetic"
        ],
        tech: [
            { name: "React", icon: "fa-brands fa-react text-[#00D8FF]" },
            { name: "Node.js", icon: "fa-brands fa-node-js text-[#68A063]" },
            { name: "Socket.io", icon: "fa-solid fa-bolt text-[#F59E0B]" },
            { name: "MongoDB", icon: "fa-solid fa-database text-[#10B981]" },
            { name: "Tailwind CSS", icon: "fa-brands fa-css3-alt text-[#38BDF8]" }
        ],
        liveUrl: "https://focusora-hq.vercel.app/",
        githubUrl: "https://github.com/Chet07-R/FocusoraHQ"
    },
    finpulse: {
        title: "FinPulse AI",
        category: "AI / ML & Full-Stack",
        categoryClass: "badge-ai",
        logo: "assets/images/Logo/Finpulse-logo.png",
        image: "assets/images/FinpulseAI/img-1.png",
        gallery: [
            "assets/images/FinpulseAI/img-1.png",
            "assets/images/FinpulseAI/img-2.jpg",
            "assets/images/FinpulseAI/img-3.jpg",
            "assets/images/FinpulseAI/img-4.jpg",
            "assets/images/FinpulseAI/img-5.jpg",
            "assets/images/FinpulseAI/img-6.jpg",
            "assets/images/FinpulseAI/img-7.jpg",
            "assets/images/FinpulseAI/img-8.jpg",
            "assets/images/FinpulseAI/img-9.jpg",
            "assets/images/FinpulseAI/img-10.jpg",
            "assets/images/FinpulseAI/img-11.jpg",
            "assets/images/FinpulseAI/img-12.jpg",
            "assets/images/FinpulseAI/img-13.jpg",
            "assets/images/FinpulseAI/img-14.jpg",
            "assets/images/FinpulseAI/img-15.jpg",
            "assets/images/FinpulseAI/img-16.jpg",
            "assets/images/FinpulseAI/img-17.jpg"
        ],
        desc: "AI-driven financial intelligence and analytics platform delivering real-time stock telemetry, market sentiment synthesis, automated risk assessment, and predictive macro-economic insights.",
        highlights: [
            "LLM-powered financial news & earnings transcript analysis with Google Gemini",
            "High-performance async FastAPI backend with PostgreSQL persistence",
            "Interactive interactive financial charts & risk rating models",
            "Automated watchlist alerts and market anomaly notifications"
        ],
        tech: [
            { name: "React", icon: "fa-brands fa-react text-[#00D8FF]" },
            { name: "FastAPI", icon: "fa-solid fa-bolt text-[#009688]" },
            { name: "Gemini AI", icon: "fa-solid fa-sparkles text-[#A855F7]" },
            { name: "PostgreSQL", icon: "fa-solid fa-database text-[#336791]" },
            { name: "Python", icon: "fa-brands fa-python text-[#3776AB]" }
        ],
        liveUrl: "https://finpulse-frontend-jrsd.onrender.com",
        githubUrl: "https://github.com/Vans30m/FinPulse-AI"
    },
    xplorism: {
        title: "Xplorism",
        category: "Full-Stack & AI",
        categoryClass: "badge-fullstack",
        logo: "assets/images/Logo/Xplorism-logo.png",
        image: "assets/images/Xplorism/img-1.png",
        gallery: [
            "assets/images/Xplorism/img-1.png",
            "assets/images/Xplorism/img-2.png",
            "assets/images/Xplorism/img-3.png",
            "assets/images/Xplorism/img-4.png",
            "assets/images/Xplorism/img-5.png",
            "assets/images/Xplorism/img-6.png",
            "assets/images/Xplorism/img-7.png",
            "assets/images/Xplorism/img-8.png",
            "assets/images/Xplorism/img-9.png",
            "assets/images/Xplorism/img-10.png",
            "assets/images/Xplorism/img-11.png",
            "assets/images/Xplorism/img-12.png",
            "assets/images/Xplorism/img-13.png",
            "assets/images/Xplorism/img-14.png",
            "assets/images/Xplorism/img-15.png",
            "assets/images/Xplorism/img-16.png",
            "assets/images/Xplorism/img-17.png"
        ],
        desc: "Premium AI trip itinerary architect featuring personalized Day-by-Day scheduling, interactive geographic map route rendering, collaborative multi-user trip sync, and OCR expense tracking.",
        highlights: [
            "Dual-AI reasoning pipeline (Google Gemini API with Ollama local fallback)",
            "Dynamic Leaflet map integration with multi-stop waypoint route mapping",
            "Secure document vault with encrypted cloud backup",
            "OCR receipt parsing & multi-currency expense ledger"
        ],
        tech: [
            { name: "React 19", icon: "fa-brands fa-react text-[#00D8FF]" },
            { name: "Tailwind CSS", icon: "fa-brands fa-css3-alt text-[#38BDF8]" },
            { name: "Node.js", icon: "fa-brands fa-node-js text-[#68A063]" },
            { name: "Socket.io", icon: "fa-solid fa-bolt text-[#F59E0B]" },
            { name: "PostgreSQL", icon: "fa-solid fa-database text-[#336791]" },
            { name: "Leaflet", icon: "fa-solid fa-map-location-dot text-[#10B981]" }
        ],
        liveUrl: "https://xplorism.vercel.app/",
        githubUrl: "https://github.com/TanishMehta23/Xplorism"
    },
    fitness: {
        title: "Fitness Planet",
        category: "Frontend",
        categoryClass: "badge-frontend",
        logo: "assets/images/Logo/Fitness-Planet-logo.png",
        image: "assets/images/Fitness-Planet/img-1.png",
        gallery: [
            "assets/images/Fitness-Planet/img-1.png",
            "assets/images/Fitness-Planet/img-2.png",
            "assets/images/Fitness-Planet/img-3.png",
            "assets/images/Fitness-Planet/img-4.png",
            "assets/images/Fitness-Planet/img-5.png",
            "assets/images/Fitness-Planet/img-6.png",
            "assets/images/Fitness-Planet/img-7.png",
            "assets/images/Fitness-Planet/img-8.png",
            "assets/images/Fitness-Planet/img-9.png",
            "assets/images/Fitness-Planet/img-10.png"
        ],
        desc: "High-conversion modern fitness and health hub built with pixel-perfect responsive layouts, real-time BMI calculator tool, workout program catalogs, and automated inquiry dispatch.",
        highlights: [
            "Interactive client-side BMI calculator with dynamic fitness tier feedback",
            "Modular e-commerce fitness store & gear showcase",
            "Integrated EmailJS automation for direct user consultation bookings",
            "100% fluid mobile-first responsive architecture"
        ],
        tech: [
            { name: "HTML5", icon: "fa-brands fa-html5 text-[#E34F26]" },
            { name: "CSS3", icon: "fa-brands fa-css3-alt text-[#1572B6]" },
            { name: "JavaScript", icon: "fa-brands fa-js text-[#F7DF1E]" },
            { name: "EmailJS", icon: "fa-solid fa-envelope text-[#7C8CF8]" }
        ],
        liveUrl: "https://new-project-delta-orcin.vercel.app/",
        githubUrl: "https://github.com/Vans30m/Fitness-Planet"
    },
    smartlocker: {
        title: "Smart Locker System IoT",
        category: "Hardware / IoT",
        categoryClass: "badge-hardware",
        icon: "fa-solid fa-lock text-amber-500",
        isCollage: true,
        desc: "DICE 3rd prize award-winning biometric security locking mechanism powered by ESP32 microcontrollers, optical fingerprint authentication, and real-time remote cloud control.",
        highlights: [
            "Secured 3rd Position at DICE Innovation Event 2026",
            "Optical fingerprint sensor with sub-second hardware matching",
            "Blynk IoT Cloud integration for remote authorization & access telemetry",
            "Fail-safe emergency power override and intrusion alert notifications"
        ],
        tech: [
            { name: "ESP32", icon: "fa-solid fa-microchip text-[#F59E0B]" },
            { name: "C++", icon: "fa-solid fa-code text-[#00599C]" },
            { name: "Blynk IoT", icon: "fa-solid fa-cloud text-[#24C270]" },
            { name: "Biometrics", icon: "fa-solid fa-fingerprint text-[#F59E0B]" }
        ],
        liveUrl: "https://github.com/TanishMehta23/Smart-Locker-System-IoT",
        githubUrl: "https://github.com/TanishMehta23/Smart-Locker-System-IoT"
    },
    greenhouse: {
        title: "Greenhouse Monitoring System",
        category: "Hardware / IoT",
        categoryClass: "badge-hardware",
        icon: "fa-solid fa-seedling text-emerald-400",
        isGreenhouseCollage: true,
        desc: "Automated climate regulation and precision agriculture monitoring system with real-time temperature, moisture, and luminosity sensors triggering automated actuators.",
        highlights: [
            "Continuous multi-sensor telemetry (soil moisture, DHT11, LDR ambient light)",
            "Closed-loop automated climate triggers for ventilation fans and irrigation pumps",
            "LCD display terminal output for on-site diagnostic telemetry",
            "Energy-efficient embedded firmware architecture"
        ],
        tech: [
            { name: "Embedded C", icon: "fa-solid fa-microchip text-[#10B981]" },
            { name: "Sensors", icon: "fa-solid fa-temperature-half text-[#F59E0B]" },
            { name: "IoT", icon: "fa-solid fa-network-wired text-[#38BDF8]" },
            { name: "Automation", icon: "fa-solid fa-gears text-[#A855F7]" }
        ],
        liveUrl: "https://github.com/TanishMehta23/Automated-Greenhouse-Monitoring-System",
        githubUrl: "https://github.com/TanishMehta23/Automated-Greenhouse-Monitoring-System"
    },
    spamshield: {
        title: "SpamShield AI",
        category: "AI / ML",
        categoryClass: "badge-ai",
        icon: "fa-solid fa-shield-halved text-cyan-400",
        image: "assets/images/spamshield.png",
        desc: "Machine learning classifier web application engineered with Python and Scikit-Learn to detect malicious email and SMS spam patterns with high confidence accuracy.",
        highlights: [
            "Trained Naive Bayes / Scikit-Learn NLP text classification pipeline",
            "Real-time probability confidence score computation",
            "Clean Flask API & responsive web interface for instant text evaluation",
            "Lightweight serverless deployment"
        ],
        tech: [
            { name: "Python", icon: "fa-brands fa-python text-[#3776AB]" },
            { name: "Scikit-Learn", icon: "fa-solid fa-brain text-[#F7931E]" },
            { name: "Flask", icon: "fa-solid fa-server text-[#FFFFFF]" },
            { name: "HTML/CSS", icon: "fa-brands fa-html5 text-[#E34F26]" }
        ],
        liveUrl: "https://spam-shield-web.vercel.app/",
        githubUrl: "https://github.com/TanishMehta23/SpamShield"
    },
    quizora: {
        title: "QuizoraAI",
        category: "AI / ML",
        categoryClass: "badge-ai",
        emoji: "📚",
        image: "assets/images/QuizoraAI.png",
        desc: "Intelligent AI learning platform that ingests raw PDF documents, extracts semantic topics, and dynamically generates interactive multiple-choice tests with answer rationales.",
        highlights: [
            "Automated PDF document text extraction and token chunking",
            "Gemini AI prompt engineering for tiered question difficulty generation",
            "Interactive Streamlit web interface with instant scoring and explanations",
            "Customizable question count and topic targeting"
        ],
        tech: [
            { name: "Python", icon: "fa-brands fa-python text-[#3776AB]" },
            { name: "Gemini AI", icon: "fa-solid fa-sparkles text-[#A855F7]" },
            { name: "Streamlit", icon: "fa-solid fa-desktop text-[#FF4B4B]" },
            { name: "PyPDF", icon: "fa-solid fa-file-pdf text-[#EF4444]" }
        ],
        liveUrl: "https://quizoraai.streamlit.app/",
        githubUrl: "https://github.com/TanishMehta23/QuizoraAI"
    }
};

/* ====================================================
   PREMIUM INFINITE LOOP PROJECTS CAROUSEL & MODAL ENGINE
   ==================================================== */
function initProjectsCarousel() {
    const track = document.getElementById("projects-carousel-track");
    const container = document.getElementById("projects-carousel-container");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const filterCapsule = document.querySelector(".filter-active-capsule");
    const filterContainer = document.querySelector(".filter-tube-container");
    const pauseBtnBottom = document.getElementById("proj-pause-btn-bottom");

    // Modal elements
    const modalBackdrop = document.getElementById("project-modal");
    const modalCloseBtn = document.getElementById("project-modal-close");
    const modalImgContainer = document.getElementById("modal-img-container");
    const modalCategoryBadge = document.getElementById("modal-category-badge");
    const modalTitle = document.getElementById("modal-title");
    const modalDesc = document.getElementById("modal-desc");
    const modalFeaturesList = document.getElementById("modal-features-list");
    const modalTechTags = document.getElementById("modal-tech-tags");
    const modalActionButtons = document.getElementById("modal-action-buttons");

    if (!track) return;

    let isAutoScrolling = true;
    let isManuallyPaused = false;
    let isHoverPaused = false;
    let isDragPaused = false;
    let resumeTimeout = null;
    let scrollSpeed = 38; // Pixels per second
    let lastTime = null;
    let animationFrameId = null;

    // Save initial original cards
    const originalCards = Array.from(track.querySelectorAll(".project-card"));
    if (originalCards.length === 0) return;

    // --- Infinite Clone Setup ---
    function setupInfiniteTrack() {
        // Clear track and re-populate with clones [clonesBefore] [originalCards] [clonesAfter]
        track.innerHTML = "";

        const currentFilter = document.querySelector(".filter-btn.active")?.getAttribute("data-filter") || "all";
        const matchedCards = originalCards.filter(card => {
            const cat = card.getAttribute("data-category") || "";
            return currentFilter === "all" || cat.split(/\s+/).includes(currentFilter);
        });

        if (matchedCards.length === 0) return;

        // Clone sets for seamless infinite loop in both directions
        const clonesBefore = matchedCards.map(c => {
            const clone = c.cloneNode(true);
            clone.setAttribute("data-clone", "before");
            return clone;
        });

        const mains = matchedCards.map(c => {
            const node = c.cloneNode(true);
            node.removeAttribute("data-clone");
            return node;
        });

        const clonesAfter = matchedCards.map(c => {
            const clone = c.cloneNode(true);
            clone.setAttribute("data-clone", "after");
            return clone;
        });

        [...clonesBefore, ...mains, ...clonesAfter].forEach(c => track.appendChild(c));

        // Center scroll position at the beginning of the main cards set
        requestAnimationFrame(() => {
            const singleSetWidth = calculateSetWidth(matchedCards.length);
            track.scrollLeft = singleSetWidth;
            currentScrollPos = singleSetWidth;
            updateCenterFocus();
        });
    }

    function calculateSetWidth(cardCount) {
        const firstCard = track.querySelector(".project-card");
        if (!firstCard) return 1000;
        const cardWidth = firstCard.offsetWidth;
        const gap = 30; // match CSS gap
        return cardCount * (cardWidth + gap);
    }

    setupInfiniteTrack();

    // Check boundary wrap-around seamlessly
    function checkInfiniteBoundaries() {
        const currentCards = Array.from(track.querySelectorAll(".project-card:not([data-clone])"));
        const cardCount = currentCards.length;
        if (cardCount <= 1) return;

        const setWidth = calculateSetWidth(cardCount);
        if (setWidth <= 0) return;

        // If scrolled past right clones set, jump back to main set
        if (track.scrollLeft >= setWidth * 2) {
            track.scrollLeft -= setWidth;
            currentScrollPos = track.scrollLeft;
        }
        // If scrolled before left clones set, jump forward to main set
        else if (track.scrollLeft <= 5) {
            track.scrollLeft += setWidth;
            currentScrollPos = track.scrollLeft;
        }
    }

    // --- 1. Continuous Auto-Scroll Engine with Seamless Looping ---
    let currentScrollPos = track.scrollLeft;

    function stepAutoScroll(currentTime) {
        if (!lastTime) lastTime = currentTime;
        const delta = Math.min((currentTime - lastTime) / 1000, 0.1); // Guard against giant delta jumps on tab wake
        lastTime = currentTime;

        const isModalOpen = modalBackdrop && modalBackdrop.classList.contains("open");
        const canScroll = isAutoScrolling && !isManuallyPaused && !isHoverPaused && !isDragPaused && !isModalOpen;

        if (canScroll) {
            // Keep track of fractional float position so WebKit/iOS subpixels don't get truncated
            currentScrollPos += scrollSpeed * delta;
            track.scrollLeft = currentScrollPos;
            checkInfiniteBoundaries();
        } else {
            currentScrollPos = track.scrollLeft;
        }

        updateCenterFocus();
        animationFrameId = requestAnimationFrame(stepAutoScroll);
    }
    animationFrameId = requestAnimationFrame(stepAutoScroll);

    // Auto-pause on hover, with 2-second auto-resume
    if (container) {
        container.addEventListener("mouseenter", () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            isHoverPaused = true;
        });
        container.addEventListener("mouseleave", () => {
            if (resumeTimeout) clearTimeout(resumeTimeout);
            resumeTimeout = setTimeout(() => {
                if (!isManuallyPaused) {
                    isHoverPaused = false;
                }
            }, 2000);
        });
    }

    // Toggle Auto-Scroll Button
    function toggleAutoScroll(e) {
        if (e) e.stopPropagation();
        isManuallyPaused = !isManuallyPaused;
        if (!isManuallyPaused) {
            isHoverPaused = false;
        }

        if (pauseBtnBottom) {
            if (!isManuallyPaused) {
                pauseBtnBottom.innerHTML = `
                    <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" id="proj-pause-indicator"></span>
                    <span id="proj-pause-text">Auto-Scrolling</span>
                    <i class="fa-solid fa-pause text-[10px] opacity-70 ml-0.5"></i>
                `;
            } else {
                pauseBtnBottom.innerHTML = `
                    <span class="w-2.5 h-2.5 rounded-full bg-amber-400" id="proj-pause-indicator"></span>
                    <span id="proj-pause-text">Paused</span>
                    <i class="fa-solid fa-play text-[10px] opacity-70 ml-0.5"></i>
                `;
            }
        }
    }

    if (pauseBtnBottom) pauseBtnBottom.addEventListener("click", toggleAutoScroll);

    // --- 2. Category Filter Capsule & Track Rebuilding ---
    function updateFilterCapsule(activeButton, animate = true) {
        if (!filterCapsule || !activeButton || !filterContainer) return;
        const btnRect = activeButton.getBoundingClientRect();
        const containerRect = filterContainer.getBoundingClientRect();
        const leftOffset = btnRect.left - containerRect.left;
        const width = btnRect.width;

        if (!animate) {
            filterCapsule.style.transition = "none";
        } else {
            filterCapsule.style.transition = "transform 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2), width 0.35s cubic-bezier(0.2, 0.9, 0.3, 1.2)";
        }
        filterCapsule.style.transform = `translateX(${leftOffset}px)`;
        filterCapsule.style.width = `${width}px`;
    }

    if (filterButtons.length > 0) {
        const initialActive = document.querySelector(".filter-btn.active") || filterButtons[0];
        if (initialActive) {
            setTimeout(() => updateFilterCapsule(initialActive, false), 50);
        }

        window.addEventListener("resize", () => {
            const currentActive = document.querySelector(".filter-btn.active");
            if (currentActive) updateFilterCapsule(currentActive, false);
            setupInfiniteTrack();
        });

        filterButtons.forEach(button => {
            button.addEventListener("click", () => {
                filterButtons.forEach(btn => btn.classList.remove("active"));
                button.classList.add("active");
                updateFilterCapsule(button, true);
                setupInfiniteTrack();
            });
        });
    }

    // --- 3. Center Card Subtle Focus Effect ---
    function updateCenterFocus() {
        const cards = Array.from(track.querySelectorAll(".project-card"));
        if (cards.length === 0) return;

        const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
        let closestCard = null;
        let minDistance = Infinity;

        cards.forEach((card) => {
            const cardRect = card.getBoundingClientRect();
            const cardCenter = cardRect.left + cardRect.width / 2;
            const distance = Math.abs(trackCenter - cardCenter);

            if (distance < minDistance) {
                minDistance = distance;
                closestCard = card;
            }
        });

        cards.forEach((card) => {
            if (card === closestCard) {
                card.classList.add("is-centered");
            } else {
                card.classList.remove("is-centered");
            }
        });
    }

    track.addEventListener("scroll", () => {
        checkInfiniteBoundaries();
        updateCenterFocus();
    }, { passive: true });

    // --- 4. Mouse Wheel to Horizontal Scrolling with Infinite Wrap ---
    track.addEventListener("wheel", (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
            e.preventDefault();
            track.scrollLeft += e.deltaY;
            checkInfiniteBoundaries();
            if (resumeTimeout) clearTimeout(resumeTimeout);
            isHoverPaused = true;
            resumeTimeout = setTimeout(() => {
                if (!isManuallyPaused) isHoverPaused = false;
            }, 2000);
        }
    }, { passive: false });

    // --- 5. Click and Drag-to-Scroll Support with Momentum & Boundary Wrapping ---
    let isDown = false;
    let startX = 0;
    let scrollLeftStart = 0;
    let hasDragged = false;
    let prevX = 0;
    let velocity = 0;

    track.addEventListener("mousedown", (e) => {
        isDown = true;
        hasDragged = false;
        isDragPaused = true;
        track.classList.add("is-dragging");
        startX = e.pageX - track.offsetLeft;
        scrollLeftStart = track.scrollLeft;
        prevX = e.pageX;
        velocity = 0;
    });

    window.addEventListener("mouseup", () => {
        if (!isDown) return;
        isDown = false;
        track.classList.remove("is-dragging");

        // Momentum coasting
        if (Math.abs(velocity) > 2) {
            track.scrollBy({
                left: -velocity * 10,
                behavior: "smooth"
            });
        }

        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isDragPaused = false;
            if (!isManuallyPaused) isHoverPaused = false;
        }, 1500);
    });

    track.addEventListener("mousemove", (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.3;
        velocity = e.pageX - prevX;
        prevX = e.pageX;

        if (Math.abs(walk) > 6) {
            hasDragged = true;
        }
        track.scrollLeft = scrollLeftStart - walk;
        checkInfiniteBoundaries();
    });

    // Touch events for mobile/tablet swipe
    track.addEventListener("touchstart", () => {
        isDragPaused = true;
    }, { passive: true });

    track.addEventListener("touchend", () => {
        if (resumeTimeout) clearTimeout(resumeTimeout);
        resumeTimeout = setTimeout(() => {
            isDragPaused = false;
        }, 2000);
    }, { passive: true });

    // --- 6. Project Details Popup Modal Renderer ---
    function openProjectModal(projectId) {
        const data = PROJECTS_DATA[projectId];
        if (!data || !modalBackdrop) return;

        // Render Media
        if (data.gallery && data.gallery.length >= 3) {
            const img1 = data.gallery[0];
            const img2 = data.gallery[1];
            const img3 = data.gallery[2];
            const moreCount = data.gallery.length - 2;

            modalImgContainer.innerHTML = `
                <div class="modal-collage-wrapper">
                    <div class="modal-collage-grid">
                        <div class="collage-cell cell-main" data-img-src="${img1}" data-index="0" title="Click to view full image">
                            <img src="${img1}" alt="${data.title} screenshot 1" loading="lazy">
                            <span class="collage-zoom-badge"><i class="fa-solid fa-expand"></i> View</span>
                        </div>
                        <div class="collage-cell" data-img-src="${img2}" data-index="1" title="Click to view full image">
                            <img src="${img2}" alt="${data.title} screenshot 2" loading="lazy">
                            <span class="collage-zoom-badge"><i class="fa-solid fa-expand"></i></span>
                        </div>
                        <div class="collage-cell" data-img-src="${img3}" data-index="2" title="Click to view full image">
                            <img src="${img3}" alt="${data.title} screenshot 3" loading="lazy">
                            ${moreCount > 0 ? `
                                <div class="collage-more-overlay">
                                    <span>+${moreCount} More</span>
                                    <span class="text-[10px] opacity-80">Click to explore</span>
                                </div>
                            ` : `<span class="collage-zoom-badge"><i class="fa-solid fa-expand"></i></span>`}
                        </div>
                    </div>
                </div>
            `;

            // Lightbox integration on collage click
            const lightbox = document.getElementById("project-img-lightbox");
            const lightboxImg = document.getElementById("lightbox-full-img");
            const lightboxClose = document.getElementById("lightbox-close-btn");
            const lightboxPrev = document.getElementById("lightbox-prev-btn");
            const lightboxNext = document.getElementById("lightbox-next-btn");
            const lightboxCounter = document.getElementById("lightbox-counter");

            let currentLightboxIndex = 0;

            function updateLightboxImage(index) {
                if (!data.gallery || data.gallery.length === 0) return;
                if (index < 0) index = data.gallery.length - 1;
                if (index >= data.gallery.length) index = 0;
                currentLightboxIndex = index;

                if (lightboxImg) {
                    lightboxImg.style.opacity = "0.4";
                    lightboxImg.src = data.gallery[currentLightboxIndex];
                    lightboxImg.onload = () => {
                        lightboxImg.style.opacity = "1";
                    };
                }
                if (lightboxCounter) {
                    lightboxCounter.textContent = `${currentLightboxIndex + 1} / ${data.gallery.length}`;
                }
            }

            const cells = modalImgContainer.querySelectorAll(".collage-cell");
            cells.forEach((cell) => {
                cell.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const idx = parseInt(cell.getAttribute("data-index"), 10);
                    if (lightbox && lightboxImg) {
                        updateLightboxImage(idx);
                        lightbox.classList.add("open");
                        lightbox.setAttribute("aria-hidden", "false");
                    }
                });
            });

            if (lightboxPrev) {
                lightboxPrev.onclick = (e) => {
                    e.stopPropagation();
                    updateLightboxImage(currentLightboxIndex - 1);
                };
            }

            if (lightboxNext) {
                lightboxNext.onclick = (e) => {
                    e.stopPropagation();
                    updateLightboxImage(currentLightboxIndex + 1);
                };
            }

            function closeLightbox() {
                if (lightbox) {
                    lightbox.classList.remove("open");
                    lightbox.setAttribute("aria-hidden", "true");
                }
            }

            if (lightboxClose) {
                lightboxClose.onclick = (e) => {
                    e.stopPropagation();
                    closeLightbox();
                };
            }

            if (lightbox) {
                lightbox.onclick = (e) => {
                    if (e.target === lightbox) {
                        closeLightbox();
                    }
                };
            }

            const handleLightboxKeydown = (e) => {
                if (!lightbox || !lightbox.classList.contains("open")) return;
                if (e.key === "ArrowLeft") {
                    e.preventDefault();
                    updateLightboxImage(currentLightboxIndex - 1);
                } else if (e.key === "ArrowRight") {
                    e.preventDefault();
                    updateLightboxImage(currentLightboxIndex + 1);
                } else if (e.key === "Escape") {
                    e.preventDefault();
                    closeLightbox();
                }
            };

            window.removeEventListener("keydown", window._currentLightboxKeyHandler);
            window._currentLightboxKeyHandler = handleLightboxKeydown;
            window.addEventListener("keydown", handleLightboxKeydown);

        } else if (data.isCollage) {
            modalImgContainer.innerHTML = `
                <div class="project-collage" style="height: 320px;">
                    <div class="collage-item"><img src="assets/images/Hardware/Smart Locker IOT/Circuit_Diagram.png" alt="Circuit"><span class="collage-label">Circuit</span></div>
                    <div class="collage-item"><img src="assets/images/Hardware/Smart Locker IOT/Block_Diagram.png" alt="Block"><span class="collage-label">Block</span></div>
                    <div class="collage-item"><img src="assets/images/Hardware/Smart Locker FingerPrint/Circuit_Diagram.png" alt="Biometric"><span class="collage-label">Biometric</span></div>
                    <div class="collage-item"><img src="assets/images/Hardware/Smart Locker IOT/Pin_Diagram.png" alt="Pinout"><span class="collage-label">Pinout</span></div>
                </div>
            `;
        } else if (data.isGreenhouseCollage) {
            modalImgContainer.innerHTML = `
                <div class="project-collage" style="height: 320px;">
                    <div class="collage-item photo-fit"><img src="assets/images/Hardware/Automated GreenHouse Monitoring/greenhouse_setup.jpg" alt="Hardware"><span class="collage-label">Hardware</span></div>
                    <div class="collage-item"><img src="assets/images/Hardware/Automated GreenHouse Monitoring/circuit_diagram.png" alt="Circuit"><span class="collage-label">Circuit</span></div>
                    <div class="collage-item photo-fit"><img src="assets/images/Hardware/Automated GreenHouse Monitoring/lcd_display_reading.jpg" alt="Telemetry"><span class="collage-label">Telemetry</span></div>
                    <div class="collage-item"><img src="assets/images/Hardware/Automated GreenHouse Monitoring/block_diagram.png" alt="Architecture"><span class="collage-label">Architecture</span></div>
                </div>
            `;
        } else {
            modalImgContainer.innerHTML = `<img src="${data.image}" alt="${data.title}" class="rounded-xl">`;
        }

        // Title
        let iconHtml = "";
        if (data.logo) iconHtml = `<img src="${data.logo}" alt="${data.title}" class="w-7 h-7 object-contain inline-block">`;
        else if (data.icon) iconHtml = `<i class="${data.icon}"></i>`;
        else if (data.emoji) iconHtml = `<span>${data.emoji}</span>`;
        modalTitle.innerHTML = `${iconHtml} <span>${data.title}</span>`;

        // Description
        modalDesc.textContent = data.desc;

        // Highlights List
        modalFeaturesList.innerHTML = data.highlights
            .map(item => `<li>${item}</li>`)
            .join("");

        // Tech Pills
        modalTechTags.innerHTML = data.tech
            .map(t => `<span class="modal-tech-pill"><i class="${t.icon}"></i> ${t.name}</span>`)
            .join("");

        // Action Buttons
        modalActionButtons.innerHTML = `
            <a href="${data.liveUrl}" target="_blank" class="modal-btn-live">
                <span>Live Demo</span>
                <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
            <a href="${data.githubUrl}" target="_blank" class="modal-btn-gh">
                <i class="fa-brands fa-github"></i>
                <span>GitHub</span>
            </a>
        `;

        // Open Modal
        modalBackdrop.classList.add("open");
        modalBackdrop.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function closeProjectModal() {
        if (!modalBackdrop) return;
        modalBackdrop.classList.remove("open");
        modalBackdrop.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    // Attach click listeners to cards to open modal
    track.addEventListener("click", (e) => {
        if (hasDragged) return; // Ignore drag clicks
        const card = e.target.closest(".project-card");
        if (!card) return;
        const projectId = card.getAttribute("data-project-id");
        if (projectId) {
            openProjectModal(projectId);
        }
    });

    if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeProjectModal);
    if (modalBackdrop) {
        modalBackdrop.addEventListener("click", (e) => {
            if (e.target === modalBackdrop) closeProjectModal();
        });
    }

    window.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modalBackdrop.classList.contains("open")) {
            closeProjectModal();
        }
    });
}

// Run Carousel initialization on load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initProjectsCarousel);
} else {
    initProjectsCarousel();
}

/* ====================================================
   PRELOADER INITIALIZATION & HERO TYPING
   ==================================================== */
async function runHeroTyping() {
    const heroTyping = document.getElementById("hero-typing");
    if (!heroTyping) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        heroTyping.textContent = "Tanish Mehta";
        return;
    }

    const phrases = [
        "Tanish Mehta"
    ];

    let phraseIndex = 0;

    // Clear initial text to start clean
    heroTyping.textContent = "";

    while (true) {
        const phrase = phrases[phraseIndex];

        // Type out the phrase
        for (let i = 0; i <= phrase.length; i++) {
            heroTyping.textContent = phrase.slice(0, i);
            await sleep(100);
        }

        // Wait before deleting
        await sleep(2200);

        // Delete the phrase
        for (let i = phrase.length; i >= 0; i--) {
            heroTyping.textContent = phrase.slice(0, i);
            await sleep(50);
        }

        // Wait before typing the next one
        await sleep(600);

        phraseIndex = (phraseIndex + 1) % phrases.length;
    }
}

window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("fade-out");
        }, 100);
    }

    // Start hero typing animation
    runHeroTyping();

    // Initialize Dashboard Spotlight Hover effect on the HUD Strip
    const hudStrip = document.querySelector(".hud-strip");
    if (hudStrip) {
        hudStrip.addEventListener("mousemove", (e) => {
            const rect = hudStrip.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            hudStrip.style.setProperty("--mouse-x", `${x}px`);
            hudStrip.style.setProperty("--mouse-y", `${y}px`);
        });
    }

    // Fetch GitHub Repositories count dynamically
    const githubRepoEl = document.getElementById("github-repo-count");
    if (githubRepoEl) {
        fetch("https://api.github.com/users/TanishMehta23")
            .then(response => response.json())
            .then(data => {
                if (data && typeof data.public_repos === "number") {
                    githubRepoEl.setAttribute("data-target", data.public_repos);
                }
            })
            .catch(err => console.error("Error fetching GitHub repos count:", err));
    }

    // Initialize Dashboard Intersection Observer Count Up
    const statNums = document.querySelectorAll(".stat-num");
    const startCountUp = (el) => {
        const target = parseInt(el.getAttribute("data-target"), 10);
        if (isNaN(target)) return;

        const isPad = el.getAttribute("data-pad") === "true";
        let count = 0;
        const duration = 1200; // total animation time in ms
        const frameRate = 1000 / 60; // 60 fps
        const totalFrames = duration / frameRate;
        const increment = target / totalFrames;

        const formatNumber = (num) => {
            const intVal = Math.floor(num);
            return isPad ? (intVal < 10 ? `0${intVal}+` : `${intVal}+`) : `${intVal}+`;
        };

        el.textContent = formatNumber(0);

        const counterInterval = setInterval(() => {
            count += increment;
            if (count >= target) {
                el.textContent = isPad ? (target < 10 ? `0${target}+` : `${target}+`) : `${target}+`;
                clearInterval(counterInterval);
            } else {
                el.textContent = formatNumber(count);
            }
        }, frameRate);
    };

    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCountUp(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNums.forEach(num => {
        statsObserver.observe(num);
    });

    // ================= DEV SNAKE ARCADE GAME =================
    const canvas = document.getElementById("snake-canvas");
    const ctx = canvas ? canvas.getContext("2d") : null;
    const overlay = document.getElementById("snake-overlay");
    const startBtn = document.getElementById("snake-start-btn");
    const overlayTitle = document.getElementById("snake-overlay-title");
    const overlayDesc = document.getElementById("snake-overlay-desc");
    const scoreVal = document.getElementById("snake-score");
    const highVal = document.getElementById("snake-high");

    const gridSize = 20;
    const tileCountX = 25; // 500 / 20 = 25
    const tileCountY = 19; // 380 / 20 = 19

    let snake = [];
    let direction = { x: 0, y: 0 };
    let nextDirection = { x: 0, y: 0 };
    let food = { x: 0, y: 0 };
    let isFeatureFood = false; // Alternates food type
    let score = 0;
    let highScore = localStorage.getItem("dev_snake_high") || 0;
    let gameInterval = null;
    let isGameActive = false;

    if (highVal) highVal.textContent = highScore;

    const resetGame = () => {
        snake = [
            { x: 12, y: 9 },
            { x: 12, y: 10 },
            { x: 12, y: 11 }
        ];
        direction = { x: 0, y: -1 };
        nextDirection = { x: 0, y: -1 };
        score = 0;
        if (scoreVal) scoreVal.textContent = score;
        spawnFood();
    };

    const spawnFood = () => {
        let proposedFood;
        let onSnake = true;
        while (onSnake) {
            proposedFood = {
                x: Math.floor(Math.random() * tileCountX),
                y: Math.floor(Math.random() * tileCountY)
            };
            onSnake = snake.some(segment => segment.x === proposedFood.x && segment.y === proposedFood.y);
        }
        food = proposedFood;
        isFeatureFood = Math.random() > 0.4; // 60% chance of feature, 40% of bug
    };

    const drawGame = () => {
        if (!ctx) return;

        // Clear canvas
        ctx.fillStyle = "#030508";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Grid Lines (Subtle)
        ctx.strokeStyle = "rgba(20, 184, 166, 0.03)";
        ctx.lineWidth = 1;
        // Vertical lines
        for (let i = 0; i <= tileCountX; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
        }
        // Horizontal lines
        for (let i = 0; i <= tileCountY; i++) {
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }

        // Move Snake
        direction = nextDirection;
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // Check Wall Collision
        if (head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
            endGame();
            return;
        }

        // Check Self Collision
        if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            endGame();
            return;
        }

        // Append new head
        snake.unshift(head);

        // Check Food Eating
        if (head.x === food.x && head.y === food.y) {
            score += isFeatureFood ? 15 : 10;
            if (scoreVal) scoreVal.textContent = score;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("dev_snake_high", highScore);
                if (highVal) highVal.textContent = highScore;
            }
            spawnFood();
        } else {
            // Remove tail if didn't eat food
            snake.pop();
        }

        // Draw Food
        if (isFeatureFood) {
            // Feature Food: Glowing Green Circle
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#10B981";
            ctx.fillStyle = "#10B981";
            ctx.beginPath();
            ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, 6, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Bug Food: Glowing Red Circle
            ctx.shadowBlur = 12;
            ctx.shadowColor = "#EF4444";
            ctx.fillStyle = "#EF4444";
            ctx.beginPath();
            ctx.arc(food.x * gridSize + gridSize / 2, food.y * gridSize + gridSize / 2, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.shadowBlur = 0; // reset shadow

        // Draw Snake
        snake.forEach((segment, idx) => {
            const isHead = idx === 0;
            if (isHead) {
                ctx.fillStyle = "#14B8A6"; // Teal head
                ctx.shadowBlur = 10;
                ctx.shadowColor = "#14B8A6";
            } else {
                // Gradient tail segments
                const intensity = Math.max(100 - idx * 6, 40);
                ctx.fillStyle = `rgb(13, ${intensity + 50}, ${intensity + 80})`;
            }
            ctx.fillRect(segment.x * gridSize + 1, segment.y * gridSize + 1, gridSize - 2, gridSize - 2);
            ctx.shadowBlur = 0;
        });
    };

    const startGame = () => {
        if (isGameActive) return;
        resetGame();
        isGameActive = true;
        if (overlay) overlay.classList.add("opacity-0", "pointer-events-none");
        gameInterval = setInterval(drawGame, 150);
    };

    const endGame = () => {
        isGameActive = false;
        clearInterval(gameInterval);
        if (overlay) {
            if (overlayTitle) overlayTitle.textContent = "GAME OVER";
            if (overlayDesc) overlayDesc.textContent = `You secured ${score} Lines of Code! Let's squish some more bugs.`;
            overlay.classList.remove("opacity-0", "pointer-events-none");
        }
    };

    // Keyboard controls
    window.addEventListener("keydown", (e) => {
        if (!isGameActive) return;

        switch (e.key) {
            case "ArrowUp":
            case "w":
            case "W":
                if (direction.y !== 1) nextDirection = { x: 0, y: -1 };
                e.preventDefault();
                break;
            case "ArrowDown":
            case "s":
            case "S":
                if (direction.y !== -1) nextDirection = { x: 0, y: 1 };
                e.preventDefault();
                break;
            case "ArrowLeft":
            case "a":
            case "A":
                if (direction.x !== 1) nextDirection = { x: -1, y: 0 };
                e.preventDefault();
                break;
            case "ArrowRight":
            case "d":
            case "D":
                if (direction.x !== -1) nextDirection = { x: 1, y: 0 };
                e.preventDefault();
                break;
        }
    });

    // Touch D-Pad Controls
    const upBtn = document.getElementById("ctrl-up");
    const downBtn = document.getElementById("ctrl-down");
    const leftBtn = document.getElementById("ctrl-left");
    const rightBtn = document.getElementById("ctrl-right");

    if (upBtn) upBtn.addEventListener("click", () => { if (direction.y !== 1) nextDirection = { x: 0, y: -1 }; });
    if (downBtn) downBtn.addEventListener("click", () => { if (direction.y !== -1) nextDirection = { x: 0, y: 1 }; });
    if (leftBtn) leftBtn.addEventListener("click", () => { if (direction.x !== 1) nextDirection = { x: -1, y: 0 }; });
    if (rightBtn) rightBtn.addEventListener("click", () => { if (direction.x !== -1) nextDirection = { x: 1, y: 0 }; });

    if (startBtn) {
        startBtn.addEventListener("click", startGame);
    }
});

// Highlight navbar and change header color when Projects section is in view
document.addEventListener("DOMContentLoaded", () => {
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('a.nav-link');
    const mobileLinks = document.querySelectorAll('a.mobile-link');
    const projectsSection = document.getElementById('projects');

    // Header color toggle is optional — observe projects section only if it exists
    if (header && projectsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.4) {
                    header.classList.add('projects-active');
                } else {
                    header.classList.remove('projects-active');
                }
            });
        }, { threshold: [0, 0.25, 0.4, 0.6, 0.9] });

        observer.observe(projectsSection);
    }

    // (Removed achievements-only observer — generic links observer below handles all sections)

    // Use viewport midpoint scanning to reliably mark the active nav link (works across layouts)
    const sectionLinks = Array.from(navLinks).filter(a => a.getAttribute('href') && a.getAttribute('href').startsWith('#'));

    const sections = sectionLinks.map(link => {
        const id = link.getAttribute('href').slice(1);
        return {
            id,
            link,
            mobileLink: document.querySelector(`a.mobile-link[href="#${id}"]`),
            el: document.getElementById(id)
        };
    }).filter(s => s.el);

    function throttle(fn, wait) {
        let last = 0;
        let timeout = null;
        return function (...args) {
            const now = Date.now();
            const remaining = wait - (now - last);
            clearTimeout(timeout);
            if (remaining <= 0) {
                last = now;
                fn.apply(this, args);
            } else {
                timeout = setTimeout(() => {
                    last = Date.now();
                    fn.apply(this, args);
                }, remaining);
            }
        };
    }

    function updateActiveByMidpoint() {
        const mid = window.innerHeight / 2;
        let foundActive = false;

        sections.forEach(s => {
            const rect = s.el.getBoundingClientRect();
            if (rect.top <= mid && rect.bottom >= mid) {
                // set this as active
                sectionLinks.forEach(a => a.classList.remove('active'));
                mobileLinks.forEach(a => a.classList.remove('active'));
                s.link.classList.add('active');
                if (s.mobileLink) s.mobileLink.classList.add('active');
                foundActive = true;

                // toggle header projects-active when projects section is active
                if (header && s.id === 'projects') {
                    header.classList.add('projects-active');
                } else if (header && s.id !== 'projects') {
                    header.classList.remove('projects-active');
                }
            }
        });

        if (!foundActive) {
            sectionLinks.forEach(a => a.classList.remove('active'));
            mobileLinks.forEach(a => a.classList.remove('active'));
            if (header) header.classList.remove('projects-active');
        }
    }

    const throttledUpdate = throttle(updateActiveByMidpoint, 120);
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', throttledUpdate);
    // run once to initialise
    updateActiveByMidpoint();
});

// Recruiter mode: toggle popup with `R`, close with `Esc` or close button
(function () {
    const modal = document.getElementById('recruiter-modal');
    const closeBtn = document.getElementById('recruiter-close');

    if (!modal) return;

    function openModal() {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
    }

    function closeModal() {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
    }

    document.addEventListener('keydown', (e) => {
        // ignore when typing in inputs or textareas
        const tag = document.activeElement && document.activeElement.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement.isContentEditable) return;

        if (e.key === 'r' || e.key === 'R') {
            if (modal.classList.contains('open')) closeModal();
            else openModal();
        }

        if (e.key === 'Escape') {
            closeModal();
        }
    });

    closeBtn.addEventListener('click', closeModal);

    // allow clicking outside to close
    document.addEventListener('click', (e) => {
        if (!modal.classList.contains('open')) return;
        const card = modal.querySelector('.recruiter-modal-card');
        if (e.target === modal || (card && !card.contains(e.target) && !e.target.matches('#recruiter-close') && !e.target.closest('#recruiter-hint'))) {
            closeModal();
        }
    });

    // Click on hint opens modal
    const hint = document.getElementById('recruiter-hint');
    if (hint) {
        hint.addEventListener('click', (e) => {
            e.stopPropagation();
            if (modal.classList.contains('open')) closeModal();
            else openModal();
        });
    }

    const connectLink = document.getElementById('rm-close-to-contact');
    if (connectLink) {
        connectLink.addEventListener('click', () => {
            closeModal();
        });
    }
})();

// ==========================================
// COPY EMAIL TO CLIPBOARD WITH FEEDBACK
// ==========================================
(function initCopyEmail() {
    const copyEmailBtn = document.getElementById('copy-email-btn');
    if (!copyEmailBtn) return;

    copyEmailBtn.addEventListener('click', () => {
        const email = 'tanish.mehta23@gmail.com';
        const copyIcon = copyEmailBtn.querySelector('i');

        const onSuccess = () => {
            if (copyIcon) copyIcon.className = 'fa-solid fa-check text-[#22C55E] text-sm sm:text-base';
            copyEmailBtn.style.color = '#22C55E';
            copyEmailBtn.style.boxShadow = '0 0 12px rgba(34, 197, 94, 0.4)';

            setTimeout(() => {
                if (copyIcon) copyIcon.className = 'fa-regular fa-copy text-sm sm:text-base';
                copyEmailBtn.style.color = '';
                copyEmailBtn.style.boxShadow = '';
            }, 2000);
        };

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(email).then(onSuccess).catch(() => {
                fallbackCopyText(email, onSuccess);
            });
        } else {
            fallbackCopyText(email, onSuccess);
        }
    });

    function fallbackCopyText(text, callback) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            if (callback) callback();
        } catch (err) {
            console.error('Fallback copy failed', err);
        }
        document.body.removeChild(textArea);
    }
})();
