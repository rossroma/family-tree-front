<template>
  <el-form :inline="true" class="demo-form-inline">
    <el-form-item label="名">
      <el-input
        v-model="givenName"
        placeholder="请输入要搜索的名字"
        clearable
        @change="handleChange"
      />
    </el-form-item>
    <el-form-item label="代">
      <el-select
        v-model="generation"
        placeholder="辈分(代)筛选"
        clearable
        @change="handleChange"
      >
        <el-option v-for="n in 15" :key="n" :label="n+16" :value="n+16" />
      </el-select>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'FilterPanel',

  props: {
    handleFilter: {
      type: Function,
      required: true
    }
  },

  data() {
    return {
      givenName: '',
      generation: ''
    }
  },

  methods: {
    handleChange(val) {
      const params = {}
      if (this.givenName) {
        params.givenName = this.givenName
      }
      if (this.generation) {
        params.generation = this.generation
      }
      this.handleFilter(params)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
