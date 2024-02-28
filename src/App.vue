<template>
  <div id="app">
    <router-view></router-view>
    <i class="el-icon-tickets"></i>
    <router-link to="/">主页</router-link>
    <i class="el-icon-edit"></i>
    <router-link to="/Set">设置</router-link>
    <div id="footer">
       备案号: <a href="https://beian.miit.gov.cn/" target="_blank">沪ICP备17037346号-2</a>
    </div>
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

#footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 2.5rem;            /* Footer height */
}

@media screen and (max-width: 750px) {
  .el-message-box {
    width: 70% !important;
  }
}
</style>
