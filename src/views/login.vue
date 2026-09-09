<template>
  <div class="login">
    <div class="index-exit" @click="close" v-if="!dialogVisible"></div>
    <div class="index-exit2" @click="goToSys" v-if="!dialogVisible"></div>
<!--    <img src="@/assets/images/logo.png" class="logo-icon"/>-->
    <div class="index-title"/>
    <div class="btn" @click="goToHome">
      <img style="width: 115px;height: 122px;"
           src="@/assets/images/next.png"
      />
      <img style="width: 323px;height: 47px;"
           src="@/assets/images/jinruxitong.png"
      />
      <img style="width: 115px;height: 122px;"
           src="@/assets/images/prev.png"
      />
    </div>
    <el-dialog
        title="激活设备"
        :visible.sync="dialogVisible"
        width="30%"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        :show-close="false"
        top="30vh"
    >
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="ruleForm.projectName"></el-input>
        </el-form-item>
        <el-form-item label="注册码" prop="registerCode">
          <div style="display: flex">
            <el-input v-model="ruleForm.registerCode" style="flex: 1"></el-input>
            <el-button type="primary" @click="getZhuCeMa">获取注册码</el-button>
          </div>
        </el-form-item>
        <el-form-item label="激活码" prop="activeCode">
          <el-input type="textarea" v-model="ruleForm.activeCode"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="close">退出</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from 'element-ui'
const { ipcRenderer, dialog } = window.require('electron')
const Store = window.require('electron-store')
const store = new Store()
export default {
  name: 'Login',
  data() {
    return {
      rules: {
        projectName: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        registerCode: [
          { required: true, message: '请获取注册码', trigger: 'blur' }
        ],
        activeCode: [
          { required: true, message: '请填写激活码', trigger: 'blur' }
        ]
      },
      loading: false,
      dialogVisible: false,
      ruleForm: {
        registerCode: null,
        activeCode: null,
        projectName: null
      },
    }
  },
  watch: {
  },
  created() {
    this.isActivation()

  },
  activated() {

  },
  beforeDestroy() {
  },
  methods: {
    isActivation() {
      let isData = store.get('activateData')
      if (isData) {
        const loading = this.$loading({
          lock: true,
          text: '查询本机设备中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        ipcRenderer.removeAllListeners('send_activate_data')
        // let dataObj = JSON.parse(isData);
        ipcRenderer.send('get_activate_data', `Unityactivation&${isData.activeCode}+${isData.projectName}`)
        ipcRenderer.on('send_activate_data', (event, data) => {
          let newData = new TextDecoder().decode(data)
          console.log(newData)
          if (newData.indexOf('激活成功') !== -1) {
            this.dialogVisible = false
            store.set('activateData', isData)
            console.log(isData)
            loading.close()
          } else {
            console.log(loading)
            this.dialogVisible = true
            loading.close()
          }
        })
      } else {
        this.dialogVisible = true
      }
      // ipcRenderer.on('server-data', (event, data) => {
      //   // 在这里你可以更新界面显示服务端返回的数据
      //   console.log('从服务器收到数据：', data);
      //   const key = localStorage.getItem(data);
      //   if(key){
      //
      //   }else{
      //
      //   }
      //   // 更新界面或执行其他操作
      // });

    },
    getZhuCeMa() {
      this.ruleForm.registerCode = ''
      ipcRenderer.send('get_registerCode_data', 'registrationCode&12321')
      ipcRenderer.on('send_registerCode_data', (event, data) => {
        // 在这里你可以更新界面显示服务端返回的数据
        console.log('从服务器收到数据：', data)
        let newData = new TextDecoder().decode(data)
        this.ruleForm.registerCode = newData.split('&')[1]
        console.log(this.ruleForm.registerCode)
        // 更新界面或执行其他操作
      })
    },
    submitForm() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          ipcRenderer.send('get_activate_data', `Unityactivation&${this.ruleForm.activeCode}+${this.ruleForm.projectName}`)
          ipcRenderer.removeAllListeners('send_activate_data')
          ipcRenderer.on('send_activate_data', (event, data) => {
            console.log(new TextDecoder().decode(data))
            let newData = new TextDecoder().decode(data)
            if (newData.indexOf('激活成功') !== -1) {
              this.dialogVisible = false
              store.set('activateData', this.ruleForm)
              let newData2 = newData.split('&')[1]
              Message({
                message: newData2,
                type: 'success'
              })
            } else {
              Message({ message: '激活失败', type: 'warning' })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    close() {
      this.$root.$children[0].pay()
      ipcRenderer.send('close-window-request')
    },
    async goToHome() {
      this.$root.$children[0].pay()
      this.$root.$children[0].payOne()
      this.$router.push({ path: '/index' })
    },
    goToSys(){
      ipcRenderer.send('go-to-sys')
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
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
  background-image: url('../assets/images/bg.png')
}

.title {
  margin: 0px auto 30px auto;
  text-align: center;
  color: #2e24b4;
}

.login-form {
  border-radius: 6px;
  background: #ffffff;
  width: 400px;
  padding: 25px;

  .el-input {
    height: 40px;

    input {
      height: 40px;
    }
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 0px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.login-code {
  width: 33%;
  height: 40px;
  float: right;

  img {
    cursor: pointer;
    vertical-align: middle;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
  padding-left: 12px;
}

.qrcode-error-mask {
  display: block;
  position: absolute;
  width: 200px;
  background: #000;
  filter: alpha(opacity=60);
  -moz-opacity: .6;
  opacity: .6;
  height: 200px;
  left: 0px;
  z-index: 9;
  top: 0;
  text-align: center;
  line-height: 100px;
}

.err-cont {
  position: absolute;
  left: 50px;
  top: 55px;
  width: 100%;
  z-index: 19;
  font-weight: 700;
  color: #ffffff;
}

.refresh-btn {
  background: #e4393c;
  width: 80px;
  height: 30px;
  position: absolute;
  top: 105px;
  left: 60px;
  line-height: 30px;
  opacity: 1;
  z-index: 19;
  color: #fbfbfb;
  text-decoration: none;
  text-align: center;
}
.logo-icon{
  width: 97px;
  height: 85px;
  position: absolute;
  top: 25px;
  left: 20px;
}
.index-exit {
  background: url("../assets/images/退出.png");
  background-size: 100%;
  width: 187px;
  height: 55px;
  position: absolute;
  top: 25px;
  right: 20px;
}
.index-exit2{
  background: url("../assets/images/进入后台.png");
  background-size: 100% 100%;
  width: 192px;
  height: 68px;
  position: absolute;
  top: 20px;
  right: 220px;
}
.index-exit:active {
  background: url("../assets/images/退出-点击.png");
  background-size: 100%;
}

.btn {
  display: flex;
  align-items: center;
}

.index-title {
  position: absolute;
  top: 75px;
  left: 505px;
  width: 912px;
  height: 106px;
  background: url("../assets/images/安全标识学习系统.png");
}
</style>
