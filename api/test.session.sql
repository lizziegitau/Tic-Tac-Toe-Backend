-- Specify the database to use
USE giraffe;

-- Create the 'players' table to store player profiles
--@block
CREATE TABLE players (
    username VARCHAR(50) PRIMARY KEY ,
    password VARCHAR(255) NOT NULL,
    CONSTRAINT uc_username UNIQUE (username)
);

-- Create the 'games' table to store game information
--@block
CREATE TABLE games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    player1 VARCHAR(50) NOT NULL,
    player2 VARCHAR(50) NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME,
    winner VARCHAR(50),
    CONSTRAINT fk_winner FOREIGN KEY (winner) REFERENCES players(username)
);

-- Create the 'moves' table to store move details
--@block
CREATE TABLE moves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    player VARCHAR(50) NOT NULL,
    position INT NOT NULL,
    move_time DATETIME NOT NULL,
    FOREIGN KEY (game_id) REFERENCES games(id),
    CONSTRAINT fk_player FOREIGN KEY (player) REFERENCES players(username)
);

-- Select game information for a specific game ID
--@block
SELECT *
FROM games
WHERE id = 1;

-- Select move details for a specific game ID
--@block
SELECT *
FROM moves
WHERE game_id = 1;

-- Select player profiles
--@block
SELECT *
FROM players;
