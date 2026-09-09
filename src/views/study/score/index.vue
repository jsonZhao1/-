<script>
import {listScore} from "@/api/study/score";
import {addDateRange, videoUrl} from '@/utils/yyh'
const { ipcRenderer  } = window.require('electron');
export default {
  name: "index",
  data(){
    return{
      scoreList:[],
      open:false,
      loading:true,
      showSearch:true,
      ids:[],
      single:true,
      multiple:true,
      total:0,
      title:'',
      dateRange:[],
      className:'',
      classId:null,
      // queryParams: {
      //   pageNum: 1,
      //   classId: null,
      //   scoreType:'2'
      // },
    }
  },
  created() {
    this.className = this.$route.query.className;
    this.getList()
  },
  methods:{
    getList() {
      let query = this.db.scoreData.toCollection().filter(record => record.className.includes(this.className))
      query.toArray().then(records => {
        const sortedRecords = records.sort((a, b) => b.score - a.score)
        this.scoreList = sortedRecords.map((item, index) => {
          item.ranking = index + 1
          return item
        })
      })
      // this.db.scoreData.orderBy('score').reverse().toArray().then(dataArray => {
      //   this.scoreList = dataArray.map((item, index) => {
      //     item.ranking = index + 1
      //     return item
      //   })
      //   // this.scoreList
      //   // ranking
      //   console.log(this.scoreList)
      // }).catch(function(error) {
      //   console.error('Error querying data: ' + error)
      // })
      // this.loading = true;
      // listScore(addDateRange(this.queryParams,this.dateRange)).then(res => {
      //   this.loading = false;
      //   this.scoreList = res.data;
      // });
    },
    gotoBack(){
      this.$root.$children[0].pay()
      this.$router.back();
    },
    screenFullToggle(){
      this.$root.$children[0].pay()
      ipcRenderer.send('window-min')
    },
  }
}
</script>

<template>
  <el-container class="score-container">
    <el-header class="score-header" style="height: 80px;width:100%;display: flex;align-items: center;justify-content: space-between">
      <div class="score-back" @click="gotoBack"></div>
      <div class="exam-back-right" @click="screenFullToggle()"></div>
    </el-header>
    <el-main class="score-main">
      <div class="score-img">
        <div class="score-top">
          <div style="width: 1543px;">
            <el-row>
              <el-col class="score-column" :span="3">
                <span class="column-name">排名</span>
              </el-col>
              <el-col class="score-column" :span="4">
                <span class="column-name">姓名</span>
              </el-col>
              <el-col class="score-column" :span="5">
                <span class="column-name">类型</span>
              </el-col>
              <el-col class="score-column" :span="6">
                <span class="column-name">成绩</span>
              </el-col>
              <el-col class="score-column" :span="6">
                <span class="column-name">上传时间</span>
              </el-col>
            </el-row>
          </div>
          <div class="score-body">
            <el-form ref="form">
            <el-form-item v-for="(it, index) in scoreList" prop="rank">
              <div v-if="index===0" class="score-pic1">
                <el-row>
                  <el-col class="score-column" :span="3">
                    <span class="score-font">{{ it.ranking }}</span>
                  </el-col>
                  <el-col class="score-column" :span="4">
                    <span class="score-font">{{ it.name }}</span>
                  </el-col>
                  <el-col class="score-column" :span="5">
                    <span class="score-font">{{ it.className }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.score }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.starTimer }}</span>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="index===1" class="score-pic2">
                <el-row>
                  <el-col class="score-column" :span="3">
                    <span class="score-font">{{ it.ranking }}</span>
                  </el-col>
                  <el-col class="score-column" :span="4">
                    <span class="score-font">{{ it.name }}</span>
                  </el-col>
                  <el-col class="score-column" :span="5">
                    <span class="score-font">{{ it.className }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.score }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.starTimer }}</span>
                  </el-col>
                </el-row>
              </div>
              <div v-else-if="index===2" class="score-pic3">
                <el-row>
                  <el-col class="score-column" :span="3">
                    <span class="score-font">{{ it.ranking }}</span>
                  </el-col>
                  <el-col class="score-column" :span="4">
                    <span class="score-font">{{ it.name }}</span>
                  </el-col>
                  <el-col class="score-column" :span="5">
                    <span class="score-font">{{ it.className }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.score }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.starTimer}}</span>
                  </el-col>
                </el-row>
              </div>
              <div v-else class="score-pic">
                <el-row>
                  <el-col class="score-column" :span="3">
                    <span class="score-font">{{ it.ranking }}</span>
                  </el-col>
                  <el-col class="score-column" :span="4">
                    <span class="score-font">{{ it.name }}</span>
                  </el-col>
                  <el-col class="score-column" :span="5">
                    <span class="score-font">{{ it.className }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.score }}</span>
                  </el-col>
                  <el-col class="score-column" :span="6">
                    <span class="score-font">{{ it.starTimer }}</span>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.score-img {
  background: url("../../../assets/images/界面.png");
  width: 1735px;
  height: 944px;
}
.score-body {
  height: 800px;
  overflow: auto;
}
.score-body::-webkit-scrollbar {
  display: none;
}

.score-header {
  height: 90px;
  line-height: 90px;
}

.score-main {
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-container {
  background: url("../../../assets/images/bj03.png");
  height: 1080px;
}

.score-top {
  margin-left: 100px;
  margin-top: 70px;
}

.column-name {
  font-size: 25px;
  color: #2e24b4;
  font-weight: bold;
  margin-bottom: 10px;
}

.score-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.score-font {
  font-size: 22px;
  color: #5850bd;
  font-weight: bold;
}

.score-pic1 {
  background: url("../../../assets/images/第一名.png");
  width: 1543px;
  height: 119px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.score-pic2 {
  background: url("../../../assets/images/第二名.png");
  width: 1543px;
  height: 119px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.score-pic3 {
  background: url("../../../assets/images/第三名.png");
  width: 1543px;
  height: 119px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.score-pic {
  background: url("../../../assets/images/其他排名.png");
  width: 1543px;
  height: 119px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}
.score-back {
  background: url("../../../assets/images/返回.png");
  width: 90px;
  height: 52px;
  margin: 15px;
}
.score-back:active {
  background: url("../../../assets/images/返回-点击.png");
  width: 106px;
  height: 70px;
  margin-top: 6px;
  margin-left: 8px;
}
.exam-back-right {
  background: url("../../../assets/images/fullScreen.png");
  background-size: 100%;
  width: 53px;
  height: 52px;
  margin: 15px;
}
</style>
