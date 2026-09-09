<script>
import { videoUrl } from '@/utils/yyh'

const { ipcRenderer } = window.require('electron')
const speech = new SpeechSynthesisUtterance()
import { getIdentifier } from '@/api/study/identifier'

export default {
  name: 'index',
  data() {
    return {
      classId: null,
      form: {},
      synth: window.speechSynthesis,
      showUrlArr: null,
      pageNum: 1
    }
  },
  created() {
    this.classId = this.$route.query.classId
    this.pageNum = this.$route.query.pageNum
    console.log(this.pageNum)
    this.handleInfo()
  },
  methods: {
    toBack() {
      this.$root.$children[0].pay()
      ipcRenderer.send('thirdWindowSend_data', { id: '', index: this.pageNum })
      // videoUrl(this.$root.$children[0].$refs)
      this.synth.cancel()
      this.$router.replace({
        path: '/study/identifierStudy',
        query: {
          className: this.form.className,
          pageNum: this.pageNum
        }
      })
    },
    screenFullToggle() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      ipcRenderer.send('window-min')
    },
    startTextToSpeech() {
      this.$root.$children[0].pay()
      // videoUrl(this.$root.$children[0].$refs)
      if (this.form.identifierDesc != null) {
        this.synth.cancel()
        speech.text = this.form.identifierDesc
        this.synth.speak(speech)
      }
    },
    handleInfo() {
      this.$root.$children[0].pay()
      this.db.markStudy.get(this.classId).then(record => {
        this.form = record
        this.startTextToSpeech()
        console.log('Found record:', record)
      }).catch(error => {
        console.error('Error:', error)
      })
      // getIdentifier(this.classId).then(response => {
      //   this.form = response.data;
      //   if (this.form.showUrl != null) {
      //     this.showUrlArr = this.form.showUrl.split(",");
      //   }
      //   this.startTextToSpeech();
      // });
    }
  }
}
</script>

<template>
  <el-container class="study-desc-container">
    <el-header class="study-header"
               style="height: 80px;width:100%;display: flex;align-items: center;justify-content: space-between"
    >
      <div class="identifierDesc-back" @click="toBack"></div>
      <div class="exam-back-right" @click="screenFullToggle()"></div>
    </el-header>
    <el-main class="study-main">
      <div class="identifier-desc-img">
        <div class="block-top">
          <el-row>
            <el-col :span="3">
              <div class="block-top-pic">
                <el-image v-if="form.identifierUrl !=null" style="width: 149px; height: 149px"
                          :src="form.identifierUrl"
                />
              </div>
            </el-col>
            <el-col :span="15">
              <div class="block-top-title">
                <span style="font-size: 34px; color: #FFFF00">{{ form.name }}</span>
              </div>
              <div class="block-top-voice" @click="startTextToSpeech"></div>
              <div class="block-top-desc">
                <span style="font-size: 20px; color: #FFFFFF">{{ form.identifierDesc }}</span>
              </div>
            </el-col>
            <el-col :span="18">
              <div class="block-top-sence">
                <div>
                  <div class="block-top-sence-img">
                    <img alt="" style="width: 500px; height: 500px" :src="form.identifierPic"
                    />
                    <!--                    <ImagePreview :width="450" :src="showUrl"/>-->
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<style scoped lang="scss">
.identifier-desc-img {
  background: url("../../../assets/images/界面.png");
  width: 1735px;
  height: 944px;
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

.study-desc-container {
  background: url("../../../assets/images/bj03.png");
  height: 1080px;
}

.block-top {
  margin-left: 150px;
  margin-top: 70px;
}

.block-top-pic {
  background: url("../../../assets/images/标识框_01.png");
  width: 181px;
  height: 181px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
}

.block-top-title {
  background: url("../../../assets/images/标识名称框.png");
  width: 420px;
  height: 48px;
  word-break: break-all;
}

.block-top-desc {
  position: relative;
  background: url("../../../assets/images/详情框.png");
  width: 1100px;
  height: 128px;
  text-align: left;
  padding: 10px;
  margin-top: 6px;
  word-break: break-all;
}

.block-top-voice {
  background: url("../../../assets/images/语音-01.png");
  height: 135px;
  width: 135px;
  position: absolute;
  margin-left: 1125px;
}

.block-top-voice:active {
  background: url("../../../assets/images/语音-02.png");
}

.block-top-sence {
  background: url("../../../assets/images/场景框.png");
  width: 1458px;
  height: 627px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
}

.block-top-sence-img {
  margin: 20px;
}

.identifierDesc-back {
  background: url("../../../assets/images/返回.png");
  width: 90px;
  height: 52px;
  margin: 15px;
}

.identifierDesc-back:active {
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
