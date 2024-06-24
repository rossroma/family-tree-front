<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="formRules" label-width="120px" class="edit-form">
      <el-form-item label="父亲：">
        {{ father && father.givenName || '无' }}
      </el-form-item>
      <el-divider content-position="center">表单信息</el-divider>
      <el-form-item label="代" prop="g">
        <el-input v-model.number="form.generation" :disabled="!!form.parentId || !!form.id" />
      </el-form-item>
      <el-form-item label="名" prop="givenName">
        <el-input v-model="form.givenName" />
      </el-form-item>
      <el-form-item label="生卒">
        <el-input v-model="form.bad" />
      </el-form-item>
      <el-form-item label="备注">
        <el-input v-model="form.memo" type="textarea" />
      </el-form-item>
      <el-form-item label="妻">
        <el-table
          :data="form.wives"
          fit
          border

          class="wives"
        >
          <el-table-column
            label="序号"
            type="index"
            align="center"
            width="50"
          />
          <el-table-column
            prop="date"
            label="姓名"
            width="120"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'wives.' + scope.$index + '.fullName'"
                :rules="{
                  required: true, message: '姓名不能为空', trigger: 'blur'
                }"
              >
                <el-input v-model="scope.row.fullName" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="from"
            label="来自"
            width="180"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model="scope.row.from" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="memo"
            label="备注"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model="scope.row.memo" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="114">
            <template slot-scope="scope">
              <el-button
                circle

                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, 'wives')"
              />
              <el-button
                circle

                icon="el-icon-plus"
                class="move"
                @click="addWife(scope.$index + 1)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text" icon="el-icon-plus" @click="addWife">添加</el-button>
      </el-form-item>
      <el-form-item label="女">
        <el-table
          :data="form.daughters"
          fit
          border

          class="daughters"
        >
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="50"
          />
          <el-table-column
            prop="date"
            label="名"
            width="120"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'daughters.' + scope.$index + '.givenName'"
                :rules="{
                  required: true, message: '名字不能为空', trigger: 'blur'
                }"
              >
                <el-input v-model="scope.row.givenName" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="married"
            label="嫁与"
            width="180"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model="scope.row.married" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            prop="memo"
            label="备注"
          >
            <template slot-scope="scope">
              <el-form-item>
                <el-input v-model="scope.row.memo" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="114">
            <template slot-scope="scope">
              <el-button
                circle

                type="danger"
                icon="el-icon-delete"
                @click="handleDelete(scope.$index, 'daughters')"
              />
              <el-button
                circle

                icon="el-icon-plus"
                class="move"
                @click="addDaughter(scope.$index + 1)"
              />
            </template>
          </el-table-column>
        </el-table>
        <el-button type="text" icon="el-icon-plus" @click="addDaughter">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" :disabled="isLoading" @click="onSubmit('form')">保存</el-button>
        <el-button @click="goBack">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getItem, updateItem, createItem } from '@/api/table'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      form: {
        givenName: '',
        generation: 17,
        bad: '',
        parentId: null,
        memo: '',
        daughters: [],
        wives: []
      },
      isLoading: false,
      father: {},
      formRules: {
        givenName: [
          { required: true, message: '请输入名', trigger: 'blur' },
          { max: 3, message: '长度小于等于3个字符', trigger: 'blur' }
        ]
      }
    }
  },

  computed: {
    isEdit() {
      return !!this.$route.query.id
    }
  },
  mounted() {
    const { id, parentId, generation, givenName } = this.$route.query
    if (id) {
      this.getItem(id)
    } else if (parentId) {
      this.father.givenName = givenName
      this.createInit(parentId, generation)
    }
  },
  methods: {

    getItem(id) {
      getItem({ id })
        .then(res => {
          this.father = res.result.father
          delete res.result.father
          this.form = res.result
        })
    },
    createInit(parentId, generation) {
      this.form = {
        ...this.form,
        parentId,
        generation: parseInt(generation) + 1
      }
    },
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
      createItem(this.form)
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
      updateItem(this.form)
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
        this.$router.push('/admin/table')
      }
    },

    addWife(index) {
      const i = Number(index) || this.form.wives.length
      this.form.wives.splice(i, 0, {
        fullName: '',
        from: '',
        memo: ''
      })
    },

    addDaughter(index) {
      const i = Number(index) || this.form.daughters.length
      this.form.daughters.splice(i, 0, {
        givenName: '',
        married: '',
        memo: ''
      })
    },

    handleDelete(index, attr) {
      this.form[attr].splice(index, 1)
    }
  }
}
</script>

<style scoped>
.edit-form .el-input{
  max-width: 240px;
}
.edit-form .el-table{
  width: 900px;
}

</style>

