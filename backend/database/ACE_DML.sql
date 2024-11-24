-- GET ALL PLAYERS AND INFO
SELECT * FROM Players;

-- GET ALL PLAYERS NAMES
SELECT name FROM Players;

-- ADD PLAYER after Asteroid game
INSERT INTO Players(name, time, asteroid_score)
VALUES (:name, :time, :asteroid_score)

-- ADD PLAYER after 1v1 match
INSERT INTO Players(name, kill_count)
VALUES (:name, :kill_count)

-- UPDATE 1v1 info for PLAYER
UPDATE Players
SET kill_count = :kill_count;
WHERE playerid = :playerid

-- DELETE PLAYER
DELETE FROM Players WHERE playerid = :playerid

-- GET TOP 10 PLAYERS BY KILL_COUNT
SELECT name, kill_count FROM Players 
ORDER BY kill_count DESC 
LIMIT 5;

-- GET TOP 10 PLAYERS BY ASTEROID_SCORE
SELECT name, asteroid_score FROM Players
ORDER BY asteroid_score DESC
LIMIT 5;