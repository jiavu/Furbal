// Alrighty, let's start! :)

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || windows.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let reqAnimF;
// 100 color values for condition bars: Red -> Yellow -> Green.
const colorMap = ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0800", "ff1100", "ff1900", "ff2200", "ff2a00", "ff3200", "ff3b00", "ff4400", "ff4c00", "ff5500", "ff5d00", "ff6500", "ff6e00", "ff7600", "ff7f00", "ff8800", "ff9000", "ff9900", "ffa100", "ffaa00", "ffb200", "ffbb00", "ffc300", "ffcb00", "ffd400", "ffdc00", "ffe500", "ffed00", "fff600", "fffe00", "f9ff00", "f4fe00", "efff00", "eaff00", "e5ff00", "e0ff00", "dbff00", "d6ff00", "d1ff00", "ccff00", "c6ff00", "c1ff00", "bcfe00", "b7ff00", "b2ff00", "adff00", "a8ff00", "a3ff00", "9eff00", "98ff00", "93fe00", "8eff00", "89ff00", "84fe00", "7fff00", "7aff00", "75ff00", "70ff00", "6bff00", "65ff00", "60ff00", "5bff00", "56ff00", "51ff00", "4cff00", "47ff00", "42ff00", "3dff00", "38ff00", "32ff00", "2dff00", "28ff00", "23ff00", "1eff00", "19ff00", "14ff00", "0fff00", "0aff00", "05ff00", "00ff00"];


// Control monitor:
const timeElapsed = document.getElementById("timeElapsed");
const loopSpeed = document.getElementById("loopSpeed");
const gSpeed = document.getElementById("gSpeed");
const interv = document.getElementById("interv");
const count = document.getElementById("count");
const pauseButton = document.getElementById("pause");

// Game elements:
const health = document.getElementById("health");
const satiation = document.getElementById("satiation");
const fun = document.getElementById("fun");
const secureness = document.getElementById("secureness");

const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const petBtn = document.getElementById("petBtn");

const points = document.getElementById("points");
const credits = document.getElementById("credits");
const food = document.getElementById("food");
const toy = document.getElementById("toy");
const specialItems = document.getElementById("specialItems");

//////////////////////////////////////////////////

// Gameloop paramenter:
let lastRender = 0;
let progress = 0;
let v_timeElapsed = 0;
const gameSpeed = 2;
/*
Health decrease on different gameSpeed values:

-2.4551341677638163  8012ms  gameSpeed 1
-2.426407073306393  4007ms  gameSpeed 2
-2.4214364966589557 2011ms   gameSpeed 4

-7.531170623291359 16008ms gameSpeed 1
-7.505613495337315 8015ms gameSpeed 2
-7.502141006606919 4013ms gameSpeed 4

-20.016419080736142 32006ms gameSpeed 1
-19.879081228891607 16002ms gameSpeed 2
-19.74145722168376 8005ms gameSpeed 4
*/
let counter = 0;            // counter and interval are not so
let interval = 1;           // important anymore. Maybe delete
let pause = false;

// Balancing powers of decrease/increase:
let healthUpdate;
const naturalDecreaseOfSatiation = 0.015;
const satiationPower = 0.0015;               // character traits will influence the Power variables
const naturalDecreaseOfFun = 0.0078;
const funPower = 0.0004;                    //
const naturalDecreaseOfSecureness = 0.013;
const securenessPower = 0.0003;             //

const foodPower = 10;
const playPower = 10;
const petPower = 3;

//const funToSat = 0.00007;   // the more fun, the higher satiation decrease. Use: funToSat+fun | DELETE, CHANGED!!! playButton => decreases satiation
const healthToFun = 0.01;      // the less health, the higher fun decrease. Use: -(healthToFun/100)*health + healthToFun
const healthToSec = 0.0115;

//////////////////////////////////////////////////

// Furball:
const myFurball = {
    name : null,
    isDead : false,
    health : 100,
    satiation : 100,
    fun : 100,
    secureness : 100
}

// Player:
const player = {
    name : null,
    points : 0,
    credits : 0,
    food : 10,
    toy : 10,
    specialItems : null
}

//////////////////////////////////////////////////
/*
*/
//////////////////////////////////////////////////

// Functions:

