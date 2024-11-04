CREATE TABLE users (  
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE drawing_board (  
    id INT PRIMARY KEY AUTO_INCREMENT,
    property VARCHAR(50) NOT NULL,
    value TEXT
);

CREATE TABLE cells (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pos_x INT NOT NULL,
    pos_y INT NOT NULL,
    color VARCHAR(255) NOT NULL,
    modified_by INT,
    FOREIGN KEY (modified_by) REFERENCES users(id)
);
