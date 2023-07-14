const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('./static'))

// Connect to MongoDB
mongoose.connect('mongodb+srv://Elizabeth:eliza0505MJ@cluster0.zs3orzz.mongodb.net/tic-tac-toe?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const gameSchema = new mongoose.Schema({
  board: [[String]],
  currentPlayer: String,
  status: String,
});

const Game = mongoose.model('Game', gameSchema);

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
    return;
  }

  if (!board.includes('')) announce(TIE);
}

async function announce(type) {
  const game = new Game({
    board,
    currentPlayer,
    status: type,
  });

  try {
    await game.save();
    console.log('Game result saved to MongoDB');
    // Implement any other actions you want to take after saving the game result
  } catch (error) {
    console.error('Failed to save game result:', error);
    // Implement error handling
  }
}

function isValidAction(tile) {
  if (tile.innerText === 'X' || tile.innerText === 'O') {
    return false;
  }
  return true;
}

function updateBoard(index) {
  board[index] = currentPlayer;
}

function changePlayer() {
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

app.post('/api/games', async (req, res) => {
  board = [['', '', ''], ['', '', ''], ['', '', '']];
  currentPlayer = 'X';
  isGameActive = true;

  try {
    const game = new Game({
      board,
      currentPlayer,
      status: 'ongoing',
    });

    await game.save();
    res.status(201).json(game);
  } catch (error) {
    console.error('Failed to create a new game:', error);
    res.status(500).json({ error: 'Failed to create a new game.' });
  }
});

// Server-side code (app.js)
// ...

app.put('/api/games/:id/move', async (req, res) => {
    const gameId = req.params.id;
    const { index } = req.body;
  
    try {
      const game = await Game.findById(gameId);
      if (!game) {
        res.status(404).json({ error: 'Game not found.' });
        return;
      }
  
      if (!isGameActive) {
        res.status(400).json({ error: 'Game is not active.' });
        return;
      }
  
      if (game.board[index] !== '') {
        res.status(400).json({ error: 'Invalid move.' });
        return;
      }
  
      game.board[index] = currentPlayer;
      game.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  
      // Perform any other game logic (e.g., check for a win or tie)
  
      await game.save();
  
      res.json(game);
    } catch (error) {
      console.error('Failed to update the game:', error);
      res.status(500).json({ error: 'Failed to update the game.' });
    }
  });
  
  // ...
  

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
