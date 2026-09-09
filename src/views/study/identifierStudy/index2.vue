<script>
import { endTimer } from '@/utils/yyh'

const { remote, clipboard, ipcRenderer } = window.require('electron')
export default {
  name: 'index',
  data() {
    return {
      loading: false,
      total: 0,
      form: {},
      currentIndex: 0,
      list: [],
      prevFlag: false,
      nextFlag: false,
      className: null,
      itemId: '',
      queryParams: { pageNum: 1, pageSize: 18 }
    }
  },
  created() {
    // endTimer()
    ipcRenderer.on('thirdWindow-data', (event, message) => {
      console.log(message, '3388')
      this.className = message.className
      this.getList()
    })
    ipcRenderer.on('get_thirdWindowData', (event, message) => {
      this.itemId = message.id
      this.queryParams.pageNum = message.index
      this.getList()
    })
  },
  methods: {
    getList() {
      let query = this.db.markStudy.toCollection().filter(record => record.className.includes(this.className))
      query.count().then(res => {
        this.total = res
        const startIndex = (this.queryParams.pageNum - 1) * this.queryParams.pageSize
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
    <!--    <el-header class="study-header">-->
    <!--      <div class="study-back" @click="gotoBack"></div>-->
    <!--    </el-header>-->
    <el-main class="study-main">
      <!--      <div v-show="prevFlag" class="prev" ></div>-->
      <div class="identifier-img">
        <!--        <div style="height: 36px"></div>-->
        <div class="study-body">
          <div v-if="list.length > 0" class="study-block" v-for="(identifier, index) in list" :key="index">
            <div class="block-block"
                 :class="{ 'biaoshikuang2': itemId === identifier.id,
                         'biaoshikuang1': itemId !== identifier.id,
                         'block-wn': itemId === identifier.id,
                        }"
                        >
              <img alt="" style="" :src="identifier.identifierUrl"/>
            </div>
          </div>
          <div v-else class="study-block">
            <span>暂无数据</span>
          </div>
        </div>
      </div>
      <!--      <div v-show="nextFlag" class="next" ></div>-->
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
}

.study-body {
  height: 895px;
  display: flex;
  flex-wrap: wrap;
  //align-items: center;
  justify-content: center;
  margin-top: 35px;
}

.study-block {
  display: flex;
  justify-content: center;
  //flex-wrap: wrap;
  //margin-left: 85px;
  //display: inline-block;
  //float: left;
  flex: 0 0 calc(16.666% - 10px);
  position: relative;
  height: 30%;
  align-items: center;
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
  background: url("../../../assets/images/bj04.png");
  height: 1080px;
}

.biaoshikuang1 {
  background: url("../../../assets/images/标识框_01.png");

  img {
    width: 149px;
    height: 149px
  }
}

.biaoshikuang2 {
  background: url("../../../assets/images/标识框_02.png");
  background-size: 100%;
  background-repeat: no-repeat;
  img {
    width: 70%;
    height: 70%;
  }
}

//.block-w {
//  width: 161px !important;
//  height: 161px !important;
//}
.block-wn{
  width: 90% !important;
  height: 90% !important;
}
.block-block {
  //background: url("@/assets/images/标识框_01.png");
  width: 181px;
  height: 181px;
  display: flex;
  justify-content: center;
  align-items: center;
  //flex: 0 0 calc(16.666% - 10px); /* 每行显示6个元素，减去间隔 */
  //margin: 5px; /* 设置元素之间的间隔 */
  //text-align: center;
  //display: flex;
  //align-items: center;
  //justify-content: center;
  //margin-top: 80px;
}

.study-back {
  background: url("../../../assets/images/返回.png");
  width: 90px;
  height: 52px;
  margin: 15px;
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
</style>
