var api = require('../config/api.js')
var utilMd5 = require('../utils/md5.js');
import Toast from '../vant-weapp/dist/toast/toast';
const app = getApp();
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

const formatYear = date => {
  var date = new Date;
  var year = date.getFullYear();

  return year
};
const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1

  return [year, month].map(formatNumber).join('-') + ' '
};

const formatDataTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('-')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
};
const dateFormatStr = function (dateStr) {
  if (dateStr == null) {
    return '';
  }
  return dateStr.replace('T', ' ')
}
//上个月
const LastMonth = function () {
  var date = new Date;
  var year = date.getFullYear();
  var month = date.getMonth();
  if (month == '0') {
    year = date.getFullYear() - 1;
    month = 12;
  }
  console.log(year, 'year');
  console.log(month, 'month');
  return [year, month].map(formatNumber).join('-')


}
//上个月
const Month = function () {
  var date = new Date;
  var month = date.getMonth();

  console.log(month, 'month');
  return month

}
const priceSwitch = function (val) {
  //金额转换  并每隔3位用逗号分开 1,234.56
  var str = (val * 100 / 100).toFixed(2) + '';
  var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部分
  var dot = str.substring(str.length, str.indexOf(".")) //取到小数部分搜索
  var ret = intSum + dot;
  return ret;
}

const formatDateUnderLine = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  return [year, month, day].map(formatNumber).join('_')
}
const yymmdd = formatDateUnderLine(new Date());
const md5key = utilMd5.hexMD5('COMMON_TOKEN_' + yymmdd).toUpperCase();

function request(url, data = {}, method = "POST", checkLogin = false) {
  return new Promise(function (resolve, reject) {
    var that = this;
    var qh_access_token = "";
    //需要验证Bearer token
    wx.request({
      url: api.TokenUrl + md5key,
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: "get",
      dataType: "json",
      success: function (res) {
        qh_access_token = res.data.token;
        //console.log("api-token:" + qh_access_token);
        wx.setStorageSync('qh_access_token', qh_access_token);
        getApp().globalData.Token = res.data.access_token;

        if (checkUserId() || checkLogin) {

          wx.request({
            url: url,
            data: data,
            method: method,
            header: {
              'content-type': 'application/json', // 默认值,
              'Authorization': 'Bearer ' + qh_access_token //设置验证
            },
            dataType: "json",
            success: function (res) {
              resolve(res);
            },
            fail: function (res) {
              console.warn('--- request fail >>>');
              console.warn(res);
              console.warn('<<< request fail ---');
              var app = getApp();
              if (app.is_on_launch) {
                app.is_on_launch = false;
                wx.showModal({
                  title: "网络请求出错",
                  content: res.errMsg,
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      reject(res);
                    }
                  }
                });
              } else {
                wx.showToast({
                  title: res.errMsg,
                  image: "/images/icon-warning.png",
                });
                reject(res);
              }
            },
            complete: function (res) {
              if (res.statusCode != 200) {
                console.log('--- request http error >>>');
                console.log(res.statusCode);
                console.log(res.data);
                console.log('<<< request http error ---');
              }
              reject(res);
            }
          });

        } else {
          // var app = getApp();
          // if (app.globalData.is_on_show) {
          //   app.globalData.is_on_show = false;
          //   wx.showModal({
          //     title: '登录提示',
          //     content: '您尚未登录，是否立即登录？',
          //     success: function (res) {
          //       if (res.confirm) {
          //         wx.reLaunch({
          //           url: '/pages/index/index'
          //         });
          //       }
          //       else if (res.cancel) {
          //         app.globalData.is_on_show = true;
          //       }
          //     }
          //   })
          // }

          wx.reLaunch({
            url: '/pages/index/index'
          });
          // let code = null;
          // return login().then((res) => {
          //   code = res.code;
          //   return getUserInfo();
          // }).then((userInfo) => {
          //   wx.getUserInfo({
          //     success: function (res) {
          //       var encryptedData = res.encryptedData
          //       var iv = res.iv;
          //       var data = {
          //         code: code,
          //         encryptedData: encryptedData,
          //         iv: iv
          //       }
          //       console.log(data)
          //       var app = getApp();
          //       request(api.UserUrl, data, 'POST',true).then(function (res) {
          //         console.log(res);
          //         app.globalData.openid = res.data.openid;
          //         app.globalData.sessKey = res.data.session_key;
          //         app.globalData.user_id = res.data.user_id;
          //         app.globalData.user_name = res.data.user_name;
          //         wx.setStorageSync("referral_code", res.data.referral_code);
          //         wx.setStorageSync("is_follow_official_account", res.data.is_follow_official_account);
          //       })
          //     }
          //   })
          // })
        }

      },
      fail: function (res) {
        Toast('网络异常');
        console.log(res);
      },
      complete: function (res) {
        if (res.statusCode != 200) {
          console.log('--- request http error >>>');
          console.log(res.statusCode);
          console.log(res.data);
          console.log('<<< request http error ---');
        }        
      }
    });

  })
}