const gameOver = () => {
    window.alert("Game Over!");
    console.log("Health: ", myFurball.health-100);
    console.log("/2: ", (myFurball.health-100)/2);
    console.log("/4: ", (myFurball.health-100)/4);
};


const switchPause = () => {
    pause = !pause;
    (pause)? cancelAnimationFrame(reqAnimF) : reqAnimF = requestAnimationFrame(loop);
}


const feed = () => {
    if (player.food >= foodPower) {
        (myFurball.satiation < 0)?
        myFurball.satiation = foodPower :
        myFurball.satiation += foodPower;
        //player.food -= foodPower;
    }
}


const play = () => {
    if (player.toy >= playPower) {
        (myFurball.fun < 0)?
        myFurball.fun = playPower :
        myFurball.fun += playPower;
        //player.toy -= playPower;
    }
}


const pet = () => {
    (myFurball.secureness < 0)?
    myFurball.secureness = petPower :
    myFurball.secureness += petPower;
}


function update(progress) {
    ++counter;

    // natural decrease and increase

    if (counter == interval) {
        counter = 0;

        myFurball.satiation -= (naturalDecreaseOfSatiation /* + myFurball.fun*funToSat */) * gameSpeed;               // + character trait
        myFurball.fun -= (naturalDecreaseOfFun + -healthToFun/100*myFurball.health + healthToFun) * gameSpeed;              // + character trait
        myFurball.secureness -= (naturalDecreaseOfSecureness + -healthToSec/100*myFurball.health + healthToSec) * gameSpeed;// + character trait

        // My own formula, makes not much sense. Or does it?
        //healthUpdate = -(satiationPower/myFurball.satiation)// + funPower/myFurball.fun);
        
        // Newtons Law of Cooling: u'(t) = -k(u(t)-a)
        healthUpdate = -satiationPower*(myFurball.health-myFurball.satiation)-funPower*(myFurball.health-myFurball.fun)-securenessPower*(myFurball.health-myFurball.secureness);
        //myFurball.health -= 0.01 * gameSpeed;// Test only, DELETE!!!!
        myFurball.health += healthUpdate * gameSpeed;

    }
    if (myFurball.health >= 100) myFurball.health = 100;
    if (myFurball.health <= 0) myFurball.isDead = true;
    //if (v_timeElapsed >= 8000) { myFurball.isDead = true } // Control values after a certain time. Delete later.
 };


function draw() {

    timeElapsed.innerHTML = "Time Elapsed: " + Math.round(v_timeElapsed) + "ms";
    loopSpeed.innerHTML = "Loop Speed: " + Math.round(progress) + "ms/loop";
    gSpeed.innerHTML = "Game Speed: " + gameSpeed;
    interv.innerHTML = "Interval: " + interval;

    health.children[0].style.width = myFurball.health + "%";
    health.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.health-1)]; // Achtung, Index -1 gibt es nicht.

    // for controlling. Delete later:
    health.children[0].innerHTML = myFurball.health;
    //satiation.children[0].innerHTML = myFurball.satiation;

    health.style.borderColor = "#" + colorMap[Math.round(myFurball.health-1)];
    satiation.children[0].style.width = myFurball.satiation + "%";
    satiation.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    satiation.style.borderColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    fun.children[0].style.width = myFurball.fun + "%";
    fun.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    fun.style.borderColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    secureness.children[0].style.width = myFurball.secureness + "%";
    secureness.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.secureness-1)];
    secureness.style.borderColor = "#" + colorMap[Math.round(myFurball.secureness-1)];

    points.innerHTML = player.points;
    credits.innerHTML = player.credits;
    food.innerHTML = player.food;
    toy.innerHTML = player.toy;
    specialItems.innerHTML = player.specialItems;


}


function loop(timestamp) {

    progress = timestamp - lastRender;
    v_timeElapsed += progress;

    update(progress); // Alle Werte neu berechnen, pro bestimmte Zeit konstant decrease.
    draw(); // Die Balken neu zeichnen.

    lastRender = timestamp;
    (myFurball.isDead)? gameOver() : reqAnimF = requestAnimationFrame(loop);

}

// Event listener:
pauseButton.addEventListener("click", switchPause);
feedBtn.addEventListener("click", feed);
playBtn.addEventListener("click", play);
petBtn.addEventListener("click", pet);

reqAnimF = requestAnimationFrame(loop);