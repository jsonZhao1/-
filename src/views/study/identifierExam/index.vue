<script>
import { addDateRange, parseTime } from '@/utils/yyh'

const { remote, clipboard, ipcRenderer } = window.require('electron')
const synth = window.speechSynthesis
const speech = new SpeechSynthesisUtterance()

export default {
  name: 'index',
  data() {
    return {
      classId: null,
      list: [],
      countStore: 0,
      scoreStore: 0,
      total: 1,
      totalCn: '一',
      courindex: 0,
      dateRange: [],
      open: false,
      loading: true,
      examStatus: 0,
      continueStatus: 0,
      question: '请问以下标识的含义是什么？请点击右侧选项确定答案。',
      checkList: [],
      dialogVisible: false,
      rankDialogVisible: false,
      correctAnswer: null,
      selectorDataList: [],
      oneScore: 0,
      // data:{
      form: {},
      queryParams: {
        className: null
      },
      name: ''
      // }
    }
  },
  created() {
    this.queryParams.className = this.$route.query.className
    this.getList()
  },
  computed: {
    residue() {
      return Number(this.form.answerTotal) - Number(this.checkList.length)
    },
    myChose() {
      return this.selectorDataList.filter(item => this.checkList.includes(item.id))
    }
  },
  methods: {
    closeDialogVisible() {
      this.$root.$children[0].pay()
      this.dialogVisible = false
    },
    openDialogVisible() {
      this.$root.$children[0].pay()
      this.dialogVisible = true
    },
    toBack() {
      this.$root.$children[0].pay()
      synth.cancel()
      let message = {
        path: `/index2`
      }
      ipcRenderer.send('fourthWindowSend_data', message)
      this.$router.push({
        path: '/study/identifier',
        query: {
          name: this.queryParams.className,
          status:'1'
        }
      })
    },
    startTextToSpeech(text) {
      synth.cancel()
      speech.text = text
      synth.speak(speech)
    },
    startExam() {
      this.$root.$children[0].pay()
      if (this.list.length <= 0) {
        this.showMessage({
          message: '暂无考题',
          type: 'warning',
          // duration:0,
          customClass: 'myClass',
          icon: ''
        })
        // this.$modal.msg("暂无考题");
        return
      }

      this.form = this.list[this.courindex]
      let option = [
        { optionSel: 'A', optionDesc: this.form.optionSelA },
        { optionSel: 'B', optionDesc: this.form.optionSelB },
        { optionSel: 'C', optionDesc: this.form.optionSelC },
        { optionSel: 'D', optionDesc: this.form.optionSelD }
      ]
      this.form.option = option
      console.log(this.form)

      // selectorList({ sceneId: this.form.id }).then(res => {
      //   this.selectorDataList = res.data
      // })
      console.log('ppp')
      // if(this.form.questionType ==1){
      let message = this.form
      message.total = this.total
      message.totalCn = this.totalCn
      message.type = 1
      message.questionType = 1
      ipcRenderer.send('fourthWindowSend_data', message)

      // }
      this.startTextToSpeech(this.question)
      this.examStatus = 1
    },
    changeSelector(item) {
      console.log(this.form.answerTotal, this.checkList)

      const index = this.checkList.findIndex(i => i == item.id)
      console.log(index)
      if (index !== -1) {
        this.checkList.splice(index, 1)
      } else {
        if (this.residue !== 0) {
          this.checkList.push(item.id)
        }
      }

    },
    cleanList() {
      this.$root.$children[0].pay()
      this.checkList = []
    },
    continueExam(index, yourOptions, correctTrue) {
      this.$root.$children[0].pay()
      this.examStatus = 1
      this.continueStatus = 0
      this.oneScore = 0
      this.checkList = []
      this.courindex++
      this.countStore++
      // if (yourOptions === correctTrue) {
      //   scoreStore.value += 10;
      // }
      if (this.list.length === 0) {
        this.showMessage({
          message: '暂无考题',
          type: 'warning',
          // duration:0,
          customClass: 'myClass',
          icon: ''
        })
        // this.$modal.alert("暂无考题");
        return
      }
      if (this.countStore > this.list.length - 1) {
        this.examStatus = 2
        return
      }
      this.total = this.countStore + 1
      this.totalCn = this.toChinesNum(this.total)
      this.startExam(yourOptions)
    },
    getList() {
      let query = this.db.topicData.toCollection().filter(record => record.className.includes(this.queryParams.className))
      query.count().then(res => {
        // this.total = res
        query.toArray().then(records => {
          records.sort(() => Math.random() - 0.5)
          // 取出前 10 个随机记录
          const randomRecords = records.slice(0, 10)
          this.list = randomRecords
          console.log(records)
        })
      })
    },
    confirmExam() {
      this.$root.$children[0].pay()
      if (this.checkList.length > 0) {
        this.continueStatus = 1
        if (this.checkList[0].toUpperCase() === this.form.correctTrue.toUpperCase()) {
          this.startTextToSpeech('回答正确')
          this.oneScore += 10
        } else {
          this.startTextToSpeech('回答错误')
        }
        let message = this.form
        message.total = this.total
        message.totalCn = this.totalCn
        message.type = 2
        message.questionType = 1
        message.checkList = this.checkList
        ipcRenderer.send('fourthWindowSend_data', message)
        this.scoreStore += this.oneScore
      } else {
        this.showMessage({
          message: '请选择答案',
          type: 'warning',
          duration: 1000,
          customClass: 'myClass',
          icon: ''
        })
        // proxy.$modal.msgWarning("请选择答案");
      }
    },
    /** 计入排名按钮 */
    addRank() {
      this.$root.$children[0].pay()
      this.rankDialogVisible = true
    },
    closeRankDialogVisible() {
      this.rankDialogVisible = false
      let message = {
        path: `/index2`
      }
      ipcRenderer.send('fourthWindowSend_data', message)
      this.$router.back()
    },
    confirmRank() {
      const scoreRank = {
        name: this.name,
        score: this.scoreStore,
        className: this.queryParams.className,
        starTimer: parseTime(new Date(), '{y}-{m}-{d}')
      }
      this.db.scoreData.add(scoreRank).then(() => {
        this.showMessage({
          message: '新增成功',
          type: 'success',
          duration: 1000,
          customClass: 'myClass'
        })
        this.rankDialogVisible = false
        let message = {
          path: `/index2`
        }
        ipcRenderer.send('fourthWindowSend_data', message)
        this.$router.back()
      }).catch(function(error) {
        console.error('Error adding data: ' + error)
      })
    },
    toChinesNum(num) {
      let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
      let unit = ['', '十', '百', '千', '万']
      num = parseInt(num)
      let getWan = (temp) => {
        let strArr = temp.toString().split('').reverse()
        let newNum = ''
        let newArr = []
        strArr.forEach((item, index) => {
          newArr.unshift(item === '0' ? changeNum[item] : changeNum[item] + unit[index])
        })
        let numArr = []
        newArr.forEach((m, n) => {
          if (m !== '零') numArr.push(n)
        })
        if (newArr.length > 1) {
          newArr.forEach((m, n) => {
            if (newArr[newArr.length - 1] === '零') {
              if (n <= numArr[numArr.length - 1]) {
                newNum += m
              }
            } else {
              newNum += m
            }
          })
        } else {
          newNum = newArr[0]
        }
        if (newNum.startsWith('一十')) {
          newNum = newNum.replace('一十', '十')
        }
        return newNum
      }
      let overWan = Math.floor(num / 10000)
      let noWan = num % 10000
      if (noWan.toString().length < 4) {
        noWan = '0' + noWan
      }
      return overWan ? getWan(overWan) + '万' + getWan(noWan) : getWan(num)
    },
    statusChange(value) {
      this.$root.$children[0].pay()
      if (this.checkList.length > 1) {
        this.checkList.splice(0, 1)
      }
    },
    screenFullToggle() {
      ipcRenderer.send('window-min')
    }
  }
}
</script>

