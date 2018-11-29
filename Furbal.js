"use strict";

let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || windows.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let reqAnimF;

/* I'll make it a progressive web app later! */
// Fullscreen mode / progressive web app: https://developers.google.com/web/fundamentals/native-hardware/fullscreen/

function toggleFullScreen() {   // supported by Safari?
    let doc = window.document;
    let docEl = doc.documentElement;    // returns the root element of the document (<html>)
    let requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
    let cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
    if (!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
        requestFullScreen.call(docEl);
    } else { cancelFullScreen.call(doc)};
}


function displayEverything() {

    jQuery(function($) {

        if ( window.screen.height / $("#adjust-height").height() > 1.17 ) {
            $(".show-in-fullscreen").each(function() {
                $(this).hide();
            });
            $(".hide-in-fullscreen").each(function() {
                $(this).show();
            });
        
        } else {
            $(".show-in-fullscreen").each(function() {
                $(this).show();
            });
            $(".hide-in-fullscreen").each(function() {
                $(this).css("display", "none");
                $(this).hide();
            });
        }
        
    });
}

/*
MODULES:
colorMaps, infoText, furbalStates
*/

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
const other0 = document.getElementById("other0");
const other1 = document.getElementById("other1");
const other2 = document.getElementById("other2");
const other3 = document.getElementById("other3");

const sizeHeight = document.getElementById("size-height");
const showHeight = document.getElementById("show-height");
const adjustHeight = document.getElementById("adjust-height");
const containerHeight = document.getElementById("container-height");
const containerWidth = document.getElementById("container-width");

const loadingScreen = document.getElementById("loading-screen");

// Game elements:
const healthHeading = document.getElementsByClassName("health")[0];
const fitness = document.getElementById("fitness");
const health = document.getElementById("health");
const satiation = document.getElementById("satiation");
const fun = document.getElementById("fun");
const secureness = document.getElementById("secureness");

const mOverFurball = document.getElementById("m-over-furball");

const furballStatement = document.getElementById("furball-says");
const furballName = document.getElementById("furball-name");

const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
const petBtn = document.getElementById("petBtn");

const userName = document.getElementById("user-name");
const points = document.getElementById("points");
const credits = document.getElementById("credits");
const food = document.getElementById("food");
const toy = document.getElementById("toy");
const specialItems = document.getElementById("special-items");

const winASpecial = document.getElementById("win-a-special");
const waSBoxText = document.getElementById("waS-box-text");
const buyTicket = document.getElementById("buy-ticket");
const clover = document.getElementById("clover");

const infoWindow = document.getElementById("info-window");
const gameField = document.getElementById("game-field");

const goToSettings = document.getElementById("go-to-settings");
const toggleFScreen = document.getElementById("toggle-fScreen");


//////////////////////////////////////////////////
//////////////////////////////////////////////////

const myFurball = { name: "My Furball" };
const player = { name: "Player" };
// keys will be set in initialization / when reading cookies.


//////////////////////////////////////////////////
//////////////////////////////////////////////////

// Gameloop parameter:
const gameSpeed = 1;

let lastRender;
let progress;
let v_timeElapsed;          // COOKIE !!! UPDATE by Cookie-Import or reset to zero.
let counter;    // Counts the number of loops made since game was started.
let pause = true;
let pauseTime;
let timeoutCredits;


// Balancing powers of decrease/increase:
let healthUpdate;
const naturalDecreaseOfSatiation = 0.015;
const satiationPower = 0.0015;               // = influence to health
const naturalDecreaseOfFun = 0.009;
const funPower = 0.001;                    // = influence to health
const naturalDecreaseOfSecureness = 0.013;
const securenessPower = 0.0006;             // = influence to health

const criticalSat = 40;                 // if satiation is critical or lower, influence to health will rise.
const criticalFun = 30;
const criticalSec = 30;

const satToFitness = 0.002;                 // if conditions are beneath critical value, fitness will decrease!
const funToFitness = 0.0016;
const secToFitness = 0.0015;

const playToSat = 0.3;           // Example: playToSat = 0.1; 10 toy consumed via play() will decrease satiation by 1. (PLAYING MAKES IT HUNGRY!)
const healthToFun = 0.01;      // the less health, the higher fun decrease. Use: -(healthToFun/100)*health + healthToFun
const healthToSec = 0.0110;     // the less health, the higher secureness decrease.

const secToFunThreshold = 0.12;   // in %. If security is 25% (or less), Furball won't play (and even lose fun by playing!).

// positive integers only! {
const foodPowerMax = 10;    // if Furbals satiation is 0, Furbal will eat maximum (1 portion).
const foodPowerMin = 1;     // if Furbals satiation is 100, Furbal will eat minimum (1 bite).
const toyPowerMax = 10;
const toyPowerMin = 1;
const petPowerMax = 2;
const petPowerMin = 1;
// } positive integers only!

const foodPrice = 1;
const toyPrice = 1.2;
const ticketPrice = 20;
const winMoney = 100;
const creditsInterval = 20000/gameSpeed     // this two variables
const pointsInterval = 5000/gameSpeed;      // will be changed dynamically later.
let timeoutGainPntsHealth = pointsInterval;
let timeoutGainPntsSat = pointsInterval;
let timeoutGainPntsFun = pointsInterval;
let timeoutGainPntsSec = pointsInterval;

// Power of special items:
const carrotPower = 40;
const lemonPower = 40;
const strawberryPower = 40;


// Later: Character traits (stats) will influence the amounts of all power variables.

//////////////////////////////////////////////////

/*
Regarding: importing modules from file://
The file:// protocol does not work with CORS - only a certain set of them work, such as http://, among others.
-> Set a http server on your local system and use http to your localhost to serve the files.
    python -m http.server 8080 --bind 127.0.0.1 //python3
or Bypass CORS by disabling web-security. */

//If all files are saved to and accessed via request to server I can use:
//import furbalStates from "./furbal_says.js";
//Otherwise paste object here and don't forget to remove type="module":
const infoText = {intro:{0:"<div class='alignCenter pulse'><h1 id='enter-game'>Furball</h1>",1:"<p>Once there was a Furball.</p>",2:"<p>A Furball is a small pet with big button eyes and a thick and furry fur living in a website.</p>",3:"<p>You have to feed your Furball.<br>If you forget to feed it, it will die.</p>",4:"<p>Play with your Furball.<br>If you forget to play with your Furball, it is going to die of boredom.<br><br>Pay attention: Playing makes your Furball hungry!</p>",5:"<p>You also have to pet your pet.<br>If you don't give it your affection, it will be lonely and is going to lose it's joy for living.</p>",6:"<p>Pay attention to Furball's level of secureness.<br>If your Furball is lonely, it won't eat and play anymore.</p>",7:"<p>If your Furball is sad or ill, it will lose it's color.<br>Critical levels of Furballs conditions will weaken it.<br><br>Be aware - Furbals fitness won't recover!</p>",8:"<p>So... what was your name again?</p>",9:", right!<br><br></p>",10:", which name do you want to give your Furball?</p>",11:", what a beautiful name!!!<br><br>Let me ask you one last question, ",skipIntro:"<div id='skip-intro'>Skip Intro &gt;&gt;</div>",next:"<br><div id='next-page'>&gt;&gt;</div>",player:"<input type='text' placeholder='Player' maxlength='26' id='enter-player-name'>",furbal:"<input type='text' placeholder='My Furball' maxlength='26' id='enter-furbal-name'>"},startWindow:{go:"<div class='alignCenter'><h1>Furball</h1><h3>Are you ready for it?</h3><button type='button' id='go'>YES!</button></div>"},finishScreen:{gameOverT1:"<div class='alignCenter'><h2>Game Over</h2><p>"/*insert gameOverInfo*/,gameOverT2:"</p><button type='button' id='again'>GIMME A NEW FURBALL!</button></div>"},settingsScreen:"<div class='alignCenter'><h2>Options</h2><p><button class='smaller-button' id='restart-game'>Restart game</button></p><p><a href='https://goo.gl/forms/ktww9CI6E7xlP4vj1' target='_blank'>Give Feedback</a></p><button type='button' id='continue'>Continue</button></div>"};

