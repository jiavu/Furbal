// Alrighty, let's start! :)

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || windows.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let reqAnimF;
// 100 color values for condition bars: Red -> Yellow -> Green.
const colorMap = ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0800", "ff1100", "ff1900", "ff2200", "ff2a00", "ff3200", "ff3b00", "ff4400", "ff4c00", "ff5500", "ff5d00", "ff6500", "ff6e00", "ff7600", "ff7f00", "ff8800", "ff9000", "ff9900", "ffa100", "ffaa00", "ffb200", "ffbb00", "ffc300", "ffcb00", "ffd400", "ffdc00", "ffe500", "ffed00", "fff600", "fffe00", "f9ff00", "f4fe00", "efff00", "eaff00", "e5ff00", "e0ff00", "dbff00", "d6ff00", "d1ff00", "ccff00", "c6ff00", "c1ff00", "bcfe00", "b7ff00", "b2ff00", "adff00", "a8ff00", "a3ff00", "9eff00", "98ff00", "93fe00", "8eff00", "89ff00", "84fe00", "7fff00", "7aff00", "75ff00", "70ff00", "6bff00", "65ff00", "60ff00", "5bff00", "56ff00", "51ff00", "4cff00", "47ff00", "42ff00", "3dff00", "38ff00", "32ff00", "2dff00", "28ff00", "23ff00", "1eff00", "19ff00", "14ff00", "0fff00", "0aff00", "05ff00", "00ff00"];


// Control monitor:
const timeElapsed = document.getElementById("timeElapsed");
const loopSpeed = document.getElementById("loopSpeed");
const interv = document.getElementById("interv");
const count = document.getElementById("count");
const pauseButton = document.getElementById("pause");

// Game elements:
const health = document.getElementById("health");
const satiation = document.getElementById("satiation");
const fun = document.getElementById("fun");
const care = document.getElementById("care");

//////////////////////////////////////////////////

// Gameloop paramenter:
let lastRender = 0;
let progress = 0;
let v_timeElapsed = 0;
let counter = 0;
let interval = 5;
let pause = false;

// Balancing decrease:
let healthUpdate;
const gameSpeed = 1; // deprecated. ^^ Delete later or find a solution
const naturalDecreaseOfSatiation = 0.4;
const satiationPower = 0.01;
const naturalDecreaseOfFun = 0.2;
const funPower = 0.01;
const naturalDecreaseofLove = 0.5;

// Furball:
const myFurball = {
    isDead : false,
    health : 100,
    satiation : 100,
    fun : 100,
    love : 50
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

// Functions:

const gameOver = () => window.alert("Game Over!");


const switchPause = () => {
    pause = !pause;
    (pause)? cancelAnimationFrame(reqAnimF) : reqAnimF = requestAnimationFrame(loop);
}


function update(progress) {
    ++counter;

    // natural decrease and increase

    if (counter == interval) {
        counter = 0;

        myFurball.satiation -= naturalDecreaseOfSatiation;
        if (myFurball.satiation <= 0) myFurball.satiation = 0;
        myFurball.fun -= naturalDecreaseOfFun;
        if (myFurball.fun <= 0) myFurball.fun = 0;

        // My own formula, makes not much sense. Or does it?
        //healthUpdate = -(satiationPower/myFurball.satiation)// + funPower/myFurball.fun);
        
        // Newtons Law of Cooling:
        healthUpdate = -satiationPower*(myFurball.health - myFurball.satiation);
                
        
        myFurball.health += healthUpdate;

    }
    if (myFurball.health >= 100) myFurball.health = 100;
    if (myFurball.health <= 0.01) myFurball.isDead = true;
    //if (v_timeElapsed >= 10000) { myFurball.isDead = true } // Control values after a certain time. Delete later.
 };


function draw() {

    timeElapsed.innerHTML = "Time Elapsed: " + Math.round(v_timeElapsed) + "ms";
    loopSpeed.innerHTML = "Game Loop Speed: " + Math.round(progress) + "ms/loop";
    interv.innerHTML = "Interval: " + interval;

    health.children[0].style.width = myFurball.health + "%";
    health.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.health-1)]; // Achtung, Index -1 gibt es nicht.

    health.children[0].innerHTML = myFurball.health // for controlling. Delete later

    health.style.borderColor = "#" + colorMap[Math.round(myFurball.health-1)];
    satiation.children[0].style.width = myFurball.satiation + "%";
    satiation.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    satiation.style.borderColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    fun.children[0].style.width = myFurball.fun + "%";
    fun.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    fun.style.borderColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    care.children[0].style.width = myFurball.care + "%";
    care.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.care-1)];
    care.style.borderColor = "#" + colorMap[Math.round(myFurball.care-1)];

}


function loop(timestamp) {

    progress = timestamp - lastRender;
    v_timeElapsed += progress;

    update(progress); // Alle Werte neu berechnen, pro bestimmte Zeit konstant decrease.
    draw(); // Die Balken neu zeichnen.

    lastRender = timestamp;
    (myFurball.isDead)? gameOver() : reqAnimF = requestAnimationFrame(loop);

}


pauseButton.addEventListener("mousedown", switchPause);

reqAnimF = requestAnimationFrame(loop);