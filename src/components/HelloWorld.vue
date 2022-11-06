<template>
  <div class="hello">
    <h1>NExT 羽毛球随机分组</h1>
    <span>场地数</span>
    <el-radio-group v-model="plate">
      <el-radio :label="1">1</el-radio>
      <el-radio :label="2">2</el-radio>
      <el-radio :label="3">3</el-radio>
      <el-radio :label="4">4</el-radio>
    </el-radio-group>
    <p>勾选参与分组同学({{ checkList.length }}) </p>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in name_list" :key="item" :label="item">
        {{ item }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row>
      <el-button type="primary" @click="OnClick" icon="el-icon-refresh">随机分组</el-button>
      <el-button type="primary" :disabled="b_voice_on" v-if="match_list.length > 0" @click="OnVoice" icon="el-icon-refresh">{{voice_text}}</el-button>
      <el-button type="danger" @click="OnSave" icon="el-icon-upload">保存结果</el-button>
    </el-row>
    <el-row>
      <div v-for="(obj, index) in match_list" :key="obj[0]">
        <p>
          场地{{ index + 1 }}
        </p>
        <div v-if="obj[2]">
          <el-row type="flex" class="row-bg" justify="space-around">
            <el-col :span="8">
              <el-row>
                <el-tag type="success">
                  {{ obj[0] }}
                </el-tag>
              </el-row>
              <el-row>
                <el-tag type="success">
                  {{ obj[1] }}
                </el-tag>
              </el-row>
            </el-col>
            <el-col :span="2">VS</el-col>
            <el-col :span="8">
              <el-row>
                <el-tag type="success">
                  {{ obj[2] }}
                </el-tag>
              </el-row>
              <el-row v-if="obj[3]">
                <el-tag type="success">
                  {{ obj[3] }}
                </el-tag>
              </el-row>
            </el-col>
          </el-row>
        </div>
        <div v-else>
          <el-row>
            <el-col :span="11">
              <el-tag type="success">
                {{ obj[0] }}
              </el-tag>
            </el-col>
            <el-col :span="2">VS</el-col>
            <el-col :span="11">
              <el-tag type="success">
                {{ obj[1] }}
              </el-tag>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-row>
    <el-row v-if="rest_list.length > 0">
      <p>
        本场休息:
      </p>
      <el-tag v-for="item in rest_list" :key="item" type="danger">
        {{ item }}
      </el-tag>
    </el-row>
    <el-row v-if="black_list.length > 0">
      <p>
        今日已休息列表:
        <el-button type="danger" @click="OnEmptyBlack" icon="el-icon-delete" circle>重置</el-button>
      </p>
      <el-tag v-for="item in black_list" :key="item" type="info">
        {{ item }}
      </el-tag>
    </el-row>
  </div>
</template>

<script>

import {cloneDeep, shuffle, slice, includes, uniq, remove} from 'lodash';
import axios from 'axios'
import {MessageBox} from 'element-ui';

export default {
  name: 'HelloWorld',
  methods: {
    OnEmptyBlack: function () {
      this.black_list = []
    },
    OnSave: function () {
      this.black_list.push(...this.rest_list)
      this.black_list = uniq(this.black_list)
      axios.post('/black', this.black_list)
    },
    GenerateRestPlayer: function () {
      let player_arr = cloneDeep(this.checkList)

      const cnt = player_arr.length
      const max_player = 4 * this.plate
      const need_rest_num = cnt - max_player

      this.rest_list = []
      let new_rest_players = []
      if (need_rest_num > 0) {
        let non_rest_players = []
        for (const name of player_arr) {
          if (includes(this.black_list, name)) {
            continue
          }
          non_rest_players.push(name)
        }

        if (non_rest_players.length < need_rest_num) {
          MessageBox.confirm(`大部分玩家已轮空过了，建议重置休息列表`, '提醒', {
            confirmButtonText: '确定重置',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.OnEmptyBlack()
          }).catch(() => {
            console.log("cancel")
          })
          return player_arr
        }

        non_rest_players = shuffle(non_rest_players)
        new_rest_players = slice(non_rest_players, 0, need_rest_num)
        for (const rest_player of new_rest_players) {
          remove(player_arr, (o) => {
            return o === rest_player
          })
        }
        this.rest_list = new_rest_players
      }
      player_arr = shuffle(player_arr)

      return player_arr
    },
    SetMatchPlace(player_arr) {
      this.match_list = []
      for (let i = 0; i < this.plate; ++i) {
        const match_obj = {}
        for (let j = 0; j < 4; ++j) {
          const p_name = player_arr[i * 4 + j]
          if (p_name) {
            match_obj[j] = p_name
          } else {
            break
          }
        }
        if (match_obj[0]) {
          this.match_list.push(match_obj)
        }
      }
    },
    OnClick: function () {
      const player_arr = this.GenerateRestPlayer()
      this.SetMatchPlace(player_arr)
    },
    OnVoiceEnd: function () {
      console.log("event finished.");
    },
    OnVoice: function () {
      if (this.match_list.length === 0) {
        MessageBox.alert("请先随机分组")
        return
      }
      if (this.b_voice_on) {
        return
      }
      const reqObj = {
        match_list: this.match_list,
        rest_list: this.rest_list
      }
      const _this = this
      this.voice_text = "播放中"
      this.b_voice_on = true
      axios.post('/tts', reqObj)
          .then(function (response) {
            if (response.data && response.data.Audio) {
              const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
              const audio = Uint8Array.from(window.atob(response.data.Audio), c => c.charCodeAt(0))
              audioCtx.decodeAudioData(audio.buffer, function (audioBuffer) {
                var source = audioCtx.createBufferSource()
                source.buffer = audioBuffer
                source.connect(audioCtx.destination)
                source.start(0) // 立即播放
                source.onended = () => {
                  _this.OnVoiceEnd()
                  _this.voice_text = "语音播报"
                  _this.b_voice_on = false
                };
              });
            } else {
              MessageBox.alert("TTS服务失败，请联系Grissom上腾讯云续费")
              _this.b_voice_on = false
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
            _this.b_voice_on = false
          });
    },
    getSvrList: function () {
      const _this = this
      axios.get('/list')
          .then(function (response) {
            console.log(response);
            const list = response.data.map(row => row.name)
            _this.checkList = list
            _this.name_list = list
            _this.plate = Math.floor(_this.name_list.length / 4)
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      axios.get('/black')
          .then(function (response) {
            _this.black_list = response.data;
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
    }
  },
  data() {
    return {
      plate: 3,
      voice_text: "语音播报",
      b_voice_on: false,
      name_list: [],
      rest_list: [],
      checkList: [],
      black_list: [],
      match_list: [],
    };
  },
  mounted() {
    this.getSvrList()
    this.checkList = this.name_list
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

</style>
