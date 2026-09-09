<template>
  <div>
<!--    <el-row type="flex" style="background: #3a8ee6">-->
<!--      <el-col :span="1" :push="23"><button @click="close">x</button></el-col>-->
<!--    </el-row>-->
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  data() {
    return {
      name: 'qweqwe'
    }
  },
  methods: {
    close() {
      this.$electron.ipcRenderer.send('window-close')
    }
  }
}
</script>

<style lang="scss" scoped>
//.dashboard {
//  &-container {
//    margin: 30px;
//  }
//  &-text {
//    font-size: 30px;
//    line-height: 46px;
//  }
//}
</style>
