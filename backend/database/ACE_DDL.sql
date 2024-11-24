--------------------
-- TABLE CREATION --
--------------------

-- Player table
CREATE TABLE IF NOT EXISTS Players (
    playerid INT AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    kill_count INT DEFAULT 0,
    asteroid_score INT DEFAULT 0,
    time int DEFAULT 0,
    Primary KEY(playerid) 
);

--------------------
--   SAMPLE DATA  --
--------------------

-- INSERT Sample data
INSERT INTO Players (name, kill_count, asteroid_score, time)
VALUES ('1337', 1337, 1337, 2),
    ('Arnold', 2029, 1984, 3),
    ('Ron Burgany', 10, 10, 4),
    ('Cristinao Ronaldo', 1200, 890, 4),
    ('Test', 1, 2, 4);
