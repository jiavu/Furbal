"use strict";

const versionNumber = "1.5beta";
const versionDate = "Dec 2018";
writeVersionToDoc(versionNumber, versionDate);

function writeVersionToDoc(vn, vd) {
    for (let a = 0; a < document.getElementsByClassName("version-number").length; a++) {
        document.getElementsByClassName("version-number")[a].innerHTML = vn;
        document.getElementsByClassName("version-date")[a].innerHTML = vd;
    }
}

if ( navigator.vendor.toLowerCase().includes("apple") )
    window.alert("If you are using Safari 10 or higher on a mobile device this game might be unplayable because of double tap zooming.");


let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || windows.msRequestAnimationFrame;
let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;
let reqAnimF;

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

// if height of gameField is tall enough, show Furballs name as heading:
window.addEventListener("resize", displayEverything);


// add to home screen feature (should work for chrome):
// https://developers.google.com/web/fundamentals/app-install-banners/
let deferredPrompt;
let PWAinstalready = false;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();   // Prevent Chrome 67 and earlier from automatically showing the prompt
    deferredPrompt = e;   // Stash the event so it can be triggered later.
    PWAinstalready = true;
});

function installWebApp() {  // do I need to give in a parameter?
    PWAinstalready = false;
    deferredPrompt.prompt();
    deferredPrompt.userChoice
    .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the A2HS prompt');
        } else {
        console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
    });
}

//////////////////////////////////////////////////
//////////////////////////////////////////////////

/*
MODULES:
colorMaps, infoText, furbalStates
*/
// ((unnecessary. I don't need to export them as modules. Scripts imported in html without type="module" now.))

/*
Regarding: importing modules from file://
The file:// protocol does not work with CORS - only a certain set of them work, such as http://, among others.
-> Set a http server on your local system and use http to your localhost to serve the files.
    python -m http.server 8080 --bind 127.0.0.1 //python3
or Bypass CORS by disabling web-security. */

/* If all files are saved to and accessed via request to server I can use:
import furbalStates from "./furbal_says.js";
Otherwise paste object here and don't forget to remove type="module": */


/* (not working for me:)
import furbalStates from "./additional_files/furbal_says.js";
import colorMaps from "./additional_files/FurbalColorMaps.js";
import infoText from "./additional_files/furbal_infoText.js";
 */

const colorMap = colorMaps[4];

//////////////////////////////////////////////////


// Control monitor:
/* 
const timeElapsed = document.getElementById("timeElapsed");
const loopSpeed = document.getElementById("loopSpeed");
const gSpeed = document.getElementById("gSpeed");
const pauseButton = document.getElementById("pause");
const other0 = document.getElementById("other0");
const other1 = document.getElementById("other1");
const other2 = document.getElementById("other2");
const other3 = document.getElementById("other3");
 */

/*
const sizeHeight = document.getElementById("size-height");
const showHeight = document.getElementById("show-height");
const adjustHeight = document.getElementById("adjust-height");
const containerHeight = document.getElementById("container-height");
const containerWidth = document.getElementById("container-width");
*/

const loadingScreen = document.getElementById("loading-screen");

// Game elements:
const healthHeading = document.getElementsByClassName("health")[0];
const fitness = document.getElementById("fitness");
const health = document.getElementById("health");
const satiation = document.getElementById("satiation");
const fun = document.getElementById("fun");
const secureness = document.getElementById("secureness");

const divOverFurball = document.getElementById("div-over-furball");

const furballStatement = document.getElementById("furball-says");
const furballName = document.getElementById("furball-name");

const feedBtn = document.getElementById("feedBtn");
const playBtn = document.getElementById("playBtn");
//const petBtn = document.getElementById("petBtn");

const userName = document.getElementById("user-name");
const points = document.getElementById("points");
const credits = document.getElementById("credits");
const level = document.getElementById("level");
const food = document.getElementById("food");
const toy = document.getElementById("toy");
//const specialItems = document.getElementById("special-items");

const winASpecial = document.getElementById("win-a-special");
const waSBoxText = document.getElementById("waS-box-text");
const buyTicket = document.getElementById("buy-ticket");
const clover = document.getElementById("clover");

const infoWindow = document.getElementById("info-window");
const gameField = document.getElementById("game-field");

const goToSettings = document.getElementById("go-to-settings");
//const toggleFScreen = document.getElementById("toggle-fScreen"); // selected by jQuery


//////////////////////////////////////////////////
//////////////////////////////////////////////////

const myFurball = { name: "Furball" };
const player = { name: "Player" };
// keys will be set in initialization / when reading cookies.


//////////////////////////////////////////////////
//////////////////////////////////////////////////

