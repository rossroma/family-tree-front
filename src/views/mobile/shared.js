
/**
 * 计算当前应该展示的卡片
 */
export class CurrentIndex {
  constructor(data, indexs) {
    this.data = data
    this.indexs = indexs
  }

  getCircleIndex(level, step) {
    // 需要兼容溢出和负数的情况
    return (this.indexs[level] + step + this.data[level].length) % this.data[level].length
  }

  slide(level, step) {
    this.indexs[level] = this.getCircleIndex(level, step)
    const { id, pid, nc } = this.data[level][this.indexs[level]]
    const subStep = step > 0 ? 1 : -1
    this._parentsIndex(pid, level - 1, subStep)
    this._childrenIndex(id, level + 1, subStep, nc)
    return this.indexs
  }

  _parentsIndex(id, level, step) {
    if (level < 0) return
    const index = this.data[level].findIndex(item => {
      return item.id === id
    })
    if (index === -1) return
    this.indexs[level] = index
    return this._parentsIndex(this.data[level][index].pid, level - 1, step)
  }

  _childrenIndex(pid, level, step) {
    if (level >= this.data.length) return
    const index = this.data[level].findIndex(item => item.pid === pid)
    if (index > -1) {
      this.indexs[level] = index
      return this._childrenIndex(this.data[level][index].id, level + 1, step)
    } else {
      this.indexs[level] = this.data[level].length - 1
      return this._childrenIndex(null, level + 1, step)
    }
  }
}

// const currentIndex = new CurrentIndex(data)
// currentIndex.slide(2, 3)
// currentIndex.slide(2, -3)
// currentIndex.slide(2, -1)
// currentIndex.slide(2, 2)

export const formatterHtml = (detail, dataList, isEdit) => {
  const { birth, death, givenName, generation, memo, wives, sons, daughters, father, id } = detail
  const renderGeneration = (generation) => {
    const eraMap = { 17: '十七', 18: '十八', 19: '十九', 20: '二十', 21: '廿一', 22: '廿二', 23: '廿三', 24: '廿四', 25: '廿五', 26: '廿六', 27: '廿七', 28: '廿八', 29: '廿九' }
    return `${eraMap[generation]}世`
  }
  const renderBad = (birth, death) => {
    if (birth || death) {
      return `<strong>生卒：</strong>${birth} ~ ${death}`
    }
    return `<strong>生卒：</strong> 不祥`
  }
  const renderWives = (wives) => {
    if (!wives || !wives.length) return ''
    const content = wives.map((item, i) => {
      return `<li class="item"><strong>${i === 0 ? '原' : '继'}配：</strong>${item.fullName} ${item.from || ''} ${item.memo || ''}</li>`
    })
    return `
      <ul class="wives">
        ${content.join('')}
      </ul>
    `
  }
  const sortMap = ['长', '次', '三', '四', '五', '六', '七', '八', '九']
  const renderChildren = (arr, type = '子') => {
    if (!arr || !arr.length) return ''
    return arr.map((item, index) => {
      if (type === '子') {
        return `<li class="item"><strong>${sortMap[index]}${type}：</strong>${item.givenName}</li>`
      }
      return `<li class="item"><strong>${sortMap[index]}${type}：</strong>${item.givenName} ${item.married || ''} ${item.memo || ''}</li>`
    }).join('')
  }
  const renderRelationship = (currentId) => {
    if (!father) return ''
    const { generation, givenName, id } = father
    const brothers = dataList.filter(item => {
      return item.parentId === id
    })
    const index = brothers.findIndex(item => {
      return item.id === currentId
    })
    return `系${renderGeneration(generation)}${givenName}公${sortMap[index]}子`
  }
  const editButton = (isEdit) => {
    if (!isEdit) return ''
    return `<button class="edit" data-id="${id}">编辑</button>`
  }
  const renderMemo = (text) => {
    if (!text) return ''
    return `<div class="memo">
              <strong>备注：</strong>${text}
            </div>`
  }
  return `
          <div class="item-tooltip">
            <h4 class="title">
              <span class="era">${renderGeneration(generation)}</span>
              <span class="name">
                讳<strong>${givenName}</strong>
              </span>
              <span class="bad">
                ${renderBad(birth, death)}
              </span>
            </h4>
            ${editButton(isEdit)}
            ${renderWives(wives)}
            <h5 class="sub-title">
              <span class="courtesy">
              &nbsp;
              </span>
              <strong class="relationship">${renderRelationship(id)}</strong>
            </h5>
            <div class="children">
              <ul class="sons">
                ${renderChildren(sons)}
              </ul>
              <ul class="daughters">
                ${renderChildren(daughters, '女')}
              </ul>
            </div>
            ${renderMemo(memo)}
          </div>
          `
}

