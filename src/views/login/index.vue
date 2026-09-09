<template>
  <div class="login" :style="{backgroundImage:`url('${backUrl}')`}">
    <div @click="exitFullscreen()">关闭</div>
    <div class="login-form">
      <el-tabs v-model="activeName" @tab-click="changeTab">
        <el-tab-pane label="账号登陆" name="first">
          <el-form ref="loginForm" :model="loginForm" :rules="loginRules" >
            <!--            <h2 class="title">登录</h2>-->
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                type="text"
                size="large"
                auto-complete="off"
                placeholder="账号"
              >
                <template #prefix><svg-icon icon-class="user" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                size="large"
                auto-complete="off"
                placeholder="密码"
                @keyup.enter="handleLogin"
              >
                <template #prefix><svg-icon icon-class="password" class="el-input__icon input-icon" /></template>
              </el-input>
            </el-form-item>
            <el-form-item prop="code" v-if="captchaEnabled">
              <el-input
                v-model="loginForm.code"
                size="large"
                auto-complete="off"
                placeholder="验证码"
                style="width: 63%"
                @keyup.enter="handleLogin"
              >
                <template #prefix><svg-icon icon-class="validCode" class="el-input__icon input-icon" /></template>
              </el-input>
              <div class="login-code">
                <img :src="codeUrl" @click="getCode" class="login-code-img"/>
              </div>
            </el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>
            <el-form-item style="width:100%;">
              <el-button
                :loading="loading"
                size="large"
                type="primary"
                style="width:48%;"
                @click.prevent="handleLogin"
              >
                <span v-if="!loading">登 录</span>
                <span v-else>登 录 中...</span>
              </el-button>
              <el-button
                size="large"
                type="primary"
                style="width:48%;"
                @click.prevent="clear"
              >
                <span>重 置</span>
              </el-button>
              <div style="float: right;" v-if="register">
                <router-link class="link-type" :to="'/register'">立即注册</router-link>
              </div>
            </el-form-item>
            <el-button
              :loading="loading"
              size="large"
              style="width:100%; height: 100%; font-size: 20px; font-family: Alibaba PuHuiTi 2.0-75 Sem;"
              @click.prevent="handleTouristLogin"
            >
              <span v-if="!loading">游客登陆</span>
              <span v-else>登 录 中...</span>
            </el-button>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="二维码登录" name="second">
          <canvas ref="canvasRef"></canvas>
          <div class="qrcode-error-mask" v-if="!qrCodeStatus">
          </div>
          <p class="err-cont" v-if="!qrCodeStatus">二维码已失效</p>
          <div class="refresh-btn" v-if="!qrCodeStatus" @click="refresh">刷新</div>
          <!--          <img src="@/assets/images/20231007103350.png" style="width: 300px" alt="">-->
          <p/>
          <span class="login-tip">请扫码登录</span>
        </el-tab-pane>
      </el-tabs>
    </div>

    <!--  底部  -->
    <!-- <div class="el-login-footer">
      <span>Copyright © 2018-2023 疯狂的狮子Li All Rights Reserved.</span>
    </div> -->
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import {getCodeImg, getBackUrl, getLoginStatus, getQrCode} from "@/api/login";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import QRCode from 'qrcode';
import Cookies from "js-cookie";
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      backUrl:'',
      voiceUrl:'',
      activeName:'first',
      captchaEnabled:true,
      codeUrl:'',
      register:false,
      qrCodeStatus:true,
      qrCodeData:null,
      intervalId:null,
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getBackImgUrl();
    this.getCode();
    this.getCookie()
  },
  methods: {
    exitFullscreen(){
      console.log( this.$electron)
      this.$electron.ipcRenderer.send('window-min')
    },
    changeTab(e){
      console.log(e)
      if(this.activeName=='second'){
        this.init()
        if(this.qrCodeStatus){
          this.intervalId= setInterval(() => {
            getLoginStatus({qrCode:this.qrCodeData}).then(res=>{
              if(res.code ===203){
                this.qrCodeStatus = false
                clearInterval(this.intervalId);
              }
              if(res.code===200){
                clearInterval(this.intervalId);
                setToken(res.data.token)
                // play()
                router.push({ path: redirect.value || "/" });
              }
            })
          }, 1000); // 5000毫秒，即5秒
        }
      }else{
        clearInterval(this.intervalId);
      }
    },
    getBackImgUrl() {
      getBackUrl().then(res => {
        this.backUrl =res.data.backUrl;
        this.voiceUrl= res.data.voiceUrl
      });

    },
    generateQRCode(){
      const canvas = this.$refs.canvasRef;
      console.log(canvas)
      const text = this.qrCodeData; // 要生成二维码的文本
      QRCode.toCanvas(canvas, text, { // 调用qrcode库的toCanvas方法生成二维码
        width: 200,
        height: 200
      }, (error) => {
        if (error) {
          console.error(error);
        }
      });
    },
    getCode() {
      getCodeImg().then(res => {
        this.captchaEnabled = res.data.captchaEnabled === undefined ? true : res.data.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      }
    },
    init (){
      this.qrCodeStatus = true
      getQrCode().then(res=>{
        console.log(res.data.qrCode)
        this.qrCodeData = res.data.qrCode
        this.generateQRCode();
      })
    },
    refresh (){
      init()
      if(this.qrCodeStatus){
        setInterval(() => {
          this.intervalId= getLoginStatus({qrCode:this.qrCodeData}).then(res=>{
            if(res.code ===203){
              this.qrCodeStatus= false
              clearInterval(this.intervalId);
            }
          })
        }, 1000); // 5000毫秒，即5秒
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, { expires: 30 });
            Cookies.set("password", encrypt(this.loginForm.password), { expires: 30 });
            Cookies.set("rememberMe", this.loginForm.rememberMe, { expires: 30 });
          } else {
            // 否则移除
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store.dispatch('user/login', this.loginForm).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
            if (this.captchaEnabled) {
              getCode();
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
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
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-size: cover;
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
.qrcode-error-mask{
  display: block;
  position: absolute;
  width: 200px;
  background: #000;
  filter: alpha(opacity=60);
  -moz-opacity: .6;
  opacity: .6;
  height: 200px;
  left:0px;
  z-index: 9;
  top: 0;
  text-align: center;
  line-height: 100px;
}
.err-cont{
  position: absolute;
  left: 50px;
  top: 55px;
  width: 100%;
  z-index: 19;
  font-weight: 700;
  color: #ffffff;
}
.refresh-btn{
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
</style>
