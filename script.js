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

        prompt.appendChild(dollar);
        prompt.appendChild(typing);

        await typeText(typing,current.cmd,50);

        await sleep(250);

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

const counter=document.querySelector(".counter");

const observer=new IntersectionObserver(entries=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

let i=0;

const target=320;

const timer=setInterval(()=>{

i+=5;

counter.textContent=i+"+";

if(i>=target){

clearInterval(timer);

counter.textContent="320+";

}

},20);

observer.disconnect();

}

});

});

const galaxy = document.getElementById("galaxy");
const planets = [...document.querySelectorAll(".planet")];

const W = galaxy.clientWidth;
const H = galaxy.clientHeight;

const objects = [];

// Generate random position without overlapping
function randomPosition(radius){

    let x,y,valid=false;

    while(!valid){

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

function animate() {

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

    requestAnimationFrame(animate);

}

animate();

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