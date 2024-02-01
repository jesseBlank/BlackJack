// Hide rules after clicking button.
function hide(element) {
    var hideButton = document.querySelector("#rules");
    hideButton.remove();
}

// Variables that target dealer and player hands
var playerHandDiv = document.querySelector(".spots3");
var dealerHandDiv = document.querySelector(".dealer");

// Variables to target the scoreboard
var playerScoreboard = document.querySelector("#play");
var tieScoreboard = document.querySelector("#tie");
var dealerScoreboard = document.querySelector("#deal");
var playerCount = 0;
var tieCount = 0;
var dealerCount = 0;

// Arrays that track deck, players hand, and dealers hand.
var deck = []
var playerHand = []
var dealerHand = []

// Create a function that gives dealer and player two random cards each.
function updateHTML() {
    console.log(deck)
    // After card is given, remove it from the deck so there are no repeats card values.
    playerHand.push(deck.pop())
    playerHand.push(deck.pop())
    dealerHand.push(deck.pop())
    dealerHand.push(deck.pop())

    var dealerCards = '';
    dealerHand.forEach((card, index) => {
        if (index === 0) { 
            dealerCards += `<img src="./cardBack.png" alt="${card.value} of ${card.suit}"></img>`;
        }
        else {
            dealerCards += `<img src="${card.image}" alt="${card.value} of ${card.suit}"></img>`;
        }
    });
    var playerCards = playerHand.map(card => `<img src="${card.image}" alt="${card.value} of ${card.suit}"></img>`).join('');

    // innerHTML to card images on table.
    playerHandDiv.innerHTML = playerCards;
    dealerHandDiv.innerHTML = dealerCards;

    // Create player and dealer score variables.
    var playerScore = handValue(playerHand);
    var dealerScore = handValue(dealerHand);
    console.log(playerScore, dealerScore);
}

// Create a function that uses shuffled deck api.
async function shuffleDeck() {
    // Fetch the api
    // Ensure there are 52 cards in the deck.
    try {
        var response = await fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=52");
        if (!response.ok) {
            throw new Error("failed to fetch deck of cards.");
        }
        // Link to json
        var data = await response.json();
        console.log("data=", data);
        deck = data.cards
        // return the data to the deck
        return data;
    }
    catch (error) {
        console.error("Error:", error);
        return null;
    }
}

//  Write a function that keeps track of the total in player or dealers hand.
function handValue(arr) {
    var sum = 0;
    var aceCount = 0;
    // Make a for loop to loop through the array of player or dealer hands
    for (var i = 0; i < arr.length; i++) {
        var card = arr[i];
        // Assign value to ace and face cards with if and else statements
        if (card.value === "ACE") {
            // Record ace count to make sure if player or dealer go over 21 with ace, ace value will be 1.
            aceCount = aceCount + 1;
            sum = sum + 11;
            console.log("found an ace");
        }
        else if (card.value === "KING" || card.value === "QUEEN" || card.value === "JACK") {
            sum = sum + 10;
        }
        else {
            sum = sum + parseInt(card.value);
            console.log("parsing number", card.value)
        }
        // If an ace is in player's hand, and player goes over 21, ace value is 1.
        if (aceCount > 0 && sum > 21) {
            sum = sum - 10;
            aceCount--;
        }
    }
    return sum;
}

// Write a function that gives a card when the "hit" button is clicked.
function drawCard() {
    // After drawing a card, remove it from deck.
    playerHand.push(deck.pop())
    var playerCards = playerHand.map(card => `<img src="${card.image}" alt="${card.value} of ${card.suit}"></img>`).join('');
    playerHandDiv.innerHTML = playerCards;

    playerScore = handValue(playerHand);

    // Console.log to troubleshoot
    console.log(playerScore);

    // Have the h1 change to say "dealer or player wins".
    var winner = document.querySelector("h1");
    if (playerScore > 21) {
        dealerCount++;
        dealerScoreboard.innerHTML = "Dealer: " + dealerCount;
        winner.innerText = "Dealer Wins!";
        return dealerCount;
    }
}

// When stay button is hit, dealer must draw until total 17 is reached.
function dealerDraw() {
    // Variables that define score in each player and dealer.
    var dealerScore = handValue(dealerHand);
    var playerScore = handValue(playerHand);
    // While loop that ensures dealer draws if dealer has score less than 17.
    while (dealerScore < 17) {
        // Card is added to dealer hand array and removed from deck.
        dealerHand.push(deck.pop());
        // Draws card image and value from API
        var dealerCards = dealerHand.map(card => `<img src="${card.image}" alt="${card.value} of ${card.suit}"></img>`).join('');
        dealerHandDiv.innerHTML = dealerCards;
        // Dealer score is updated with card value
        dealerScore = handValue(dealerHand);
    }
    // console.log the score to troubleshoot
    console.log(playerScore, dealerScore);
    // Have the h1 announce the winner with if and else statements.
    var winner = document.querySelector("h1");
    if (dealerScore <= 21 && dealerScore > playerScore) {
        document.querySelector("div.dealer img:first-child").src=`${dealerHand[0].image}`;
        winner.innerText = "Dealer Wins!";
        dealerCount++;
        dealerScoreboard.innerHTML = "Dealer: " + dealerCount;
        return dealerCount;
    }
    else if (dealerScore > 21) {
        document.querySelector("div.dealer img:first-child").src=`${dealerHand[0].image}`;
        winner.innerText = "Player Wins!";
        playerCount++;
        playerScoreboard.innerHTML = "Player: " + playerCount;
        return playerCount;
    }
    else if (dealerScore === playerScore) {
        document.querySelector("div.dealer img:first-child").src=`${dealerHand[0].image}`;
        winner.innerText = "Player Ties!"
        tieCount++;
        tieScoreboard.innerHTML = "Tie: " + tieCount;
        return tieCount;
    }
    else if (playerScore > dealerScore && playerScore <= 21) {
        document.querySelector("div.dealer img:first-child").src=`${dealerHand[0].image}`;
        winner.innerText = "Player Wins!";
        playerCount++;
        playerScoreboard.innerHTML = "Player: " + playerCount;
        return playerCount;
    }
}

// Endgame function that resets all variables.
function endGame() {   
    playerHand = [];
    dealerHand = [];

    playerHandDiv.innerHTML = "";
    dealerHandDiv.innerHTML = "";

    document.querySelector("h1").innerText = "Blackjack!";
}

// Newgame function that starts a new game rather than refreshing the page.
function newGame() {
    // Calls endGame function which cleans "cards" up.
    endGame();

    // Puts new "cards" on the table.
    updateHTML();
}