export const colors = [
  [
    '#FFEBEE',
    '#FFCDD2',
    '#EF9A9A',
    '#E57373',
    '#EF5350',
    '#F44336',
    '#E53935',
    '#D32F2F',
    '#C62828',
    '#B71C1C'
  ],
  [
    '#FCE4EC',
    '#F8BBD0',
    '#F48FB1',
    '#F06292',
    '#EC407A',
    '#E91E63',
    '#D81B60',
    '#C2185B',
    '#AD1457',
    '#880E4F'
  ],
  [
    '#F3E5F5',
    '#E1BEE7',
    '#CE93D8',
    '#BA68C8',
    '#AB47BC',
    '#9C27B0',
    '#8E24AA',
    '#7B1FA2',
    '#6A1B9A',
    '#4A148C'
  ],
  [
    '#EDE7F6',
    '#D1C4E9',
    '#B39DDB',
    '#9575CD',
    '#7E57C2',
    '#673AB7',
    '#5E35B1',
    '#512DA8',
    '#4527A0',
    '#311B92'
  ],
  [
    '#E8EAF6',
    '#C5CAE9',
    '#9FA8DA',
    '#7986CB',
    '#5C6BC0',
    '#3F51B5',
    '#3949AB',
    '#303F9F',
    '#283593',
    '#1A237E'
  ],
  [
    '#E3F2FD',
    '#BBDEFB',
    '#90CAF9',
    '#64B5F6',
    '#42A5F5',
    '#2196F3',
    '#1E88E5',
    '#1976D2',
    '#1565C0',
    '#0D47A1'
  ],
  [
    '#E1F5FE',
    '#B3E5FC',
    '#81D4FA',
    '#4FC3F7',
    '#29B6F6',
    '#03A9F4',
    '#039BE5',
    '#0288D1',
    '#0277BD',
    '#01579B'
  ],
  [
    '#E0F7FA',
    '#B2EBF2',
    '#80DEEA',
    '#4DD0E1',
    '#26C6DA',
    '#00BCD4',
    '#00ACC1',
    '#0097A7',
    '#00838F',
    '#006064'
  ],
  [
    '#E0F2F1',
    '#B2DFDB',
    '#80CBC4',
    '#4DB6AC',
    '#26A69A',
    '#009688',
    '#00897B',
    '#00796B',
    '#00695C',
    '#004D40'
  ],
  [
    '#E8F5E9',
    '#C8E6C9',
    '#A5D6A7',
    '#81C784',
    '#66BB6A',
    '#4CAF50',
    '#43A047',
    '#388E3C',
    '#2E7D32',
    '#1B5E20'
  ],
  [
    '#F1F8E9',
    '#DCEDC8',
    '#C5E1A5',
    '#AED581',
    '#9CCC65',
    '#8BC34A',
    '#7CB342',
    '#689F38',
    '#558B2F',
    '#33691E'
  ],
  [
    '#F9FBE7',
    '#F0F4C3',
    '#E6EE9C',
    '#DCE775',
    '#D4E157',
    '#CDDC39',
    '#C0CA33',
    '#AFB42B',
    '#9E9D24',
    '#827717'
  ],
  [
    '#FFFDE7',
    '#FFF9C4',
    '#FFF59D',
    '#FFF176',
    '#FFEE58',
    '#FFEB3B',
    '#FDD835',
    '#FBC02D',
    '#F9A825',
    '#F57F17'
  ],
  [
    '#FFF8E1',
    '#FFECB3',
    '#FFE082',
    '#FFD54F',
    '#FFCA28',
    '#FFC107',
    '#FFB300',
    '#FFA000',
    '#FF8F00',
    '#FF6F00'
  ],
  [
    '#FFF3E0',
    '#FFE0B2',
    '#FFCC80',
    '#FFB74D',
    '#FFA726',
    '#FF9800',
    '#FB8C00',
    '#F57C00',
    '#EF6C00',
    '#E65100'
  ],
  [
    '#FBE9E7',
    '#FFCCBC',
    '#FFAB91',
    '#FF8A65',
    '#FF7043',
    '#FF5722',
    '#F4511E',
    '#E64A19',
    '#D84315',
    '#BF360C'
  ]
]

export const colorType = {
  // 仁
  2: 11,
  3: 11,
  4: 11,
  // 礼
  6: 10,
  7: 10,
  8: 10,
  // 贵
  60: 7,
  61: 8,
  91: 9,
  62: 8,
  92: 5,
  93: 7,
  118: 6,
  159: 5,
  // 智
  228: 15,
  443: 3,
  444: 3,
  358: 2,
  359: 2,
  360: 0,
  361: 1,
  382: 0,
  229: 13,
  230: 15,
  232: 14,
  247: 13
}
