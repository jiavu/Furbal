// Alrighty, let's start! :)

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || windows.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let reqAnimF;

// 100 color values for condition bars: Red -> Yellow -> Green.
const colorMaps = {
    // red -> yellow -> lighter green:
    1 : ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0600", "ff0c01", "ff1301", "ff1902", "ff1f03", "ff2603", "ff2c04", "ff3205", "ff3905", "ff3f06", "ff4606", "ff4c07", "ff5208", "ff5908", "ff5f09", "ff660a", "ff6c0a", "fe720b", "ff790b", "ff7f0c", "ff850d", "ff8c0d", "ff920e", "ff990f", "ff9f0f", "ffa510", "ffac10", "ffb211", "ffb812", "ffbf12", "ffc513", "ffcc14", "ffd214", "ffd815", "ffdf15", "ffe516", "ffeb17", "fff217", "fff818", "ffff19", "f8ff18", "f2ff17", "ebff17", "e5ff16", "dfff15", "d8ff15", "d2ff14", "ccff14", "c5ff13", "bfff12", "b8ff12", "b2ff11", "acff10", "a5ff10", "9fff0f", "98ff0e", "92ff0e", "8cfe0d", "85ff0d", "7fff0c", "79ff0b", "72ff0b", "6cff0a", "65ff09", "5fff09", "59ff08", "52ff08", "4cff07", "46ff06", "3fff06", "39ff05", "32ff04", "2cff04", "26ff03", "1fff03", "19ff02", "13ff01", "0cff01", "06ff00", "00ff00"],
    // red -> orange -> green:
    2 : ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0600", "ff0d00", "ff1400", "ff1b00", "ff2200", "ff2800", "ff2f00", "ff3600", "ff3d00", "ff4400", "ff4a00", "ff5100", "ff5800", "ff5f00", "ff6500", "ff6c00", "ff7300", "ff7a00", "ff8100", "ff8800", "ff8e00", "ff9500", "ff9c00", "ffa300", "ffa900", "ffb000", "ffb700", "ffbe00", "ffc500", "ffcb00", "fbcc01", "f7cd03", "f4ce04", "f0cf06", "edd007", "e9d109", "e6d20a", "e2d30c", "dfd30e", "dbd40f", "d8d511", "d4d612", "d0d714", "cdd815", "c9d917", "c6da18", "c2da1a", "bfdb1c", "bbdc1d", "b8dd1f", "b4de20", "b1df22", "ade023", "aae125", "a6e227", "a2e228", "9fe32a", "9be42b", "98e52d", "94e62e", "91e730", "8de831", "8ae933", "86e935", "83ea36", "7feb38", "7cec39", "78ed3b", "74ee3c", "71ef3e", "6df03f", "6af041", "66f143", "63f244", "5ff346", "5cf447", "58f549", "55f64a", "51f74c", "4df84e"],
    // red -> blue -> green:
    3 : ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "f90106", "f4020c", "ef0313", "ea0519", "e5061f", "e00726", "db082c", "d60a32", "d10b39", "cc0c3f", "c60e46", "c10f4c", "bc1052", "b71159", "b2135f", "ad1466", "a8156c", "a31672", "9e1879", "98197f", "931a85", "8e1c8c", "891d92", "841e99", "7f1f9f", "7a21a5", "7522ac", "7023b2", "6b24b8", "6526bf", "6027c5", "5b28cc", "562ad2", "512bd8", "4c2cdf", "472de5", "422feb", "3d30f2", "3831f8", "3233ff", "3337fb", "343bf7", "3440f3", "3544ef", "3648eb", "364de7", "3751e3", "3756df", "385adb", "395ed7", "3963d3", "3a67cf", "3a6bcb", "3b70c7", "3c74c4", "3c79c0", "3d7dbc", "3d81b8", "3e86b4", "3f8ab0", "3f8eac", "4093a8", "4097a4", "419ca0", "42a09c", "42a498", "43a994", "43ad90", "44b18c", "45b689", "45ba85", "46bf81", "46c37d", "47c779", "48cc75", "48d071", "49d46d", "49d969", "4add65", "4be261", "4be65d", "4cea59", "4cef55", "4df351", "4ef84d"],
    4 : ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "f6060a", "ee0c14", "e6121e", "de1828", "d61e33", "ce243d", "c52a47", "bd3051", "b5375b", "ad3d65", "a54370", "9d497a", "944f84", "8c558e", "845b99", "7c61a3", "7468ad", "6c6eb7", "6374c1", "5b7acc", "5380d6", "4b86e0", "438cea", "3b92f4", "3299ff", "339afb", "339cf8", "349ef5", "349ff2", "35a1ee", "35a3eb", "36a5e8", "36a6e5", "37a8e2", "37aade", "38acdb", "38add8", "39afd5", "39b1d1", "3ab2ce", "3ab4cb", "3bb6c8", "3bb8c5", "3cb9c1", "3cbbbe", "3dbdbb", "3dbfb8", "3ec0b4", "3ec2b1", "3fc4ae", "3fc5ab", "40c7a8", "40c9a4", "41cba1", "41cc9e", "42ce9b", "42d098", "43d294", "43d391", "44d58e", "44d78b", "45d887", "45da84", "46dc81", "46de7e", "47df7b", "47e177", "48e374", "48e571", "49e66e", "49e86a", "4aea67", "4aeb64", "4bed61", "4bef5e", "4cf15a", "4cf257", "4df454", "4df651", "4ef84d"],
    // red -> lighter blue, lighter green:
    5 : ["ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "ff0000", "f60308", "ee0611", "e50a19", "dd0d22", "d4112a", "cc1432", "c3173b", "bb1b44", "b21e4c", "aa2255", "a1255d", "992865", "902c6e", "882f76", "7f327f", "773688", "6e3990", "663d99", "5d40a1", "5544aa", "4c47b2", "444abb", "3b4ec3", "3351cb", "2a54d4", "2258dc", "195be5", "115fed", "0862f6", "0265fe", "0069f9", "006cf4", "006fef", "0072ea", "0075e5", "0078e0", "007bdb", "007ed6", "0081d1", "0084cc", "0087c6", "008ac1", "008dbc", "0090b7", "0093b2", "0096ad", "009aa8", "009da3", "00a09e", "00a398", "00a693", "00a98e", "00ac89", "00af84", "00b27f", "00b57a", "00b875", "00bb70", "00be6b", "00c165", "00c460", "00c75b", "00ca56", "00ce51", "00d14c", "00d447", "00d742", "00da3d", "00dd38", "00e032", "00e32d", "00e628", "00e923", "00ec1e", "00ef19", "00f214", "00f50f", "00f80a", "00fb05", "00ff00"]
}
const colorMap = colorMaps[4];


