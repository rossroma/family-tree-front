<template>
  <div v-if="treeList.length" class="mobile">
    <div v-for="(children, index) in treeList" :key="index" class="swiper" :class="['list' + index]">
      <div class="swiper-wrapper">
        <div
          v-for="(child) in children"
          :key="child.id"
          :data-id="child.id"
          :class="{isnc: child.id === -1, deepColor: index < 4}"
          class="swiper-slide"
          :style="{ background: child.color }"
        >
          {{ child.name }}
        </div>
      </div>
    </div>

    <el-button class="xuyan" type="danger" icon="el-icon-notebook-1" circle @click="isIntroductionShow = true" />
    <Introduction v-if="isIntroductionShow" :dialog-show.sync="isIntroductionShow" />
    <el-dialog width="100%" :visible.sync="dialogDetailVisible" custom-class="detailDialog">
      <div v-html="detailHtml" />
    </el-dialog>
  </div>
</template>

<script>
import Swiper from 'swiper'
import { CurrentIndex, formatterHtml, colors, colorType } from './shared'
import { getTreeList, getItem } from '@/api/table'
import Introduction from '@/views/home/components/introduction.vue'
import 'public/static/swiper-bundle.min.css'
const initialSlides = [0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0]
export default {
  name: 'Mobile',

  components: {
    Introduction
  },

  data() {
    return {
      originData: [],
      treeList: [],
      isIntroductionShow: false,
      detailHtml: '',
      dialogDetailVisible: false
    }
  },

  mounted() {
    this.getData()
  },

  methods: {
    async getData() {
      const res = await getTreeList()
      this.originData = res.result.rows
      this.treeList = this.formatter(res.result.rows)
      this.addColor(this.treeList)
      this.$nextTick(() => {
        this.init(this.treeList)
      })
    },

    formatter(list) {
      const result = {}
      list.forEach(item => {
        const { generation, id, givenName, parentId } = item
        if (result[generation]) {
          result[generation].push({ id, pid: parentId, name: givenName, generation })
        } else {
          result[generation] = [{ id, pid: parentId, name: givenName, generation }]
        }
      })
      return this.formatChildren(Object.values(result))
    },

    formatChildren(arr) {
      return arr.map((subArr, index) => {
        if (!index) return subArr
        if (index >= arr.length - 1) {
          subArr.push({ name: '空', id: -1, pid: null })
          return subArr
        }
        const pids = arr[index + 1].map(item => item.pid).filter((pid, i, arrs) => arrs.indexOf(pid) === i)
        let flag = false
        const format = subArr.map(item => {
          if (!pids.includes(item.id)) {
            flag = true
            item.nc = 1
          }
          return item
        })
        if (flag) {
          format.push({ name: '空', id: -1, pid: null })
        }
        return format
      })
    },

    addColor(arr, level = 0) {
      arr[level].forEach((item, index) => {
        if (item.id in colorType) {
          item.type = colorType[item.id]
          item.color = colors[item.type][item.generation - 18]
        } else if (level > 3) {
          const father = arr[level - 1].find(fa => fa.id === item.pid)
          if (father) {
            item.type = father.type
            item.color = colors[item.type][item.generation - 18]
          }
        }
      })
      const newLevel = level + 1
      if (arr[newLevel]) {
        this.addColor(arr, newLevel)
      }
    },

    init(data) {
      const that = this
      const currentIndex = new CurrentIndex(data, initialSlides)
      const swiperList = data.map((n, i) => {
        return new Swiper(`.list${i}`, {
          initialSlide: initialSlides[i],
          on: {
            slideChangeTransitionEnd(swiper) {
              if (!swiperList) return
              const { activeIndex, previousIndex } = swiper
              const newIndexs = currentIndex.slide(i, activeIndex - previousIndex)
              newIndexs.forEach((index, level) => {
                swiperList[level].slideTo(index, 300, false)
              })
            },
            click(swiper, { target }) {
              that.showDialog(i, target.dataset.id)
            }
          }
        })
      })
    },
    // 显示详情
    showDialog(level, id) {
      getItem({ id }).then(({ result }) => {
        const data = { ...result, sons: this.originData.filter(item => item.parentId === result.id) }
        this.detailHtml = formatterHtml(data, this.originData)
        this.dialogDetailVisible = true
      })
    }
  }
}
</script>

<style lang="scss">
  .mobile {
    max-width: 450px;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    // background: linear-gradient(to bottom, #FFE0B2, rgba(216, 67, 21, 0.9));
  }
  .mobile .swiper {
    height: 80px;
    width: 150px;
    overflow: initial;
    margin-left: 0;
  }

  .mobile .swiper .swiper-slide {
    line-height: 80px;
    font-size: 24px;
    color: #fff;
    text-align: center;
    cursor: pointer;
    opacity: 0.8;
    background: #FFFDE7;
  }
  .mobile .swiper .swiper-slide.deepColor{
    color: #000
  }

  .swiper .swiper-slide.swiper-slide-active {
    opacity: 1;
  }
  .swiper .swiper-slide.isnc {
    background-color: rgba(255, 255, 255, 0.2);
  }

  .mobile .xuyan {
    position: fixed;
    right: 20px;
    top: 20px;
  }
  .detailDialog {
    background-color: #FFFDE7;
  }
</style>
