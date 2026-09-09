<template>
  <div class="login-page" id="index" ref="appRef">
    <div class="index-exit2" @click="goToSys"></div>
    <!--    <div class="login-header">安全用电教育管理后台</div>-->
    <!-- 此处图片用于当视屏加载失败时的替换背景图片 -->
    <div class="login-content">
      <!-- 此处内容放置中间登录模块 -->
      <el-form ref="loginRef" :model="loginForm" :rules="loginRules" class="login-form">
        <h2 class="title">登录</h2>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            size="large"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <template #prefix>
              <img style="width: 26px;height: 27px;position: absolute;top: 50%;transform: translateY(-50%);left: 20px"
                   src="@/assets/images/login-icon2.png"
              />
              <!--              <svg-icon icon-class="password" class="el-input__icon input-icon"/>-->
            </template>
          </el-input>
        </el-form-item>
        <el-form-item style="display: flex;justify-content: center;width: 100%">
          <el-button
            type="primary"
            style="width: 200px"
            @click.prevent="handleLogin"
          >
            <span>登 录</span>
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { Message } from 'element-ui'
import store from '@/store'
import router from '@/router'

const { ipcRenderer } = window.require('electron')
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value) {
        if (value.length < 6) {
          callback(new Error('密码不能小于6位数'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请填写密码'))
      }
    }
    return {
      loginForm: {
        password: ''
      },
      loginRules: {
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      psd: '123456'
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
    this.db.psd.toArray().then(res => {
      console.log(res)
      this.psd = res[0].password
    }).catch(err => {
      console.log(err)
    })
  },
  mounted() {
  },
  activated() {

  },
  beforeDestroy() {
  },
  methods: {
    goToSys() {
      ipcRenderer.send('go-to-sys')
    },
    close() {
      ipcRenderer.send('close-window-request')
    },
    canplay() {
      // this.vedioCanPlay = true
    },
    handleLogin() {
      this.$refs.loginRef.validate(valid => {
        if (valid) {
          if (this.loginForm.password === this.psd) {
            this.$router.push('/sys/index')
            console.log('成功')
          } else {
            this.showMessage({
              message: '密码错误',
              type: 'warning',
              duration: 1000
            })
          }
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
  //color: #ffffff;
}

.login-header {
  position: absolute;
  font-size: 50px;
  color: #FFFFFF;
  top: 10%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.login-form {
  border-radius: 6px;
  //background: #ffffff;
  width: 409px;
  //padding: 25px 25px 5px 25px;
  //margin-top: 60px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

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

.login-page {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: url('../../assets/images/bj04.png')
}

.login-background {
  width: 100%;
  display: block;
  position: fixed;
  top: 0;
  height: 100%;
  left: 0;
  z-index: -99;
}

//根据需求自行修改这个类名的样式，其他样式必须添加
.login-content {
  width: 680px;
  height: 360px;
  z-index: 2;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-width: 0px;
  background-color: #FFFFFF;
  background-size: 100%;
  background-repeat: no-repeat;
  //background-size: 100% auto;
  background-position: center;
  //display: flex;
  //justify-content: center;
  //align-items: center;
}

.index-exit2 {
  background: url("../../assets/images/返回前台体验.png");
  background-size: 100%;
  width: 187px;
  height: 55px;
  margin: 15px;
  position: absolute;
  top: 0px;
  right: 0px;
}

.btn {
  width: 409px;
  height: 82px;
  //background: url("../../assets/images/login-btn.png");
  background-size: 100%;
  background-repeat: no-repeat;
  //background-size: 100% auto;
  background-position: center;
}

.login-tip {
  font-size: 18px;
  font-weight: bolder;
  //color: #04DDD7;
}

::v-deep .login-form .el-input {
  height: 52px;
}

::v-deep .login-content .el-input__inner {
  height: 52px;
  line-height: 52px;
  font-size: 22px;
  padding-left: 70px;
  //color: #5FCECC;
  //background-color: #084E4F;
  //border: 1px solid #37B1AF;
}

::v-deep .login-form .input-icon {
  height: 52px;
}

::v-deep .el-input__prefix, .el-input__suffix {

}

::v-deep .login-content .el-checkbox {
  //color: #5FCECC;
  font-size: 20px;
}

::v-deep .login-content .el-checkbox__label {
  font-size: 20px;
}

::v-deep .login-content .el-checkbox__inner {
  width: 20px;
  height: 20px;
  //background-color: #084E4F;
  //border: 2px solid #37B1AF;
  //
}

::v-deep .login-content .el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
  //background-color: #084E4F;
  //border: 2px solid #37B1AF;
}

::v-deep .login-content .el-checkbox__input.is-focus .el-checkbox__inner {
  //border-color: #37B1AF;
}

::v-deep .el-checkbox__inner::after {
  height: 10px;
  left: 6px;
  top: 2px;
}

::v-deep .login-content .el-checkbox__input.is-checked + .el-checkbox__label {
  //color: #5FCECC;
}
</style>