const furbalStates = {toFeeding:{95:"Salad. Not again.",90:"I'm so full.",85:"I am good, thanks.",1:"Can I have a dessert?",2:"Tastes good, thanks.",3:"Is it food or...",4:"Yummy!",5:"* munch crunch chomp *"},toPlaying:{95:"I don't want to play anymore. You can have it.",90:"Yeay. Toys. :/",85:"I already had a lot of them.",1:"It's my dolly! Play with your own one!",2:"Oh, toys!",3:"Yippee!",4:"Catch me! Haha, catch me!!!"},toPetting:{95:"Leave me some space, okay?",85:"Come on, you're squeezing me.",1:"Huuug!",2:"I love you mama!",3:"You are the sunshine of my live.",4:"It's so good to have you.",5:"Rrrrrrrr!"},health:{90:"Oh, happy day!",50:"Could be better.",40:"I am not feeling so well.",30:"Why do you let me die?",20:"I declare that this is my last will and testament.",10:"I am feeling so cold.",5:"I think it's over.",0:"I'm dead."},satiation:{75:"I could maybe eat something.",60:"I want candy, now!",50:"Can I have cookie?",40:"I am so hungry.",30:"Can I eat stones?",20:"I am starving...",10:"My stomache hurts.",},fun:{90:"Live is fun!",75:"Let's play something!",50:"Boring!!!",40:"* YAWN *",30:"* snooze *",20:"Deadly boring."},secureness:{85:"It's so good to have you.",60:"Where are you?",50:"I am so lonley.",40:"I am afraid all alone!",noPlay:"I am so alone and sad. I don't want to play.",noEat:"I am so alone and sad. I don't want to eat."}};

let furballSaying;
let saysFeed;       // for statement cooldowns so statements won't be displayed for ever.
let saysPlay;
let saysPet;
let saysHealth;
let saysSatiation;
let saysFun;
let saysSecureness;

const cooldownStatement = 2000;      // Cooldown for Furball's statements. Update statement only after cooldown time.
let timeElapsedTemp;

let secCritical;        // prioritize Furball's statments (warningSystem).
let prioAction;


// For displaying elements and jQuery animations:

let satShown;            // so conditions won't be displayed for ever.
let funShown;
let secShown;
const cooldownCond = 4500;
let countSatShown;
let countFunShown;
let countSecShown;

const fadeInTime = 0.2;         //jQuery reads ms, gsap reads s.
const fadeOutTime = 0.8;
const fadeEasing = "linear";    // default: "swing"     //probably unused after replacing jQuery fades with gsap.

let clickOnFurbal = false;


// Animation:

function letJump(element) {
    TweenMax.to(element, 0.2, {
        /* fontSize: "130%", */
        scaleX: 1.04,
        scaleY:1.04,
        //transformOrigin: "35% 50%",
        ease: Power2.easeInOut,
        onComplete: ()=>
            TweenMax.to(element, 0.2, {
                /* fontSize: "100%", */
                scaleX: 1,
                scaleY: 1,
                //transformOrigin: "35% 50%",
                ease: Power2.easeInOut,
            })
        });
}

function letJump2(element) {
    TweenMax.to(element, 0.2, {
        scaleX: 1.4,
        scaleY:1.4,
        ease: Power2.easeInOut,
        onComplete: ()=>
            TweenMax.to(element, 0.2, {
                scaleX: 1,
                scaleY: 1,
                ease: Power2.easeInOut,
            })
        });
}


function letShrink (element) {
    TweenMax.to(element, 0.2, {
        /* fontSize: "80%", */
        scaleX: 0.7,
        scaleY: 0.7,
        ease: Power2.easeInOut,
        onComplete: ()=>
            TweenMax.to(element, 0.2, {
                /* fontSize: "100%", */
                scaleX: 1,
                scaleY: 1,
                ease: Power2.easeInOut
            })
        });
}

function letShrink2 (element) {
    TweenMax.to(element, 0.2, {
        scaleX: 0.97,
        scaleY: 0.97,
        ease: Power2.easeInOut,
        onComplete: ()=>
            TweenMax.to(element, 0.2, {
                /* fontSize: "100%", */
                scaleX: 1,
                scaleY: 1,
                ease: Power2.easeInOut
            })
        });
}

const greyout = {
    add(element) { element.addClass("greyscaled"); },

    remove(element ) { element.removeClass("greyscaled"); }
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

function startWindow() {

    function intro() {
        switch (introPage) {
            case 0:                             // still loading screen
                loadingScreen.innerHTML = infoText.intro[0];
                $("#enter-game").click( ()=> {
                    introPage++;
                    intro();
                });
                break;
            case 1:                             // once there was a Furball.
                loadingScreen.style.display = "none";
                $("#info-window").fadeIn(1500).html(
                    "<div>" +
                    infoText.intro[1] +
                    "</div><div class='alignCenter'>" +
                    infoText.intro.next +
                    infoText.intro.skipIntro +
                    "</div>");
                $("#skip-intro").click( ()=> { newGame(); });
                $("#next-page").click( ()=> {
                    introPage++;
                    intro();
                });
                break;
            case 2:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[2] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 3:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[3] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 4:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[4] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 5:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[5] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 6:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[6] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 7:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[7] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 8:                             // insert player's name
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div class='alignCenter'>" +
                        infoText.intro[8] +
                        infoText.intro.player +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 9:                             // insert Furball's name
                if ( $('#enter-player-name').prop("value") )
                    player.name = $('#enter-player-name').prop("value").trim(); // seems that trim() isn't necessary

                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div class='alignCenter'>" +
                        "<p>" + player.name +
                        infoText.intro[9] +
                        "<p>" + player.name +
                        infoText.intro[10] +
                        infoText.intro.furbal +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 10:                            // last question...
                if ($('#enter-furbal-name').prop("value") )
                    myFurball.name = $('#enter-furbal-name').prop("value").trim(); // seems that trim() isn't necessary

                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        "<p>" + myFurball.name +
                        infoText.intro[11] +
                        player.name + "...</p>" +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        introPage++;
                        intro();
                    });
                }).fadeIn(1000);
                break;
            case 11:
                $("#info-window").fadeOut(500, ()=> {
                    newGame();
                });
        }
    }
    
    let introPage = 0;

    window.addEventListener("load", function() {
        $("#game-field").hide();
        displayEverything();
        intro();
    })
}

