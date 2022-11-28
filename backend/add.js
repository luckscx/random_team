const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.spl3');
const lodash = require("lodash")
const process = require("process")

let valid_name = "金炯;李书宇;季天成;邢洁琼"
if (process.argv.length == 3)
{
    valid_name = process.argv[2]
}
console.log(valid_name)
valid_name = valid_name.split(";")
valid_name = lodash.uniq(valid_name)

db.serialize(() => {
    const stmt = db.prepare("INSERT INTO player(name,play_cnt,nickname) VALUES (?, ?, ?)");
    valid_name.forEach((name) => {
        stmt.run(name,0, name);
    })
    stmt.finalize();

    db.each("SELECT rowid AS id, name, play_cnt, nickname, FROM player", (err, row) => {
        console.log(row.id,row.name, row.play_cnt, row.nickname);
    });
});

db.close();
