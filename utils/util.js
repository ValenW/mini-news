const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const logFail = (requestFor, res) => {
  console.log("Error when " + requestFor + ":");
  console.log(res);
}

const getResult = res => {
  if (res && res.data && res.data.code == "200" && res.data.message == "success") {
    return res.data.result;
  }
  return null;
}

const getRequestObject = obj => {
  return {
    url: obj.url,
    data: obj.data,
    success: res => {
      let result = getResult(res);
      if (result != null) {
        obj.success(result);
      } else {
        logFail(`[${obj.filedName}] parse result`, res);
      }
    },
    fail: res => {
      logFail(`[${obj.filedName}] request`, res);
    },
    complete: res => {
      obj.callback && obj.callback();
    }
  }
}

module.exports = {
  formatTime: formatTime,
  logFail: logFail,
  getResult: getResult,
  getRequestObject: getRequestObject,
}
