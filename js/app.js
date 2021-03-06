(function() {
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
    const $face = document.getElementById('bmo-face');
    const $game = document.getElementById('game');
    const $start = document.getElementById('restart');
    const $deck = document.getElementById('deck');
    const $bubble = document.getElementById('message');
    const $bmoMessage = document.getElementById('bmo-message');
    const $moves = document.getElementById('moves');
    const $smile = document.getElementById('smile');
    const $winSmile = document.getElementById('win-smile');
    const $bigSmile = document.getElementById('big-smile');
    const $startLabel = document.getElementById('start-label');
    const $oneStar = document.getElementById('one-star');
    const $twoStar = document.getElementById('two-star');
    const $threeStar = document.getElementById('three-star');
    const $timer = document.getElementById('timer');
    const $stars = document.getElementById('stars');

    let $cards;

    let $openCards = [];
    let moves = 0;
    let matches = 0;
    let isRestart = true;
    let isFirstGame = true;
    let seconds = -1;
    let minutes = 0;
    let timerEvent;
    let firstMoveMade = false;

    /*
     * Start the game transitions
     */
    function initGame() {
        $face.classList.add('shown');
        setTimeout(function() {
            displayMessage('<p class="type-writer">Who wants to play video games? ♥</p>', false, true);
            setTimeout(function() {
                $start.addEventListener('click', function(evt) {
                    if (isRestart) {
                        $openCards = [];
                        displayCards();
                        isRestart = false;
                    }
                    firstMoveMade = false;
                    stopTimer();
                    resetTimer();
                    updateTimer();
                });
                $startLabel.classList.add('shown');
            }, 1000);
        }, 600);

        // Add one event litener to deck element
        $deck.addEventListener('click', function(evt) {
            let $pickedCard;
            if (evt.target.nodeName === 'I') $pickedCard = evt.target.parentNode.parentNode;
            else if (evt.target.nodeName === 'DIV') {
                $pickedCard = evt.target.parentNode;
            }

            if ($pickedCard && $openCards.length <= 1) {
                if (!firstMoveMade) {
                    startTimer();
                    firstMoveMade = true;
                    isRestart = true;
                }
                flipCard($pickedCard);
                addToOpenCards($pickedCard);
            }
        });
    }

    /*
     * Build the first deck when app is started
     */
    function prepareNewDeck() {
        let randomCards = getRandomCards();

        const $deckFragment = document.createDocumentFragment();

        let firefoxClass = navigator.userAgent.indexOf("Firefox") !== -1 ? ' firefox-bug' : '';

        for (const card of randomCards) {
            const $newElement = document.createElement('li');
            $newElement.classList.add('card');
            $newElement.classList.add('card-container');

            $newElement.innerHTML = `<div class="card-flip" data-card="${card}">
                                  <img class="back" src="img/${card}-min.png" alt="Game Card">
                                  <div class="front escale"><i class="fa fa-question-circle-o ${firefoxClass}"></i></div>
                                </div>`

            $deckFragment.appendChild($newElement);
        }

        $deck.style.display = 'none';

        $deck.appendChild($deckFragment);
        $deck.style.display = null;

        // Cache the cards
        $cards = document.getElementsByClassName('card-flip');
    }

    /*
     * Rebuild deck when game is re-started
     */
    function rebuildDeck() {
        moves = -1;
        matches = 0;
        firstMoveMade = false;
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

    /*
     * Display the cards on the page
     */
    function displayCards() {
        $face.classList.remove('shown');
        $bigSmile.classList.remove('wider');
        setTimeout(function() {
            if (isFirstGame) {
                prepareNewDeck();
                isFirstGame = false;
                $game.classList.add('shown');
            } else rebuildDeck();
            displayMessage('<p class="type-writer">This does compute!</p>', true, true);
        }, 300);
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

        updateMoves();
    }

    /*
     * Display winning message
     */
    function wonGame() {
        stopTimer();
        setTimeout(function() {
            $smile.classList.add('hidden');
            $winSmile.classList.add('shown');

            $face.classList.add('shown');

            let starHTML = `${$stars.innerHTML.replace(/<li>/g, '').replace(/<\/li>/g, '')}`;
            displayMessage(`<p class="type-writer">I bow to you! <strong>${minutes}:${seconds < 10 ? '0' : ''}${seconds}</strong> secs ${starHTML}</p>`);

            setTimeout(function() { $bigSmile.classList.add('wider'); }, 600);

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
        if (moves >= 12) {
            $threeStar.classList.add('fa-star-o');
        }
        if (moves >= 18) {
            $twoStar.classList.add('fa-star-o');
        }
    }

    /*
     * Reset the star display
     */
    function resetStars() {
        $threeStar.classList.remove('fa-star-o');
        $twoStar.classList.remove('fa-star-o');
    }

    /*
     * Create array with the card order
     */
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

    /*
     * Set the src attribute for a img element
     */
    function setImageSource($elem, cardName) {
        $elem.childNodes[1].src = `img/${cardName}-min.png`;
    }

    /*
     * Update timer in the screen
     */
    function updateTimer() {
        ++seconds;
        if (seconds == 60) {
            ++minutes;
            seconds = 0;
        }

        $timer.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    /*
     * Reset the timer
     */
    function resetTimer() {
        seconds = -1;
        minutes = 0;
    }

    /*
     * Stop the timer
     */
    function stopTimer() {
        if (timerEvent) clearInterval(timerEvent);
    }

    /*
     * Start the timer
     */
    function startTimer() {
        stopTimer();
        timerEvent = setInterval(function() { updateTimer() }, 1000);
    }

    setTimeout(function() { initGame(); }, 500);
})();