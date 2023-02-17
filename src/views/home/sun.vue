<template>
  <div class="app-container">
    <div class="chart-wrap" />
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { getTreeList, getItem } from '@/api/table'
import { formatterHtml, colors, colorType } from '@/views/mobile/shared'
import { getToken } from '@/utils/auth' // get token from cookie
import { handleEvent } from './shared'

let timer = null
export default {

  mounted() {
    this.init()
    document.addEventListener('click', handleEvent)
  },

  beforeDestroy() {
    document.removeEventListener('click', handleEvent)
  },

  methods: {
    async init() {
      const res = await getTreeList()
      const tree = this.arrayToTree(res.result.rows)
      let data = this.computedValue(tree)
      data = this.addColor(data)
      const myChart = echarts.init(document.querySelector('.chart-wrap'))
      const option = {
        toolbox: {
          show: true,
          top: '4px',
          right: '290px',
          itemSize: 24,
          feature: {
            restore: {
              show: true
            }
          }
        },
        tooltip: {
          triggerOn: 'none',
          backgroundColor: '#FFFDE7',
          enterable: true,
          hideDelay: 500,
          position: ([left, top]) => {
            return { left, top }
          },
          formatter(params, tiket, cb) {
            const { id, children } = params.data
            getItem({ id }).then(({ result }) => {
              const data = { ...result, sons: children.map(item => ({ givenName: item.name })) }
              cb(tiket, formatterHtml(data, res.result.rows, !!getToken()))
            })
            return 'Loading'
          }
        },
        series: {
          type: 'sunburst',
          data,
          radius: [0, '100%'],
          label: {
            rotate: 'radial'
          },
          itemStyle: {
            borderWidth: 0.2,
            color: '#fff'
          }
        }
      }
      myChart.setOption(option)
      myChart.on('mouseover', function({ dataIndex }) {
        timer = setTimeout(() => {
          myChart.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex })
        }, 400)
      })
      myChart.on('mouseout', function(params) {
        clearTimeout(timer)
        myChart.dispatchAction({ type: 'hideTip' })
      })
      myChart.getZr().on('click', function(params) {
        if (!params.target) {
          myChart.dispatchAction({ type: 'restore' })
        }
      })
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

    computedValue(arr) {
      return arr.map(item => {
        if (item.children.length) {
          this.computedValue(item.children)
        } else {
          item.value = 1
        }
        return item
      })
    },

    addColor(arr, level = 0, type) {
      return arr.map((item, index) => {
        if (level === 1) {
          type = colorType[item.id]
        } else if (level === 2) {
          type = colorType[item.id]
        } else if (level === 3) {
          type = colorType[item.id]
        }
        if (level) {
          item.itemStyle = { color: colors[type][level - 1] }
        }
        if (item.children) {
          this.addColor(item.children, level + 1, type)
        }
        return item
      })
    }
  }
}
</script>

<style scoped>
  .app-container{
    height: 100vw;
    display: flex;
    flex-direction: column;
  }
  .chart-wrap {
    flex: 1 1 auto;
  }
</style>
