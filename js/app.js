/*
 * List that holds all of your cards
 */
const cards = [
    'lsp',
    'finn',
    'peppermintButler',
    'gunter',
    'jake',
    'princessBubblegum',
    'ladyRaincorn',
    'treeTrunks',
    'marceline',
    'hudson',
    'cinnamon',
    'flamePrincess',
    'lemongrab',
    'partyBear',
    'iceKing'
];

/*
 * Cache frequently used elements
 */
let $face = document.getElementById('bmo-face');
let $game = document.getElementById('game');
let $start = document.getElementById('restart');
let $deck = document.getElementById('deck');
let $bubble = document.getElementById('message');
let $bmoMessage = document.getElementById('bmo-message');
let $moves = document.getElementById('moves');
let $smile = document.getElementById('smile');
let $winSmile = document.getElementById('winSmile');
let $startLabel = document.getElementById('startLabel');
let $oneStar = document.getElementById('oneStar');
let $twoStar = document.getElementById('twoStar');
let $threeStar = document.getElementById('threeStar');

let $openCards = [];
let moves = 0;
let matches = 0;
let isRestart = true;
let isFirstGame = true;

function initGame() {
    $face.classList.add('shown');
    setTimeout(function() {
        displayMessage('<p class="type-writer">Who wants to play video games? <span>♥</span></p>', false, true);
        setTimeout(function() {
            $start.addEventListener('click', function(evt) {
                if (isRestart) {
                    displayCards();
                    isRestart = false;
                }
            });
            $startLabel.classList.add('shown');
        }, 1000);
    }, 600);
}

setTimeout(function() { initGame(); }, 500);

/*
 * Display the cards on the page
 */
function displayCards() {
    console.log('here');

    $face.classList.remove('shown');
    setTimeout(function() {
        if (isFirstGame) {
            prepareNewDeck();
            isFirstGame = false;
            $game.classList.add('shown');
        } else rebuildDeck();
        displayMessage('<p class="type-writer">This does compute!</p>', true, true);

    }, 300);
}

$deck.addEventListener('click', function(evt) {
    let $pickedCard;
    if (evt.target.nodeName === 'I') $pickedCard = evt.target.parentNode.parentNode;
    else if (evt.target.nodeName === 'DIV') {
        $pickedCard = evt.target.parentNode;
    }

    if ($pickedCard && $openCards.length <= 1) {
        flipCard($pickedCard);
        addToOpenCards($pickedCard);
    }
});

function prepareNewDeck() {
    moves = -1;
    matches = 0;
    resetStars();
    updateMoves();

    let randomCards = getRandomCards();

    const $deckFragment = document.createDocumentFragment();

    for (const card of randomCards) {
        const $newElement = document.createElement('li');
        $newElement.classList.add('card');
        $newElement.classList.add('card-container');

        $newElement.innerHTML = `<div class="card-flip" data-card="${card}">
                                  <img class="back" src="img/${card}-min.png" alt="Game Card">
                                  <div class="front escale"><i class="fa fa-question-circle-o"></i></div>
                                </div>`

        $deckFragment.appendChild($newElement);
    }

    $deck.style.display = 'none';

    while ($deck.firstChild) {
        $deck.removeChild($deck.firstChild);
    }

    $deck.appendChild($deckFragment);
    $deck.style.display = null;
}

/*
 * Display the card's symbol
 */
function flipCard($element) {
    $element.classList.add('flipped');
}

/*
 * Add the card to a *list* of "open" cards
 */
function addToOpenCards($element) {
    $openCards.push($element);
    if ($openCards.length > 1) checkCardMatch();
}

/*
 * Check if cards match
 */
function checkCardMatch() {
    if ($openCards[0].dataset.card !== $openCards[1].dataset.card) {
        setTimeout(function() {
            unflipCards();
            setTimeout(function() { $openCards = []; }, 400);
        }, 700);
    } else {
        setTimeout(function() {
            $openCards = [];
            ++matches;
            if (matches == 8) {
                wonGame();
            }
        }, 400);
    }

    isRestart = true;
    updateMoves();
}

/*
 * Display winning message
 */
function wonGame() {
    setTimeout(function() {
        $smile.classList.add('hidden');
        $winSmile.classList.add('shown');

        $face.classList.add('shown');
        displayMessage(`<p class="type-writer">I bow to you, sensei! <strong>${moves}</strong> Moves</p>`);

    }, 600);
}

/*
 * Display BMO's messages
 */
function displayMessage(messageHMTL, isShort = false, hidden = false) {
    $bubble.classList.remove('shown');
    isShort ? $bmoMessage.classList.add('short-message') : $bmoMessage.classList.remove('short-message');
    $bubble.classList.add('shown');
    $bmoMessage.innerHTML = messageHMTL;
    if (hidden) {
        setTimeout(function() { $bubble.classList.remove('shown'); }, 2500);
    }
}

/*
 * Hide the cards' symbol
 */
function unflipCards() {
    $openCards[0].classList.remove('flipped');
    $openCards[1].classList.remove('flipped');
}

/*
 * Hide the cards' symbol
 */
function updateMoves() {
    ++moves;
    $moves.innerText = moves;
    checkStars();
}

function checkStars() {
    if (moves >= 10) {
        $threeStar.classList.add('fa-star-o');
    }
    if (moves >= 14) {
        $twoStar.classList.add('fa-star-o');
    }
    if (moves >= 20) {
        $oneStar.classList.add('fa-star-o');
    }

}


function resetStars() {
    $threeStar.classList.remove('fa-star-o');
    $twoStar.classList.remove('fa-star-o');
    $oneStar.classList.remove('fa-star-o');
}

function getRandomCards() {
    let shuffledCards = shuffle(cards).slice(0, 8);
    return shuffle([...shuffledCards, ...shuffledCards]);
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function setImageSource($elem, cardName) {
    $elem.childNodes[1].src = `img/${cardName}-min.png`;
}

function rebuildDeck() {
    moves = -1;
    matches = 0;
    resetStars();
    updateMoves();

    let $cards = document.getElementsByClassName('card-flip');
    let randomCards = getRandomCards();
    let i = 0;
    for (const $card of $cards) {
        if ($card.classList.contains('flipped')) $card.classList.remove('flipped');
        $card.dataset.card = randomCards[i];
        setTimeout(setImageSource, 150, $card, randomCards[i]);
        ++i;
    }
}