<script>
const { remote, clipboard, ipcRenderer } = window.require('electron')
export default {
  name: 'index',
  data() {
    return {
      loading: false,
      total: 0,
      queryParams: { pageNum: 1, pageSize: 18 },
      form: {},
      currentIndex: 0,
      list: [],
      prevFlag: false,
      nextFlag: false,
      className: null
    }
  },
  created() {
    this.className = this.$route.query.className
    this.queryParams.pageNum = this.$route.query.pageNum ? this.$route.query.pageNum : 1
    console.log(this.queryParams.pageNum)
    this.getList()
  },
  methods: {
    gotoBack() {
      this.$root.$children[0].pay()
      ipcRenderer.send('thirdWindow-close')
      ipcRenderer.send('thirdWindowSend_data', { id: '', index: 1 })
      this.$router.back()
    },
    screenFullToggle() {
      this.$root.$children[0].pay()
      ipcRenderer.send('window-min')
    },
    prev() {
      this.$root.$children[0].pay()
      this.queryParams.pageNum = this.queryParams.pageNum - 1
      this.getList()
      ipcRenderer.send('thirdWindowSend_data', { id: '', index: this.queryParams.pageNum })
    },
    next() {
      this.$root.$children[0].pay()
      this.queryParams.pageNum = this.queryParams.pageNum + 1
      this.getList()
      ipcRenderer.send('thirdWindowSend_data', { id: '', index: this.queryParams.pageNum })
    },
    handleInfo(item) {
      this.$root.$children[0].pay()
      ipcRenderer.send('thirdWindowSend_data', { id: item.id, index: this.queryParams.pageNum })
      this.$router.replace({
        path: '/study/identifierDesc',
        query: {
          classId: item.id,
          pageNum: this.queryParams.pageNum
        }
      })
    },
    getList() {

      let query = this.db.markStudy.toCollection().filter(record => record.className.includes(this.className))
      query.count().then(res => {
        this.total = res
        console.log(this.queryParams.pageNum,res)
        const startIndex = (Number(this.queryParams.pageNum - 1)) * this.queryParams.pageSize
        console.log(startIndex)
        query.offset(startIndex).limit(this.queryParams.pageSize).toArray().then(records => {
          this.$nextTick(() => {
            this.list = records
          })
          console.log(records)
          const currentCount = records.length
          const remainingCount = res - startIndex - currentCount
          this.nextFlag = remainingCount > 0
          this.prevFlag = this.queryParams.pageNum != 1
        })
      })
    }
  }
}
</script>

<template>
  <el-container class="study-container">
    <!--    <el-header class="study-header" style="height: 80px;width:100%;display: flex;align-items: center;justify-content: space-between">-->
    <div class="study-back" @click="gotoBack"></div>
    <div class="exam-back-right" @click="screenFullToggle()"></div>
    <!--    </el-header>-->
    <el-main class="study-main">
      <div v-show="prevFlag" class="prev" @click="prev"></div>
      <div class="identifier-img">
        <div style="height: 36px"></div>
        <div class="study-body">
          <div v-if="list.length > 0" class="study-block" v-for="(identifier, index) in list"
               :key="index"
          >
            <div class="block-block">
              <img alt="" style="width: 149px; height: 149px" :src="identifier.identifierUrl"
                   @click="handleInfo(identifier)"
              />
            </div>
          </div>
          <div v-else class="study-block">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
      <div v-show="nextFlag" class="next" @click="next"></div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.identifier-img {
  background: url("../../../assets/images/界面.png");
  width: 1680px;
  height: 900px;
  background-size: cover;
  position: relative;
  margin-top: 50px;
}

.study-body {
  height: 860px;
}

.study-block {
  margin-left: 85px;
  display: inline-block;
  float: left;
  position: relative;
}

.study-header {
  height: 90px;
  line-height: 90px;
}

.study-main {
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.study-container {
  background: url("../../../assets/images/bj02.png");
  height: 1080px;
}

.block-block {
  background: url("../../../assets/images/标识框_01.png");
  width: 181px;
  height: 181px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 80px;
}

.study-back {
  background: url("../../../assets/images/返回.png");
  width: 90px;
  height: 52px;
  position: absolute;
  top: 20px;
  left: 30px;
}

.study-back:active {
  background: url("../../../assets/images/返回-点击.png");
  width: 106px;
  height: 70px;
  margin-top: 6px;
  margin-left: 8px;
}

.prev {
  position: absolute;
  background: url("../../../assets/images/prev.png");
  width: 71px;
  height: 129px;
  margin-left: -1750px;
}

.next {
  position: absolute;
  background: url("../../../assets/images/next.png");
  width: 71px;
  height: 129px;
  margin-left: 1750px;
}

.exam-back-right {
  background: url("../../../assets/images/fullScreen.png");
  background-size: 100%;
  width: 53px;
  height: 52px;
  position: absolute;
  top: 20px;
  right: 30px;
}
</style>