//////////////////////////////////////////////////


// Control monitor:
const timeElapsed = document.getElementById("timeElapsed");
const loopSpeed = document.getElementById("loopSpeed");
const gSpeed = document.getElementById("gSpeed");
const pauseButton = document.getElementById("pause");

// Game elements:
const health = document.getElementById("health");
const satiation = document.getElementById("satiation");
const fun = document.getElementById("fun");
const secureness = document.getElementById("secureness");

const furballStatement = document.getElementById("furball-says");
const furballName = document.getElementById("furball-name");

const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const petBtn = document.getElementById("petBtn");

const points = document.getElementById("points");
const credits = document.getElementById("credits");
const food = document.getElementById("food");
const toy = document.getElementById("toy");
const specialItems = document.getElementById("specialItems");

//////////////////////////////////////////////////
//////////////////////////////////////////////////


// Gameloop parameter:
let lastRender = 0;
let progress = 0;
let v_timeElapsed;
const gameSpeed = 2;
let counter = 0;    // Counts the number of loops made since game was started.
let pause = false;
const cooldown = 3000;
let timeElapsedTemp = 0;


// Balancing powers of decrease/increase:
let healthUpdate;
const naturalDecreaseOfSatiation = 0.015;
const satiationPower = 0.0015;               // = influence to health
const naturalDecreaseOfFun = 0.0078;
const funPower = 0.0009;                    // = influence to health
const naturalDecreaseOfSecureness = 0.013;
const securenessPower = 0.0003;             // = influence to health

const foodPowerMax = 10;    // if Furbals satiation is 0, Furbal will eat maximum.
const foodPowerMin = 1;     // if Furbals satiation is 100, Furbal will eat minimum.
const playPowerMax = 10;
const playPowerMin = 1;
const petPowerMax = 3;
const petPowerMin = 1;


const playToSat = 0.3;           // example: playToSat = 0.1; 10 toy consumed via play() will decrease satiation by 1. (PLAYING MAKES IT HUNGRY!)
const healthToFun = 0.01;      // the less health, the higher fun decrease. Use: -(healthToFun/100)*health + healthToFun
const healthToSec = 0.0110;     // the less health, the higher secureness decrease.

const secToFunThreshold = 0.25;   // in %. If security is 25% (or less), Furball won't play (and even lose fun by playing!).

// Later: Character traits will influence the amounts of all power variables.

//////////////////////////////////////////////////


// Furball:
const myFurball = {
    name : "My Furball",
    isDead : false,
    health : 100,
    satiation : 100,
    fun : 100,
    secureness : 100
};

// Player:
const player = {
    name : null,
    points : 0,
    credits : 0,
    food : 5000,
    toy : 5000,
    specialItems : null
};