function newGame() {

    console.log("v_timeElapsed in newGame(): " + v_timeElapsed);

    //myFurball.name = "My Furball";   // Let user insert a name in startWindow()...
    myFurball.isDead = false;
    myFurball.health = 41;          // should be >20. Should also not fire statements directly after starting game.
    myFurball.fitness = 100;
    myFurball.satiation = 50;       // should be 50
    myFurball.fun = 90;             // should be <91
    myFurball.secureness = 90;      // should be <91

    //player.name = "Player";    // let user insert a name in startWindow()...
    player.gameInProgress = true;
    player.points = 0;
    player.credits = 0;
    player.food = 50;
    player.toy = 50;
    player.specialItems = {
        "carrot": 1,
        "lemon": 1,
        "strawberry": 1
    };

    // last page of start window, confirm to start game, close start window.
    $("#info-window").fadeIn(1500).html(infoText.startWindow.go);
    $(function() {
        $("#go").click(function() {
            $("#go").prop("disabled", true).html("Let's go!");
            $("#info-window").fadeOut(1500, gameInit);
        });
    });
}

function gameInit() {
    // Load cookies here...
    // If no cookies, "I couldn't find your progress. Did you delete the browser cookies?"
    // (and go to newGame).

    // RESETTING VARIABLES:

    v_timeElapsed = 0;                      // COOKIE   // THIS WOULD BE A RESET !!!
    console.log("v_timeElapsed in gameInit(): " + v_timeElapsed);
    
    lastRender = 0;
    progress = 0;
    counter = 0;
    pauseTime = undefined;
    timeoutCredits = 0;

    furballSaying = "";
    saysFeed = false;       // for statement cooldowns so statements won't be displayed for ever.
    saysPlay = false;
    saysPet = false;
    saysHealth = false;
    saysSatiation = false;
    saysFun = false;
    saysSecureness = false;
    timeElapsedTemp = 0;

    secCritical = false;
    prioAction = false;

    satShown = true;
    funShown = true;
    secShown = true;
    countSatShown = 0;
    countFunShown = 0;
    countSecShown = 0;

    furballName.innerHTML = myFurball.name;
    userName.innerHTML = player.name;
    slotMachine.reset();    // is also checking credits for buy-ticket.
    buyFood.check();
    buyToy.check();
    specialItem.check("strawberry");
    specialItem.check("lemon");
    specialItem.check("carrot");

    $(function() {
        $("#name-in-health").text(myFurball.name);

        switchPause();
        
        $("#game-field").fadeIn(1500, function() {
            $(this).css("pointerEvents", "auto");
            TweenMax.set(goToSettings, {display:"inline-block"});
        });
    })
}

function gameOver() {
    furballStatement.innerHTML = furbalStates.health[0];    //"I'm dead.";

    const averageLoopSpeed = v_timeElapsed / counter;
    const hours = Math.floor(v_timeElapsed/3600000);
    const minutes = Math.floor(v_timeElapsed/60000 %60);
    const secondsMs = Math.round(v_timeElapsed)/1000 %60;
    const seconds = Math.floor(secondsMs);
    
    let gameOverInfo = myFurball.name + " survived ";
    if (hours) gameOverInfo += hours + " hours, ";
    if (minutes) gameOverInfo += minutes + " minutes and ";
    gameOverInfo += seconds + " seconds.";

    let gameOverHTML = infoText.finishScreen.gameOverT1
                        + gameOverInfo
                        + infoText.finishScreen.gameOverT2;

    TweenMax.set(gameField, {pointerEvents:"none"});
    TweenMax.set(goToSettings, {display:"none"});
    
    pause = true;

    $(function(){
        $("#satiation,#fun,#secureness").removeClass("flash").fadeIn(200,
            window.setTimeout(function() {
                $("#game-field").fadeOut(1500, ()=> {
                    $("#info-window").fadeIn(1500)
                    .html(gameOverHTML);
                    $("#again").click(newGame);
                });
        }, 1500)
        );
    });

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

}

function switchPause() {

    console.log("v_timeElapsed in switchPause(): " + v_timeElapsed);

    pause = !pause;
    pause? TweenMax.set(gameField, {pointerEvents:"none", opacity: 0.4} )
           : TweenMax.set(gameField, {pointerEvents:"auto", opacity: 1} );

    (pause)? console.log("=========PAUSE=========") : reqAnimF = requestAnimationFrame(loop);
// When continuing game after pause: seems to entail longer looptimes sometimes. But it doesn't occur every time.
}

function settings() {
    if (myFurball.isDead) { gameOver() }
    else {
        switchPause();

        $(function() {
            $("#info-window").html(infoText.settingsScreen);
            $("#restart-game").click(newGame);
            $("#continue").click(settings);
        })

        // pause? $(function() {$("#info-window").show()}) : $(function() {$("#info-window").hide()});
        pause? TweenMax.set(infoWindow, {display: "inline-block"} )
               : TweenMax.set(infoWindow, { display: "none"} );
    }
}

//////////////////////////////////////////////////

// ACTIONS: feed, play, pet // buying things // gambling:

