
const env = process.env
const SecretID = env["TC_SECRETID"]
const SecretKey = env["TC_SECRETKEY"]

//const VoiceType = 101027 //精品
const VoiceType = 1001 //普通

module.exports = {
    SecretID,
    SecretKey,
    VoiceType
}
