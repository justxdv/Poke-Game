// Game variables
const canvas = document.querySelector('#confetti');
const jsConfetti = new JSConfetti()
let cards = document.querySelectorAll('.card');
let cardArray = [...cards];
let flippedCard = false;
let lockCard = false;
let firstCard, secondCard;
let gameOver = false;
const matchSound = new Audio('./assets/match.mp3');
const noMatchSound = new Audio('./assets/no-match.mp3');
const gameOverSound = new Audio('./assets/win.mp3');



// Shuffle the cards
function shuffle() {
  cardArray.forEach((card) => {
    let randomIndex = Math.floor(Math.random() * cards.length);
    card.style.order = randomIndex;
    console.log(card.children, randomIndex);
    card.children[1].style.backgroundImage = `url(${card.getAttribute('data-image')})`;
  });
}

// Flip a card
function flipCard() {
  if (gameOver) return; // Don't allow flipping cards when the game is over
  if (lockCard) return;
  if (this === firstCard) return;

  this.classList.add('flip');

  if (!flippedCard) {
    flippedCard = true;
    firstCard = this;
    return;
  }

  secondCard = this;
  checkMatch();
}

// Check for a match
function checkMatch() {
    let isMatch = firstCard.dataset.image === secondCard.dataset.image;
    isMatch ? disableCards() : unflipCards();
    
    // check for game over
    if (document.querySelectorAll('.card.flip').length === cardArray.length) {
        setTimeout(() => {
            showGameOverMessage();
            jsConfetti.addConfetti();
        }, 500);
    }
}

// Disable matched cards
function disableCards() {
  firstCard.removeEventListener('click', flipCard);
  secondCard.removeEventListener('click', flipCard);
  resetBoard();
  matchSound.play();
}

// Unflip non-matched cards
function unflipCards() {
  lockCard = true;

  setTimeout(() => {
    firstCard.classList.remove('flip');
    secondCard.classList.remove('flip');
    resetBoard();
    noMatchSound.play();
  }, 1000);
}

// Reset the game board
function resetBoard() {
    [flippedCard, lockCard] = [false, false];
    [firstCard, secondCard] = [null, null];
    
  }
  


// Show game over message and restart button
function showGameOverMessage() {
    // Get the overlay element and create a message element
    let overlay = document.getElementById('overlay');
    let message = document.createElement('div');
    message.classList.add('message');
  
    // Set the message text and create a restart button
    message.innerHTML = `
      <p>Congratulations! You Won!</p>
      <button class="restart-button">Restart</button>
    `;
  
    // Add the message and button to the overlay
    overlay.style.display = 'flex';
    overlay.appendChild(message);
  
    
  
    // Add event listener to restart button
    document.querySelector('.restart-button').addEventListener('click', () => {
        restartGame();
        gameOverSound.pause(); // stop game-over sound effect
        jsConfetti.clearCanvas();
      });
    
      gameOverSound.play(); // play game-over sound effect
    }

  
  

// Restart the game
function restartGame() {
    gameOver = false;
    let overlay = document.getElementById('overlay');
    overlay.style.display = 'none';
    overlay.removeChild(document.querySelector('.message'));
    cardArray.forEach((card) => {
      card.classList.remove('flip');
      card.addEventListener('click', flipCard);
    });
    setTimeout(() => {
      shuffle();
    }, 1000);
  }
  

// Start the game
function startGame() {
  shuffle();
  cards.forEach((card) => card.addEventListener('click', flipCard));
}

startGame();