// Gameloop parameter:
let gameSpeed;              // e. g. starts with 1, ends with 2
const calibrate = 16.694;   // When I did balancing and set the constant time variables I had an average loop speed of 16.694.
let averageLoopSpeed;

let lastRender;
let progress;
let v_timeElapsed;          // COOKIE !!! UPDATE by Cookie-Import or reset to zero.
let counter;    // Counts the number of loops made since game was started.
let countForCredits;
let pause = true;
let pauseTime;


// Balancing powers of decrease/increase:

const winGame = 2000;   // player wins game with 2000 points (level 10).

let healthUpdate;
const naturalDecreaseOfSatiation = 0.015;
const satiationPower = 0.0015;               // = influence to health
const naturalDecreaseOfFun = 0.0098;
const funPower = 0.001;                    // = influence to health
const naturalDecreaseOfSecureness = 0.014;
const securenessPower = 0.0006;             // = influence to health

const criticalSat = 40;                 // if satiation is critical or lower, influence to health will rise.
const criticalFun = 30;
const criticalSec = 30;

const satToFitness = 0.005;                 // if conditions are beneath critical value, fitness will decrease!
const funToFitness = 0.002;
const secToFitness = 0.003;

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
const toyPrice = 1.5;
const ticketPrice = 20;
const getFirstCreditsWith = 40;

const winMoney = 50;
const activateSlotMachine = 400;
let slotMachineActive;
const creditsInterval = 20000;     // this two variables
const pointsInterval = 10000;      // will be changed dynamically later.
let timeoutCredits;
let timeoutGainPntsHealth;
let timeoutGainPntsSat;
let timeoutGainPntsFun;
let timeoutGainPntsSec;

// Power of special items:
const carrotPower = 40;
const lemonPower = 40;
const strawberryPower = 40;


// Later: Character traits (stats) will influence the amounts of all power variables.

//////////////////////////////////////////////////


let furballSaying;
let saysFeed;       // for statement cooldowns so statements won't be displayed for ever.
let saysPlay;
let saysPet;
let saysHealth;
let saysSatiation;
let saysFun;
let saysSecureness;

let prevLevel; // for jump animation of level

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
let pettingTime;

let hint = 0;

// Animation:

function letJump(element) {     // small jump (for the big elements)
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

function letJump2(element) {    // big jump (for the small elements)
    TweenMax.to(element, 0.2, {
        scaleX: 1.55,
        scaleY:1.55,
        ease: Power2.easeInOut,
        onComplete: ()=>
            TweenMax.to(element, 0.2, {
                scaleX: 1,
                scaleY: 1,
                ease: Power2.easeInOut,
            })
        });
}

function letJump3(element) {    // medium jump
    TweenMax.to(element, 0.2, {
        scaleX: 1.3,
        scaleY:1.3,
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

// Game stages:

const startWindow = {

    intro() {
        switch (this.introPage) {
            case 0:                             // still loading screen
                loadingScreen.innerHTML = infoText.intro[0];
                $(document).keydown((e)=> {
                    if (e.keyCode==13 || e.keyCode==39) {  // which or keycode.
                        this.introPage++;
                        this.intro();
                    } else if (e.keyCode==40) {
                        loadingScreen.style.display = "none";
                        newGame();
                    };
                })
                $("#enter-game").click( ()=> {
                    this.introPage++;
                    this.intro();
                });
                break;
            case 1:                             // "once there was a Furball.""
                loadingScreen.style.display = "none";
                $("#info-window").fadeIn(1500).html(
                    "<div>" +
                    infoText.intro[1] +
                    "</div><div class='alignCenter'>" +
                    infoText.intro.next +
                    infoText.intro.skipIntro +
                    "</div>");
                $("#skip-intro").click( ()=> { newGame(); });   // i could move the listeners to the html string as <sript>.
                $("#next-page").click( ()=> {
                    this.introPage++;
                    this.intro();
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
                        this.introPage++;
                        this.intro();
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
                        this.introPage++;
                        this.intro();
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
                        this.introPage++;
                        this.intro();
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
                        this.introPage++;
                        this.intro();
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
                        this.introPage++;
                        this.intro();
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
                        this.introPage++;
                        this.intro();
                    });
                }).fadeIn(1000);
                break;
            case 8:
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        infoText.intro[8] +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        this.introPage++;
                        this.intro();
                    });
                }).fadeIn(1000);
                break;
            case 9:                             // insert player's name
                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div class='alignCenter'>" +
                        infoText.intro[9] +
                        infoText.intro.player +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $('#enter-player-name').attr({
                        placeholder: player.name,
                        focus: true,    // not working
                        select: true    //
                    });
                    $("#next-page").click( ()=> {
                        this.introPage++;
                        this.intro();
                    });
                }).fadeIn(1000);
                break;
            case 10:                             // insert Furball's name
                if ( $('#enter-player-name').prop("value") )
                    player.name = $('#enter-player-name').prop("value").trim(); // seems that trim() isn't necessary

                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div class='alignCenter'>" +
                        "<p>" + player.name +
                        infoText.intro[10] +
                        "<p>" + player.name +
                        infoText.intro[11] +
                        infoText.intro.furbal +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $('#enter-furbal-name').attr({
                        focus: true,
                        select: true
                    });
                    $("#next-page").click( ()=> {
                        this.introPage++;
                        this.intro();
                    });
                }).fadeIn(1000);
                break;
            case 11:                            // last question...
                if ($('#enter-furbal-name').prop("value") )
                    myFurball.name = $('#enter-furbal-name').prop("value").trim(); // seems that trim() isn't necessary

                $("#info-window").fadeOut(500, ()=> {
                    $("#info-window").html(
                        "<div>" +
                        "<p>" + myFurball.name +
                        infoText.intro[12] +
                        player.name + "...</p>" +
                        "</div><div style='text-align:right'>" +
                        infoText.intro.next +
                        "</div>"
                    );
                    $("#next-page").click( ()=> {
                        this.introPage++;
                        this.intro();
                    });
                }).fadeIn(1000);
                break;
            case 12:
                $("#info-window").fadeOut(500, ()=> {
                    newGame();
                });
        }
    },

    init() {
        // (load listener moved now)
        //window.addEventListener("load", ()=> {
            TweenMax.set(goToSettings, {display:"none"});
            $(document).off();
            loadingScreen.style.display = "flex";
            $("#game-field").hide();
            $("#info-window").hide();
            this.introPage = 0;
            this.intro();            
        //});
    },

    newGame() {
        TweenMax.set(goToSettings, {display:"none"});
        $(document).off().keydown((e)=> {
            if (e.keyCode==13 || e.keyCode==39) {
                // 'this' doesn't work here. Seems 'this' refers to the button pressed before.
                this.introPage++;
                this.intro();
            } else if (e.keyCode==40) {
                newGame();
            };
        });
        $("#game-field").hide();
        this.introPage = 9;
        this.intro();
    },

    introPage: 0
};

