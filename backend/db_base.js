const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.spl3');

const player_map = {}

db.all("SELECT rowid AS id, name, play_cnt, nickname FROM player", (err, rows) => {
    for (const row of rows) {
        player_map[row.name] = row
    }
});


const getNickName = name => {
    if (player_map[name]) {
        return player_map[name].nickname
    }
    return name;
};

module.exports = {
    getNickName
}
