<template>
  <div class="tree" :style="treeStyle">
    <ul class="menu">
      <li
        v-for="num in 14"
        :key="num"
        class="item"
      >{{ num | toCn }}</li>
    </ul>
    <div id="range" class="noUi-connect" />
    <Treenode :list="treeList" :generation="generation" />
  </div>
</template>

<script>
import { getTreeList, getItem } from '@/api/table'
import { formatterHtml } from '@/views/mobile/shared'
import { sleep, debounce, LS } from '@/utils'
import { getToken } from '@/utils/auth' // get token from cookie
import { handleEvent } from './shared'
import Treenode from './components/tree-node.vue'
import 'public/static/jquery.nouislider.all.min.js'
import 'public/static/jquery.nouislider.min.css'
import jBox from 'jbox'
import 'jbox/dist/jBox.all.css'

export default {
  name: 'Tree',

  components: {
    Treenode
  },

  filters: {
    toCn(num) {
      const singles = ' 一二三四五六七八九'
      const ten = ' 十廿卅'
      const format = (num + 16).toString()
      return ten[format[0]] + singles[format[1]] + '世'
    }
  },

  data() {
    return {
      treeList: [],
      originData: [], // 原始数据
      generation: parseInt(LS.get('generation')) || 25,
      wrapWidth: 12000,
      jbox: null,
      handleSliderDebounce: () => {}
    }
  },

  computed: {
    treeStyle() {
      return { width: this.wrapWidth + 'px' }
    }
  },

  mounted() {
    this.init()
    document.addEventListener('click', handleEvent)
    this.handleSliderDebounce = debounce(this.handleSlider) // 防抖处理
  },

  beforeDestroy() {
    document.removeEventListener('click', handleEvent)
  },

  methods: {
    async init() {
      const res = await getTreeList()
      this.originData = res.result.rows
      this.treeList = this.arrayToTree(res.result.rows)
      this.bindEvent()
      this.initSlider()
    },

    arrayToTree(items) {
      const result = [] // 存放结果集
      const itemMap = {} //
      for (const item of items) {
        const id = item.id
        const pid = item.parentId

        if (!itemMap[id]) {
          itemMap[id] = {
            children: []
          }
        }

        itemMap[id] = {
          name: item.givenName,
          pid: item.parentId,
          id,
          generation: item.generation,
          children: itemMap[id]['children']
        }

        const treeItem = itemMap[id]

        if (!pid) {
          result.push(treeItem)
        } else {
          if (!itemMap[pid]) {
            itemMap[pid] = {
              children: []
            }
          }
          itemMap[pid].children.push(treeItem)
        }
      }
      return result
    },

    handleSlider(generation) {
      const width = document.querySelector('.tree-node').clientWidth + 100
      this.wrapWidth = width

      this.bindEvent()
    },

    async bindEvent() {
      // 先销毁事件绑定，防止重复绑定事件
      if (this.jbox) {
        this.jbox.destroy()
      }
      const that = this
      await sleep(300)

      // eslint-disable-next-line new-cap
      this.jbox = new jBox('Tooltip', {
        attach: '.node-item',
        width: 300,
        minHeight: 100,
        delayOpen: 100,
        closeOnMouseleave: true,
        async onOpen() {
          const { id } = this.target[0].dataset
          const formated = await that.getItemHtml(id)
          this.setContent(formated)
        }
      })
    },

    async getItemHtml(id) {
      const { result } = await getItem({ id })
      const children = this.originData
        .filter(item => item.parentId === parseInt(id))
      const data = { ...result, sons: children }
      return formatterHtml(data, this.originData, !!getToken())
    },

    initSlider() {
      const that = this
      // 左侧滑块的载入
      $('#range').noUiSlider({
        start: [9],
        step: 1,
        orientation: 'vertical',
        range: {
          'min': [1],
          'max': [14]
        }
      })
      $('.noUi-handle').attr('title', '鼠标拖动控制显示层级')

      // 滑块操作
      $('#range').on({
        slide() {
          const ran = parseInt($('#range').val())
          if (ran < 14) { // eraNo的数组长度目前只有14，以后会增加
            that.generation = ran + 16
            that.wrapWidth = 12000
            that.handleSliderDebounce(that.generation)
            LS.set('generation', that.generation)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .tree {
    width: 11000px;
    min-width: 100%;
    display: flex;
    background-image: linear-gradient(0, #F5FAFF 0%, #F5FAFF 50%, #fff 50%, #fff 100%);
    background-size: 3px 168px;
    .menu {
      width: 20px;
      list-style: none;
      margin: 0;
      padding: 0 30px 0 10px;
      .item {
        width: 100%;
        font-weight: bold;
        font-size: 14px;
        height: 84px;
        box-sizing: border-box;
        padding-top: 20px;
        vertical-align: middle;
      }
    }
    .slider {
      margin-top: 44px;
    }
    .tree-node {
      padding-top: 0;
      &::after {
        border: 0 none;
      }
    }
    #range {
      height: 1104px;
      z-index: 1000;
      left: 0;
      top: 40px;
    }
  }
</style>

<style>
  .noUi-origin {
    background: none repeat scroll 0 0 #fafafa;
  }
</style>
