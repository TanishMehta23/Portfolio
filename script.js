if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("hidden");

});

const terminal = document.getElementById("terminal-content");

const commands = [
    {
        cmd: "pwd",
        output: "/home/tanish"
    },
    {
        cmd: "ls projects/",
        output: "FocusoraHQ\nFinPulseAI\nFitness Planet\nSpamShield\nNexus AI\nQuizoraAI"
    },
    {
        cmd: "git status",
        output: "On branch main\nYour portfolio is up to date."
    },
    {
        cmd: "cat mission.txt",
        output: "Building scalable AI-powered web applications."
    },
    {
        cmd: "echo $GOAL",
        output: "Software Engineer @ Top Tech Company"
    }
];

let index = 0;
let terminalInstanceId = 0;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element, text, speed = 40) {

    element.innerHTML = "";

    for (let i = 0; i < text.length; i++) {

        element.innerHTML += text[i];

        await sleep(speed);

    }

}

async function runTerminal() {
    const myInstanceId = ++terminalInstanceId;
    window.terminalInstance = myInstanceId;

    while (true) {
        if (window.terminalInstance !== myInstanceId) return;

        terminal.innerHTML = "";

        const current = commands[index];

        // prompt
        const prompt = document.createElement("div");
        prompt.className = "terminal-line";
        terminal.appendChild(prompt);

        const dollar = document.createElement("span");
        dollar.className = "prompt";
        dollar.textContent = "$";

        const typing = document.createElement("span");

        const cursor = document.createElement("span");
        cursor.className = "cursor";

        prompt.appendChild(dollar);
        prompt.appendChild(typing);
        prompt.appendChild(cursor);

        await typeText(typing, current.cmd, 50);
        if (window.terminalInstance !== myInstanceId) return;

        await sleep(250);
        if (window.terminalInstance !== myInstanceId) return;
        cursor.remove();

        const output = document.createElement("div");
        output.className = "output";
        output.innerHTML = current.output.replace(/\n/g, "<br>");
        terminal.appendChild(output);

        await sleep(1800);
        if (window.terminalInstance !== myInstanceId) return;

        // clear command

        const clearLine = document.createElement("div");
        clearLine.className = "terminal-line";
        terminal.appendChild(clearLine);

        clearLine.innerHTML = `
            <span class="prompt">$</span>
            <span class="command">clear</span>
        `;

        await sleep(900);
        if (window.terminalInstance !== myInstanceId) return;

        terminal.style.opacity = "0";

        await sleep(300); // wait for fade out
        if (window.terminalInstance !== myInstanceId) return;

        terminal.innerHTML = "";

        terminal.style.opacity = "1";

        await sleep(100); // short pause before next command starts typing
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
        // Fallback positioning
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

    // =============================
    // MOVE PLANETS
    // =============================

    objects.forEach(p => {

        // Mouse attraction
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 180 && dist > 5) {

            const force = (180 - dist) / 180;

            p.vx += (dx / dist) * force * 0.04;
            p.vy += (dy / dist) * force * 0.04;

        }

        // Slow down naturally
        p.vx *= 0.985;
        p.vy *= 0.985;

        // Maintain a gentle continuous drift (especially on mobile/no hover)
        const currentSpeed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (currentSpeed < 0.25) {
            const angle = Math.random() * Math.PI * 2;
            p.vx += Math.cos(angle) * 0.08;
            p.vy += Math.sin(angle) * 0.08;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Bounce from walls
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

    // =============================
    // COLLISION
    // =============================

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

    // =============================
    // DRAW
    // =============================

    objects.forEach(p => {

        p.el.style.left = (p.x - p.r) + "px";
        p.el.style.top = (p.y - p.r) + "px";

    });

    requestAnimationFrame(animateGalaxy);

}

animateGalaxy();

const achievementCounters = document.querySelectorAll(".achievement-number");

const achievementObserver = new IntersectionObserver((entries) => {

    entries.forEach(entry => {

        if (!entry.isIntersecting) return;

        const counter = entry.target;

        const target = parseInt(counter.innerText);

        let count = 0;

        const increment = target / 60;

        const timer = setInterval(() => {

            count += increment;

            if (count >= target) {

                counter.innerText = target + "+";

                clearInterval(timer);

            } else {

                counter.innerText = Math.floor(count) + "+";

            }

        }, 20);

        achievementObserver.unobserve(counter);

    });

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
            ring.style.background = "rgba(20,184,166,.08)";

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
    }
}
renderMockContributions();

async function fetchGithubContributions() {
    try {
        const response = await fetch("https://github-contributions-api.deno.dev/TanishMehta23.json");
        if (!response.ok) throw new Error("Failed to fetch contributions");
        const data = await response.json();

        if (data && data.contributions) {
            let totalContributions = 0;
            const weeks = data.contributions;

            if (grid) {
                grid.innerHTML = "";
            }

            weeks.forEach(week => {
                week.forEach(day => {
                    totalContributions += day.contributionCount;

                    if (grid) {
                        const box = document.createElement("span");
                        box.classList.add("github-box");

                        let level = 0;
                        if (day.contributionLevel === "FIRST_QUARTILE") level = 1;
                        else if (day.contributionLevel === "SECOND_QUARTILE") level = 2;
                        else if (day.contributionLevel === "THIRD_QUARTILE") level = 3;
                        else if (day.contributionLevel === "FOURTH_QUARTILE") level = 4;

                        box.classList.add(`level-${level}`);
                        box.setAttribute("title", `${day.contributionCount} contributions on ${day.date}`);
                        grid.appendChild(box);
                    }
                });
            });

            const totalText = document.querySelector(".github-total-contributions");
            if (totalText) {
                totalText.textContent = totalContributions;
            }
        }
    } catch (error) {
        console.error("Error loading GitHub contributions:", error);
    }
}

fetchGithubContributions();

/* Month Labels */
if (months && months.children.length === 0) {
    const labels = [
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun"
    ];

    labels.forEach(month => {
        const span = document.createElement("span");
        span.textContent = month;
        span.style.gridColumn = "span 4";
        months.appendChild(span);
    });
}

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
   PROJECT FILTERING SYSTEM
   ==================================================== */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove("active"));
            // Add active class to clicked button
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            projectCards.forEach(card => {
                const cardCategory = card.getAttribute("data-category");

                if (filterValue === "all" || cardCategory === filterValue) {
                    card.classList.remove("hide-card");
                } else {
                    card.classList.add("hide-card");
                }
            });
        });
    });
}

