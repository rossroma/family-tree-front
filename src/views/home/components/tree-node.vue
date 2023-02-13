<template>
  <ul class="tree-node" :class="{ single: list.length === 1 }">
    <li v-for="item in list" :key="item.id">
      <span :data-id="item.id">{{ item.name }}</span>
      <Treenode
        v-if="!!item.children.length && item.generation < generation"
        :list="item.children"
        :generation="generation"
      />
    </li>
  </ul>
</template>

<script>

export default {
  name: 'TreeNode',

  components: {
    Treenode: () => import('./tree-node.vue')
  },

  props: {
    list: {
      type: Array,
      default: () => []
    },
    generation: {
      type: Number,
      required: true
    }
  },

  methods: {
    handleMouseover(e, { id, children }) {
    },

    handleMouseout(id) {
      const dialog = document.querySelector('.detail-dialog')
      if (dialog) {
        dialog.style.display = 'none'
      }
    },

    appendToBody(html, { pageX, pageY }) {
      let dialog = document.querySelector('.detail-dialog')
      if (!dialog) {
        dialog = document.createElement('div')
        dialog.setAttribute('class', `detail-dialog`)
        dialog.setAttribute('style', `display:none`)
        document.body.appendChild(dialog)
      }
      dialog.innerHTML = html
      dialog.setAttribute('style', `left:${pageX}px;top:${pageY}px`)
      console.log(html)
    }
  }

}
</script>

<style lang="scss" scoped>
  .tree-node {
    list-style: none;
    padding: 20px 0 0;
    margin: 0;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      border-left: 1px solid #ccc;
      width: 0;
      height: 20px;
    }
    li {
      float: left;
      text-align: center;
      list-style-type: none;
      position: relative;
      padding: 20px 5px 0 5px;
      &::before, &::after {
        content: '';
        position: absolute;
        top: 0;
        right: 50%;
        border-top: 1px solid #ccc;
        width: 50%;
        height: 20px;
      }
      &::after {
        right: auto;
        left: 50%;
        border-left: 1px solid #ccc;
      }
      &:first-child::after {
        border-radius: 5px 0 0 0;
      }
      &:last-child::before {
        border-right: 1px solid #ccc;
        border-radius: 0 5px 0 0;
      }
      &:first-child::before, &:last-child::after {
        border: 0 none;
      }
      span {
        border: 1px solid #ccc;
        padding: 5px;
        width: 14px;
        height: 32px;
        text-decoration: none;
        color: #666;
        font-family: arial, verdana, tahoma;
        font-size: 12px;
        display: inline-block;
        background: #FFF;
        cursor: pointer;
        box-sizing: content-box;
        border-radius: 5px;
        &:hover, &:hover+ul li span {
          background: #c8e4f8;
          color: #000;
          border: 1px solid #94a0b4;
        }
        &:hover+ul::before, &:hover+ul ::before, &:hover+ul ::after {
          border-color: #94a0b4;
        }
      }
    }
  }
  .single::before {
    height: 40px;
  }
</style>
