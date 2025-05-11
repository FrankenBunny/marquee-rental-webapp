/* Gamla koden
CREATE TABLE marquee_user {
    INT PRIMARY KEY id,
    VARCHAR(50) UNIQUE username, 
};
*/

CREATE TABLE marquee_user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE
);
