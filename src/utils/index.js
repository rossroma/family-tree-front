/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        // https://stackoverflow.com/questions/4310953/invalid-date-in-safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {Number} ms
 * @returns Promise
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * @description localStorage的获取，增加，删除
 * @class Storage
 */
class Storage {
  constructor(props) {
    this.props = props || {}
    this.source = this.props.source || window.localStorage
    this.initRun()
  }

  initRun() {
    const reg = new RegExp('__expires__')
    const data = this.source
    const list = Object.keys(data)
    if (list.length > 0) {
      list.map((key, v) => {
        if (!reg.test(key)) {
          const now = Date.now()
          const expires = data[`${key}__expires__`] || Date.now + 1
          if (now >= expires) {
            this.remove(key)
          }
        }
        return key
      })
    }
  }

  /**
   * @description 获取方法
   * @param {String} key 键
   * @returns value
   * @memberof Storage
   */
  get(key) {
    const source = this.source
    const expired = source[`${key}__expires__`] || Date.now + 1
    const now = Date.now()

    if (now >= expired) {
      this.remove(key)
      return
    }
    let value = source[key]
    if (/^\{.*\}$/.test(value) || /^\[.*\]$/.test(value)) value = JSON.parse(value)
    return value
  }

  /**
   * @description 存储方法
   * @param {String} key 键
   * @param {String} value 值
   * @param {Number} expired 过期时间，单位分钟，非必填
   * @returns value
   * @memberof Storage
   */
  set(key, value, expired) {
    if (typeof value === typeof {}) value = JSON.stringify(value)
    const source = this.source
    source[key] = value
    if (expired) {
      source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired
    }
    return value
  }

  /**
   * @description 删除方法
   * @param {String} key 键
   * @returns value
   * @memberof Storage
   */
  remove(key) {
    const data = this.source
    const value = data[key]
    delete data[key]
    delete data[`${key}__expires__`]
    return value
  }
}

export const LS = new Storage()

/**
 * 实现函数的节流（目的是频繁触发中缩减频率）
 * @param fn {Function} 实际要执行的函数
 * @param wait {Number} 执行间隔，单位是毫秒(ms)，默认100ms
 * @return {Function} 可被调用执行的函数
 */

export function debounce(fn, delay = 300) {
  // timer 是在闭包中的
  let timer = null

  return function() {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn.apply(this, arguments)
      timer = null
    }, delay)
  }
}
