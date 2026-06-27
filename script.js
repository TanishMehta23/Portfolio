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

observer.observe(counter);