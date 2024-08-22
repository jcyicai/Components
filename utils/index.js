// 引入 lodash
import _ from 'lodash'
import moment from 'moment'

/**
 * num: 要格式化数字
 * decimals: 保留精度
 * type: 返回数字类型  n = 数字类型 s = 字符串类型
 * zeroFill: 是否补零
 * @returns number || string
 */
export function baseNumFormat(num, decimals = 2, type = 'n', zeroFill = false) {
  if (num === undefined || num === null || num === '' || num === 'undefined' || isNaN(num)) {
    return ''
  }
  const number = _.round(num, decimals)
  return type === 'n' ? number : numberFormat(number, decimals, zeroFill)
}

/*
 * number：要格式化数字
 * decimals：保留几位小数
 * dec_point：小数点符号
 * thousands_sep：千分位符号
 * zero_fill:是否补零
 * */
export function numberFormat(num, decimals, zeroFill, decPoint, thousandsSep) {
  const number = `${num}`.replace(/[^0-9+-Ee.]/g, '')
  const roundtag = 'round' // 'ceil','floor','round' 取整方式，向上取整，向下取整，四舍五入
  const n = !Number.isFinite(+number) ? 0 : +number
  const prec = !Number.isFinite(+decimals) ? 2 : Math.abs(decimals)
  const sep = typeof thousandsSep === 'undefined' ? ',' : thousandsSep
  const dec = typeof decPoint === 'undefined' ? '.' : decPoint
  let s = ''
  const toFixedFix = (n2, prec2) => {
    const k = Math.pow(10, prec2)

    return `${parseFloat(Math[roundtag](parseFloat((n2 * k).toFixed(prec2 * 2))).toFixed(prec2 * 2)) / k}`
  }
  s = (prec ? toFixedFix(n, prec) : `${Math.round(n)}`).split('.')
  const re = /(-?\d+)(\d{3})/
  while (re.test(s[0])) {
    s[0] = s[0].replace(re, `$1${sep}$2`)
  }

  if (zeroFill) {
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
  }

  return s.join(dec)
}

/**
 * @description 时间格式化
 * @param date 日期
 * @param cFormat 格式类型  YYYY-MM-DD HH:mm:ss 24小时制
 * @param isTimestamp 是否返回时间戳
 * @returns {string | number}
 */
export function baseDateFormat(date, cFormat = 'YYYY-MM-DD', isTimestamp = false) {
  if (!date) {
    return ''
  }

  if (isTimestamp) {
    return moment(date).valueOf()
  } else {
    return moment(date).format(cFormat)
  }
}

/**
 * @description 是否函数
 * @param value 值
 * @returns {boolean}
 */
export function isFunction(value) {
  return typeof value === 'function'
}

/**
 * @description 是否不是空对象
 * @param obj 值
 * @returns {boolean}
 */
export function isNotEmptyObject(obj) {
  return obj && Object.keys(obj).length
}