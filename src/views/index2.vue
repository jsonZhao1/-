<template>
  <div>
    <el-container class="index-container">
      <div class="index-title"/>
    </el-container>
  </div>

</template>

<script>
import {endTimer} from "@/utils/yyh";

const { ipcRenderer  } = window.require('electron');
const Store = window.require('electron-store');
const store = new Store();
export default {
  name: 'Login',
  data() {
    return {
    }
  },
  watch: {

  },
  created() {
    // endTimer()
    // ipcRenderer.on('get_data', (event, message) => {
    //   if(message.status ==='1'){
    //     this.$router.push(`/identifierStudy?classId=${message.classId}`)
    //   }else if(message.status ==='2'){
    //     this.$router.push(`/identifierExam2?classId=${message.classId}`)
    //   }
    // })
  },
  methods: {

  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.home {
  position: relative;
  height: 100%;
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
}
.index-container{
  height: 1080px;
  background: url("../assets/images/bg.png");
  position:relative;
  .index-title {
    position:absolute;
    top: 75px;
    left: 505px;
    width: 912px;
    height: 106px;
    background: url("../assets/images/安全标识学习系统.png");
  }
}
.index-header {
  height: 5vh;
  line-height: 60px;
  margin-top: 18px;
}
.index-main {
  height: 95vh;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 160px;
}
.index-block {
  position: absolute;
  width: 1400px;
  padding: 30px;
  margin-top: 100px;
}
.block-img {
  margin: 50px;
  width: 335px;
  height: 446px;
}
.index-exit {
  background: url("../assets/images/退出.png");
  background-size: 100%;
  width: 187px;
  height: 55px;
  margin: 15px;
}
.index-exit:active {
  background: url("../assets/images/退出-点击.png");
  background-size: 100%;
}
.prev {
  position: absolute;
  background: url("../assets/images/prev.png");
  width: 71px;
  height: 129px;
  margin-left: -1480px;
}
.next {
  position: absolute;
  background: url("../assets/images/next.png");
  width: 71px;
  height: 129px;
  margin-left: 1480px;
}
.index-block-block {
  float: left;
}
.exam-back-right {
  background: url("../assets/images/fullScreen.png");
  background-size: 100%;
  width: 53px;
  height: 52px;
  margin: 15px;
}
</style>