<template>
  <div>
    <el-container class="exam-desc-container">
      <el-header class="exam-header"
                 style="height: 80px;width:100%;display: flex;align-items: center;justify-content: space-between"
      >
        <div class="exam-back" @click="openDialogVisible"></div>
        <div class="exam-back-right" @click="screenFullToggle()"></div>
      </el-header>
      <el-main>
        <!--  开始考核页面  -->
        <div v-if="examStatus === 0" class="exam-main">
          <div class="exam-start-body">
            <div class="exam-start-text">
              <div class="exam-start-font-div">
              <span class="exam-start-font">
                1.进入考核后，系统将从题库中随机选择10道题目；
              </span>
              </div>
              <div class="exam-start-font-div">
              <span class="exam-start-font">
                2.点击对应选项的选中框后并点击【确定】按钮完成回答；
              </span>
              </div>
              <div class="exam-start-font-div">
              <span class="exam-start-font">
                3.每道题完成后将公布本题答案，完成10道题后，考核结束；
              </span>
              </div>
            </div>
          </div>
          <div class="exam-start-btn" @click="startExam">
          </div>
        </div>
        <!--  考核页面  -->
        <div v-else-if="examStatus === 1" class="exam-main">
          <el-form :model="form" label-width="80px">
            <div class="exam-desc-question">
              <div style="position: absolute; margin-left: 300px; margin-top: 28px; width: 200px;text-align: center">
                <span style="font-size: 30px">第{{ totalCn }}题</span>
              </div>
              <div style="position: absolute; margin-left: 100px; margin-top: 128px; width: 650px"
              >
                <span style="font-size: 30px; color: #FFFFFF">{{ total }}.请问以下标识的含义是什么？请点击<span
                  style="color: #E6A23C"
                >右侧</span>选项确定答案</span>
              </div>
              <div style="position: absolute; margin-left: 160px; margin-top: 230px">
                <img :src="form.identifierUrl" style="width: 500px;height: 500px" alt="">
              </div>
            </div>
            <div v-if="continueStatus === 0" class="exam-desc-answer">
              <div class="exam-desc-selector" style="padding-left: 80px">
                <el-row>
                  <el-col>
                    <el-checkbox-group v-model="checkList" @change="statusChange">
                      <!--                      <el-form-item v-for="(it,index) in form.options" prop="optionSel" >-->
                      <div class="exam-answer-selector" v-for="(it,index) in form.option" :key="index"
                           style="margin-bottom: 20px;width: 950px"
                      >
                        <el-checkbox :label="it.optionSel">
                          <!--                            <div class="exam-answer-selector">-->
                          <!--                              <span class="exam-answer-font">-->
                          {{ it.optionSel }}.{{ it.optionDesc }}
                          <!--                              </span>-->
                          <!--                            </div>-->
                        </el-checkbox>
                      </div>
                      <!--                      </el-form-item>-->
                    </el-checkbox-group>
                  </el-col>
                </el-row>
              </div>
              <div class="exam-desc-selector-confirm" @click="confirmExam"></div>
            </div>
            <div v-else class="exam-desc-score">
              <div class="exam-result-score" v-if="checkList.length > 0">
                <span style="font-size: 100px; font-family: '微软雅黑',serif; color: #FFFF00">{{ oneScore }}</span>
              </div>
              <!--                <div v-else class="exam-result-score">-->
              <!--                  <span style="font-size: 80px; font-family: '微软雅黑',serif; color: #FFFF00">0</span>-->
              <!--                </div>-->
              <!--              单选正确答案-->
              <div>
                <div class="exam-result-answer-true">
                  <el-row>
                    <el-col :span="15">
                      <div class="exam-answer-selector-result">
                        <span class="exam-answer-font">{{
                            form.correctTrue.toUpperCase()
                          }}.{{ form[`optionSel${form.correctTrue.toUpperCase()}`] }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
                <!--              单选我的答案-->
                <div class="exam-result-answer-your">
                  <el-row>
                    <el-col :span="15">
                      <div class="exam-answer-selector-result">
                        <span class="exam-answer-font">{{
                            checkList[0].toUpperCase()
                          }}.{{ form[`optionSel${checkList[0].toUpperCase()}`] }}</span>
                      </div>
                    </el-col>
                  </el-row>
                </div>
              </div>
              <!--              继续按钮-->
              <div class="exam-desc-selector-continue" @click="continueExam(1,checkList[0],form.correctTrue)"></div>
            </div>
          </el-form>
        </div>
        <!--   结算页面   -->
        <div v-if="examStatus === 2" class="exam-main">
          <div class="exam-rank-body">
            <div class="exam-rank-score">
              <span style="font-size: 150px; font-family: '微软雅黑',serif; color: #FFFFFF">{{ scoreStore }}</span>
            </div>
          </div>
          <div class="exam-rank-btn" @click="addRank()">
          </div>
        </div>
      </el-main>
    </el-container>
    <el-dialog :visible.sync="dialogVisible">
      <div class="exam-dialog">
        <div class="exam-dialog-cancel" @click="closeDialogVisible">

        </div>
        <div class="exam-dialog-exit" @click="toBack">

        </div>
      </div>
      <!--   <div class="exam-dialog" v-if="dialogVisible" style="position: fixed;top: 90px;left: 50%">-->

      <!--   </div>-->

    </el-dialog>
    <el-dialog :visible.sync="rankDialogVisible" :close-on-click-modal="false" :close-on-press-escape="false"
               :show-close="false"
    >
      <div class="exam-dialog-rank">
        <el-input v-model="name" placeholder="请输入内容"
                  style="position: absolute;top: 80px;padding:0 34px;"
        ></el-input>
        <div class="exam-dialog-cancel" @click="closeRankDialogVisible">

        </div>
        <div class="exam-dialog-add" @click="confirmRank">

        </div>
      </div>
      <!--   <div class="exam-dialog" v-if="dialogVisible" style="position: fixed;top: 90px;left: 50%">-->

      <!--   </div>-->

    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>


::v-deep .el-input .el-input__inner {
  height: 88px !important;
  border: 0px;
  background-color: transparent;
  font-size: 35px;
}

::v-deep .el-checkbox__inner {
  top: 0;
}

::v-deep .el-checkbox {
  display: flex;
}

::v-deep .el-checkbox__label {
  font-size: 45px !important;
  font-weight: bold !important;
  font-family: "微软雅黑", serif;
  color: #0072c6 !important;
  line-height: initial !important;
}

::v-deep .el-dialog {
  background: transparent !important;
  width: 699px;
}

::v-deep .el-pager li {
  background: transparent !important;
}

::v-deep .el-dialog__body {
  padding: 0;
}

::v-deep .el-dialog__header {
  padding: 0;
}
</style>
<style lang="scss">
.myClass {
  background: url("../../../assets/images/messageBg.png");
  background-size: 100%;
  width: 400px;
  height: 60px;
  border: none;

  .el-message__content {
    color: #FFFFFF;
    font-size: 18px;
  }

  .el-icon {
    width: 30px;
    height: 30px;

    svg {
      width: 30px;
      height: 30px;
    }
  }
}

.exam-desc-container {
  background: url("../../../assets/images/bj03.png");
  height: 1080px;
}

.exam-start-body {
  background: url("../../../assets/images/考核说明界面.png");
  width: 1607px;
  height: 640px;
  margin-top: 80px;
  margin-left: 120px;
}

.exam-rank-body {
  background: url("../../../assets/images/本次考核完毕.png");
  width: 1814px;
  height: 594px;
  margin-top: 40px;
}

.exam-start-text {
  padding-top: 170px;
  padding-left: 260px;
}

.exam-start-btn {
  background: url("../../../assets/images/开始考核.png");
  width: 334px;
  height: 127px;
  margin-top: 50px;
  margin-left: 755px;
}

.exam-start-btn:active {
  background: url("../../../assets/images/开始考核-点击.png");
}

.exam-rank-btn {
  background: url("../../../assets/images/计入排行.png");
  width: 374px;
  height: 110px;
  margin-top: 90px;
  margin-left: 755px;
}

.exam-rank-btn:active {
  background: url("../../../assets/images/计入排行-点击.png");
}

.exam-main {
  position: relative;
}

.exam-desc-question {
  position: absolute;
  background: url("../../../assets/images/考核内容界面.png");
  width: 801px;
  height: 897px;
  margin-top: 70px;
  margin-left: -12px;
}

.exam-desc-answer {
  position: absolute;
  background: url("../../../assets/images/题目界面.png");
  width: 1113px;
  height: 897px;
  margin-left: 778px;
  margin-top: 70px;
}

.exam-start-font {
  font-size: 40px;
  font-weight: normal;
  color: #ffffff;
  margin: 20px;
}

.exam-start-font-div {
  padding-top: 22px;
}

.exam-answer-selector {
  display: flex;
  align-items: center;
  background: #ffffff;
  width: 860px;
  height: 80px;
  border-radius: 8px;
}

.exam-answer-selector-result {
  display: flex;
  align-items: center;
  background: #ffffff;
  width: 750px;
  height: 80px;
  padding-left: 70px;
  border-radius: 8px;
}

.exam-answer-font {
  font-size: 45px;
  font-weight: bold;
  font-family: "微软雅黑", serif;
  color: #0072c6;
}

.exam-desc-selector {
  margin-top: 170px;
}

.exam-desc-selector-confirm {
  background: url("../../../assets/images/确定.png");
  width: 277px;
  height: 105px;
  margin-left: 450px;
  margin-top: 130px;
}

.exam-desc-selector-confirm:active {
  background: url("../../../assets/images/确定-点击.png");
}

.exam-desc-selector-confirm-chexiao {
  width: 277px;
  height: 105px;
  background: url("../../../assets/images/chexiao.png");
}

.exam-desc-selector-confirm-chexiao:active {
  background: url("../../../assets/images/chexiao-dianji.png");
}

.exam-desc-score {
  position: absolute;
  background: url("../../../assets/images/得分界面.png");
  width: 1113px;
  height: 897px;
  margin-left: 778px;
  margin-top: 70px;
}

.exam-desc-selector-continue {
  background: url("../../../assets/images/继续.png");
  width: 277px;
  height: 105px;
  margin-left: 450px;
  margin-top: 692px;
}

.exam-desc-selector-continue:active {
  background: url("../../../assets/images/继续-点击.png");
}

.exam-result-score {
  position: absolute;
  text-align: center;
  width: 130px;
  margin-top: 138px;
  margin-left: 470px;
}

.exam-rank-score {
  position: absolute;
  text-align: center;
  width: 280px;
  margin-top: 310px;
  margin-left: 745px;
}

.exam-result-answer-true {
  position: absolute;
  margin-top: 340px;
  margin-left: 250px;
}

.exam-result-answer-your {
  position: absolute;
  margin-top: 500px;
  margin-left: 250px;
}

.el-checkbox__inner {
  width: 60px;
  height: 60px;
  margin-right: 10px;
  left: 868px;
  background: #7171C6;
  border-radius: 7px;
}

.el-checkbox__inner::after {
  width: 20px;
  height: 40px;
  border: 8px solid #FFFF00;
  border-left: 0;
  border-top: 0;
  left: 16px;
  top: 0;
}

.el-checkbox__input.is-checked .el-checkbox__inner::after {
  transform: rotate(33deg) scaleY(1.4);
}

.exam-dialog {
  background: url("../../../assets/images/是否退出考核.png");
  width: 699px;
  height: 366px;
}

.exam-dialog-cancel {
  background: url("../../../assets/images/取消.png");
  width: 234px;
  height: 86px;
  float: left;
  margin-top: 240px;
  margin-left: 50px;
}

.exam-dialog-cancel:active {
  background: url("../../../assets/images/取消-点击.png");
}

.exam-dialog-exit {
  background: url("../../../assets/images/退出2.png");
  width: 234px;
  height: 86px;
  float: left;
  margin-top: 240px;
  margin-left: 80px;
}

.exam-dialog-exit:active {
  background: url("../../../assets/images/退出2-点击.png");
}

.exam-dialog-add {
  background: url("../../../assets/images/确定.png");
  width: 234px;
  height: 86px;
  background-size: cover;
  float: left;
  margin-top: 240px;
  margin-left: 80px;
}

.exam-dialog-add:active {
  background: url("../../../assets/images/确定-点击.png");
}

.exam-back {
  background: url("../../../assets/images/返回.png");
  width: 90px;
  height: 52px;
  margin: 15px;
}

.exam-back:active {
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

.itemStyle {
  width: 120px;
  height: 120px;
  margin-top: 20px;
  margin-right: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.itemBg1 {
  background: url("../../../assets/images/标识框_01.png");
  background-size: 100%;
}

.itemBg2 {
  background: url("../../../assets/images/标识框_02.png");
  background-size: 100%;
}

.exam-dialog-rank {
  background: url("../../../assets/images/输入姓名.png");
  width: 699px;
  height: 366px;
}

</style>
