var counter = 0;
var playersSymbol = " ";
var computersSymbol;
var gamePosArr = [];
var computerWinsSound = new Audio("http://res.cloudinary.com/angiemjohnson/video/upload/v1470535194/244453__milton__dramatic-robot-1_asbcxg.mp3")
var playerWinMusic = new Audio("http://res.cloudinary.com/angiemjohnson/video/upload/v1470534745/99636__tomlija__small-crowd-yelling-yeah_vfzbpp.wav")
var startGameMusic = new Audio("http://res.cloudinary.com/angiemjohnson/raw/upload/v1469732205/Shall-we-play-a-game_unines.mp3");
var endGameMusic = new Audio("http://res.cloudinary.com/angiemjohnson/raw/upload/v1469733568/Game-over-sound-effect_d4gfjm.mp3");
var squareClickSound = new Audio("https://res.cloudinary.com/angiemjohnson/video/upload/v1470534191/233539__oceanictrancer__click_thltr7.wav")
var computerMovesSound = new Audio("http://res.cloudinary.com/angiemjohnson/video/upload/v1470534454/316874__dtrostli__tr-dhita-cymbal02_fifx1l.wav")
$(function () {

    // force board to be a square
    var div = $('#gameboard');
    var width = div.width();
    div.css('height', width);

    // re-force board to be a square everytime the window is resized
    $(window).resize(function () {
        var div = $('#gameboard');
        var width = div.width();
        div.css('height', width);
    });

    init();

    $("#X").on("click", function () {
        playersSymbol = "X";
        computersSymbol = "O";
        // make the game board available for play
        playGame();

    });

    $("#O").on("click", function () {
        playersSymbol = "O";
        computersSymbol = "X";

        // make the game board available for play
        playGame();

        //TODO: If player clicks O, therefore the computer is X and makes it's move first
        gamePosArr[4] = "X";
        $("#4").addClass("X");
        computerMovesSound.play();
    });

    //.one allows the click event to only happen once per square so that there's not multiple Xs or Os in the squares.
    $(".square").on("click", function (eventData) {
        console.log("square clicked");

        //checks to see if the div has an "X" or "o" class so that multiples will not be added after the initial click is done.
        if (eventData.currentTarget.className.indexOf("X") !== -1 || eventData.currentTarget.className.indexOf("O") !== -1) {
            console.log("This Square Is Occupied");
        }
        else {
            // ensure the game is not already over before allowing the user to click a square
            if (checkForWinner(gamePosArr) !== true) {

                // show the desired symbol in the passed square
                selectSquare(eventData.currentTarget.id, playersSymbol);

                if (checkForWinner(gamePosArr) === true) {
                    endGame(playersSymbol + " Wins!");
                    playerWinMusic.play();
                }
                else if (gamePosArr.filter(function (value) { return value !== undefined }).length >= 9) {
                    endGame("Game Is A Draw");
                    endGameMusic.play();
                }
                else {
                    computerMoves();
                    // arr is the empty arr that is housing the Xs and Os that have been clicked by the players. if arr has 9 Xs and/or Os, the game is a draw because there are no more moves that can be made.

                    if (gamePosArr.filter(function (value) { return value !== undefined }).length >= 9) {
                        endGame("Game Is A Draw");
                        endGameMusic.play();
                    }
                }
            }
        }
    });

    $("#reset").on("click", function () {
        $("#resetContainer").removeClass('slideDown');
        $("#resetContainer").addClass('slideUp');

        init();

        $(".square").removeClass("X O");
        gamePosArr = [];
    });

});

function selectSquare(id, player) {
    $("#" + id).toggleClass(player);
    gamePosArr[id] = player;
    squareClickSound.play();
    /*$("#" + id).addClass("X O")*/
    console.log(gamePosArr);
}

function init() {
    startGameMusic.play();

    // show the start menu, it already has the slideUp
    $('#startContainer').removeClass('slideUp');
    $('#startContainer').addClass('slideDown');

    $('#veil').removeClass('fadeOut');
    $('#veil').addClass('fadeIn');

}

function playGame() {
    $('#startContainer').removeClass('slideDown');
    $('#startContainer').addClass('slideUp');

    $('#veil').removeClass('fadeIn');
    $('#veil').addClass('fadeOut');
}


//array is being passed to be checked by the function to see if a player(computer or human) is a winner.
//player is either the computer or the human that is playing

function checkForWinner(array) {
    if ((array[0] == array[1] && array[1] == array[2] && array[0] !== undefined)
        || (array[3] == array[4] && array[4] == array[5] && array[3] !== undefined)
        || (array[6] == array[7] && array[7] == array[8] && array[6] !== undefined)) {
        return true;
    }
    if ((array[0] == array[3] && array[3] == array[6] && array[0] !== undefined)
        || (array[1] == array[4] && array[4] == array[7] && array[1] !== undefined)
        || (array[2] == array[5] && array[5] == array[8] && array[2] !== undefined)) {
        return true;
    }
    if ((array[0] == array[4] && array[4] == array[8] && array[0] !== undefined)
        || (array[2] == array[4] && array[4] == array[6] && array[2] !== undefined)) {
        return true;
    }
    else {
        return false;
    }
}
function endGame(message) {

    $("#resetContainer").removeClass('slideUp');
    $("#endOfGameStatement").text(message);
    $("#resetContainer").addClass('slideDown');
}
//
function computerMoves() {
    computerMovesSound.play();
    //loops through all the possible
    for (var i = 0; i < 9; i++) {
        if ($("#" + i).hasClass("X") !== true && $("#" + i).hasClass("O") !== true) {
            //copy of the game array in a temporary array. Don't want to alter the games original array
            var tempArr = gamePosArr.slice(0);
            tempArr[i] = computersSymbol;
            if (checkForWinner(tempArr) === true) {
                selectSquare(i, computersSymbol);
                endGame(computersSymbol + " Wins!");
                computerWinsSound.play();
                return;
            }
            //TODO:check all the available squares. Make the computer put the other players symbol in it.  then call the checkForWinner function to see if the player wins. If the player is close to winning,The computer puts it's symbol down to try to block
        }
    }
    for (var i = 0; i < 9; i++) {
        if ($("#" + i).hasClass("X") !== true && $("#" + i).hasClass("O") !== true) {
            var tempArr = gamePosArr.slice(0);
            tempArr[i] = playersSymbol;
            if (checkForWinner(tempArr) === true) {
                selectSquare(i, computersSymbol);
                return;
            }
        }
    }

     if (gamePosArr[4] === undefined) {
        gamePosArr[4] = computersSymbol;
        $("#4").addClass(computersSymbol);
        return;
    }


    if (playersSymbol === "X" && gamePosArr[0] === undefined) {
        gamePosArr[0] = "O";
        $("#0").addClass("O");
        return;
    }


    //The section is for when the computer can't win or block the human player.
    //The computer has to checks all the squares and put it's symbol in an available square
    var randomSquareSelected;

    do {
        //pick a random number until finding a square that is empty
        randomSquareSelected = Math.floor((Math.random() * 8) + 0);
    }
    while ($("#" + randomSquareSelected).hasClass("X") || $("#" + randomSquareSelected).hasClass("O"));
    selectSquare(randomSquareSelected, computersSymbol);

}