function feed() {
    let satiationIncrease;

    (myFurball.secureness < 0)?
        satiationIncrease = 0 :
        //satiationIncrease = ( (-(foodPowerMax-foodPowerMin)/100 *myFurball.satiation) + foodPowerMax ) * myFurball.secureness/100;
        satiationIncrease = ( (-(foodPowerMax-foodPowerMin)/myFurball.fitness *myFurball.satiation) + foodPowerMax ) * myFurball.secureness/100;
        // the less secureness, the less myFurball will eat.


    /* If player doesn't have enough food for 1 food portion, Furball gets what player has.
        If player has no food, Furball gets no food. */
    if (player.food > 0 && player.food < satiationIncrease) {
        satiationIncrease = player.food;
    } else if (!player.food) { satiationIncrease = 0 };


    // That's how food will increase Furballs satiation:
    satiationIncrease = Math.round(satiationIncrease);
    (myFurball.satiation < 0 && myFurball.secureness/100 > 0)?
        myFurball.satiation = satiationIncrease :
        myFurball.satiation += satiationIncrease;


    // Reset color:
    furballStatement.style.color = "var(--black)";
    if (myFurball.satiation > criticalSat) satiation.style.color = "var(--black)";


    // Get Furballs statements about food and warn if necessary:
    if (player.food) {

        // reset prio:
        secCritical = false;
        prioAction = true;

        if (!satiationIncrease) {       // Because secureness is critical, no satiationIncrease.
            secCritical = true;
            saysFeed = furbalStates.secureness.noEat;
            furballStatement.style.color = "var(--red)";
            //countSecShown = 0;
            //secShown = true;                                    // ..v
            //secureness.style.color = "var(--red)";              // not really necessary. secureness should already be red and flashing in this range.
            //$( () => $("#secureness").fadeIn(fadeInTime) );     // But, secCritical could maybe be higher than critical threshold of secureness,
                                                                //depending on result of satiationIncrease.
        } else if (myFurball.satiation >= 95) {
            saysFeed = furbalStates.toFeeding[95];
        } else if (myFurball.satiation >= 90) {
            saysFeed = furbalStates.toFeeding[90];
        } else if (myFurball.satiation >= 85) {
            saysFeed = furbalStates.toFeeding[85];
        } else if (!saysFeed) {
            timeElapsedTemp = 0;
            let r = Math.floor(Math.random()*5);
            saysPlay = false;
            saysPet = false;
            saysFeed = furbalStates.toFeeding[r+1];
        }

        if (myFurball.health > 20) {
            furballSaying = saysFeed;
        } else if (secCritical) { furballSaying = saysFeed }
        

        // Fade in html element (Furballs satiation):

        countSatShown = 0;
        satShown = true;

        // Animation:
        if (satiationIncrease) TweenMax.to(satiation, fadeInTime, {opacity:1});

        if (satiationIncrease > 0) {
            letJump(satiation);
            letShrink(food);
        }
        
    }

    // Update players food box:
    player.food -= satiationIncrease;
    feedBtn.disabled = !player.food? true : false;

    //if (myFurball.satiation > myFurball.fitness) myFurball.satiation = myFurball.fitness;
    // i am sure it had to be moved to update().

}


function play() {

    //let funIncrease = ( (-(toyPowerMax-toyPowerMin)/100 *myFurball.fun) + toyPowerMax ) * (myFurball.secureness/100 -secToFunThreshold);   // the less secureness, the less myFurball will play.
    let funIncrease = ( (-(toyPowerMax-toyPowerMin)/myFurball.fitness *myFurball.fun) + toyPowerMax ) * (myFurball.secureness/100 -secToFunThreshold);
    
    /* If player doesn't have enough toy for 1 toy portion, Furball gets what player has.
        If player has no toys, Furball gets no toys. */
    if (player.toy > 0 && player.toy < funIncrease) {
        funIncrease = player.toy;
    } else if (!player.toy) { funIncrease = 0 };


    // That's how toys will increase Furballs fun:
    funIncrease = Math.round(funIncrease);
    (myFurball.fun < 0 && myFurball.secureness/100 -secToFunThreshold > 0)?
        myFurball.fun = funIncrease :
        myFurball.fun += funIncrease;

        
    // Reset:
    furballStatement.style.color = "var(--black)";
    if (myFurball.fun > criticalFun) fun.style.color = "var(--black)";


    // Get Furballs statements about toys and checking if a warning is necessary:
    if (player.toy) {

        // reset prio:
        secCritical = false;
        prioAction = true;

        if (funIncrease <= 0) {     // Because secureness is critical, no fun increase.
            secCritical = true;
            saysPlay = furbalStates.secureness.noPlay;
            furballStatement.style.color = "var(--red)";
            //countSecShown = 0;
            //secShown = true;                                    // ..v
            //secureness.style.color = "var(--red)";              // not really necessary. secureness
            //$( () => $("#secureness").fadeIn(fadeInTime) );     // should already be red and flashing.

        } else if (myFurball.fun >= 95) {
            saysPlay = furbalStates.toPlaying[95];
        } else if (myFurball.fun >= 90) {
            saysPlay = furbalStates.toPlaying[90];
        } else if (myFurball.fun >= 85) {
            saysPlay = furbalStates.toPlaying[85];
        } else if (!saysPlay) {
            timeElapsedTemp = 0;
            let r = Math.floor(Math.random()*4);
            saysFeed = false;
            saysPet = false;
            saysPlay = furbalStates.toPlaying[r+1];
        }

        if (myFurball.health > 20) {
            furballSaying = saysPlay;
        } else if (secCritical) { furballSaying = saysPlay }


        // Fade in html elements (Furballs conditions):
        
        countFunShown = 0;
        funShown = true;
        
        let a = funIncrease > 0? true : false;
        let b = funIncrease < 0? true : false;

        if (a) {
            myFurball.satiation -= playToSat * funIncrease; // PLAYING MAKES FURBALL HUNGRY!

            satiation.style.color = "var(--red)";
            letJump(fun);
            letShrink(toy);
            satShown = true;
            TweenMax.to(satiation, fadeInTime, {opacity:1});
            letShrink2(satiation);

        } else if (b) {
            fun.style.color = "var(--red)";

            funIncrease *= -1;
        }
        
        // Update players toy box:
        player.toy -= funIncrease;
        playBtn.disabled = !player.toy? true : false;

        if (funIncrease) TweenMax.to(fun, fadeInTime, {opacity:1});
    }
    
    //if (myFurball.fun > myFurball.fitness) myFurball.fun = myFurball.fitness;
    // i am sure it had to be moved to update().

}


function pet() {

    let securenessIncrease = ((petPowerMax-petPowerMin)/100 *myFurball.secureness) + petPowerMin; // the less secureness, the less increase. LOST CONFIDENCE!
    
    // That's how petting will increase Furballs secureness:
    (myFurball.secureness < 0)?
        myFurball.secureness = securenessIncrease :
        myFurball.secureness += securenessIncrease;
    //if (myFurball.secureness > myFurball.fitness) myFurball.secureness = myFurball.fitness;
    // i am sure it had to be moved to update().


    // Reset color:
    furballStatement.style.color = "var(--black)";
    if (myFurball.secureness > criticalSec) secureness.style.color = "var(--black)";


    // reset prio:
    secCritical = false;
    prioAction = true;


    // Get Furballs statements about petting:
    if (myFurball.secureness >= 95) {
        saysPet = furbalStates.toPetting[95];
    } else if (myFurball.secureness >= 85) {
        saysPet = furbalStates.toPetting[85];
    } else if (!saysPet) {
        timeElapsedTemp = 0;
        let r = Math.floor(Math.random()*5);
        saysPlay = false;
        saysFeed = false;
        saysPet = furbalStates.toPetting[r+1];
    }
    if (myFurball.health > 20) furballSaying = saysPet;


    // Fade in html element (Furballs secureness):

    countSecShown = 0;
    secShown = true;

    if (saysPet) {
        TweenMax.to(secureness, fadeInTime, {opacity:1});
        letJump(secureness);
    }
    
}

