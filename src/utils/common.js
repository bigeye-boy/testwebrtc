/**
 * 通用js方法封装处理 General js method encapsulation processing
 */

// 日期格式化 Date format
export function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
      return null;
    }
    const format = pattern || "{y}-{m}-{d} {h}:{i}:{s}";
    let date;
    if (typeof time === "object") {
      date = time;
    } else {
      if (typeof time === "string" && /^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else if (typeof time === "string") {
        time = time
          .replace(new RegExp(/-/gm), "/")
          .replace("T", " ")
          .replace(new RegExp(/\.[\d]{3}/gm), "");
      }
      if (typeof time === "number" && time.toString().length === 10) {
        time = time * 1000;
      }
      date = new Date(time);
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay(),
      M: date.toLocaleString('en-US',{"month":"short"})
    };
    const time_str = format.replace(/{(y|m|d|h|i|s|M|a)+}/g, (result, key) => {
      let value = formatObj[key];
      // Note: getDay() returns 0 on Sunday
      if (key === "a") {
        return ["日", "一", "二", "三", "四", "五", "六"][value];
      }
      if (result.length > 0 && value < 10) {
        value = "0" + value;
      }
      return value || 0;
    });
    return time_str;
  }


/**
 * 参数处理 Parameter processing
 * @param {*} params  参数  parameter
 */
export function tansParams(params) {
    let result = "";
    for (const propName of Object.keys(params)) {
      const value = params[propName];
      var part = encodeURIComponent(propName) + "=";
      if (value !== null && value !== "" && typeof value !== "undefined") {
        if (typeof value === "object") {
          for (const key of Object.keys(value)) {
            if (
              value[key] !== null &&
              value[key] !== "" &&
              typeof value[key] !== "undefined"
            ) {
              let params = propName + "[" + key + "]";
              var subPart = encodeURIComponent(params) + "=";
              result += subPart + encodeURIComponent(value[key]) + "&";
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&";
        }
      }
    }
    return result;
}
  
// 千分位分隔符
export function numberToCurrencyNo(value) {
  if (!value) return 0
  // 获取整数部分
  const intPart = Math.trunc(value)
  // 整数部分处理，增加,
  const intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  // 预定义小数部分
  let floatPart = ''
  // 将数值截取为小数部分和整数部分
  const valueArray = value.toString().split('.')
  if (valueArray.length === 2) { // 有小数部分
    floatPart = valueArray[1].toString() // 取得小数部分
    return intPartFormat + '.' + floatPart
  }
  return intPartFormat + floatPart
}

export function getNumber(value) {
  if (!value) return 0
  if(typeof value !== 'number') return value
  const formatter = new Intl.NumberFormat('en-US');
  return formatter.format(value)
}

export function formatDuring(mss) {
  return new Intl.NumberFormat('en-US').format((mss/60/60).toFixed(0)) + ' h'
}

export function formatMinutes(seconds) {
  var hours = new Intl.NumberFormat('en-US').format(Math.floor(seconds / 3600));
  var minutes = Math.floor((seconds % 3600) / 60);
  if (hours !== '0') {
    return hours + " h " + minutes + " m";
  }
  return minutes + " m";
}
