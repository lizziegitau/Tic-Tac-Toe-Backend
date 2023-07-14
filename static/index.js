window.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.getElementById('reset');
    const announcer = document.getElementById('announcer');
  
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let isGameActive = true;
    let gameId = null; // New variable to store the game ID
  
    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';
  
    const winningConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
  
    function handleResultValidation() {
      let roundWon = false;
      for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = board[winCondition[0]];
        const b = board[winCondition[1]];
        const c = board[winCondition[2]];
        if (a === '' || b === '' || c === '') {
          continue;
        }
        if (a === b && b === c) {
          roundWon = true;
          break;
        }
      }
  
      if (roundWon) {
        announce(currentPlayer === 'X' ? PLAYERX_WON : PLAYERO_WON);
        isGameActive = false;
        return;
      }
  
      if (!board.includes('')) announce(TIE);
    }
  
    const announce = (type) => {
      switch (type) {
        case PLAYERO_WON:
          announcer.innerHTML = 'Player <span class="playerO">O</span> Won 🏁';
          break;
        case PLAYERX_WON:
          announcer.innerHTML = 'Player <span class="playerX">X</span> Won 🏁';
          break;
        case TIE:
          announcer.innerText = 'Tie 🙂';
      }
      announcer.classList.remove('hide');
    };
  
    const isValidAction = (tile) => {
      if (tile.innerText === 'X' || tile.innerText === 'O') {
        return false;
      }
  
      return true;
    };
  
    const updateBoard = (index) => {
      board[index] = currentPlayer;
    };
  
    const changePlayer = () => {
      playerDisplay.classList.remove(`player${currentPlayer}`);
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      playerDisplay.innerText = currentPlayer;
      playerDisplay.classList.add(`player${currentPlayer}`);
    };
  
    const userAction = async (tile, index) => {
      if (isValidAction(tile) && isGameActive) {
        tile.innerText = currentPlayer;
        tile.classList.add(`player${currentPlayer}`);
        updateBoard(index);
        handleResultValidation();
        changePlayer();
  
        try {
          const response = await fetch(`/api/games/${gameId}/move`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              index: index,
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to update the game.');
          }
  
          const updatedGame = await response.json();
          // Handle the updated game data if needed
        } catch (error) {
          console.error('Failed to update the game:', error);
        }
      }
    };
  
    const resetBoard = () => {
      board = ['', '', '', '', '', '', '', '', ''];
      isGameActive = true;
      announcer.classList.add('hide');
  
      if (currentPlayer === 'O') {
        changePlayer();
      }
  
      tiles.forEach((tile) => {
        tile.innerText = '';
        tile.classList.remove('playerX');
        tile.classList.remove('playerO');
      });
    };
  
    tiles.forEach((tile, index) => {
      tile.addEventListener('click', () => userAction(tile, index));
    });
  
    resetButton.addEventListener('click', resetBoard);
  
    // Function to create a new game
    const createNewGame = async () => {
      try {
        const response = await fetch('/api/games', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) {
          throw new Error('Failed to create a new game.');
        }
  
        const newGame = await response.json();
        gameId = newGame._id; // Assign the game ID
  
        // Handle the new game data if needed
      } catch (error) {
        console.error('Failed to create a new game:', error);
      }
    };
  
    // Function to update the game state
    const updateGameState = async (index) => {
      try {
        const response = await fetch(`/api/games/${gameId}/move`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            index: index,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update the game.');
        }
  
        const updatedGame = await response.json();
        // Handle the updated game data if needed
      } catch (error) {
        console.error('Failed to update the game:', error);
      }
    };
  
    // Call the createNewGame function to create a new game
    createNewGame();
  });
  