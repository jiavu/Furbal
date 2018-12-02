const infoText = {
    intro : {
        0 : "<div class='alignCenter pulse'><h1 id='enter-game'>Furball</h1>",
        1 : "<p>Once there was a Furball.</p>",
        2 : "<p>A Furball is a small pet with big button eyes and a thick and furry fur living in a website.</p>",
        3 : "<p>You have to feed your Furball.<br>If you forget to feed it, it will die.</p>",
        4 : "<p>Play with your Furball.<br>If you forget to play with your Furball, it is going to die of boredom.<br><br>Pay attention: Playing makes your Furball hungry!</p>",
        5 : "<p>You also have to pet your pet.<br>If you don't give it your affection, it will be lonely and is going to lose it's joy for living.</p>",
        6 : "<p>Pay attention to Furball's level of secureness.<br>If your Furball is lonely, it won't eat and play anymore.</p>",
        7 : "<p>If your Furball is sad or ill, it will lose it's color.<br>Critical levels of Furballs conditions will weaken it.<br><br>Be aware - Furbals fitness won't recover!</p>",
        8 : "<p>So... what was your name again?</p>",
        9 : ", right!<br><br></p>", // 9 with 10 together
        10 : ", which name do you want to give your Furball?</p>",
        11 : ", what a beautiful name!!!<br><br>Let me ask you one last question, ",
        skipIntro : "<div id='skip-intro'>Skip Intro &gt;&gt;</div>",
        next : "<br><div><span id='next-page'>&gt;&gt;</span></div>",   // https://www.w3schools.com/HTML/html_entities.asp
        player : "<input type='text' placeholder='Player' maxlength='26' id='enter-player-name'>", // entry fields
        furbal : "<input type='text' placeholder='My Furball' maxlength='26' id='enter-furbal-name'>"
    },
    startWindow : {
        go : "<div class='alignCenter'><h1>Furball</h1>\
                    <h3>Are you ready for it?</h3>\
                    <button type='button' id='go'>YES!</button>\
                </div>"
    },
    finishScreen : {
        gameOverT1 : "<div class='alignCenter'> \
                        <h1>Game Over</h1> \
                        <p>",
                        // insert gameOverInfo  //
        gameOverT2 :    "</p> \
                        <button type='button' id='again'>GIMME A NEW FURBALL!</button>\
                    </div>"
    },
    settingsScreen : "<div class='alignCenter'> \
                        <h1>Options</h1>\
                        <p><button type='button' class='smaller-button' id='restart-game'>Restart Game</button></p> \
                        <p><a href='https://goo.gl/forms/ktww9CI6E7xlP4vj1' target='_blank' class='smaller-button'>Give Feedback</a></p> \
                        <p><button type='button' class='smaller-button' id='install-app'>Get App</button></p> \
                        <button type='button' id='continue'>Continue</button> \
                    </div>",
    catIpsum : 
        "<h1>Überschrift</h1>\
        Cat ipsum dolor sit amet, american bobtail savannah or jaguar or tom. Turkish angora jaguar. Jaguar.<br>\
        Scottish fold cougar scottish fold but turkish angora mouser so malkin for havana brown. Turkish angora.<br><br>\
        Bombay lynx, yet tomcat. Singapura. Cheetah bengal siberian and savannah norwegian forest. Balinese . <br>"
};

export default infoText;

/*
Maximum health: endurance, capacity, fitness, stamina

===

Add:

Some last things:
(ul)
- You need to buy {your Furball}'s food and toy with your game credits.
- You are starting to get credits if you made 50 points.
- The more points you gain, the more game credits you earn.
- Furball's metabolism gets faster when leveling up.
        (- If {your Furball} survives xx minutes, you win and {your Furball} will be immortal.
        or:)

-> If you earn 2000 points / if your Furball survives level 10, you win and {your Furball} will be immortal.
*/