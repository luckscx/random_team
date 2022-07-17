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
    <p>勾选参与分组同学</p>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in name_list" :key="item" :label="item">
        {{ item }}
      </el-checkbox>
    </el-checkbox-group>
    <el-row>
      <el-button type="primary" @click="OnClick">随机分组</el-button>
      <el-button type="danger" @click="OnAll">全选</el-button>
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
        休息中:
      </p>
      <el-tag v-for="item in rest_list" :key="item" type="danger">
        {{ item }}
      </el-tag>
    </el-row>
  </div>
</template>

<script>

import {cloneDeep, shuffle, slice} from 'lodash';

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
    OnClick: function () {
      console.log(this.checkList);
      this.rest_list = []
      let player_arr = cloneDeep(this.checkList)
      const cnt = player_arr.length
      console.log(cnt);
      const max_player = 4 * this.plate
      // 一次随机即可
      player_arr = shuffle(player_arr)
      console.log(max_player);
      if (cnt > max_player) {
        this.rest_list = slice(player_arr, max_player)
        player_arr = slice(player_arr, 0, max_player)
      }
      console.log(this.rest_list);
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
  },
  data() {
    return {
      plate: 2,
      name_list: ["grissomshen", "zhenghou", "kenlou", "davidcai", "edwinzhu",
        "zeroozhang", "jennywu", "hongyizhang", "jetxie", "jejunzeng",
        "v_ayuyzhou", "derekzwang",
        "robertwan", "waveryu", "mztchen"],
      rest_list: [],
      checkList: [],
      match_list: [],
    };
  },
  mounted() {
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
