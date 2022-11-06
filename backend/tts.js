// Depends on tencentcloud-sdk-nodejs version 4.0.3 or higher
const tencentcloud = require("tencentcloud-sdk-nodejs");
const TtsClient = tencentcloud.tts.v20190823.Client;
const md5 = require("md5")
const cfg = require("./config.js")
const SecretID = cfg.SecretID
const SecretKey = cfg.SecretKey
const db_base = require("./db_base.js")
const getNickName = db_base.getNickName
const LRU = require('lru-cache')

const options = {
    max: 200,
    // how long to live in ms
    ttl: 1000 * 60 * 10,
    // return stale items before removing from cache?
    allowStale: false,
    updateAgeOnGet: false,
    updateAgeOnHas: false,
}

const cache_vo = new LRU(options)

// 实例化一个认证对象，入参需要传入腾讯云账户secretId，secretKey,此处还需注意密钥对的保密
// 密钥可前往https://console.cloud.tencent.com/cam/capi网站进行获取
const clientConfig = {
    credential: {
        secretId: SecretID,
        secretKey: SecretKey,
    },
    region: "ap-hongkong",
    profile: {
        httpProfile: {
            endpoint: "tts.ap-hongkong.tencentcloudapi.com",
        },
    },
};

// 实例化要请求产品的client对象,clientProfile是可选的
const client = new TtsClient(clientConfig);

const transTextVO = async (text, text_id) => {
    const params = {
        "VoiceType": cfg.VoiceType,
        "SessionId": text_id,
        "SampleRate" : 8000,
        "Volume" : cfg.VoiceVolume,
        "Codec" : "mp3"
    };
    params.Text = text
    return client.TextToVoice(params).then(
        (data) => {
            // const audio = Buffer.from(data.Audio, 'base64')
            // fs.writeFileSync("./t.mp3", audio)
            return data
        },
        (err) => {
            console.error("error", err);
            return null
        }
    );
};

const place_name_map = {
    "0" : "一号场地",
    "1" : "二号场地",
    "2" : "三号场地",
    "4" : "四号场地",
}

const TeamToText = (match_list, rest_list) => {
    let res = ""
    for (let i = 0; i < match_list.length; i++) {
        const place_name = place_name_map[i]
        const obj = match_list[i]
        const p1 = getNickName(obj[0])
        const p2 = getNickName(obj[1])
        const p3 = getNickName(obj[2])
        const p4 = getNickName(obj[3])
        res += `${place_name}, ${p1}和${p2} 对阵 ${p3}和${p4};`
    }

    if (rest_list && rest_list.length > 0)  {
        const name_all = rest_list.map(getNickName).join(",")
        res += `剩下${name_all}休息。`
    }

    return res;
};

const trans = async (reqObj) => {
    const match_list = reqObj.match_list
    const rest_list = reqObj.rest_list
    const vo_text = TeamToText(match_list, rest_list)
    const text_id = md5(vo_text)
    if (cache_vo.get(text_id))  {
        console.log("hit cache %s",vo_text)
        return cache_vo.get(text_id)
    }
    console.log("trans vo %s", vo_text)
    const vo = await transTextVO(vo_text, text_id)
    cache_vo.set(text_id, vo)
    return vo;
};

// const test_text = "场地一，娄师傅和侯争 对阵 Grissom和Edwin；场地二 万洪波和于波 对阵 谢渊和正天"
// const test_obj = {
//     match_list : [["Grissom","kenlou","侯真","弘毅"]],
//     rest_list : ["正天","张皓"]
// }
// trans(test_obj)

module.exports = {
    trans
}
