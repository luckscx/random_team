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
    <p>勾选参与分组同学({{checkList.length}}) </p>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in name_list" :key="item" :label="item">
        {{ item }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row>
      <el-button type="primary" @click="OnClick">随机分组</el-button>
      <el-button type="danger" @click="OnSave">保存结果</el-button>
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
      </p>
      <el-tag v-for="item in black_list" :key="item" type="info">
        {{ item }}
      </el-tag>
    </el-row>
  </div>
</template>

<script>

import {cloneDeep, shuffle, slice, includes, uniq} from 'lodash';
import axios from 'axios'

export default {
  name: 'HelloWorld',
  methods: {
    OnAll: function () {
      if (this.checkList.length < this.name_list.length) {
        this.checkList = this.name_list
      } else {
        this.checkList = []
      }
    },
    OnSave: function () {
      this.black_list.push(...this.rest_list)
      this.black_list = uniq(this.black_list)
      console.log(this.black_list)
      axios.post('/black', this.black_list)
    },
    OnClick: function () {
      this.rest_list = []
      let player_arr = cloneDeep(this.checkList)
      const cnt = player_arr.length
      const max_player = 4 * this.plate
      // 一次随机即可
      player_arr = shuffle(player_arr)
      if (cnt > max_player) {
        this.rest_list = slice(player_arr, max_player)
        player_arr = slice(player_arr, 0, max_player)
      }
      for (const name of this.rest_list) {
        if (includes(this.black_list, name)) {
          alert(`${name}今日已轮空过了，建议重新随机`)
        }
      }
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
    getSvrList : function () {
      const _this = this
      axios.get('/list')
          .then(function(response)
          {
              console.log(response);
              const list = response.data.map( row => row.name)
              _this.checkList = list
              _this.name_list = list
              _this.plate = Math.floor(_this.name_list.length / 4)
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
      axios.get('/black')
          .then(function(response)
          {
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
      name_list: [],
      rest_list: [],
      checkList: [],
      black_list : [],
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
