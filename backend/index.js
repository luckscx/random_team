var express = require('express')
var app = express()
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.spl3');
const tts = require("./tts")

app.use(express.json());

let list = []
let black_list = []
const player_map = {}

db.all("SELECT rowid AS id, name, play_cnt, nickname FROM player", (err, rows) => {
    for (const row of rows) {
        player_map[row.name] = row
    }
});


const check_list = function(ll){
    if (ll.length > 24 || ll.length <= 0 ) {
        console.log(ll.length)
        return false
    }
    for (const row of ll) {
        if (!row || (!player_map[row.name] && !player_map[row])) {
            console.log(row)
            return false
        }
    }
    return true
}

app.get('/list', function (req, res) {
    res.send(list)
})

app.post('/list', function (req, res) {
    if (!check_list(req.body)) {
        res.send("e")
        return
    }
    for (const row of req.body) {
       const sql = `UPDATE player set play_cnt = play_cnt + 1 where name = '${row.name}'`
       db.run(sql)
    }
    black_list = []
    list = req.body
    res.send(list)
})

app.get('/all', function (req, res) {
    db.all("SELECT rowid AS id, name, play_cnt FROM player order by play_cnt DESC", (err, rows) => {
        res.send(rows)
    });
})

app.get('/black', function (req, res) {
    res.send(black_list)
})

app.post('/black', function (req, res) {
    if (!check_list(req.body)) {
        res.send("e")
        return
    }
    black_list = req.body
    res.send(black_list)
})

app.post('/tts', function (req, res) {
    tts.trans(req.body).then(vo => {
        res.send(vo)
    })
})

app.delete('/black', function (req, res) {
    black_list = []
    res.send(black_list)
})

const port = 12000
console.log("listen on %d",port)
app.listen(port)
