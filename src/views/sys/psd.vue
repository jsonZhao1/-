<script>
import { parseTime } from '@/utils/yyh'

export default {
  name: 'psd',
  data() {
    var equalToPassword = (rule, value, callback) => {
      if (this.form.newPassword !== value) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [{ required: true, message: '旧密码不能为空', trigger: 'blur' }],
        newPassword: [{ required: true, message: '新密码不能为空', trigger: 'blur' }, {
          min: 6,
          max: 20,
          message: '长度在 6 到 20 个字符',
          trigger: 'blur'
        }],
        confirmPassword: [{ required: true, message: '确认密码不能为空', trigger: 'blur' }, {
          required: true,
          validator: equalToPassword,
          trigger: 'blur'
        }]
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['identifierClassRef'].validate(valid => {
        if (valid) {
          console.log(this.db.psd[0])
          this.db.psd.where('password').equals(this.form.oldPassword).modify(book => {
            console.log(book.password)
            book.password = this.form.newPassword
          }).then(updatedCount => {
            if (updatedCount > 0) {
              console.log('密码已成功更新')
              this.showMessage({
                message: '修改成功',
                type: 'success',
                duration: 1000
              })
              this.form = {
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
              }
            } else {
              this.showMessage({
                message: '旧密码错误',
                type: 'warning',
                duration: 1000
              })
              console.log('未找到符合条件的记录')
            }
          }).catch(error => {
            console.error('更新密码时出现错误:', error)
          })
        }
      })
    }
  }
}
</script>

<template>
  <div>
    <div class="center">
      <el-form :model="form" :rules="rules" ref="identifierClassRef" label-width="120px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="旧密码" prop="oldPassword">
              <el-input v-model="form.oldPassword" placeholder="请输入旧密码" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item label="新密码" prop="newPassword" width="200px">
              <el-input v-model="form.newPassword" placeholder="请输入新密码" maxlength="20" show-word-limit/>
            </el-form-item>
            <el-form-item label="确认密码" prop="confirmPassword" width="200px">
              <el-input v-model="form.confirmPassword" placeholder="请输入确认密码" maxlength="20" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align: center;margin-top: 20px">
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.center {
  width: 50%;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