function petBySwipe() {

    let securenessIncrease = gameSpeed * ( ((petPowerMax-petPowerMin)/100 *myFurball.secureness) + petPowerMin )/20;
     // the less secureness, the less increase. LOST CONFIDENCE!
    
    // That's how petting will increase Furballs secureness:
    (myFurball.secureness < 0)?
        myFurball.secureness = securenessIncrease :
        myFurball.secureness += securenessIncrease;
    //if (myFurball.secureness > myFurball.fitness) myFurball.secureness = myFurball.fitness;
    // i am sure it had to be moved to update().


    // Reset color:
    furballStatement.style.color = "var(--black)";
    if (myFurball.secureness > criticalSec) secureness.style.color = "var(--black)";


    // reset prio:
    secCritical = false;
    prioAction = true;


    // Get Furballs statements about petting:
    if (myFurball.secureness >= 95) {
        saysPet = furbalStates.toPetting[95];
    } else if (myFurball.secureness >= 85) {
        saysPet = furbalStates.toPetting[85];
    } else if (!saysPet) {
        timeElapsedTemp = 0;
        let r = Math.floor(Math.random()*5);
        saysPlay = false;
        saysFeed = false;
        saysPet = furbalStates.toPetting[r+1];
    }
    if (myFurball.health > 20) furballSaying = saysPet;


    // Fade in html element (Furballs secureness):

    countSecShown = 0;
    secShown = true;

    if (saysPet) {
        TweenMax.to(secureness, fadeInTime, {opacity:1});
        //letJump(secureness);                              // would be nice if it could jump once and again.
    }
    
}

const buyFood = {
    // I need costs AND buyable food to be positive integers....

    buy() {
        const maxbuyableFood = foodPowerMax/(foodPrice*foodPowerMax)*Math.ceil(foodPrice*foodPowerMax);

        if (player.credits) {
            if (player.credits < Math.ceil(foodPrice*foodPowerMax)) {
                if (player.credits >= Math.ceil(foodPrice*foodPowerMin)) {
                    player.food += Math.ceil(Math.floor(player.credits - player.credits % foodPrice) / foodPrice);
                    player.credits -= Math.floor(player.credits - player.credits % foodPrice);
                }
            } else {
                player.food += Math.round(maxbuyableFood);
                player.credits -= Math.ceil(foodPrice*foodPowerMax);
            }

            letShrink(credits);
            letJump2(food);
        }

        buyFood.check(); // this.check() doesn't work?
        buyToy.check();
        slotMachine.check();
    },

    check() {
        feedBtn.disabled = !player.food? true : false;

        !( player.credits >= Math.ceil(foodPrice*foodPowerMin) )?
            jQuery(function($) { greyout.add($("#buy-food")); } ) :
            jQuery(function($) { greyout.remove($("#buy-food")); } );
    }
}


const buyToy = {

    buy() {
        const maxbuyableToy = toyPowerMax/(toyPrice*toyPowerMax)*Math.ceil(toyPrice*toyPowerMax);

        if (player.credits) {
            if (player.credits < Math.ceil(toyPrice*toyPowerMax)) {
                if (player.credits >= Math.ceil(toyPrice*toyPowerMin)) {
                    player.toy += Math.ceil(Math.floor(player.credits - player.credits % toyPrice) / toyPrice);
                    player.credits -= Math.floor(player.credits - player.credits % toyPrice);
                }
            } else {
                player.toy += Math.round(maxbuyableToy);
                player.credits -= Math.ceil(toyPrice*toyPowerMax);
            }
            letShrink(credits);
            letJump2(toy);
        }
        buyToy.check();
        buyFood.check();
        slotMachine.check();
    },
    
    check() {
        playBtn.disabled = !player.toy? true : false;

        !(player.credits >= Math.ceil(toyPrice*toyPowerMin) )?
            jQuery(function($) { greyout.add($("#buy-toy")) }) :
            jQuery(function($) { greyout.remove($("#buy-toy")) });
    }
}


const slotMachine = {

    prize : "nothing",

    reset() {
        waSBoxText.innerText = "Win Special";
        
        clover.style.display = "none";
        TweenMax.set("#win-a-special img", { display: "none" });
        TweenMax.set(buyTicket, {
            display: "inline",
            scale: 1
        });
        slotMachine.check();           // why does this.check() not work? error: "this.check is not a function"
    },

    pay() {
        buyTicket.style.pointerEvents = "none";
        TweenMax.to(buyTicket, 0.5, {
            transformOrigin: "left",
            scale: 0
        });

        player.credits -= ticketPrice;

        waSBoxText.innerText = "";
        clover.style.display = "inline";
    },
    
    play() {
        clover.style.display = "none";
        waSBoxText.innerText = "Good Luck!";
        TweenMax.set(waSBoxText, { rotationY:0 });
        TweenMax.set(winASpecial, { borderImageSource: "url(./icons/waS-border_Animation.gif)" });
        TweenMax.to(waSBoxText, 4/gameSpeed, {
            /* onStart: ()=> winASpecial.style.borderImageSource = "url(./icons/waS-border_Animation.gif)", */
            rotationY: 360,
            onComplete: slotMachine.prizeGenerator
        });
    },

    prizeGenerator() {
        winASpecial.style.borderImageSource = "url(./icons/waS-border1.gif)";

        let r = Math.floor(Math.random()*2);
        if (r) {
            let x = Math.floor(Math.random()*4);

            switch(x) {
                case 1:
                    this.prize = "carrot";
                    break;
                case 2:
                    this.prize = "lemon";
                    break;
                case 3:
                    this.prize = "strawberry";
                    break;
                default: this.prize = "credits";
            }

            console.log("won: " + this.prize);

            TweenMax.set("#won-"+this.prize, { display: "inline-block" });
            waSBoxText.innerText = "You win!";
            TweenMax.to(waSBoxText, 0.5/gameSpeed, {
                scale: 1.2,
                ease: Power4.easeInOut,
                repeat: 1,
                yoyo: true,
                onComplete: ()=> setTimeout( ()=> {

                    (this.prize == "credits")?
                    player.credits += winMoney : player.specialItems[this.prize]++;

                    specialItem.check(this.prize);
                    letJump2( "#" + this.prize ) ;
                    slotMachine.reset();
                }, 500/gameSpeed)
            });
        
        } else {
            this.prize = "nothing";
            waSBoxText.innerText = "You lose.";

            console.log("won: " + this.prize);

            TweenMax.to("#won-nothing", 0.2, { display: "inline-block" });
            setTimeout(slotMachine.reset, 1000/gameSpeed);
        }
    },

    check() {
        !(player.credits >= ticketPrice)?
        jQuery(function($) { greyout.add($("#buy-ticket")) }) :
        jQuery(function($) {
            greyout.remove($("#buy-ticket"));
            buyTicket.style.pointerEvents = "auto";
        });
    }
}


