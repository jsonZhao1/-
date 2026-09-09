<template>
  <div>
    <el-container class="index-container">
      <el-header class="index-header"
                 style="height: 80px;width:100%;display: flex;align-items: center;justify-content: space-between"
      >
        <div class="index-exit" @click="logout"></div>
        <div class="exam-back-right" @click="screenFullToggle()"></div>
      </el-header>
      <div class="index-title"/>
      <el-main class="index-main">
        <div class="home">
          <div v-show="prevFlag" class="prev" @click="prev"></div>
          <div class="index-block">
            <div v-if="list.length > 0" class="index-block-block" v-for="(identifierClass, index) in list" :key="index">
              <img v-if="index >= currentIndex && index < currentIndex + 3" class="block-img" alt=""
                   :src="identifierClass.imgUrl" @click="gotoIdentifier(identifierClass.name,identifierClass.status)"
              />
            </div>
            <div v-else class="index-block">
              <span style="font-size: 40px; color: #FFFFFF">暂无数据</span>
            </div>
          </div>
          <div v-show="nextFlag" class="next" @click="next"></div>
        </div>
      </el-main>
    </el-container>
  </div>

</template>

<script>
import { MessageBox } from 'element-ui'
import { videoUrl, startTimer, endTimer } from '@/utils/yyh'
import { getBackUrl } from '@/api/login'
import { db } from '@/dexie'

const { ipcRenderer } = window.require('electron')
const Store = window.require('electron-store')
const store = new Store()
export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      list: [],
      queryParams: { pageNum: 1, pageSize: 3 },
      total: 0,
      nextFlag: false,
      currentIndex: 0,
      prevFlag: false,
      voiceUrl: null
    }
  },
  watch: {},
  beforeDestroy() {
    // endTimer()
  },
  created() {
    // startTimer()
    this.getList()
    // this.getBackImgUrl()
    ipcRenderer.send('window-open')
  },
  methods: {
    getBackImgUrl() {
      getBackUrl().then(res => {
        this.voiceUrl = res.data.voiceUrl
        this.play()
      })

    },
    play() {
      this.$root.$children[0].$refs.MusicPlay.src = this.voiceUrl
      this.$root.$children[0].$refs.MusicPlay.volume = 0.2
      this.$root.$children[0].$refs.MusicPlay.currentTime = 0
      this.$root.$children[0].$refs.MusicPlay.play()
    },
    getList() {
      this.db.open()
        .then(() => {
          console.log('数据库已打开');
          // 进行其他数据库操作
          let query = this.db.markClass.toCollection().filter(record => record.enableFlag === 1)
          console.log(query)
          query.count().then(res => {
            console.log(res)
            const startIndex = (this.queryParams.pageNum - 1) * this.queryParams.pageSize
            query.offset(startIndex).limit(this.queryParams.pageSize).toArray().then(records => {
              this.total = res
              this.list = records
              const currentCount = records.length
              const remainingCount = res - startIndex - currentCount
              this.nextFlag = remainingCount > 0
              this.prevFlag = this.queryParams.pageNum != 1
            })
          })
        })

      console.log(this.db.markClass)
    },
    screenFullToggle() {
      this.$root.$children[0].pay()
      ipcRenderer.send('window-min')
    },
    logout() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      // MessageBox.confirm('确定注销并退出系统吗？', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {
        this.$router.push({ path: '/' })
        // this.$store.dispatch('LogOut').then(() => {
        //   ipcRenderer.send('secondaryWindow-close')
        //   store.set('token', '')
        //   this.$router.push({ path: '/login' })
        // })
      // }).catch(() => {
      // })
    },
    prev() {
      this.$root.$children[0].pay()
      this.queryParams.pageNum = this.queryParams.pageNum - 1
      this.getList()
      // videoUrl(this.$root.$children[0])
    },
    next() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0])
      this.queryParams.pageNum = this.queryParams.pageNum + 1
      this.getList()
    },
    gotoIdentifier(name, status) {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      this.$router.push({
        path: '/study/identifier',
        query: {
          name: name,
          status: status
        }
      })
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
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

.index-container {
  height: 1080px;
  background: url("../assets/images/bg.png");
  position: relative;

  .index-title {
    position: absolute;
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
