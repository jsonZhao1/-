<script>
import { videoUrl } from '@/utils/yyh'

const { ipcRenderer } = window.require('electron')
export default {
  data() {
    return {
      className: null,
      status: '1'
    }
  },
  created() {
    this.className = this.$route.query.name
    this.status = this.$route.query.status
    console.log(this.className)
  },
  methods: {
    gotoBack() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      this.$router.push({
        path: '/index'
      })
    },
    screenFullToggle() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      ipcRenderer.send('window-min')
    },
    gotoStudy() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      ipcRenderer.send('window-open2', { className: this.className })
      // ipcRenderer.send('window-open',message)
      this.$router.push({
        path: '/study/identifierStudy',
        query: {
          className: this.className
        }
      })
    },
    firstExam() {
      this.$root.$children[0].pay()
      // let message = {
      //   path:`/identifierExam2?classId=${this.classId}`,
      //   id:'uniqueId2'
      // }
      ipcRenderer.send('window-open3', { className: this.className })
      // ipcRenderer.send('send_data', { status:'2',
      //   classId:this.classId})
      if (this.status === '1') {
        this.$router.push({
          path: '/study/identifierExam',
          query: {
            className: this.className
          }
        })
      } else {
        this.$router.push({
          path: '/changjing',
          query: {
            className: this.className
          }
        })
      }
    },
    gotoRank() {
      this.$root.$children[0].pay()
      this.$router.push({
        path: '/study/score',
        query: {
          className: this.className
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <el-container class="iden-container">
      <!--      <el-header class="iden-header" style="height: 52px;width:100%;display: flex;align-items: center;justify-content: space-between;margin-top: 30px">-->
      <div class="identifier-back" @click="gotoBack"></div>
      <div class="exam-back-right" @click="screenFullToggle()"></div>
      <!--      </el-header>-->
      <!--      <div>{{filteredArray}}</div>-->
      <!--      <div>{{pcdata}}</div>-->
      <div class="iden-title"/>
      <el-main class="iden-main">
        <img class="img-study" style="width: 32%" src="@/assets/images/标识学习.png" @click="gotoStudy" alt="">
        <img class="img-exam" style="width: 32%" src="@/assets/images/认知考试.png" @click="firstExam" alt="">
        <img class="img-rank" style="width: 32%" src="@/assets/images/分数排名.png" @click="gotoRank" alt="">
      </el-main>
    </el-container>
  </div>
</template>

<style scoped lang="scss">
.iden-container {
  background: url("../../../assets/images/bg.png");
  height: 100%;
  position: relative;
}

.iden-title {
  position: absolute;
  top: 75px;
  left: 505px;
  width: 912px;
  height: 106px;
  background: url("../../../assets/images/安全标识学习系统.png");
}

.iden-header {
  height: 90px;
  line-height: 90px;
}

.iden-main {
  height: 100vh;
  color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 160px;
}

.identifier-back {
  background: url("../../../assets/images/返回.png");
  width: 90px;
  height: 52px;
  //margin: 15px;
  position: absolute;
  top: 30px;
  left: 30px;
}

.identifier-back:active {
  background: url("../../../assets/images/返回-点击.png");
  width: 106px;
  height: 70px;
  position: absolute;
  top: 30px;
  left: 30px;
}

.exam-back-right {
  background: url("../../../assets/images/fullScreen.png");
  background-size: 100%;
  width: 53px;
  height: 52px;
  position: absolute;
  top: 30px;
  right: 30px;
  //margin: 15px;
}
</style>