const specialItem = {

    give(item) {
        switch (item) {
            case "strawberry":
                player.specialItems.strawberry -= 1;

                myFurball.secureness = myFurball.secureness < 0?
                    strawberryPower
                :   myFurball.secureness + strawberryPower;

                //if (myFurball.secureness > myFurball.fitness) myFurball.secureness = myFurball.fitness;
                //moved to update()
                
                if (myFurball.secureness > criticalSec) secureness.style.color = "var(--black)";

                // fire a furball statement!
                
                TweenMax.to(secureness, fadeInTime, {opacity:1});
                letJump(secureness);
                secShown = true;
                break;

            case "lemon":
            player.specialItems.lemon -= 1;

                myFurball.fun = myFurball.fun < 0?
                    lemonPower
                :   myFurball.fun + lemonPower;

                //if (myFurball.fun > myFurball.fitness) myFurball.fun = myFurball.fitness;
                //moved to update()
                
                if (myFurball.fun > criticalFun) fun.style.color = "var(--black)";

                // fire a furball statement!

                TweenMax.to(fun, fadeInTime, {opacity:1});
                letJump(fun);
                funShown = true;
                break;

            case "carrot":
                player.specialItems.carrot -= 1;

                myFurball.satiation = myFurball.satiation < 0?
                    carrotPower
                :   myFurball.satiation + carrotPower;
                
                //if (myFurball.satiation > myFurball.fitness) myFurball.satiation = myFurball.fitness;
                //moved to update()
                
                if (myFurball.satiation > criticalSat) satiation.style.color = "var(--black)";

                // fire a furball statement!

                TweenMax.to(satiation, fadeInTime, {opacity:1});
                letJump(satiation);
                satShown = true;
                break;
        }

        specialItem.check(item);
    },

    check(item) {
        if (player.specialItems[item] <= 0) {
            jQuery(function($) {
                $("#"+item).addClass("hide");
            })
        } else {
            jQuery(function($) {
                $("#"+item).removeClass("hide");
                $("#"+item+">span").text(player.specialItems[item]); //-> should show number of items available.
            });
        }
    }
}


function incomeCredits() {
    timeoutCredits = 0;

    let avgLoopSp = v_timeElapsed / counter;
    let lostSatiation = Math.ceil(naturalDecreaseOfSatiation * creditsInterval / avgLoopSp);
    let lostFun = Math.ceil(naturalDecreaseOfFun * creditsInterval / avgLoopSp);
    
    // maybe calculate creditsInterval / avgLoopSp and make it fix?
    
    /* 
    console.log("Get credits for food now.");
    console.log("Lost fun (natural loss):");
    console.log(lostFun);
    console.log("should get credits for toy: ", lostFun * toyPrice);
    console.log("=========");
     */

    /*
    - calculate natural decreases per creditsInterval
        -> Math.ceil(naturalDecreaseOf... * creditsIntervall / averageLoopSpeed)

            (averageLoopSpeed = v_timeElapsed / counter;)

    - multiply by ressource costs (foodPrice, toyPrice)
    - add up results.
    - add some extra money for slotMachine ;)

    => that will be the basic income the player gets every time this function is called.

    Maybe the player gets additional money depening on his points.
    */
   player.credits += Math.round(lostSatiation*foodPrice + lostFun*toyPrice);
   player.credits += ticketPrice;

   letJump2(credits);

   buyFood.check();
   buyToy.check();
   slotMachine.check();


}


function incomePoints(progress) {

    if (myFurball.health >= 90) {
        if (!timeoutGainPntsHealth) {
            player.points += 200;
            letJump($("#health-container"));
            letJump2(credits);
        }
        if (timeoutGainPntsHealth >= pointsInterval) {
            timeoutGainPntsHealth = 0;
        } else { timeoutGainPntsHealth += progress; }
    } else { timeoutGainPntsHealth = 0; }


    if (myFurball.satiation >= 95 && myFurball.health < 90) {
        if (!timeoutGainPntsSat) player.points += 50;
        if (timeoutGainPntsSat >= pointsInterval) {
            timeoutGainPntsSat = 0;
        } else { timeoutGainPntsSat += progress; }
    } else { timeoutGainPntsSat = 0; }


    if (myFurball.fun >= 95 && myFurball.health < 90) {
        if (!timeoutGainPntsFun) player.points += 50;
        if (timeoutGainPntsFun >= pointsInterval) {
            timeoutGainPntsFun = 0;
        } else { timeoutGainPntsFun += progress; }
    } else { timeoutGainPntsFun = 0; }

    if (myFurball.secureness >= 95 && myFurball.health < 90) {
        if (!timeoutGainPntsSec) player.points += 50;
        if (timeoutGainPntsSec >= pointsInterval) {
            timeoutGainPntsSec = 0;
        } else { timeoutGainPntsSec += progress; }
    } else { timeoutGainPntsSec = 0; }


    /*
    - feeding, playing and petting should give some points.
    - v_timeElapsed (game progress) after 5 minutes, 10 minutes --> big extra points.
    */
}


//////////////////////////////////////////////////

