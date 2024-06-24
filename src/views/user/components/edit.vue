<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" class="edit-form">
      <el-divider content-position="center">表单信息</el-divider>
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="form.nickName" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.memo" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isLoading" @click="onSubmit('form')">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { updateUser, register } from '@/api/user'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      form: {
        nickName: null,
        password: null,
        memo: ''
      },
      isLoading: false,
      formRules: {
        username: [
          { required: true, message: '请输入名', trigger: 'blur' },
          { max: 16, min: 4, message: '长度在 4 到 16 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { max: 200, min: 6, message: '长度在 6 到 16 个字符', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    isEdit() {
      return !!this.form.id
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.form = this.$route.query
    }
  },
  methods: {
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.isEdit) {
            return this.handleUpdate()
          }
          return this.handleCreate()
        }
        Message({
          message: '表单校验不通过!',
          type: 'error'
        })
      })
    },
    handleCreate() {
      this.isLoading = true
      register(this.form)
        .then(res => {
          Message({
            message: '添加成功!',
            type: 'success'
          })
          this.goBack()
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    handleUpdate() {
      updateUser(this.form)
        .then(res => {
          Message({
            message: '更新成功!',
            type: 'success'
          })
          this.goBack()
        })
    },
    goBack() {
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.$router.push('/admin/user')
      }
    }
  }
}
</script>

<style scoped>
.edit-form .el-input{
  max-width: 420px;
}

</style>

