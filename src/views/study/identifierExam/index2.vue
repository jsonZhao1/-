<script>
import { listIdentifier, idenClassTreeSelect } from '@/api/study/identifier'
import { endTimer } from '@/utils/yyh'

const { remote, clipboard, ipcRenderer } = window.require('electron')
export default {
  name: 'index2',
  data() {
    return {
      classId: null,
      identifierList: [],
      loading: true,
      total: 0,
      form: {
        questionType: null,
        identifierUrl: null,
        num: null
      },
      idenClassOptions: undefined,
      currentIndex: 0,
      storeData: [],
      totalCn: 0
    }
  },
  created() {
    ipcRenderer.on('fourthWindow-data', (event, message) => {
      // console.log(message,'3388')
      // this.classId = message.classId;
      // this.getList()
    })
    ipcRenderer.on('get_fourthWindowData', (event, message) => {

      this.form = message
        this.storeData = this.form.selectorDataList.filter(item => this.form.classList.includes(item.id + ''))


      // if (message.num == 1) {
      // } else {
      //   this.storeData = this.identifierList.filter(elem => {
      //     const matchedElem = message.data.find(item => item === elem.id);
      //     return matchedElem !== undefined;
      //   });
      // }
    })
  },
  mounted() {

  },
  methods: {
    // getList() {
    //   this.loading = true;
    //   listIdentifier(this.classId).then(res => {
    //     this.loading = false;
    //     this.identifierList = res.rows;
    //     this.total = res.total;
    //   });
    // }
  }
}
</script>

<template>
  <el-container class="study-container">
    <el-main class="study-main">
      <div class="exam-main" v-if="form.identifierUrl || form.sceneUrl">
        <el-form :model="form" label-width="80px">
          <div class="exam-desc-question">
            <div style="position: absolute; margin-left: 300px; margin-top: 28px; width: 200px;text-align: center">
              <span style="font-size: 30px">第{{ form.totalCn }}题</span>
            </div>
            <div style="position: absolute; margin-left: 100px; margin-top: 128px; width: 650px;text-align: left"
                 v-if="form.questionType==1"
            >
              <span style="font-size: 30px; color: #FFFFFF">{{ form.total }}.请问以下标识的含义是什么？请点击<span
                  style="color: #E6A23C"
              >右侧</span>选项确定答案</span>
            </div>
            <div style="position: absolute; margin-left: 100px; margin-top: 128px; width: 650px;text-align: left"
                 v-if="form.questionType==2"
            >
              <span style="font-size: 30px; color: #FFFFFF">{{ form.total }}.请问以下场景将用到哪几个标识？请点击<span
                  style="color: #E6A23C"
              >右侧</span>选项确定答案</span>
            </div>
            <div style="position: absolute; margin-left: 160px; margin-top: 230px">
              <img :src="form.questionType==1?form.identifierUrl:form.sceneUrl" style="width: 500px;height: 500px"
                   alt=""
              >
            </div>
          </div>
          <div class="exam-desc-answer" style="padding: 40px">
            <div v-if="form.questionType==2" >
              <div style="display: flex;align-items: center;margin-bottom: 40px">
                <div style="font-size: 30px;color: #FCE326;margin-right: 20px">正确答案:</div>
                <div class="exam-result-answer-true" style="display: flex;flex-wrap: wrap;" v-if="form.type == 2">
                  <div v-for="(item,index) in storeData" :key="index" class="itemBg2" style="display:flex;
              width: 120px;height: 120px;align-items: center;justify-content: center;margin-right: 10px"
                  >
                    <img :src="item.identifierUrl" alt="" style="width: 90px;height: 90px">
                  </div>
                </div>
              </div>
            </div>
            <div style="margin: 25% 120px;" v-if="form.questionType==1">
              <div class="exam-result-answer-true" v-if="form.type == 2">
                <el-row>
                  <el-col :span="24" style="display: flex;align-items: center;margin-bottom: 40px">
                    <div style="font-size: 30px;color: #FCE326;margin-right: 20px">正确答案:</div>
                    <div class="exam-answer-selector-result" style="flex: 1">
                      <div class="exam-answer-font">{{
                          form.correctTrue.toUpperCase()
                        }}.{{ form[`optionSel${form.correctTrue.toUpperCase()}`] }}
                      </div>
                    </div>
                  </el-col>
                  <el-col :span="24" style="display: flex;align-items: center;">
                    <div style="font-size: 30px;color: #ffffff;margin-right: 20px">你的选择:</div>
                    <div class="exam-answer-selector-result" style="flex: 1">
                      <div class="exam-answer-font">{{
                          form.checkList[0].toUpperCase()
                        }}.{{ form[`optionSel${form.checkList[0].toUpperCase()}`] }}
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-form>
      </div>

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
  height: 860px;
  padding: 0 50px;
  margin-top: 40px;
}

.study-block {
  //margin-left: 85px;
  margin: 0 10px;
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
  background: url("../../../assets/images/bj04.png");
  height: 1080px;
}

.biaoshikuang1 {
  background: url("../../../assets/images/标识框_01.png");
  background-size: cover;

  img {
    width: 89px;
    height: 89px
  }
}

.biaoshikuang2 {
  background: url("../../../assets/images/标识框_02.png");
  background-size: cover;

  img {
    width: 89px;
    height: 89px
  }
}

.block-block {
  //background: url("@/assets/images/标识框_01.png");
  width: 137px;
  height: 137px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
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

.exam-main {
  position: relative;
  width: 100%;
  height: 897px;
  margin-top: 50px;
}

.exam-desc-question {
  position: absolute;
  background: url("../../../assets/images/考核内容界面.png");
  width: 801px;
  height: 897px;
  margin-left: -12px;
}

.exam-desc-answer {
  position: absolute;
  background: url("../../../assets/images/题目界面.png");
  width: 1113px;
  height: 897px;
  margin-left: 778px;
}

.itemBg2 {
  background: url("../../../assets/images/标识框_02.png");
  background-size: 100%;
}

::-webkit-scrollbar {
  width: 0px;
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
</style>
