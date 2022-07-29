<template>
  <div class="hello">
    <h1>设置参与人</h1>
    <el-row>
      <el-button type="primary" @click="OnClick">保存</el-button>
    </el-row>
    <p>勾选设置今日参与的同学({{checkList.length}})</p>
    <el-checkbox-group v-model="checkList">
      <el-checkbox v-for="item in name_list" :key="item.id" :label="item" border>
        {{ item.name }}
      </el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>

import {cloneDeep} from 'lodash';
import axios from 'axios'

export default {
  name: 'SetPage',
  methods: {
    OnClick: function () {
      let player_arr = cloneDeep(this.checkList)
      axios.post("/list", player_arr)
      alert("已设置今日参加同学")
    },
    getCurrentList : function () {
      let _this = this
      axios.get('/list')
          .then(function(response)
          {
            _this.checkList = []
            for (const item of response.data) {
              // 必须要和name list中的对象一致才行
              for (const obj of _this.name_list) {
                if (obj.id === item.id) {
                  _this.checkList.push(obj)
                }
              }
            }
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
    },
    getSvrList : function () {
      let _this = this
      axios.get('/all')
          .then(function(response)
          {
              console.log(response.data);
              _this.name_list = response.data;
              _this.getCurrentList()
          })
          .catch(function (error) { // 请求失败处理
            console.log(error);
          });
    },
  },
  data() {
    return {
      name_list: [],
      checkList: [],
      match_list: [],
    };
  },
  mounted() {
    this.getSvrList()
    // this.checkList = this.name_list
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
