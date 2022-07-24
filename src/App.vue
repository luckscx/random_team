<template>
  <div id="app">
    <router-view></router-view>
    <i class="el-icon-tickets"></i>
    <router-link to="/">主页</router-link>
    <i class="el-icon-edit"></i>
    <router-link to="/Set">设置</router-link>
  </div>
</template>

<script>

export default {
  name: 'app',
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
