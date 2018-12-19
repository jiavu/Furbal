const furbalStates = {

// Trigger via switch cases?

//////////////////////////////
//////////////////////////////

//High priority:

    // Reaction to player's actions:

    toFeeding : {
        95: "Salad. Not again.",     // > 95%
        90: "I'm so full.",          // almost full satiation    > 90%
        85: "I am good, thanks.",    // if already fed           80% -> 90%
        1: "Can I have a dessert?",
        2: "Tastes good, thanks.",
        3: "Is it food or...",
        4: "Yummy!",
        5: "* munch crunch chomp *"
    },

    toPlaying : {
        95: "I don't want to play anymore. You can have it.",    // if satisfied, > 90%
        90: "Yeay. Toys. :/",                                       // if satisfied, 80% -> 90%
        85: "I already had a lot of them.",                     // if satisfied, 70% -> 80%
        1: "It's my dolly! Play with your own one!",
        2: "Oh, toys!",
        3: "Yippee!",
        4: "Catch me! Haha, catch me!!!"
    },

    toPetting : {
        95: "Leave me some space, okay?",                // if > 95%
        85: "Come on, you're squeezing me.",              // if satisfied, 85 - 95%
        // < 75%:
        1: "Huuug!",
        2: "I love you mama!",
        3: "You are the sunshine of my live.",
        4: "It's so good to have you.",
        5: "Rrrrrrrr!"
    },
        
    /*=======================*/
    /*=======================*/

    // Reaction to Furball's states:

    won : "WE WON!!!",

    health : {         // Highest priority
        //good
        90: "Oh, happy day!",                                        // > 90%
        50: "Could be better.",                                      // 40 -> 50%
        40: "I am not feeling so well.",                             // 30 -> 40%
        30: "Why do you let me die?",                                // 20 -> 30%
        20: "I declare that this is my last will and testament.",    // 10 -> 20%
        10: "I am feeling so cold.",                                 // 5 -> 10%
        5: "I think it's over.",                                    // < 5%
        0: "I'm dead."
        //bad
    },
    /*----------*/

    // Medium priority:

    satiation : {
        //good
        75: "I could maybe eat something.",  // 60 -> 75%
        60: "I want candy, now!",            // 50 -> 60%
        50: "Can I have cookie?",            // 40 -> 50%
        40: "I am so hungry.",               // 30 -> 40%
        30: "Can I eat stones?",             // 20 -> 30%
        20: "I am starving...",             // 10 -> 20%
        10: "My stomache hurts.",           // < 10%
        //bad
    },

    /*----------*/

    fun : {
        //good
        90: "Live is fun!",              // > 90 %
        75: "Let's play something!",     // 50 -> 75%
        50: "Boring!!!",                 // 40 -> 50%
        40: "* YAWN *",                  // 30 -> 40%
        30: "* snooze *",                // 20 -> 30%
        20: "Deadly boring."            // < 20%
        //bad
    },

    /*----------*/

    secureness : {
        //good
        85: "It's so good to have you.",     // > 85%       // (doppelt, gibt es schon bei pet)
        60: "Where are you?",                // 50 -> 60%
        50: "I am so lonley.",               // 40 -> 50%
        40: "I am afraid all alone!",        // 30 -> 40%
        
        // !!! HIGHEST PRIORITY, HIGHER THAN HEALTH:
        noPlay: "I am so alone and sad. I don't want to play.",
        noEat: "I am so alone and sad. I don't want to eat."
        //bad
    }

};


//export default furbalStates; // unnecessary. I don't need to export them.

/*
*Jeweils in die feed() und die play()-Funktion:
if (funIncrease <= 0) furballSaying = furbalStates.secureness.noPlay;
if (!satiationIncrease) furballSaying = furbalStates.secureness.noEat;
Mit hoher Priorität!

*/