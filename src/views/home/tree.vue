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
import Treenode from './components/tree-node.vue'
import 'public/static/jquery.nouislider.all.min.js'
import 'public/static/jquery.nouislider.min.css'

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
      generation: 25,
      wrapWidth: 12000
    }
  },

  computed: {
    treeStyle() {
      return { width: this.wrapWidth + 'px' }
    }
  },

  mounted() {
    this.init()
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
      this.generation = generation

      this.wrapWidth = 12000
      this.$nextTick(() => {
        const width = document.querySelector('.tree-node').clientWidth + 100
        this.wrapWidth = width
      })
    },

    bindEvent() {
      setTimeout(() => {
        $('.tree-node li span').hover((e) => {
          const { currentTarget } = e
          const { id } = currentTarget.dataset

          getItem({ id })
            .then(({ result }) => {
              const children = this.originData
                .filter(item => item.parentId === parseInt(id))
              const data = { ...result, sons: children }
              this.appendToBody(formatterHtml(data, this.originData), e)
            })
        },
        () => {
          $('.detail-dialog').fadeOut(300)
        })
      }, 300)
    },

    appendToBody(html, { pageX, offsetX, pageY, offsetY }) {
      let dialog = document.querySelector('.detail-dialog')
      if (!dialog) {
        dialog = document.createElement('div')
        dialog.setAttribute('class', `detail-dialog`)
        dialog.setAttribute('style', `display:none`)
        document.body.appendChild(dialog)
      }
      dialog.innerHTML = html
      const pageWidth = document.body.offsetWidth
      const top = pageY - offsetY
      const left = pageX - offsetX
      const leftWith = (pageWidth - left) > 360 ? left + 30 : left - 330
      dialog.setAttribute('style', `left:${leftWith}px;top:${top + 20}px`)
      $('.detail-dialog').fadeTo(300)
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
          if (ran < 14) { // eraNo的数组长度目前只有10，以后会增加
            that.handleSlider(ran + 16)
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
  .detail-dialog {
    position: absolute;
    width: 320px;
    background: #FFFDE7;
    box-shadow: 0 2px 4px #ccc;
    border: solid 1px #ccc;
    border-radius: 5px;
    padding: 10px;
  }
  .noUi-origin {
    background: none repeat scroll 0 0 #fafafa;
  }
</style>