function newGame() {

    //myFurball.name = "My Furball";   // Let user insert a name in startWindow()...
    myFurball.isDead = false;
    myFurball.health = 41;          // should be >20. Should also not fire statements directly after starting game. ->41
    myFurball.fitness = 100;
    myFurball.satiation = 55;       // start game with 55, 50 fires a statement
    myFurball.fun = 90;             // start game with 90
    myFurball.secureness = 90;      // start game with 90

    player.gameInProgress = true;       // unecessary if I don't use cookies to safe game progress.
    player.points = 0;
    player.credits = 0;
    player.level = 1;
    player.food = 50;
    player.toy = 20;
    player.specialItems = {
        "carrot": 0,
        "lemon": 0,
        "strawberry": 0
    };

    // last page of start window, confirm to start game, close start window.
    $(function() {
        $("#info-window").fadeIn(1500).html(infoText.startWindow.go);
        $(document).off().on("keypress", function(e) {
            if (e.keyCode == 13) {
                enter();
            }
        });
        $("#go").click(enter);
    });

    function enter() {
        $(function() {
            $(document).off();
            $("#go").prop("disabled", true).html("Let's go!");
            $("#info-window").fadeOut(1500, gameInit);
        });
    }
}

function gameInit() {
    // Load cookies here...
    // If no cookies, "I couldn't find your progress. Did you delete the browser cookies?"
    // (and go to newGame).

    // RESETTING VARIABLES:

    gameSpeed = 1;
    v_timeElapsed = 0;                      // if using cookies... THIS WOULD BE A RESET !!!
    averageLoopSpeed = calibrate;
    
    lastRender = null;
    progress = 0;
    counter = 0;
    countForCredits = 0;
    pauseTime = undefined;

    slotMachineActive = false;

    timeoutCredits = creditsInterval/gameSpeed;     // I can delete the "/gameSpeeds" if initial gameSpeed keeps beeing 1.

    timeoutGainPntsHealth = pointsInterval/gameSpeed;
    timeoutGainPntsSat = pointsInterval/gameSpeed;
    timeoutGainPntsFun = pointsInterval/gameSpeed;
    timeoutGainPntsSec = pointsInterval/gameSpeed;
    
    furballSaying = "";
    saysFeed = false;       // for statement cooldowns so statements won't be displayed for ever.
    saysPlay = false;
    saysPet = false;
    saysHealth = false;
    saysSatiation = false;
    saysFun = false;
    saysSecureness = false;

    prevLevel = 1;

    timeElapsedTemp = 0;

    secCritical = false;
    prioAction = false;

    satShown = true;
    funShown = true;
    secShown = true;
    countSatShown = 0;
    countFunShown = 0;
    countSecShown = 0;

    pettingTime = 0;

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

            $(document).keypress(function(e) {
                if (e.keyCode == 13) settings();
            });
        });
    })
}