/* ====================================================
   DYNAMIC GRADIENT HOVER GLOW FOR BENTO CARDS
   ==================================================== */
const bentoCards = document.querySelectorAll(".bento-card, .terminal-card, .focus-card");
bentoCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--x", `${x}px`);
        card.style.setProperty("--y", `${y}px`);
    });
});
/* ====================================================
   PROJECT CARD FLIP SUPPORT (MOBILE & DESKTOP)
   ==================================================== */
document.querySelectorAll(".project-card").forEach(card => {
    card.addEventListener("click", function (e) {
        if (e.target.closest("a, button")) {
            return;
        }
        const isHoverDevice = window.matchMedia("(hover: hover)").matches;

        if (isHoverDevice) {
            // On desktop hover devices: toggle flipped/unflipped explicitly on click
            if (this.classList.contains("flipped")) {
                this.classList.remove("flipped");
                this.classList.add("unflipped");
            } else {
                this.classList.add("flipped");
                this.classList.remove("unflipped");
            }
        } else {
            // On mobile touch devices: clean toggle
            this.classList.toggle("flipped");
        }
    });

    card.addEventListener("mouseleave", function () {
        this.classList.remove("flipped");
        this.classList.remove("unflipped");
    });
});

/* ====================================================
   PRELOADER INITIALIZATION & HERO TYPING
   ==================================================== */
async function runHeroTyping() {
    const heroTyping = document.getElementById("hero-typing");
    if (!heroTyping) return;

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

        let count = 0;
        const duration = 1200; // total animation time in ms
        const frameRate = 1000 / 60; // 60 fps
        const totalFrames = duration / frameRate;
        const increment = target / totalFrames;

        const counterInterval = setInterval(() => {
            count += increment;
            if (count >= target) {
                el.textContent = target + "+";
                clearInterval(counterInterval);
            } else {
                el.textContent = Math.floor(count) + "+";
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
})();