document.addEventListener("DOMContentLoaded", () => {
    const gameGrid = document.querySelector(".game-grid");
    const restartButton = document.querySelector(".restart-button");
    const cards = [];
    const images = ["🐶", "🐱", "🐰", "🦁", "🐻", "🐯", "🐷", "🐸"];
    const gridSize = 4;
    let flippedCards = [];
    let foundCards = [];
    let score = 0;
    let timer = 0;
    let maxClicks = 3;
    let isGameFinished = false;
  
    // Create the game grid
    createGrid(gridSize);
  
    // Add event listener to the cards
    gameGrid.addEventListener("click", handleCardClick);
    restartButton.addEventListener("click", restartGame);
  
    // Start the timer
    startTimer();
  
    // Function to create the game grid
    function createGrid(size) {
      const totalCards = size * size;
      const cardPairs = totalCards / 2;
      const allCards = [];
  
      for (let i = 0; i < cardPairs; i++) {
        const randomIndex = Math.floor(Math.random() * images.length);
        const cardValue = images[randomIndex];
        allCards.push(cardValue);
        allCards.push(cardValue);
        images.splice(randomIndex, 1); // Remove the used image
      }
  
      shuffleArray(allCards);
  
      for (let i = 0; i < totalCards; i++) {
        const card = document.createElement("div");
        card.classList.add("card");
  
        const front = document.createElement("div");
        front.classList.add("front");
  
        const back = document.createElement("div");
        back.classList.add("back");
        back.textContent = allCards[i];
  
        card.appendChild(front);
        card.appendChild(back);
  
        gameGrid.appendChild(card);
        cards.push(card);
      }
    }
  
    // Function to shuffle the cards randomly
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
  
    // Function to handle card click
    function handleCardClick(e) {
      if (isGameFinished) return;
      
      const selectedCard = e.target.closest(".card");
      if (!selectedCard || selectedCard.classList.contains("flip") || flippedCards.length >= 2) {
        return;
      }
  
      flipCard(selectedCard);
      addFlippedCard(selectedCard);
      checkForMatch();
  
      if (flippedCards.length === 2) {
        maxClicks--;
        if (maxClicks === 0) {
          disableClicks();
          setTimeout(() => {
            resetFlippedCards();
            enableClicks();
            maxClicks = 3;
          }, 8000); // Allow new clicks after 8 seconds
        }
      }
    }
  
    // Function to flip a card
    function flipCard(card) {
      card.classList.add("flip");
    }
  
    // Function to add a flipped card to the flippedCards array
    function addFlippedCard(card) {
      flippedCards.push(card);
    }
  
    // Function to check if the flipped cards match
    function checkForMatch() {
      if (flippedCards.length === 2) {
        const card1 = flippedCards[0];
        const card2 = flippedCards[1];
        const card1Value = card1.querySelector(".back").textContent;
        const card2Value = card2.querySelector(".back").textContent;
  
        if (card1Value === card2Value) {
          foundCards.push(card1, card2);
          updateScore(1);
  
          if (foundCards.length === cards.length) {
            endGame();
          }
        } else {
          disableClicks();
          setTimeout(() => {
            flipCard(card1);
            flipCard(card2);
            enableClicks();
          }, 1000);
        }
  
        resetFlippedCards();
      }
    }
  
    // Function to update the score
    function updateScore(points) {
      score += points;
      document.querySelector(".score").textContent = `Score: ${score}`;
    }
  
    // Function to start the timer
    function startTimer() {
      timerInterval = setInterval(() => {
        timer++;
        document.querySelector(".timer").textContent = `Time: ${timer} sec`;
      }, 1000);
    }
  
    // Function to end the game
    function endGame() {
      isGameFinished = true;
      clearInterval(timerInterval);
      disableClicks();
      setTimeout(() => {
        alert(`Congratulations! You completed the game in ${timer} seconds with a score of ${score}`);
      }, 500);
    }
  
    // Function to disable card clicks
    function disableClicks() {
      gameGrid.style.pointerEvents = "none";
    }
  
    // Function to enable card clicks
    function enableClicks() {
      gameGrid.style.pointerEvents = "auto";
    }
  
    // Function to reset the flipped cards
    function resetFlippedCards() {
      flippedCards.forEach(card => {
        card.classList.remove("flip");
      });
      flippedCards = [];
    }
  
    // Function to restart the game
    function restartGame() {
      clearInterval(timerInterval);
      gameGrid.innerHTML = "";
      cards.length = 0;
      flippedCards.length = 0;
      foundCards.length = 0;
      score = 0;
      timer = 0;
      maxClicks = 3;
      isGameFinished = false;
      document.querySelector(".timer").textContent = "Time: 0 sec";
      document.querySelector(".score").textContent = "Score: 0";
      createGrid(gridSize);
      startTimer();
    }
  });
  