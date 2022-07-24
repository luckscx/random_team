const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db.spl3');
const lodash = require("lodash")

let valid_name = "edwinzhu(朱震鸣);allisonhu(胡艺);andyshen(沈翌达);annietao(陶宇);annkojiang(江媛);binyuyang(杨彬誉);cathyyytian(田璐);darwinyuan(袁海歌);davidcai(蔡奋麟);derekzwang(王征);echoxtli(李秀婷);ericslyang(杨双林);evelynluo(罗雅琦);feizhang(张非);gibsonzhou(周晓峰);grissomshen(沈陈霄);haileyhe(贺艳霞);harveyyuan(袁海宏);hongyizhang(张弘毅);huanhe(何欢);ivyyliu(刘宇靓);jejunzeng(曾杰军);jennywu(吴佳一);jetxie(谢渊);jiajunwang(王嘉军);jianyuyin(尹建宇);jodyleung(jodyleung);jordonhuang(黄佳栋);joshuadai(戴维);junbinlu(卢俊彬);karayang(杨英卓);karoljiang(姜妍琛);kenlou(娄郭樑);kevinlyin(尹小龙);keyzhou(周挺);lynnolin(林雪峰);marspan(潘晨);maximhu(胡喆);miaomiliu(刘敏);mijohuang(黄晓鹤);mztchen(陈正天);nathanpang(庞邵玺);noflyyang(杨吴菲);opentang(唐懿明);patrickyuan(袁培笙);pingpinchen(陈萍);qinxie(谢钦);quinnpan(潘敬奎);robertwan(万洪波);rogerdeng(邓佳伟);rougamozhou(周勋);serenachi(池晨);sophiazhao(赵学英);terryzswang(王泽圣);tobyzhzhang(张华);tomxchen(陈霄);trisswu(吴昊天);v_ayuyzhou(周昱圆);v_azxxzdai(戴泽轩);v_yufeilu(陆雨菲);visionxie(谢淼);waveryu(于波);weiguohan(韩伟国);weixingma(马伟兴);xiaodongyan(严孝东);xuncxchen(陈逊);yuzhouguo(过雨洲);zeroozhang(张麟);zhenghou(侯争);zhenqianlai(賴震謙);zitaoye(叶梓涛);edwinzhu(朱震鸣);ambertzhang(张韵棠);cachediao(刁寿钧);grissomshen(沈陈霄);huanhe(何欢);jennywu(吴佳一);kenlou(娄郭樑);mztchen(陈正天);rebeccawzhu(朱文婕);waveryu(于波);yintaoxu(徐寅韬);zhenghou(侯争)"
valid_name = valid_name.split(";")
valid_name = lodash.uniq(valid_name)

db.serialize(() => {
    db.run("CREATE TABLE player (name TEXT, play_cnt int)");
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