function gameOver() {
    
    const hours = Math.floor(v_timeElapsed/3600000);
    const minutes = Math.floor(v_timeElapsed/60000 %60);
    const secondsMs = Math.round(v_timeElapsed)/1000 %60;
    const seconds = Math.floor(secondsMs);
    
    let gameOverInfo = myFurball.name + " survived ";
    if (hours) gameOverInfo += hours + " hours, ";
    if (minutes) gameOverInfo += minutes + " minutes and ";
    gameOverInfo += seconds + " seconds.";

    let gameOverHTML = myFurball.isDead? (
        furballStatement.innerHTML = furbalStates.health[0],    //"I'm dead.";
        infoText.finishScreen.gameOverT1
        + gameOverInfo
        + infoText.finishScreen.gameOverT2
    ) : (
        furballStatement.innerHTML = furbalStates.won,
        infoText.finishScreen.gameOverWonT1
        + myFurball.name
        + infoText.finishScreen.gameOverWonT2
        + player.name
        + infoText.finishScreen.gameOverWonT3
    );


    TweenMax.set(gameField, {pointerEvents:"none"});
    TweenMax.set(goToSettings, {display:"none"});
    
    pause = true;

    $(function(){
        $(document).off();
        $("#satiation,#fun,#secureness").removeClass("flash");

        TweenMax.to($("#satiation,#fun,#secureness"), 0.2, {
            opacity: 1,
            onComplete: function() {
                window.setTimeout(function() {
                    TweenMax.to($("#game-field"), 1.5, {
                        opacity: 0,
                        onComplete: function() {

                            $("#info-window").fadeIn(1500)
                            .html(gameOverHTML);
                            
                            $(document).on("keypress", function(e) {
                                if (e.keyCode == 13) {
                                    startWindow.newGame();
                                };
                            //$("#again").click(newGame); // to early? no reaction when clicking on button.
                            // => moved to infoText.finishScreen.gameOverT2 now.
                            });
                        }}
                    )
                }, 1500);
            }
        });

        /*      // buggy:
        // jQuery bug (this.easing is not a function).
        // jquery-3.3.1.js:6710

        $("#satiation,#fun,#secureness").removeClass("flash").fadeIn(200,
            window.setTimeout(function() {
                $("#game-field").fadeOut(1500, ()=> {

                    $("#info-window").fadeIn(1500)
                    .html(gameOverHTML);
                    
                    $(document).on("keypress", function(e) {
                        if (e.keyCode == 13) {
                            newGame();
                        };
                    $("#again").click(newGame);
                    });
                }, 1500);
            })
        );
        */
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

    pause = !pause;
    pause? TweenMax.set(gameField, {pointerEvents:"none", opacity: 0.4} )
           : TweenMax.set(gameField, {pointerEvents:"auto", opacity: 1} );

    (pause)? console.log("=========PAUSE=========") : reqAnimF = requestAnimationFrame(loop);
// When continuing game after pause: seems to entail longer looptimes....
// because 1x loop will be proceeded until pause is deactivated. Ca. 17ms (1loop) jump (maybe 16.711 ms)
}

function settings() {
    if (myFurball.isDead) { gameOver() }
    else {
        switchPause();

        $(function() {
            $("#info-window").html(infoText.settingsScreen);
            $("#enter-furbal-name2").attr("placeholder", "Change Furball's name");

            PWAinstalready?
                $("#install-app").prop("disabled", false) :
                $("#install-app").prop("disabled", true);
            
            $("#enter-furbal-name2").on("input", function() {
                if ($(this).prop("value")) {
                    myFurball.name = $(this).prop("value").trim();
                    furballName.innerHTML = myFurball.name;
                }
            });
            $("#install-app").click( ()=> installWebApp() );
            $("#restart-game").click( ()=> startWindow.newGame() );
            $("#restart-intro").click( ()=> startWindow.init() );
            $("#get-hint").click( function() {
                $(this).prop( "disabled", "true")
                .html(infoText.hints[hint]);
                hint++;
                if (hint >= infoText.hints.length) hint = 0;
            });
            $("#sources-and-credits").click( function() {
                $("#info-window").html(infoText.credits);
                writeVersionToDoc(versionNumber, versionDate);
                pause = false;
                $("#back").click(settings);
            });
            $("#continue").click( ()=> settings() );
        });

        // pause? $(function() {$("#info-window").show()}) : $(function() {$("#info-window").hide()});
        pause? TweenMax.set(infoWindow, {display: "inline-block"} )
               : TweenMax.set(infoWindow, { display: "none"} );
    }
}

//////////////////////////////////////////////////

// ACTIONS: feed, play, pet // buying things // gambling:

const actionButtons = {
    
    feed() {

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
        satiationIncrease = Math.ceil(satiationIncrease);
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

            if (myFurball.health > 20) {        // (prioritization)
                furballSaying = saysFeed;
            } else if (secCritical) { furballSaying = saysFeed }
            

            // Fade in html element (Furballs satiation):

            countSatShown = 0;
            satShown = true;

            // Animation:
            if (satiationIncrease) TweenMax.to(satiation, fadeInTime, {opacity:1});

            if (satiationIncrease > 0) {
                player.points++;
                letJump(satiation);
                letJump3(satiation.firstElementChild);
                letShrink(food);
        }
    }

    // Update players food box:
    player.food -= satiationIncrease;
    feedBtn.disabled = !player.food? true : false;

    },

    play() {
            
        //let funIncrease = ( (-(toyPowerMax-toyPowerMin)/100 *myFurball.fun) + toyPowerMax ) * (myFurball.secureness/100 -secToFunThreshold);   // the less secureness, the less myFurball will play.
        let funIncrease = ( (-(toyPowerMax-toyPowerMin)/myFurball.fitness *myFurball.fun) + toyPowerMax ) * (myFurball.secureness/100 -secToFunThreshold);
        
        /* If player doesn't have enough toy for 1 toy portion, Furball gets what player has.
            If player has no toys, Furball gets no toys. */
        if (player.toy > 0 && player.toy < funIncrease) {
            funIncrease = player.toy;
        } else if (!player.toy) { funIncrease = 0 };


        // That's how toys will increase Furballs fun:
        funIncrease = Math.ceil(funIncrease);
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
                player.points++;

                satiation.style.color = "var(--red)";
                letJump(fun);
                letJump3(fun.firstElementChild);
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
    },

    // Old pet(), not used anymore:
    /*
    pet() {

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
            letJump3(secureness.firstElementChild);
        }
    },*/

    petBySwipe() {
            
        let securenessIncrease = gameSpeed/(averageLoopSpeed/calibrate) * ( ((petPowerMax-petPowerMin)/100 *myFurball.secureness) + petPowerMin )/20;
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

        // gain points for petting:
        if (pettingTime >= 1000/gameSpeed *averageLoopSpeed/calibrate) {
            player.points++;
            pettingTime = 0;
        } else { pettingTime += progress; }
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
        TweenMax.to(waSBoxText, 4/gameSpeed *averageLoopSpeed/calibrate, {
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
            TweenMax.to(waSBoxText, 0.5/gameSpeed *averageLoopSpeed/calibrate, {
                scale: 1.2,
                ease: Power4.easeInOut,
                repeat: 1,
                yoyo: true,
                onComplete: ()=> setTimeout( ()=> {

                    (this.prize == "credits")? (
                        player.credits += winMoney,
                        buyFood.check(),
                        buyToy.check()
                        ) : player.specialItems[this.prize]++;

                    specialItem.check(this.prize);
                    letJump2( "#" + this.prize ) ;
                    slotMachine.reset();
                }, 500/gameSpeed *averageLoopSpeed/calibrate)
            });
        
        } else {
            this.prize = "nothing";
            waSBoxText.innerText = "You lose.";

            console.log("won: " + this.prize);

            TweenMax.to("#won-nothing", 0.2, { display: "inline-block" });
            setTimeout(slotMachine.reset, 1000/gameSpeed *averageLoopSpeed/calibrate);
        }
    },

    check() {
        // deactivate the hole until player has enough points!

        if (player.points < activateSlotMachine) {
            jQuery(function($) { greyout.add($("#win-a-special")) });
        } else {
            jQuery(function($) { greyout.remove($("#win-a-special")) });

            !(player.credits >= ticketPrice)?
            jQuery(function($) { greyout.add($("#buy-ticket")) }) :
            jQuery(function($) {
                greyout.remove($("#buy-ticket"));
                buyTicket.style.pointerEvents = "auto";
            });
        }
    }
}


const specialItem = {

    give(item) {

        let r;
        secCritical = false;
        prioAction = true;

        switch (item) {

            case "strawberry":
                player.specialItems.strawberry -= 1;

                myFurball.secureness = myFurball.secureness < 0?
                    strawberryPower
                :   myFurball.secureness + strawberryPower;

                //if (myFurball.secureness > myFurball.fitness) myFurball.secureness = myFurball.fitness;
                //moved to update()
                
                if (myFurball.secureness > criticalSec) secureness.style.color = "var(--black)";

                // fire a furball statement:
                timeElapsedTemp = 0;
                r = Math.floor(Math.random()*5);
                saysPlay = false;
                saysFeed = false;
                saysPet = furbalStates.toPetting[r+1];
                furballSaying = saysPet;
                
                TweenMax.to(secureness, fadeInTime, {opacity:1});
                letJump(secureness);
                letJump3(secureness.firstElementChild);
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

                // fire a furball statement:
                timeElapsedTemp = 0;
                r = Math.floor(Math.random()*4);
                saysFeed = false;
                saysPet = false;
                saysPlay = furbalStates.toPlaying[r+1];
                furballSaying = saysPlay;

                TweenMax.to(fun, fadeInTime, {opacity:1});
                letJump(fun);
                letJump3(fun.firstElementChild);
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

                // fire a furball statement:
                timeElapsedTemp = 0;
                r = Math.floor(Math.random()*5);
                saysPlay = false;
                saysPet = false;
                saysFeed = furbalStates.toFeeding[r+1];
                    furballSaying = saysFeed;


                TweenMax.to(satiation, fadeInTime, {opacity:1});
                letJump(satiation);
                letJump3(satiation.firstElementChild);
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

    if (countForCredits === 1) {
        player.credits += Math.round(40 * foodPrice);

    } else {
        let lostSatiation = Math.ceil(naturalDecreaseOfSatiation * countForCredits * gameSpeed/(averageLoopSpeed/calibrate) );
        let lostFun = Math.ceil(naturalDecreaseOfFun * countForCredits * gameSpeed/(averageLoopSpeed/calibrate) );
        
        // BASIC SECURITY INCOME
        player.credits += Math.round( (1 + (player.level-1)*0.5/10) * (lostSatiation*foodPrice + lostFun*toyPrice) );
        // factor in order to rise income when leveling up (1.4 for level 5...).

        //if (player.level >= 4) player.credits += ticketPrice;

    }

    letJump2(credits);

    buyFood.check();
    buyToy.check();
    slotMachine.check();

    countForCredits = 0;

}


function incomePoints(progress) {

    if (myFurball.health >= myFurball.fitness-10) {
        if (!timeoutGainPntsHealth) {
            player.points += Math.round(50 * (myFurball.fitness-10) / 90);      // for health=90: 50 points.
            letJump($("#health-container"));
            letJump2($("#name-in-health, #title-in-health"));
            letJump2(credits);
        }
        if (timeoutGainPntsHealth >= pointsInterval/gameSpeed * averageLoopSpeed/calibrate) {
            timeoutGainPntsHealth = 0;
        } else { timeoutGainPntsHealth += progress; }
    } else { timeoutGainPntsHealth = 0; }

    
    if (myFurball.satiation >= myFurball.fitness-5 && myFurball.health < myFurball.fitness-10) {
        if (!timeoutGainPntsSat) player.points += Math.round(10 * (myFurball.fitness-5) / 95);      // for satiation=95: 20 points.
        if (timeoutGainPntsSat >= pointsInterval/gameSpeed * averageLoopSpeed/calibrate) {
            timeoutGainPntsSat = 0;
        } else { timeoutGainPntsSat += progress; }
    } else { timeoutGainPntsSat = 0; }


    if (myFurball.fun >= myFurball.fitness-5 && myFurball.health < myFurball.fitness-10) {
        if (!timeoutGainPntsFun) player.points += Math.round(10 * (myFurball.fitness-5) / 95);      // for fun=95: 20 points.
        if (timeoutGainPntsFun >= pointsInterval/gameSpeed * averageLoopSpeed/calibrate) {
            timeoutGainPntsFun = 0;
        } else { timeoutGainPntsFun += progress; }
    } else { timeoutGainPntsFun = 0; }

    if (myFurball.secureness >= myFurball.fitness-5 && myFurball.health < myFurball.fitness-10) {
        if (!timeoutGainPntsSec) player.points += Math.round(5 * (myFurball.fitness-5) / 95);      // for secureness=95: 10 points.
        if (timeoutGainPntsSec >= pointsInterval/gameSpeed * averageLoopSpeed/calibrate) {
            timeoutGainPntsSec = 0;
        } else { timeoutGainPntsSec += progress; }
    } else { timeoutGainPntsSec = 0; }
    

    // v_timeElapsed (game progress) after 5 minutes, 10 minutes --> extra points?

    if (!slotMachineActive && player.points >= activateSlotMachine) {
        
        // activate slotMachine! :D
        slotMachineActive = true;
        slotMachine.check();
        player.credits += ticketPrice;
        slotMachine.pay();
        slotMachine.play();
    }
     
    // leveling up:
    if (player.points >= 40 && player.points < 100) {
        gameSpeed = Math.round(1.15 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 100 && player.points < 200) {
        player.level = 2;
        gameSpeed = Math.round(1.3 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 200 && player.points < 300) {
        player.level = 3;
        gameSpeed = Math.round(1.45 * 1000 * averageLoopSpeed/calibrate)/1000;        
    } else if (player.points >= 300 && player.points < 400) {
        player.level = 4;
        gameSpeed = Math.round(1.6 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 400 && player.points < 500) {
        player.level = 5;
        gameSpeed = Math.round(1.75 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 500 && player.points < 600) {
        player.level = 6;
        gameSpeed = Math.round(1.9 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 600 && player.points < 700) {
        player.level = 7;
        gameSpeed = Math.round(2.05 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 700 && player.points < 800) {
        player.level = 8;
        gameSpeed = Math.round(2.2 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 800 && player.points < 900) {
        player.level = 9;
        gameSpeed = Math.round(2.35 * 1000 * averageLoopSpeed/calibrate)/1000;
    } else if (player.points >= 900 && player.points < 1000) {
        player.level = 10;
        gameSpeed = Math.round(2.5 * 1000 * averageLoopSpeed/calibrate)/1000;
    }

    
    if (player.level != prevLevel) {
        player.credits += Math.round(foodPowerMax * foodPrice) + Math.round(toyPowerMax/2 * toyPrice);
        letJump2(credits);
        letJump2(level);
        prevLevel = player.level;
    }
    
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
    countForCredits++;
    if (player.points >= getFirstCreditsWith) {
        timeoutCredits >= creditsInterval/gameSpeed * averageLoopSpeed/calibrate?
        incomeCredits() :
        timeoutCredits += progress;
    } else { countForCredits = 0 }

    // Natural decrease and increase of Furballs conditions:
    myFurball.satiation -= naturalDecreaseOfSatiation * gameSpeed/(averageLoopSpeed/calibrate) ;                                                         // + character trait
    myFurball.fun -= (naturalDecreaseOfFun + -healthToFun/100*myFurball.health + healthToFun) * gameSpeed/(averageLoopSpeed/calibrate);                 // + character trait
    myFurball.secureness -= (naturalDecreaseOfSecureness + -healthToSec/100*myFurball.health + healthToSec) * gameSpeed/(averageLoopSpeed/calibrate);   // + character trait

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
    

    // Fitness update:
    let factor2 = (condition, critical) => {
        return condition <= critical?
            -(condition-critical)/10 + 1 : 0;
    };

    if (myFurball.fitness > 45) {
        myFurball.fitness -= factor2(myFurball.satiation, criticalSat) * satToFitness
        + factor2(myFurball.fun, criticalFun) * funToFitness
        + factor2(myFurball.secureness, criticalSec) * secToFitness;
    }
    
    /* Update Furballs health: Newtons Law of Cooling: u'(t) = -k(u(t)-a) */
    healthUpdate = -satiationPower *factor(myFurball.satiation, criticalSat) * (myFurball.health-myFurball.satiation)
                    -funPower *factor(myFurball.fun, criticalFun) * (myFurball.health-myFurball.fun)
                    -securenessPower *factor(myFurball.secureness, criticalSec) * (myFurball.health-myFurball.secureness);
    
    myFurball.health += healthUpdate * gameSpeed/(averageLoopSpeed/calibrate);


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

    function greyscale(furbal) {
        if (myFurball.health <= 60) {
            if (myFurball.health > 0) {
                let grey = -2.5 * myFurball.health + 150;
                TweenMax.set(furbal, {
                    webkitFilter: `grayscale(${grey}%)`,
                    filter: `grayscale(${grey}%)`
                })
            }
        } else {
            TweenMax.set(furbal, {
                webkitFilter: "grayscale(0%)",
                filter: "grayscale(0%)"
            })
        }
    }

    // test-monitor: // DEACTIVATE WHEN FINISHED!
    /* 
    timeElapsed.innerHTML = "Time elapsed: " + Math.round(v_timeElapsed) + "ms";
    loopSpeed.innerHTML = "Loop Speed: " + Math.round(progress) + "ms/loop";
    gSpeed.innerHTML = "Game Speed: " + gameSpeed;
    other0.innerHTML = "avgLoopSpd: " + averageLoopSpeed;
    // other0.innerHTML = "Other0: " + factor(myFurball.satiation, criticalSat);   // test monitor
    other1.innerHTML = "Other1: " + myFurball.satiation;
    other2.innerHTML = "Other2: " + myFurball.fun;
    other3.innerHTML = "Other3: " + myFurball.secureness;
    // slider for adjusting height (my layout tool):
    containerHeight.innerHTML = "Height: " + $("#adjust-height").height();
    containerWidth.innerHTML = "Width: " + $("#adjust-height").width();
    */

    // user and items:
    points.innerHTML = player.points;
    credits.innerHTML = player.credits;
    level.innerHTML = player.level;
    food.innerHTML = player.food;
    toy.innerHTML = player.toy;

    credits.style.color = !player.credits? "var(--red)" : "var(--black)";
    food.style.color = !player.food? "var(--red)" : "var(--black)";
    toy.style.color = !player.toy? "var(--red)" : "var(--black)";


    // draw condition bars and write Furballs statements

    fitness.style.width = myFurball.fitness -10 + "%";
    health.style.width = myFurball.health*100/(myFurball.fitness-10) + "%";
    health.style.backgroundColor = "#" + colorMap[Math.round(myFurball.health-1)]; // There is no index -1
    fitness.style.borderColor = "#" + colorMap[Math.round(myFurball.health-1)];

    furballStatement.innerHTML = furballSaying;

    satiation.children[1].style.width = myFurball.satiation + "%";
    satiation.children[1].style.backgroundColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    //satiation.style.borderColor = "#" + colorMap[Math.round(myFurball.satiation-1)];
    fun.children[1].style.width = myFurball.fun + "%";
    fun.children[1].style.backgroundColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    //fun.style.borderColor = "#" + colorMap[Math.round(myFurball.fun-1)];
    secureness.children[1].style.width = myFurball.secureness + "%";
    secureness.children[1].style.backgroundColor = "#" + colorMap[Math.round(myFurball.secureness-1)];
    //secureness.style.borderColor = "#" + colorMap[Math.round(myFurball.secureness-1)];

    // Furball loosing color:
    greyscale(divOverFurball);


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

    if (!lastRender) lastRender = timestamp;

    progress = timestamp - lastRender;
    v_timeElapsed += progress;

    update(progress);
    draw();

    ++counter;
    if (v_timeElapsed) averageLoopSpeed = v_timeElapsed / counter;

    (myFurball.isDead || player.points >= 1000)? gameOver()
        : pause? (
            pauseTime = timestamp,
            cancelAnimationFrame(reqAnimF)
        ) : (
            lastRender = timestamp,
            reqAnimF = requestAnimationFrame(loop)
        );
        
}


//////////////////////////////////////////////////
//////////////////////////////////////////////////

/* Extrawurst for Safari (prevent zooming by gesture and double tap):
window.addEventListener('touchmove', function (event) {
    if (event.scale !== 1) { event.preventDefault(); }
}, false);
// doesn't work `_´

// that is killing double tap completely:
/*
let lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
  let now = (new Date()).getTime();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
*/


window.addEventListener("load", ()=> {

    // Event listener:
    //pauseButton.addEventListener("click", switchPause);
    feedBtn.addEventListener("click", actionButtons.feed);
    playBtn.addEventListener("click", actionButtons.play);
    //petBtn.addEventListener("click", actionButtons.pet);
    goToSettings.addEventListener("click", settings);

    //carrot.addEventListener("click", ()=> specialItem("give", "carrot"));

    //jQuery(function($) {
        $("#toggle-fScreen").click(toggleFullScreen);

        $("#buy-food").click( buyFood.buy );
        $("#buy-toy").click( buyToy.buy );
        $("#buy-ticket").click( slotMachine.pay );
        $("#clover").click( slotMachine.play );

        $("#strawberry").click( ()=> specialItem.give("strawberry") );
        $("#lemon").click( ()=> specialItem.give("lemon") );
        $("#carrot").click( ()=> specialItem.give("carrot") );
    //});


    // petting Furball by swiping over Furball:
    divOverFurball.onmousedown = function(e){
        e.preventDefault();
        clickOnFurbal = true;
    }
    window.onmouseup = ()=> { clickOnFurbal = false; };
    divOverFurball.onmousemove = function() {
        if (clickOnFurbal) actionButtons.petBySwipe();
    };

    // petting on mobile:
    divOverFurball.addEventListener("touchmove", handleMove, false);
    function handleMove(event) {
        event.preventDefault();
        actionButtons.petBySwipe();
    }


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
    
    displayEverything();

    player.gameInProgress? gameInit() : startWindow.init();

});