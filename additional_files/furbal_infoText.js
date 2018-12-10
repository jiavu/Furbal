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
        8 : "<p> \
                Some last things: \
                <ul> \
                    <li>You need to buy your Furball's food and toy with your game credits.</li> \
                    <li>You are starting to get credits if you made 50 points.</li> \
                    <li>The more points you earn, the more game credits you get.</li> \
                    <li>Furball's metabolism gets faster in time.</li> \
                    <li>If your Furball survives Level 10, you win and your Furball will be immortal.</li> \
                </ul> \
            </p>",
        9 : "<p>So... what was your name again?</p>",
        10 : ", right!<br><br></p>", // 9 with 10 together
        11 : ", which name do you want to give your Furball?</p>",
        12 : ", what a beautiful name!!!<br><br>Let me ask you one last question, ",
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
                        <button type='button' id='again'>GIMME A NEW FURBALL!</button> \
                    </div>\
                    <script>$('#again').click(()=>startWindow.newGame());</script>",
        
        // Won game:                    
        gameOverWonT1 : "<div class= 'alignCenter'> \
                        <h1>You won!</h1> \
                        <p>",
                        // insert Furball's name //
        gameOverWonT2 : " survived level 10 and became immortal!<br><br> \
                        You, ",
                        // insert Player's name //
        gameOverWonT3 : ", are great!</p> \
                        <button type='button' id='again'>GIMME A NEW FURBALL!</button> \
                        </div>\
                        <script>$('#again').click(()=>startWindow.newGame());</script>"
    },
    settingsScreen : "<div class='alignCenter'> \
                        <h1>Options</h1>\
                        <input type='text' placeholder='My Furball' maxlength='26' id='enter-furbal-name2' style='margin:2%;width:75%'> \
                        <p><button type='button' class='smaller-button' id='restart-intro'>New Game (restart intro)</button></p> \
                        <p><button type='button' class='smaller-button' id='restart-game'>Restart Game</button></p> \
                        <p><button type='button' class='smaller-button' id='get-hint'>Get a hint</button></p> \
                        <p><a href='https://goo.gl/forms/ktww9CI6E7xlP4vj1' target='_blank' class='smaller-button link-as-button'>Give Feedback</a></p> \
                        <p><button type='button' class='smaller-button' id='sources-and-credits'>Credits</button></p> \
                        <p><button type='button' class='smaller-button' id='install-app'>Get App</button></p> \
                        <button type='button' id='continue'>Continue</button> \
                    </div>",
    hints : [
        "Hint:<br>Furball's secureness increases by petting.",
        "Hint:<br>Lemon is for fun, carrot is for satiation, strawberry is for secureness.",
        "Hint:<br>Try to fill the conditions to make more points."
    ],
    credits :
        '<div class="alignCenter settings-credits"> \
            <h1>Credits</h1>\
            <p> \
                developed by:<br>\
                Jan-Patrick Tyra<br> \
                <a href="https://github.com/jiavu" target="_blank">Github</a><br> \
                Version: 1.5beta - Dec 2018 \
                <p>∞</p> \
            </p> \
            <h3>Sources</h3> \
            <div> \
                Settings and Fullscreen icon made by <a href="https://www.flaticon.com/authors/gregor-cresnar"  target="_blank" title="Gregor Cresnar">Gregor Cresnar</a><br> \
                Coin, notes and strawberry made by <a href="https://www.flaticon.com/authors/smashicons"  target="_blank" title="Smashicons">Smashicons</a><br> \
                Cash icon made by <a href="https://www.flaticon.com/authors/roundicons"  target="_blank" title="Roundicons">Roundicons</a><br> \
                Carrot made by <a href="https://www.flaticon.com/authors/prettycons"  target="_blank" title="prettycons">prettycons</a><br> \
                Lemon and clover leaf made by <a href="http://www.freepik.com"  target="_blank" title="Freepik">Freepik</a><br> \
                Santa hat made by <a href="https://www.flaticon.com/authors/vectors-market"  target="_blank" title="Vectors Market">Vectors Market</a><br> \
                from <a href="https://www.flaticon.com/"  target="_blank" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0" target="_blank">CC 3.0 BY</a> \
            </div> \
        <p><button type="button" class="smaller-button" id="back">Back</button></p> \
        </div>',

    catIpsum : 
        "<h1>Überschrift</h1>\
        Cat ipsum dolor sit amet, american bobtail savannah or jaguar or tom. Turkish angora jaguar. Jaguar.<br>\
        Scottish fold cougar scottish fold but turkish angora mouser so malkin for havana brown. Turkish angora.<br><br>\
        Bombay lynx, yet tomcat. Singapura. Cheetah bengal siberian and savannah norwegian forest. Balinese . <br>"
};

export default infoText;

/*
Maximum health: endurance, capacity, fitness, stamina
*/