/*
Regarding: importing modules from file://
The file:// protocol does not work with CORS - only a certain set of them work, such as http://, among others.

Possibilities:
1. Maybe set a http server on your local system and use http to your localhost to serve the files.
    Using Python(3): open cmd,
    python -m http.server 8080 --bind 127.0.0.1
2. Bypass CORS by disabling web-security.
3. provide crossOrigin: null to OpenLayers OSM source:
var newLayer = new ol.layer.Tile({
source: new ol.source.OSM({
    url: 'path/to/file.js',
    crossOrigin: null
    })
});
4. Save it in Github and change address in Furbal.html ?? :D - Didn't work.
*/


import furbalStates from "./furbal_says.js";
let furballSaying;
let saysFeed = false;
let saysPlay = false;
let saysPet = false;
let saysSatiation;
let saysFun;
let saysSecureness;

//////////////////////////////////////////////////
//////////////////////////////////////////////////
// Functions:

const gameOver = () => {
    furballStatement.innerHTML = "I'm dead.";

    const averageLoopSpeed = v_timeElapsed / counter;
    const hours = Math.floor(v_timeElapsed/3600000);
    const minutes = Math.floor(v_timeElapsed/60000 %60);
    const secondsMs = Math.round(v_timeElapsed)/1000 %60;
    const seconds = Math.floor(secondsMs);
    
    
    console.log("");
    console.log("==============");
    console.log("==============");
    console.log("");
    console.log("Game Speed: " + gameSpeed);
    console.log("Avrge Loop Speed: " + averageLoopSpeed + "ms");
    console.log("------")
    console.log("Time Elapsed: ", v_timeElapsed + " ms");
    console.log( hours + " hours, "
        + minutes + " minutes, "
        + secondsMs + " seconds.");
    window.alert(myFurball.name + " survived " +
    hours + " hours, "
    + minutes + " minutes and "
    + seconds + " seconds.");
};


const switchPause = () => {
    pause = !pause;
    (pause)? cancelAnimationFrame(reqAnimF) : reqAnimF = requestAnimationFrame(loop);
}


const feed = () => {
    let satiationIncrease;
    (myFurball.secureness < 0)?
        satiationIncrease = 0 :
        satiationIncrease = ( (-(foodPowerMax-foodPowerMin)/100 *myFurball.satiation) + foodPowerMax ) * myFurball.secureness/100;
        // the less secureness, the less myFurball will eat.

    //if (0 < player.food < satiationIncrease) {    // Weird behavior. Doesn't work as intended.
    if (player.food > 0 && player.food < satiationIncrease) {
        satiationIncrease = player.food;
        
    } else if (!player.food) {
        satiationIncrease = 0;
    }

    satiationIncrease = Math.round(satiationIncrease);
    (myFurball.satiation < 0)?
        myFurball.satiation = satiationIncrease :
        myFurball.satiation += satiationIncrease;
    
    player.food -= satiationIncrease;    
    if (myFurball.satiation > 100) myFurball.satiation = 100;

    /*
    let r = Math.floor(Math.random()*5),
    saysFeed =
        (!satiationIncrease)?
            furbalStates.secureness.noEat :  // BAUSTELLE! bestimmten Kommentaren müssen Prioritäten zugewiesen werden.
            (myFurball.satiation >= 95)?
                furbalStates.toFeeding[95] :
                (myFurball.satiation >= 90)?
                    furbalStates.toFeeding[90] :
                    (myFurball.satiation >= 80)?
                        furbalStates.toFeeding[80] :
                        (!saysFeed)? (
                            console.log("Check"),
                            furbalStates.toFeeding[r] ) :
                            saysFeed;
    // doesn't work as intended :/
    */

    if (!satiationIncrease) {
        saysFeed = furbalStates.secureness.noEat;
    } else if (myFurball.satiation >= 95) {
        saysFeed = furbalStates.toFeeding[95];
    } else if (myFurball.satiation >= 90) {
        saysFeed = furbalStates.toFeeding[90];
    } else if (myFurball.satiation >= 85) {
        saysFeed = furbalStates.toFeeding[85];
    } else if (!saysFeed) {
        let r = Math.floor(Math.random()*5);
        saysFeed = furbalStates.toFeeding[r+1];
    }

}


