let gameOverText;

const infoText = {
    manual : {
        1 : "Once there was a Furball...",
        2 : "What's the name of your Furball?:"
    },
    startWindow : {
        go : "<div class='alignCenter'><h1>Furball</h1>\
                    <h3>Are you ready for it?</h3>\
                    <button type='button' id='go'>YES!</button>\
                </div>"
    },
    finishScreen : {
        playAgain : `<div class='alignCenter'> \
                        <h2>Game Over</h2> \
                        <p>${gameOverText}</p> \
                        <button type='button' id='again'>GIMME A NEW FURBALL!</button>\
                    </div>`
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