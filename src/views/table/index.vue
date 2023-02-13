<template>
  <div class="app-container">
    <filterPanel :handle-filter="handleFilter" />
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
      <el-table-column type="index" width="50" />
      <el-table-column label="id" property="id" width="50" />
      <el-table-column label="名" prop="givenName" width="70">
        <template slot-scope="scope">
          <strong>{{ scope.row.givenName }}</strong>
        </template>
      </el-table-column>
      <el-table-column label="代" prop="generation" width="60" sortable />
      <el-table-column label="生卒" prop="bad" width="100" sortable />
      <el-table-column label="妻" width="100">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-table :data="scope.row.wives" size="small">
              <el-table-column property="fullName" label="姓名" />
              <el-table-column property="from" label="来自" />
              <el-table-column property="memo" label="备注" />
            </el-table>
            <el-link slot="reference" type="primary">{{ scope.row.wives.length ? '查看' : '' }}</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column label="女" width="100">
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="400"
            trigger="click"
          >
            <el-table :data="scope.row.daughters" size="small">
              <el-table-column property="givenName" label="名" />
              <el-table-column property="married" label="嫁与" />
              <el-table-column property="memo" label="备注" />
            </el-table>
            <el-link slot="reference" type="primary">{{ scope.row.wives.length ? '查看' : '' }}</el-link>
          </el-popover>
        </template>
      </el-table-column>
      <!-- <el-table-column label="父ID" prop="parentId" sortable /> -->
      <el-table-column label="备注" prop="memo" />
      <el-table-column label="创建时间" width="160" prop="createdAt" sortable />
      <el-table-column label="更新时间" width="160" prop="updatedAt" sortable />

      <el-table-column label="操作" width="162" fixed="right">
        <template slot-scope="scope">
          <el-button
            circle
            type="primary"
            icon="el-icon-plus"
            @click="handleCreate(scope.row)"
          />
          <el-button
            circle
            icon="el-icon-edit"
            @click="handleEdit(scope.row.id)"
          />
          <el-button
            circle
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(scope.row.id)"
          />
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination">
      <el-pagination
        :current-page="page.page"
        :page-sizes="[50, 100, 200]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

  </div>
</template>

<script>
import { getList, removeItem } from '@/api/table'
import FilterPanel from './components/filter-panel.vue'

export default {
  components: {
    FilterPanel
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      list: null,
      listLoading: true,
      total: 0,
      order: null,
      tableHeight: window.innerHeight - 200,
      params: {
      },
      page: {
        pageSize: 50,
        page: 1
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList({
        ...this.page,
        order: this.order,
        ...this.params
      })
        .then(res => {
          this.list = res.result.rows
          this.total = res.result.count
          this.listLoading = false
        })
    },
    handleEdit(id) {
      this.$router.push({ path: `/admin/edit`, query: { id }})
    },
    handleCreate({ id, generation, givenName }) {
      this.$router.push({ path: `/admin/edit`, query: { parentId: id, generation, givenName }})
    },

    handleDelete(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteItem(id)
      }).catch(() => {})
    },

    deleteItem(id) {
      removeItem({ id })
        .then(res => {
          this.$message({
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
    },

    handleFilter(params) {
      this.params = params
      this.page.page = 1
      this.fetchData()
    },

    /**
     * 分页相关
     */
    handleSizeChange(val) {
      this.page = {
        ...this.page,
        pageSize: val
      }
      this.refreshList()
    },

    handleCurrentChange(val) {
      this.page = {
        ...this.page,
        page: val
      }
      this.refreshList()
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