function update(progress) {

    function warningSystem() {
        /*
        - Check all conditions here to update Furbals statements.
        - Check priorities of Furball-statemens and perhaps update FurbalSaying.
        - Check all conditions to fade in condition bars if critical.
        
        Priority for Furball-statements:
        Highest
            1. feed() or play() -> secureness too low,
            2. if health is critical,
            3. feed(), play() and pet() statements,
            4. if satiation, fun or secureness are critical,
            5. Arriving Thresholds of conditions while decreasing.
            6. Furball is healthy (> 90),
            7. Furball is happy (fun > 90),
        Lowest.

        Maybe set booleans (global) if a condition is true and check
        them here to decide if furbalSaying should be updated?

        */

        // Reset:
        healthHeading.style.color = "var(--black)";
        if (!secCritical && !prioAction) {
            furballStatement.style.color = "var(--black)";
        }

        ////    Health thresholds
        switch (Math.round(myFurball.health)) {
            case 50:
                saysHealth = furbalStates.health[50];
                break;
            case 40:
                saysHealth = furbalStates.health[40];
                break;
            case 30:
                saysHealth = furbalStates.health[30];
                break;
            default:                            //critical, priority 2:
                if (myFurball.health <= 20) {
                    healthHeading.style.color = "var(--red)";
                    if (myFurball.health <= 0) { saysHealth = furbalStates.health[0]; }
                    else if (myFurball.health <= 5) { saysHealth = furbalStates.health[5]; }
                    else if (myFurball.health <= 10) { saysHealth = furbalStates.health[10]; }
                    else if (myFurball.health <= 20) { saysHealth = furbalStates.health[20]; }
                }
                // Furball healthy, priority 6:
                else if (myFurball.health >= 90) {saysHealth = furbalStates.health[90];}
        }


        //// Satiation thresholds

        // Reset:
        if (myFurball.satiation > criticalSat) {
            //$(function() { $("#satiation").removeClass("flash"); });
            satiation.classList.remove("flash");
        }

        switch (Math.round(myFurball.satiation)) {
            case 75:
                saysSatiation = furbalStates.satiation[75];
                break;
            case 60:
                saysSatiation = furbalStates.satiation[60];
                break;
            case 50:
                saysSatiation = furbalStates.satiation[50];
                break;
            default:                                            // critical, priority 4:
                if (myFurball.satiation <= criticalSat) {
                    satiation.style.color = "var(--red)";
                    satShown = true;
                    countSatShown = 0;

                    TweenMax.to(satiation, fadeOutTime, {
                        ease: Power0.easeNone,
                        opacity: 1
                    });
                    
                    //$(function() { ($("#satiation").addClass("flash")); });
                    satiation.classList.add("flash");
                    
                    if (myFurball.satiation <= 10) { saysSatiation = furbalStates.satiation[10]; }
                    else if ( myFurball.satiation <= 20) { saysSatiation = furbalStates.satiation[20]; }
                    else if ( myFurball.satiation <= 30) { saysSatiation = furbalStates.satiation[30]; }
                    else if ( myFurball.satiation <= 40) { saysSatiation = furbalStates.satiation[40]; }
                }
                
        }

        //// Fun thresholds

        // Reset:
        if (myFurball.fun > criticalFun) {
            //$(function() { $("#fun").removeClass("flash"); });
            fun.classList.remove("flash");
        }

        switch (Math.round(myFurball.fun)) {
            case 75:
                saysFun = furbalStates.fun[75];
                break;
            case 50:
                saysFun = furbalStates.fun[50];
                break;
            case 40:
                saysFun = furbalStates.fun[40];
            default:                                            // critical, priority 4:
                if (myFurball.fun <= criticalFun) {
                    fun.style.color = "var(--red)";
                    funShown = true;
                    countFunShown = 0;

                    TweenMax.to(fun, fadeOutTime, {
                        ease: Power0.easeNone,
                        opacity: 1
                    });

                    //$(function() { $("#fun").addClass("flash"); });
                    fun.classList.add("flash");

                    if (myFurball.fun <= 20) { saysFun = furbalStates.fun[20]; }
                    else if (myFurball.fun <= 30) { saysFun = furbalStates.fun[30]; }
                }

                // Furball happy, priority 7:
                else if (myFurball.fun >= 90) { saysFun = furbalStates.fun[90]; }
        }


        //// Secureness thresholds
        
        // Reset:
        if (myFurball.secureness > criticalSec) {
            //$(function() { $("#secureness").removeClass("flash"); });
            secureness.classList.remove("flash");
        }

        switch (Math.round(myFurball.secureness)) {
            case 60:
                saysSecureness = furbalStates.secureness[60];
                break;
            case 50:
                saysSecureness = furbalStates.secureness[50];
                break;
            default:                                            // critical, priority 4:
                if (myFurball.secureness <= criticalSec) {
                    secureness.style.color = "var(--red)";
                    secShown = true;
                    countSecShown = 0;
                    
                    TweenMax.to(secureness, fadeOutTime, {
                        ease: Power0.easeNone,
                        opacity: 1
                    });

                    //$(function() { $("#secureness").addClass("flash"); });
                    secureness.classList.add("flash");

                    saysSecureness = furbalStates.secureness[40];
                }

                // Furball feels save, priority 8:
                else if (myFurball.secureness >= 85) { saysSecureness = furbalStates.secureness[85]; }
        }


        ////                              ////
        ////        PRIORITIZAZION        ////
        // Which statement to fire? Prio check:

        if (!secCritical) {
            if (myFurball.health <= 20) {                       // health critical
                furballSaying = saysHealth;
                timeElapsedTemp = 0;
                furballStatement.style.color = "var(--red)";
            } else if (!prioAction) {
                if (saysHealth && myFurball.health < 90 && healthUpdate <= 0) { furballSaying = saysHealth }
                
                else if (myFurball.satiation <= 40) {                // satiation critical
                    furballSaying = saysSatiation;
                    timeElapsedTemp = 0;
                    furballStatement.style.color = "var(--red)";
                } else if (myFurball.fun <= 30) {               // fun critical
                    furballSaying = saysFun;
                    timeElapsedTemp = 0;
                    furballStatement.style.color = "var(--red)";
                } else if (myFurball.secureness <=40) {         // secureness critical
                    furballSaying = saysSecureness;
                    timeElapsedTemp = 0;
                    furballStatement.style.color = "var(--red)";
                
                // Reaching thresholds of conditions:
                } else if (saysSatiation) { furballSaying = saysSatiation }
                else if (saysFun && myFurball.fun < 90) { furballSaying = saysFun }
                else if (saysSecureness && myFurball.secureness < 85) { furballSaying = saysSecureness }
                
                // Lowest priority: Furball is well:
                else if (myFurball.health >= 90) {
                    furballSaying = saysHealth;
                    timeElapsedTemp = 0;
                } else if (myFurball.fun >= 90) {
                    furballSaying = saysFun;
                    timeElapsedTemp = 0;
                } else if (myFurball.secureness >= 85) {
                    furballSaying = saysSecureness;
                    timeElapsedTemp = 0;
                } else { furballSaying = "" }
            }
        }
    }

    
    /////////////////////////////////////////////////////////
    /////////////////////////////////////////////////////////

    // get points
    incomePoints(progress);

    // get credits
    timeoutCredits >= creditsInterval?
        incomeCredits() :
        timeoutCredits += progress;

    // Natural decrease and increase of Furballs conditions:
    myFurball.satiation -= naturalDecreaseOfSatiation * gameSpeed;                                                      // + character trait
    myFurball.fun -= (naturalDecreaseOfFun + -healthToFun/100*myFurball.health + healthToFun) * gameSpeed;              // + character trait
    myFurball.secureness -= (naturalDecreaseOfSecureness + -healthToSec/100*myFurball.health + healthToSec) * gameSpeed;// + character trait

    /* Increase power to health if condition falls below critical threshold */
    let factor = (condition, critical) => {
        return condition <= critical?
            -(condition-critical)/25 + 1 : 1;
        
        // f(x) = -(x/100) + 1      // for x=-100 factor will be 2
        // f(x) = -(x/50) + 1       // for x=-100 factor will be 3
        // f(x) = -(x/33.33) + 1    // for x=-100 factor will be 4
        // f(x) = -(x/25) + 1       // for x=-100 factor will be 5
        // f(x) = -(x/20) + 1       // for x=-100 factor will be 6
        // f(x) = -(x/11.11) + 1    // for x=-100 factor will be 10
        // f(x) = -(x/10) + 1       // for x=-100 factor will be 11
    };
    // other0.innerHTML = "Other0: " + factor(myFurball.satiation, criticalSat);   // test monitor


    // Fitness update:
    let factor2 = (condition, critical) => {
        return condition <= critical?
            -(condition-critical)/10 + 1 : 0;
    };

    myFurball.fitness -= factor2(myFurball.satiation, criticalSat) * satToFitness
                        + factor2(myFurball.fun, criticalFun) * funToFitness
                        + factor2(myFurball.secureness, criticalSec) * secToFitness;


    /* Update Furballs health: Newtons Law of Cooling: u'(t) = -k(u(t)-a) */
    healthUpdate = -satiationPower *factor(myFurball.satiation, criticalSat) * (myFurball.health-myFurball.satiation)
                    -funPower *factor(myFurball.fun, criticalFun) * (myFurball.health-myFurball.fun)
                    -securenessPower *factor(myFurball.secureness, criticalSec) * (myFurball.health-myFurball.secureness);
    
    myFurball.health += healthUpdate * gameSpeed;

    if (myFurball.satiation > myFurball.fitness) myFurball.satiation = myFurball.fitness;
    if (myFurball.fun > myFurball.fitness) myFurball.fun = myFurball.fitness;
    if (myFurball.secureness > myFurball.fitness) myFurball.secureness = myFurball.fitness;

    if (myFurball.health >= myFurball.fitness) myFurball.health = myFurball.fitness;
    if (myFurball.health <= 0) myFurball.isDead = true;

    warningSystem();


    // Let a Furball's statement stay for a while until updating again:
    if (furballSaying) {
        timeElapsedTemp += progress;
        if (timeElapsedTemp >= cooldownStatement) {
            furballSaying = "";
            saysFeed = false; saysPlay = false; saysPet = false;
            saysHealth = "";
            saysSatiation = ""; saysFun = ""; saysSecureness = "";

            prioAction = false; secCritical = false;

            timeElapsedTemp = 0;
        }
    }

    //Test: DELETE / DEACTIVATE !!!
    //myFurball.satiation = 30;
    //myFurball.fun = 30;
    //myFurball.secureness = 30;
    //myFurball.health = 100;
    //if (v_timeElapsed >= 8000) { myFurball.isDead = true } // Control values after a certain time. Delete later.
    //if (myFurball.satiation <= 0) myFurball.isDead = true;  // time check. Delete later!
}


