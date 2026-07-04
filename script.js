const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {

    mobileMenu.classList.toggle("hidden");

});

const terminal = document.getElementById("terminal-content");

const commands = [
    {
        cmd: "whoami",
        output: "Tanish Mehta"
    },
    {
        cmd: "role",
        output: "MERN Stack Developer and DSA Enthusiast"
    },
    {
        cmd: "skills --list",
        output: "React\nFastAPI\nNode.js\nJava\nGemini AI"
    },
    {
        cmd: "status",
        output: "Open to Internship Opportunities ✨"
    },
    {
        cmd: "learning",
        output: "System Design\nCloud Computing"
    }
];

let index = 0;

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(element,text,speed=40){

    element.innerHTML="";

    for(let i=0;i<text.length;i++){

        element.innerHTML+=text[i];

        await sleep(speed);

    }

}

async function runTerminal(){

    while(true){

        terminal.innerHTML="";

        const current=commands[index];

        // prompt
        const prompt=document.createElement("div");
        prompt.className="terminal-line";
        terminal.appendChild(prompt);

        const dollar=document.createElement("span");
        dollar.className="prompt";
        dollar.textContent="$";

        const typing=document.createElement("span");

        const cursor=document.createElement("span");
        cursor.className="cursor";

        prompt.appendChild(dollar);
        prompt.appendChild(typing);
        prompt.appendChild(cursor);

        await typeText(typing,current.cmd,50);

        await sleep(250);
        cursor.remove();

        const output=document.createElement("div");
        output.className="output";
        output.innerHTML=current.output.replace(/\n/g,"<br>");
        terminal.appendChild(output);

        await sleep(1800);

        // clear command

        const clearLine=document.createElement("div");
        clearLine.className="terminal-line";
        terminal.appendChild(clearLine);

        clearLine.innerHTML=`
            <span class="prompt">$</span>
            <span class="command">clear</span>
        `;

        await sleep(900);

        terminal.style.opacity="0";

        await sleep(250);

        terminal.innerHTML="";

        terminal.style.opacity="1";

        index=(index+1)%commands.length;

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

// Fetch dynamic stats from GitHub and LeetCode APIs
async function fetchDynamicStats() {
    // 1. Fetch LeetCode
    try {
        const res = await fetch("https://alfa-leetcode-api.onrender.com/TanishMehta23/solved");
        if (res.ok) {
            const data = await res.json();
            if (data && data.solvedProblem) {
                const solvedCount = data.solvedProblem;
                const leetcodeUIElements = document.querySelectorAll(".leetcode-count, .leetcode-achievement-count");
                leetcodeUIElements.forEach(el => {
                    el.textContent = solvedCount + "+";
                });
            }
        }
    } catch (err) {
        console.error("Error fetching LeetCode stats:", err);
    }

    // 2. Fetch GitHub Repos
    try {
        const res = await fetch("https://api.github.com/users/TanishMehta23");
        if (res.ok) {
            const data = await res.json();
            if (data && data.public_repos !== undefined) {
                const repoCount = data.public_repos;
                const projectsUI = document.querySelector(".projects-count");
                if (projectsUI) {
                    projectsUI.textContent = repoCount + "+";
                }
            }
        }
    } catch (err) {
        console.error("Error fetching GitHub repos:", err);
    }
}

// Trigger stats fetching
fetchDynamicStats();

// Observer for dashboard stats counters
const statsCounters = document.querySelectorAll(".projects-count, .leetcode-count");
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counterEl = entry.target;
            const target = parseInt(counterEl.textContent) || 0;
            animateCountUp(counterEl, target);
            statsObserver.unobserve(counterEl);
        }
    });
}, { threshold: 0.1 });

statsCounters.forEach(counterEl => {
    statsObserver.observe(counterEl);
});

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
    // Keep planets in bounds immediately on resize
    objects.forEach(p => {
        if (p.x < p.r) p.x = p.r;
        if (p.x > W - p.r) p.x = W - p.r;
        if (p.y < p.r) p.y = p.r;
        if (p.y > H - p.r) p.y = H - p.r;
    });
});

const objects = [];

// Generate random position without overlapping
function randomPosition(radius){

    let x,y,valid=false;
    let attempts = 0;

    while(!valid && attempts < 150){
        attempts++;

        x = radius + Math.random()*(W-radius*2);
        y = radius + Math.random()*(H-radius*2);

        valid = true;

        for(const p of objects){

            const dx=x-p.x;
            const dy=y-p.y;

            if(Math.sqrt(dx*dx+dy*dy)<radius+p.r+25){

                valid=false;
                break;

            }

        }

    }

    if (!valid) {
        // Fallback positioning
        x = radius + Math.random()*(W-radius*2);
        y = radius + Math.random()*(H-radius*2);
    }

    return {x,y};

}

// Create objects
planets.forEach(el=>{

    let r = el.offsetWidth/2;

    const pos = randomPosition(r);

    objects.push({

        el,

        x:pos.x,

        y:pos.y,

        r,

        vx:(Math.random()-.5)*0.4,

        vy:(Math.random()-.5)*0.4

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

const achievementObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const counter = entry.target;

        const target = parseInt(counter.innerText);

        let count = 0;

        const increment = target/60;

        const timer = setInterval(()=>{

            count += increment;

            if(count>=target){

                counter.innerText=target+"+";

                clearInterval(timer);

            }else{

                counter.innerText=Math.floor(count)+"+";

            }

        },20);

        achievementObserver.unobserve(counter);

    });

});

achievementCounters.forEach(counter=>{

    achievementObserver.observe(counter);

});
const cards=document.querySelectorAll(".achievement-card");

const cardObserver=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("show-card");

}

});

},{
threshold:.2
});

cards.forEach(card=>{

cardObserver.observe(card);

});

const ring = document.querySelector(".cursor-ring");

if(ring){

    let mouseX = window.innerWidth/2;
    let mouseY = window.innerHeight/2;

    let ringX = mouseX;
    let ringY = mouseY;

    document.addEventListener("mousemove",(e)=>{

        mouseX=e.clientX;
        mouseY=e.clientY;

    });

    function animateCursor(){

        ringX += (mouseX-ringX)*0.18;
        ringY += (mouseY-ringY)*0.18;

        ring.style.left = ringX+"px";
        ring.style.top  = ringY+"px";

        requestAnimationFrame(animateCursor);

    }

    animateCursor();

    document.querySelectorAll(
        "a,button,.project-card,.planet,.achievement-card,.profile-card"
    ).forEach(item=>{

        item.addEventListener("mouseenter",()=>{

            ring.style.width="60px";
            ring.style.height="60px";
            ring.style.background="rgba(20,184,166,.08)";

        });

        item.addEventListener("mouseleave",()=>{

            ring.style.width="34px";
            ring.style.height="34px";
            ring.style.background="transparent";

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
if(months && months.children.length === 0){
    const labels=[
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

    labels.forEach(month=>{
        const span=document.createElement("span");
        span.textContent=month;
        span.style.gridColumn="span 4";
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
   PRELOADER INITIALIZATION
   ==================================================== */
window.addEventListener("load", () => {
    const preloader = document.getElementById("preloader");
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add("fade-out");
        }, 700); // Fades out after 0.7 seconds
    }
});