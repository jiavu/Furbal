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
const gameSpeed = 1.7;
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
let interval = 1;           // not important anymore. Maybe delete interval check.
let pause = false;

// Balancing powers of decrease/increase:
let healthUpdate;
const naturalDecreaseOfSatiation = 0.015;
// 0.015, gameSpeed = 1, satiation empty after 111532ms (1.859 min; 1:51:532min)
// 0.015, gameSpeed = 0.01, satiation empty after ...
const satiationPower = 0.0015;               // = influence to health
const naturalDecreaseOfFun = 0.0078;
const funPower = 0.0004;                    // = influence to health
const naturalDecreaseOfSecureness = 0.013;
const securenessPower = 0.0003;             // = influence to health

const foodPowerMax = 10;    // if Furbals satiation is 0, Furbal will eat maximum.
const foodPowerMin = 1;     // if Furbals satiation is 100, Furbal will eat minimum.
const playPowerMax = 10;
const playPowerMin = 1;
const petPowerMax = 4;
const petPowerMin = 1;


const playToSat = 0.3;           // example: playToSat = 0.1; 10 toy consumed via play() will decrease satiation by 1. (PLAYING MAKES IT HUNGRY!)
const healthToFun = 0.01;      // the less health, the higher fun decrease. Use: -(healthToFun/100)*health + healthToFun
const healthToSec = 0.0115;     // the less health, the higher secureness decrease.

// Later: Character traits will influence the amounts of all power variables.

//////////////////////////////////////////////////

// Furball:
const myFurball = {
    name : null,
    isDead : false,
    health : 1,
    satiation : 100,
    fun : 100,
    secureness : 100
}

// Player:
const player = {
    name : null,
    points : 0,
    credits : 0,
    food : 5000,
    toy : 5000,
    specialItems : null
}

//////////////////////////////////////////////////
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
    let satiationIncrease = (-(foodPowerMax-foodPowerMin)/100*myFurball.satiation) + foodPowerMax;
    //if (0 < player.food < satiationIncrease) {    // SHOULD BE THE SAME OR NOT? It has a weird behavior. If satiationIncrease > 1 but player.food is still > satiationIncrease, condition is true for some reason.
    if (player.food > 0 && player.food < satiationIncrease) {
        //window.alert(`player.food: ${player.food} | satiationIncrease: ${satiationIncrease}`);        // only a check, delete later
        satiationIncrease = player.food;
        
    } else if (!player.food) {
        satiationIncrease = 0;
    }

    satiationIncrease = Math.round(satiationIncrease);
    player.food -= satiationIncrease;
    (myFurball.satiation < 0)?
        myFurball.satiation = satiationIncrease :
        myFurball.satiation += satiationIncrease;
    
    if (myFurball.satiation > 100) myFurball.satiation = 100;
}


const play = () => {
    let funIncrease = (-(playPowerMax-playPowerMin)/100*myFurball.fun) + playPowerMax;
    if (player.toy > 0 && player.toy < funIncrease) {
        funIncrease = player.toy;
    
    } else if (!player.toy) {
        funIncrease = 0;
    }

    funIncrease = Math.round(funIncrease);
    player.toy -= funIncrease;
    (myFurball.fun < 0)?
        myFurball.fun = funIncrease :
        myFurball.fun += funIncrease;
    if (myFurball.fun > 100) myFurball.fun = 100;

    myFurball.satiation -= playToSat * funIncrease; // PLAYING MAKES FURBALL HUNGRY!
}


const pet = () => {
    let securenessIncrease = (-(petPowerMax-petPowerMin)/100*myFurball.secureness) + petPowerMax;
    (myFurball.secureness < 0)?
        myFurball.secureness = securenessIncrease :
        myFurball.secureness += securenessIncrease;
    if (myFurball.secureness > 100) myFurball.secureness = 100;
}


function update(progress) {
    ++counter;

    // natural decrease and increase

    if (counter == interval) {
        counter = 0;

        myFurball.satiation -= naturalDecreaseOfSatiation * gameSpeed;                                                      // + character trait
        myFurball.fun -= (naturalDecreaseOfFun + -healthToFun/100*myFurball.health + healthToFun) * gameSpeed;              // + character trait
        myFurball.secureness -= (naturalDecreaseOfSecureness + -healthToSec/100*myFurball.health + healthToSec) * gameSpeed;// + character trait
      
        // Newtons Law of Cooling: u'(t) = -k(u(t)-a)
        healthUpdate = -satiationPower*(myFurball.health-myFurball.satiation)-funPower*(myFurball.health-myFurball.fun)-securenessPower*(myFurball.health-myFurball.secureness);
        //myFurball.health -= 0.01 * gameSpeed;// Test only, DELETE!!!!
        myFurball.health += healthUpdate * gameSpeed;

    }
    if (myFurball.health >= 100) myFurball.health = 100;
    if (myFurball.health <= 0) myFurball.isDead = true;
    //if (v_timeElapsed >= 8000) { myFurball.isDead = true } // Control values after a certain time. Delete later.
    //if (myFurball.satiation <= 0) myFurball.isDead = true;  // time check. Delete later!
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