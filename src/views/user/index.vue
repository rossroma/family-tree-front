<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      class="table"
      height="tableHeight"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="handleSortChange"
    >
      <el-table-column label="id" property="id" width="50" />
      <el-table-column label="用户名" prop="username" width="100" sortable />
      <el-table-column label="昵称" prop="nickName" width="100" />
      <el-table-column label="角色" prop="role" width="70" />
      <el-table-column label="密码" prop="password" width="300" />
      <el-table-column label="备注" prop="memo" />
      <el-table-column label="创建时间" width="160" prop="createdAt" sortable />
      <el-table-column label="更新时间" width="160" prop="updatedAt" sortable />
      <el-table-column label="操作" width="130" fixed="right">
        <template slot-scope="scope">
          <el-button
            circle
            icon="el-icon-edit"
            @click="handleEdit(scope.row)"
          />
          <el-button
            v-if="scope.row.role !== 'admin'"
            circle
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          />
          <el-button
            v-if="scope.row.role === 'admin'"
            circle
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate(scope.row)"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="1"
        :page-size="100"
        layout="total"
        :total="total"
      />
    </div>

  </div>
</template>

<script>
import { getUserList, removeUser } from '@/api/user'
import { Message, MessageBox } from 'element-ui'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      order: null,
      tableHeight: window.innerHeight - 200
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getUserList({
        order: this.order
      })
        .then(res => {
          this.list = res.result.rows
          this.total = res.result.count
          this.listLoading = false
        })
    },
    handleEdit(row) {
      this.$router.push({ path: `/admin/userEdit`, query: row })
    },
    handleCreate() {
      this.$router.push({ path: `/admin/userEdit` })
    },

    handleDelete(id) {
      MessageBox.confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(id)
      }).catch(() => {})
    },

    deleteItem(id) {
      removeUser({ id })
        .then(res => {
          Message({
            type: 'success',
            message: '删除成功!'
          })
          this.refreshList()
        })
    },

    refreshList() {
      this.fetchData()
    },
    handleSortChange({ prop, order }) {
      if (order) {
        this.order = [prop, order]
      } else {
        this.order = null
      }
      this.fetchData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 50px);
    box-sizing: border-box;
    .table {
      flex: 1 1 auto;
    }
    .pagination {
      flex: 0 0 40px;
      height: 40px;
      padding-top: 15px;
    }
  }
</style>
