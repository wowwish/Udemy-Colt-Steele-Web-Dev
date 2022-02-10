const p1 = {
    score: 0,
    button: document.querySelector('#p1Button'),
    display: document.querySelector('#p1Display')
}

const p2 = {
    score: 0,
    button: document.querySelector('#p2Button'),
    display: document.querySelector('#p2Display')
}

const resetButton = document.querySelector('#reset');
const winningScoreSelect = document.querySelector('#playto');
const tieBreaker = document.createElement('option');


let winningScore = 3;
let isGameOver = false;

p1.button.addEventListener('click', function () {
    updateScores(p1, p2);
})

p2.button.addEventListener('click', function () {
    updateScores(p2, p1);
})

resetButton.addEventListener('click', reset);

// function triggered when a different winning score is selected. When the current winning score is selected, nothing happens.
winningScoreSelect.addEventListener('change', function () {
    // change winning score to selected value
    winningScore = parseInt(this.value);
    reset();
})


function updateScores(player, opponent) {
    if (!isGameOver) {
        player.score += 1;
        if (player.score === winningScore) {
            isGameOver = true;
            player.display.classList.add('has-text-success');
            opponent.display.classList.add('has-text-danger');
            player.button.disabled = true; // disable button and prevent it from being clicked
            opponent.button.disabled = true;
        }
    }
    player.display.textContent = player.score;
}



function reset() {
    isGameOver = false;
    for (let p of [p1, p2]) {
        p.score = 0;
        p.display.classList.remove('has-text-success', 'has-text-danger');
        p.display.textContent = 0;
        p.button.disabled = false;
    }
}

