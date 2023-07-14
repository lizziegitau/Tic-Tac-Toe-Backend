window.addEventListener('DOMContentLoaded', () => {
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const playerDisplay = document.querySelector('.display-player');
  const resetButton = document.getElementById('reset');
  const announcer = document.getElementById('announcer');
  const createPlayerButton = document.getElementById('create-player');
  const deletePlayerButton = document.getElementById('delete-player');
  const storeGameButton = document.getElementById('store-game');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  let board = ['', '', '', '', '', '', '', '', ''];
  let currentPlayer = 'X';
  let isGameActive = true;

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
      storeGame();
      return;
    }

    if (!board.includes('')) announce(TIE);
  }

  const announce = (type) => {
    switch (type) {
      case PLAYERO_WON:
        announcer.innerHTML = `Player <span class="playerO">${getPlayerSymbol('O')}</span> Won 🏁`;
        break;
      case PLAYERX_WON:
        announcer.innerHTML = `Player <span class="playerX">${getPlayerSymbol('X')}</span> Won 🏁`;
        break;
      case TIE:
        announcer.innerText = 'Tie 🙂';
    }
    announcer.classList.remove('hide');
  };

  const getPlayerSymbol = (player) => {
    if (player === 'X') {
      return player1;
    } else if (player === 'O') {
      return player2;
    }
    return '';
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
    playerDisplay.innerText = getPlayerSymbol(currentPlayer);
    playerDisplay.classList.add(`player${currentPlayer}`);
  };

  const userAction = (tile, index) => {
    if (isValidAction(tile) && isGameActive) {
      tile.innerText = currentPlayer;
      tile.classList.add(`player${currentPlayer}`);
      updateBoard(index);
      handleResultValidation();
      changePlayer();
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

  const createPlayer = () => {
    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch('/players', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Display success message or handle errors
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  const deletePlayer = () => {
    const username = usernameInput.value;

    fetch(`/players/${username}`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Display success message or handle errors
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  const storeGame = () => {
    fetch('/games', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ player1, player2 }),
    })
      .then((response) => response.json())
      .then((data) => {
        const gameId = data.gameId; // Get the generated game_id from the response

        const position = board.indexOf(currentPlayer);
        fetch(`/games/${gameId}/moves`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ player: currentPlayer, position }),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            // Display success message or handle errors
          })
          .catch((error) => {
            console.error(error);
            // Handle error
          });
      })
      .catch((error) => {
        console.error(error);
        // Handle error
      });
  };

  tiles.forEach((tile, index) => {
    tile.addEventListener('click', () => userAction(tile, index));
  });

  resetButton.addEventListener('click', resetBoard);
  createPlayerButton.addEventListener('click', createPlayer);
  deletePlayerButton.addEventListener('click', deletePlayer);
});