function commonRequest(object) {
  var that = this;
  if (!object.data) {
    object.data = {};
  }
  var qh_access_token = "";

  //需要验证Bearer token
  wx.request({
    url: api.TokenUrl + getApp().md5Key,
    header: {
      'content-type': 'application/x-www-form-urlencoded' // 默认值
    },
    method: "get",
    dataType: "json",
    success: function (res) {
      qh_access_token = res.data.token;

      wx.setStorageSync('qh_access_token', qh_access_token);
      var qh_access_token_time = formatTime(new Date());
      wx.setStorageSync('qh_access_token_time', qh_access_token_time);

      postRequest(object, qh_access_token);


    },
    fail: function (res) {
      console.log(res.error);
    }
  });
}

function postRequest(object, qh_access_token) {
  wx.showLoading({
    title: "加载中……",
    mask: true,
  });

  wx.request({
    url: object.url,
    header: object.header || {
      'content-type': 'application/json', // 默认值,
      'Authorization': 'Bearer ' + qh_access_token //设置验证
    },
    data: object.data || {},
    method: object.method || "GET",
    dataType: object.dataType || "json",
    success: function (res) {
      //is_VerifyLogin
      //getApp().checkOpenId();
      if (res.data.code == -1) {
        //getApp().login();
      } else {
        if (object.success)
          object.success(res);
      }
    },
    fail: function (res) {
      console.warn('--- request fail >>>');
      console.warn(res);
      console.warn('<<< request fail ---');
      var app = getApp();
      if (app.is_on_launch) {
        app.is_on_launch = false;
        wx.showModal({
          title: "网络请求出错",
          content: res.errMsg,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
              if (object.fail)
                object.fail(res);
            }
          }
        });
      } else {
        wx.showToast({
          title: res.errMsg,
          image: "/images/icon-warning.png",
        });
        if (object.fail)
          object.fail(res);
      }
    },
    complete: function (res) {
      wx.hideLoading();
      if (res.statusCode != 200) {
        console.log('--- request http error >>>');
        console.log(res.statusCode);
        console.log(res.data);
        console.log('<<< request http error ---');
      }
      if (object.complete)
        object.complete(res);
    }
  });

}

/**
 * 检查微信会话是否过期
 */
function checkSession() {
  return new Promise(function (resolve, reject) {
    wx.checkSession({
      success: function () {
        resolve(true);
      },
      fail: function () {
        reject(false);
      }
    })
  });
}

function checkUserId() {
  var app = getApp();
  var openid = app.globalData.openid;
  var user_id = app.globalData.user_id;
  if (user_id != "" && user_id != null && user_id != undefined) {
    return true;
  } else {
    return false;
  }
}

function checkOpenId() {
  var openid = wx.getStorageSync("openid");
  var user_id = wx.getStorageSync("user_id");
  if (user_id != "" && user_id != null && user_id != undefined) {
    return true;
  } else {
    return false;
  }
}

function get(url, data = {}) {
  return request(url, data, 'GET')
}

function post(url, data = {}) {
  return request(url, data, 'POST')
}

/**
 * 调用微信登录
 */
function login() {
  return new Promise(function (resolve, reject) {
    wx.login({
      success: function (res) {
        if (res.code) {
          resolve(res);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        reject(err);
      }
    });
  });
}

function getUserInfo() {
  return new Promise(function (resolve, reject) {
    wx.getUserInfo({
      withCredentials: true,
      success: function (res) {
        console.log(res)
        if (res.errMsg == 'getUserInfo:ok') {
          resolve(res);
        } else {
          reject(res)
        }
      },
      fail: function (err) {
        reject(err);
      }
    })
  }).catch((e) => {});
}

/**
 * 执行请求，禁止多次点击或者重复点击
 */
function showLoading(message) {
  if (wx.showLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.showLoading({
      title: message,
      mask: true
    });
  } else {
    // 低版本采用Toast兼容处理并将时间设为20秒以免自动消失
    wx.showToast({
      title: message,
      icon: 'loading',
      mask: true,
      duration: 20000
    });
  }
}

function hideLoading() {
  if (wx.hideLoading) {
    // 基础库 1.1.0 微信6.5.6版本开始支持，低版本需做兼容处理
    wx.hideLoading();
  } else {
    wx.hideToast();
  }
}

module.exports = {
  dateFormatStr: dateFormatStr,
  formatTime: formatTime,
  formatDate: formatDate,
  formatDataTime: formatDataTime,
  LastMonth: LastMonth,
  Month: Month,
  priceSwitch: priceSwitch,
  request: request,
  formatDateUnderLine: formatDateUnderLine,
  showLoading: showLoading,
  hideLoading: hideLoading,
  formatYear: formatYear
}