function draw() {

    // test-monitor: // DEACTIVATE WHEN FINISHED!
    timeElapsed.innerHTML = "Time elapsed: " + Math.round(v_timeElapsed) + "ms";
    loopSpeed.innerHTML = "Loop Speed: " + Math.round(progress) + "ms/loop";
    gSpeed.innerHTML = "Game Speed: " + gameSpeed;
    other0.innerHTML = "Other0: " + myFurball.health;
    other1.innerHTML = "Other1: " + myFurball.satiation;
    other2.innerHTML = "Other2: " + myFurball.fun;
    other3.innerHTML = "Other3: " + myFurball.secureness;
    // slider for adjusting height (my layout tool):
    containerHeight.innerHTML = "Height: " + $("#adjust-height").height();
    containerWidth.innerHTML = "Width: " + $("#adjust-height").width();


    // user and items:
    points.innerHTML = player.points;
    credits.innerHTML = player.credits;
    food.innerHTML = player.food;
    toy.innerHTML = player.toy;

    !player.credits? credits.style.color = "var(--red)" : credits.style.color = "var(--black)";
    !player.food? food.style.color = "var(--red)" : food.style.color = "var(--black)";
    !player.toy? toy.style.color = "var(--red)" : toy.style.color = "var(--black)";


    // draw condition bars and write Furballs statements

    fitness.style.width = myFurball.fitness -10 + "%";
    health.style.width = myFurball.health*100/(myFurball.fitness-10) + "%";
    health.style.backgroundColor = "#" + colorMap[Math.round(myFurball.health-1)]; // There is no index -1
    fitness.style.borderColor = "#" + colorMap[Math.round(myFurball.health-1)];

    furballStatement.innerHTML = furballSaying;

    satiation.children[0].style.width = myFurball.satiation + "%";
    satiation.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    //satiation.style.borderColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    fun.children[0].style.width = myFurball.fun + "%";
    fun.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    //fun.style.borderColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    secureness.children[0].style.width = myFurball.secureness + "%";
    secureness.children[0].style.backgroundColor = "#" + colorMap[Math.round(myFurball.secureness-1)];
    //secureness.style.borderColor = "#" + colorMap[Math.round(myFurball.secureness-1)];


    // Fade out condition bars:
    if (satShown) {
        countSatShown += progress;
        if (countSatShown >= cooldownCond) {
                TweenMax.to(satiation, fadeOutTime, {opacity:0});       // what's wrong here? No fade out..
                satShown = false;
                countSatShown = 0;
        }
    }
    if (funShown) {
        countFunShown += progress;
        if (countFunShown >= cooldownCond) {
            TweenMax.to(fun, fadeOutTime, {opacity:0});       // what's wrong here? No fade out..
            funShown = false;
            countFunShown = 0;
        }
    }
    if (secShown) {
        countSecShown += progress;
        if (countSecShown >= cooldownCond) {
            TweenMax.to(secureness, fadeOutTime, {opacity:0});       // what's wrong here? No fade out..
            secShown = false;
            countSecShown = 0;
        }
    }
}


function loop(timestamp) {
    
    if (pauseTime) {
        lastRender += timestamp - pauseTime;
        pauseTime = undefined;
    } 
    
    progress = timestamp - lastRender;
    //if (progress > 30) console.log("!!!-------------!!!");        // For debugging. Issue: Sometimes loop times are longer.
    //console.log(progress);
    v_timeElapsed += progress;

    update(progress);
    draw();

    ++counter;

    myFurball.isDead? gameOver()
        : pause? (
            pauseTime = timestamp,
            cancelAnimationFrame(reqAnimF)
        ) : (
            lastRender = timestamp,
            reqAnimF = requestAnimationFrame(loop)
        );
        
}


// Event listener:
pauseButton.addEventListener("click", switchPause);
feedBtn.addEventListener("click", feed);
playBtn.addEventListener("click", play);
petBtn.addEventListener("click", pet);
goToSettings.addEventListener("click", settings);

//carrot.addEventListener("click", ()=> specialItem("give", "carrot"));
//I will continue working with jQuery method.

jQuery(function($) {
    $("#toggle-fScreen").click(toggleFullScreen);

    $("#buy-food").click( buyFood.buy );
    $("#buy-toy").click( buyToy.buy );
    $("#buy-ticket").click( slotMachine.pay );
    $("#clover").click( slotMachine.play );

    $("#strawberry").click( ()=> specialItem.give("strawberry") );
    $("#lemon").click( ()=> specialItem.give("lemon") );
    $("#carrot").click( ()=> specialItem.give("carrot") );
});

// petting Furball by swiping over Furball:
mOverFurball.onmousedown = ()=> clickOnFurbal = true;
window.onmouseup = ()=> clickOnFurbal = false;
mOverFurball.onmousemove = function() {
    if (clickOnFurbal) petBySwipe();   // replace with new petting function
};

mOverFurball.addEventListener("touchmove", handleMove, false);
function handleMove(event) {
    event.preventDefault();
    petBySwipe();
}

// if height of gameField is tall enough, show Furballs name as heading.
window.addEventListener("resize", displayEverything);


/*
// Layout adjusting: height:
sizeHeight.oninput = function() {
    adjustHeight.style.height = this.value + "px";
    showHeight.value = sizeHeight.value;
}
showHeight.oninput = function() {
    adjustHeight.style.height = this.value + "px";
}
*/


TweenMax.set(goToSettings, {display:"none"});

player.gameInProgress? gameInit() : startWindow();