const play = () => {
    let funIncrease = ( (-(playPowerMax-playPowerMin)/100 *myFurball.fun) + playPowerMax ) * (myFurball.secureness/100 -secToFunThreshold);   // the less secureness, the less myFurball will play.
    
    if (player.toy > 0 && player.toy < funIncrease) {
        funIncrease = player.toy;
    
    } else if (!player.toy) {
        funIncrease = 0;
    }

    funIncrease = Math.round(funIncrease);
    (myFurball.fun < 0)?
        myFurball.fun = funIncrease :
        myFurball.fun += funIncrease;
    
    if (funIncrease < 0) funIncrease *= -1;
    player.toy -= funIncrease;
    if (myFurball.fun > 100) myFurball.fun = 100;
    if (funIncrease <= 0) {
        saysPlay = furbalStates.secureness.noPlay;         // BAUSTELLE! bestimmten Kommentaren müssen Prioritäten zugewiesen werden.
    }
    myFurball.satiation -= playToSat * funIncrease; // PLAYING MAKES FURBALL HUNGRY!
}


const pet = () => {
    //let securenessIncrease = (-(petPowerMax-petPowerMin)/100*myFurball.secureness) + petPowerMax; // the less secureness, the more increase.
    let securenessIncrease = ((petPowerMax-petPowerMin)/100 *myFurball.secureness) + petPowerMin; // the less secureness, the less increase. LOST CONFIDENCE!
    
    (myFurball.secureness < 0)?
        myFurball.secureness = securenessIncrease :
        myFurball.secureness += securenessIncrease;
    if (myFurball.secureness > 100) myFurball.secureness = 100;
}


function update(progress) {

    

    // natural decrease and increase:

    myFurball.satiation -= naturalDecreaseOfSatiation * gameSpeed;                                                      // + character trait
    myFurball.fun -= (naturalDecreaseOfFun + -healthToFun/100*myFurball.health + healthToFun) * gameSpeed;              // + character trait
    myFurball.secureness -= (naturalDecreaseOfSecureness + -healthToSec/100*myFurball.health + healthToSec) * gameSpeed;// + character trait
    
    // Newtons Law of Cooling: u'(t) = -k(u(t)-a)
    healthUpdate = -satiationPower*(myFurball.health-myFurball.satiation)-funPower*(myFurball.health-myFurball.fun)-securenessPower*(myFurball.health-myFurball.secureness);
    //myFurball.health -= 0.01 * gameSpeed;// Test only, DELETE!!!!
    myFurball.health += healthUpdate * gameSpeed;

    if (myFurball.health >= 100) myFurball.health = 100;
    if (myFurball.health <= 0) myFurball.isDead = true;

    /*
    Check all conditions to trigger Furbals statements here.
    this function returns 1 phrase for html object "#furball-says".
    */

    if (saysFeed) {
        timeElapsedTemp += progress;
        furballSaying = saysFeed;
        if (timeElapsedTemp >= cooldown) {
            saysFeed = false;
            timeElapsedTemp = 0;
        }
    } else { furballSaying = ""; }

    /*
    switch(Math.round(myFurball.satiation)) {
        case 10:
            saysSatiation = furbalStates.satiation[10];
            break;
        case 20:
            saysSatiation = furbalStates.satiation[20];
            break;
        case 30:
            saysSatiation = furbalStates.satiation[30];
            break;
        case 40:
            saysSatiation = furbalStates.satiation[40];
            break;
        case 50:
            saysSatiation = furbalStates.satiation[50];
            break;
        case 60:
            saysSatiation = furbalStates.satiation[60];
            break;
        case 75:
            saysSatiation = furbalStates.satiation[75];
            break;
    }
    furballSaying = saysSatiation;
    */

    //if (v_timeElapsed >= 8000) { myFurball.isDead = true } // Control values after a certain time. Delete later.
    //if (myFurball.satiation <= 0) myFurball.isDead = true;  // time check. Delete later!
 };


function draw() {

    timeElapsed.innerHTML = "Time Elapsed: " + Math.round(v_timeElapsed) + "ms";
    loopSpeed.innerHTML = "Loop Speed: " + Math.round(progress) + "ms/loop";
    gSpeed.innerHTML = "Game Speed: " + gameSpeed;

    health.children[0].style.width = myFurball.health + "%";
    health.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.health-1)]; // Achtung, Index -1 gibt es nicht.

    // for controlling. Delete later:
    //health.children[0].innerHTML = myFurball.health;
    //satiation.children[0].innerHTML = myFurball.satiation;
    //secureness.children[0].innerHTML = myFurball.secureness;

    furballStatement.innerHTML = furballSaying;

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
    ++counter;
    progress = timestamp - lastRender;
    v_timeElapsed += progress;

    update(progress);
    draw();

    lastRender = timestamp;
    (myFurball.isDead)? gameOver() : reqAnimF = requestAnimationFrame(loop);

}

// Event listener:
pauseButton.addEventListener("click", switchPause);
feedBtn.addEventListener("click", feed);
playBtn.addEventListener("click", play);
petBtn.addEventListener("click", pet);


furballName.innerHTML = myFurball.name;
v_timeElapsed = 0;

reqAnimF = requestAnimationFrame(loop);