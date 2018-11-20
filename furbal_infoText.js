const infoText = {
    intro : {
        0 : "<div class='alignCenter' id='enter-game'><h1>Furball</h1>",
        1 : "<p>Once there was a Furball.</p>",
        2 : "<p>A Furball is a small pet with big button-eyes and a thick and furry fur living in a website.</p>",
        3 : "<p>You have to feed your Furball. If you forget to feed it, it will die.</p>",
        4 : "<p>Play with your Furball. If you forget to play with your Furball, it is going to die of boredom.</p>",
        5 : "<p>You also have to pet your pet. If you don't give it your affection, it will be lonely and is going to lose it's joy for living.</p>",
        6 : "<p>Pay attention to Furball's level of secureness. If your Furball is lonely, it won't eat and play anymore.</p>",
        7 : "<p>If your Furball is sad or ill, it will lose it's color.<br>Critical levels of Furballs conditions will weaken it. Be aware - Furbals fitness won't recover!</p>",
        8 : "<p>So... what was your name again?</p>",
        9 : ", right!</p>", // 9 with 10 together
        10 : ", which name do you want to give your Furball?</p>",
        11 : ", what a beautiful name!!!<br>Let me ask one last question, ",
        skipIntro : "<button type='button' class='smaller-button'>Skip Intro</button>",
        next : "<p>&gt;&gt;&gt;</p>",   // &gt; should be '>>>'     // https://www.w3schools.com/HTML/html_entities.asp
        player : "<input type='text' value='Player' id='enter-player-name'>", // entry fields
        furbal : "<input type='text' value='My Furball' id='enter-furbal-name'>"
    },
    startWindow : {
        go : "<div class='alignCenter'><h1>Furball</h1>\
                    <h3>Are you ready for it?</h3>\
                    <button type='button' id='go'>YES!</button>\
                </div>"
    },
    finishScreen : {
        gameOverT1 : "<div class='alignCenter'> \
                        <h2>Game Over</h2> \
                        <p>",
                        // insert gameOverInfo  //
        gameOverT2 :    "</p> \
                        <button type='button' id='again'>GIMME A NEW FURBALL!</button>\
                    </div>"
    },
    settingsScreen : "<div class='alignCenter'> \
                        <h2>Options</h2>\
                        <p><button type='button' class='smaller-button' id='restart-game'>Restart game</button></p> \
                        <p><a href='https://goo.gl/forms/ktww9CI6E7xlP4vj1' target='_blank'>Give Feedback</a></p> \
                        <button type='button' id='continue'>Continue</button> \
                    </div>",
    catIpsum : 
        "<h1>Überschrift</h1>\
        Cat ipsum dolor sit amet, american bobtail savannah or jaguar or tom. Turkish angora jaguar. Jaguar.<br>\
        Scottish fold cougar scottish fold but turkish angora mouser so malkin for havana brown. Turkish angora.<br><br>\
        Bombay lynx, yet tomcat. Singapura. Cheetah bengal siberian and savannah norwegian forest. Balinese . <br>"
};

export default infoText;