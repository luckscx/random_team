const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.spl3');
const lodash = require("lodash")

let valid_name = "kianagao(高杲);azhangliu(刘品章);bbbjiang(蒋颖文琪);celinzcheng(程征);eduardli(李伟);erieljiang(姜润知);feizhang(张非);flixzhang(张闯);froecholiu(刘芷骏);gamechen(gamechen);grissomshen(沈陈霄);guangyuanli(李广源);hawkenxiong(熊和宽);jintonghan(韩金桐);leiolei(雷翔);leobritxu(许辉);lukezhzhou(周之涵);mikejyao(姚骏);ozzyzhao(赵子叶);policai(蔡梦艺);richardjli(李嘉);rickyhou(侯雨辰);robinrxu(徐荣);simeonma(马辛琢);soddyzhao(赵宇光);stevehong(洪祥健);sunshinehe(贺设霞);trevorjiang(蒋国太);vinhan(韩轶);yintaoxu(徐寅韬);zhangdiren(任张堤)"
valid_name = valid_name.split(";")
valid_name = lodash.uniq(valid_name)

db.serialize(() => {
    db.run("CREATE TABLE player (name TEXT, play_cnt int, nickname TEXT)");
    const stmt = db.prepare("INSERT INTO player(name,play_cnt) VALUES (?, ?)");
    valid_name.forEach((name) => {
        stmt.run(name,0);
    })
    stmt.finalize();

    db.each("SELECT rowid AS id, name, play_cnt FROM player", (err, row) => {
        console.log(row.id,row.name, row.play_cnt);
    });
});

db.close();
