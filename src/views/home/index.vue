<template>
  <div class="home">
    <router-view />
    <el-button-group class="top-menu">
      <el-button type="primary" :icon="currentRoute.icon" round @click="switchRouter">{{ currentRoute.title }}</el-button>
      <el-button type="primary" icon="el-icon-notebook-1" round @click="isIntroductionShow = true">序言</el-button>
      <el-button type="primary" icon="el-icon-setting" round @click="$router.push('/admin')">管理</el-button>
    </el-button-group>
    <Introduction v-if="isIntroductionShow" :dialog-show.sync="isIntroductionShow" />
  </div>
</template>

<script>

export default {
  name: 'Home',

  components: {
    Introduction: () => import(/* webpackChunkName: "introduction" */ '@/views/home/components/introduction.vue')
  },

  data() {
    return {
      isIntroductionShow: false,
      currentType: 1
    }
  },

  computed: {
    currentRoute() {
      if (this.currentType === 0) {
        return {
          icon: 'tree',
          title: '树状图',
          route: '/tree'
        }
      }
      return {
        icon: 'dashboard',
        title: '日落图',
        route: '/sun'
      }
    }
  },

  methods: {
    switchRouter(isTree) {
      this.$router.push(this.currentRoute.route)
      this.currentType = Math.abs(this.currentType - 1)
    }
  }
}
</script>

<style scoped>
  .top-menu {
    position: fixed;
    top: 20px;
    right: 20px;
  }
</style>
