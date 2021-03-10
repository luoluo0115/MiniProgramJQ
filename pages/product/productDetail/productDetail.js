// pages/product/good/good.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productList: [],
    productParamsList: [],
    show: false,
    isHidden: true,
    token: null,
    hasMoreSelect: false,
    selectSize: "选择规格：",
    selectSizePrice: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,
    favicon: 0,
    selectptPrice: 0,
    canSubmit: false, //  选中规格尺寸时候是否允许加入购物车,
    productPrice: '',
    pre_product_price_id: 0,
    propertyChildIds: [],
    propertyChildNames: [], //选择框值(影响价格）
    propertyChildNamesAll: "", //选择框值
    propertyChildNamesVal: "", //文本框值
    propertyProductConfig: "", //产品配置参数
    curr_customer_info_id: '',
    curr_customer_name: '',
    referral_code: '',
    showbill: false,
    pre_product_id: '',
    message: '',
    showloading: true
  },
  onTapShare() {
    this.setData({
      show: true
    });
  },

  onClose() {
    this.setData({
      show: false
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    console.log(options)
    var product_id = options.product_id;
    that.setData({
      pre_product_id: product_id,
    })

    that.QueryPreProductList(that.data.pre_product_id);
    that.QueryPreProductParams(that.data.pre_product_id)
    if (app.globalData.iphone == true) {
      that.setData({
        iphone: 'iphone'
      })
    }
  },
  onTapGood() {
    this.setData({
      show: false,
      showbill: true
    });
  },
  onTapArticle(event) {

    this.setData({
      show: false,
      showbill: true,
      article_title: app.globalData.article_title,
      summary: app.globalData.summary
    });

  },
  //父组件接收子组件传值
  compontpass: function (e) {
    this.setData({
      showbill: e.detail.showbill
    });
  },

  onCloseBill() {
    this.setData({
      showbill: false
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },


  //获取前置产品列表
  QueryPreProductList: function (event) {
    let that = this;
    let pre_product_id = event;
    that.setData({
      showloading: true
    })
    util.request(api.QueryPreProductListByIDUrl, {
      openid: app.globalData.openid,
      pre_product_id: pre_product_id,
      user_id: app.globalData.user_id
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        let product_desc = res.data.productList[0].product_desc
        WxParse.wxParse('product_desc', 'html', product_desc, that, 5);
        that.setData({
          productList: res.data.productList[0],
          is_param: res.data.productList[0].is_param,
          productPrice: res.data.productList[0].product_price,
        });
        console.log(that.data.productList.product_price, 'that.data.productList.product_price')
        if (that.data.is_param == 'N') {
          that.setData({
            productPrice: that.data.productList.product_price,
            pre_product_price_id: that.data.pre_product_id,
            propertyChildIds: '',
            propertyChildNames: that.data.product_name
          })
        }
      } else {
        that.setData({
          productList: []
        });
      }
      that.setData({
        showloading: false
      })
    })

  },
  //获取前置产品参数
  QueryPreProductParams: function (event) {
    let that = this;
    let pre_product_id = event;
    let customer_name = app.globalData.curr_customer_name;
    if (customer_name.indexOf("测试") >= 0) {
      customer_name = "";
    }
    that.setData({
      showloading: true
    })
    util.request(api.QueryPreProductParamsUrl, //获取前置产品参数
      {
        openid: app.globalData.openid,
        pre_product_id: pre_product_id,
      }, 'POST').then(function (res) {
      if (res.data.success == true) {
        console.log(res.data.productParamsList, 'res.data.productParamsList')
        let productParamsList = res.data.productParamsList;
        for (var i = 0; i < productParamsList.length; i++) {
          if (productParamsList[i].param_type == "E" && productParamsList[i].param_meaning == "C") {
            productParamsList[i].param_data = customer_name;
          }
        }
        that.setData({
          productParamsList: productParamsList,
        });
      } else {
        that.setData({
          productParamsList: []
        });
      }
      that.setData({
        showloading: false
      })
    })

  },
  tobuy: function () {
    let that = this;
    util.request(api.CheckCellPhoneUrl, //检查手机号是否注册
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id
      }, 'POST').then(function (res) {
      if (res.statusCode == 200) {
        if (res.data.code == "0") {
          that.bindGuiGeTap();
        } else if (res.data.code == "2") {
          Dialog.confirm({
            message: '请先认证一下手机号，方便下单后与您沟通,谢谢'
          }).then(() => {

          }).catch(() => {
            // on cancel
          });
        } else if (res.data.code == "3") {
          Dialog.confirm({
            confirmButtonText: '去关注',
            message: '请先关注微信公众号，方便下单后给你推送消息通知,谢谢'
          }).then(() => {
            wx.redirectTo({
              url: "/pages/home/officialAccount/officialAccount"
            })
          }).catch(() => {
            // on cancel
          });
        }
      }
    })
  },
  /**
   * 规格选择弹出框
   */
  bindGuiGeTap: function () {
    this.setData({
      hideShopPopup: false
    })
  },
  /**
   * 规格选择弹出框隐藏
   */
  closePopupTap: function () {
    this.setData({
      hideShopPopup: true
    })
  },
  /**
   * 选择商品规格
   * @param {Object} e
   */
  labelItemTap: function (e) {

    var that = this;
    // 取消该分类下的子栏目所有的选中状态
    var childs = that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList;

    for (var i = 0; i < childs.length; i++) {
      that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList[i].active = false;
    }
    // 设置当前选中状态
    that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList[e.currentTarget.dataset.propertychildindex].active = true;
    console.log(that.data.productParamsList[e.currentTarget.dataset.propertyindex].paramDataList[e.currentTarget.dataset.propertychildindex], 'childs')

    // 获取所有的选中规格尺寸数据
    var needSelect = that.data.productParamsList;
    var needSelectNum = 0;
    for (var j = 0; j < needSelect.length; j++) {
      if (needSelect[j].is_price_impact == 'Y') {
        needSelectNum++;
      }

    }

    var curSelectNum = 0;
    var propertyChildIds = "";
    var propertyChildNames = "";
    var propertyChildNamesAll = ""; //所有下拉框
    var propertyProductConfig = ""; //产品配置参数
    //var paramnametext = that.data.productParamsList[that.data.productParamsList.length].param_name;
    for (var i = 0; i < that.data.productParamsList.length; i++) {
      if (that.data.productParamsList[i].is_price_impact == 'Y') {
        console.log(that.data.productParamsList, 'that.data.productParamsList')
        var pre_product_id = that.data.productParamsList[i].pre_product_id
        childs = that.data.productParamsList[i].paramDataList;
        console.log(childs, ' childs')
        for (var j = 0; j < childs.length; j++) {
          if (childs[j].active) {
            curSelectNum++;
            propertyChildIds = propertyChildIds + that.data.productParamsList[i].pre_product_params_id + ":" + childs[j].id + ",";
            propertyChildNames = propertyChildNames + that.data.productParamsList[i].param_name + ":" + childs[j].paramData +
              "|";
          }
        }
      }
      if (that.data.productParamsList[i].is_product_impact == 'Y') {                
        childs = that.data.productParamsList[i].paramDataList;        
        for (var j = 0; j < childs.length; j++) {
          if (childs[j].active) {                        
            propertyProductConfig = propertyProductConfig+ childs[j].paramData +"|";
          }
        }
      }
      //所有选中的下拉框的值
      if (that.data.productParamsList[i].param_type == 'S') {
        childs = that.data.productParamsList[i].paramDataList;
        for (var j = 0; j < childs.length; j++) {
          if (childs[j].active) {
            propertyChildNamesAll = propertyChildNamesAll + that.data.productParamsList[i].param_name + ":" + childs[j].paramData +
              "|";
          }
        }
      }
    }
    propertyProductConfig = propertyProductConfig.substring(0, propertyProductConfig.lastIndexOf('|'));    
    var canSubmit = false;
    if (needSelectNum == curSelectNum) {
      canSubmit = true;
    }
    // 计算当前价格
    if (canSubmit) {
      let that = this;
      console.log(encodeURIComponent(propertyChildNames), '181propertyChildNames')
      let postData = {
        openid: app.globalData.openid,
        pre_product_id: pre_product_id,
        param_data: encodeURIComponent(propertyChildNames)
      }      
      util.request(api.QueryPreProductPriceUrl, //获取前置产品价格
        {
          openid: app.globalData.openid,
          pre_product_id: pre_product_id,
          param_data: encodeURIComponent(propertyChildNames)
        }, 'POST').then(function (res) {
        if (res.data.success == true) {
          console.log(res.data.productPrice, 'productPrice')
          that.setData({
            productPrice: res.data.productPrice,
            pre_product_price_id: res.data.pre_product_price_id,
            propertyChildIds: propertyChildIds,
            propertyChildNames: propertyChildNames
          });

        } else {
          console.log(res.data.msg)
          that.setData({
            productPrice: "0",
            pre_product_price_id: 0,
            propertyChildIds: propertyChildIds,
            propertyChildNames: propertyChildNames
          });
        }
      })
    }

    that.setData({
      productParamsList: that.data.productParamsList,
      canSubmit: canSubmit,
      propertyChildNamesAll: propertyChildNamesAll,
      propertyProductConfig: propertyProductConfig,
    })


  },
  /**
   * 组建下单信息
   */
  buliduBuyNowInfo: function (e) {
    var shopCarMap = {};
    let that = this;
    let label = that.data.propertyChildNamesAll + that.data.propertyChildNamesVal;
    if (label != '' && label.indexOf("|") != -1) {
      if (that.data.is_param == "N") {
        label = label.substring(0, label.lastIndexOf('|'));
      } else {
        label = label.substring(0, label.lastIndexOf('|'));
      }
    }
    shopCarMap.goodsId = that.data.productList.pre_product_id;
    shopCarMap.pic = that.data.productList.product_image;
    shopCarMap.name = that.data.productList.product_name;
    shopCarMap.propertyChildIds = that.data.propertyChildIds;
    shopCarMap.label = label;
    shopCarMap.propertyProductConfig = that.data.propertyProductConfig;
    shopCarMap.price = that.data.productPrice;
    shopCarMap.pre_product_price_id = that.data.pre_product_price_id;
    shopCarMap.left = "";
    shopCarMap.active = true;
    shopCarMap.curr_customer_info_id = that.data.curr_customer_info_id;
    shopCarMap.curr_customer_name = that.data.curr_customer_name;
    shopCarMap.referral_code = that.data.referral_code;

    var buyNowInfo = {};

    if (!buyNowInfo.shopList) {
      buyNowInfo.shopList = [];
    }
    buyNowInfo.shopList.push(shopCarMap);
    console.log(buyNowInfo, 'buyNowInfo');
    return buyNowInfo;

  },
  /**
   * 提交订单
   */
  /*input打印*/
  getFillInInf: function (e) {
    let index = e.currentTarget.dataset.index; // 获取索引
    let value = e.detail.value // 获取value
    let arr = this.data.productParamsList;
    arr[index].param_data = value;
  },
  buyNow: function (e) {
    let that = this;
    let paramname = e.currentTarget.dataset.id;
    if (that.data.is_param == 'N') {
      that.setData({
        productPrice: that.data.productPrice,
        pre_product_price_id: '0',
        propertyChildIds: '0',
        propertyChildNames: '',
        propertyChildNames: that.data.productList.product_name,
        propertyChildNamesAll: that.data.productList.product_name,
      });

    } else {
      console.log(that.data.productParamsList, 'that.data.productParamsList')
      if (that.data.productParamsList) {
        if (that.data.productParamsList.length == 1 && that.data.productParamsList[0].param_type == 'E') {
          if (that.data.productParamsList[0].param_data == '') {
            Toast(`请填写${that.data.productParamsList[0].param_name}`);
            return;
          }
        } else {
          wx.hideLoading();
          // if (!that.data.canSubmit) {
          //   if (!that.data.canSubmit) {
          //     Toast('请选中所有!');
          //   }
          //   return;
          // }
          //检查选择框是否选中
          for (var i = 0; i < that.data.productParamsList.length; i++) {
            if (that.data.productParamsList[i].param_type == 'S') {
              //所有选中下拉框(S)参数个数
              let selectSNum = 0;
              let childs = that.data.productParamsList[i].paramDataList;
              let param_name = that.data.productParamsList[i].param_name;
              for (var j = 0; j < childs.length; j++) {
                if (childs[j].active) {
                  selectSNum++;
                }
              }
              if (selectSNum <= 0) {
                Toast("请选择" + param_name);
                return;
              }
            }
          }
        }
      }
    }
    //检查文本框值是否存在(E)
    var cCount = 0;
    var propertyChildNamesVal = "";
    for (var i = 0; i < that.data.productParamsList.length; i++) {
      if (that.data.productParamsList[i].param_type == 'E') {
        propertyChildNamesVal = propertyChildNamesVal + that.data.productParamsList[i].param_name + ":" + that.data.productParamsList[i].param_data +
          "|";
        that.setData({
          propertyChildNamesVal: propertyChildNamesVal
        })
        console.log(propertyChildNamesVal, 'propertyChildNamesVal')
        if (that.data.productParamsList[i].param_data == '') {
          Toast(`请填写${that.data.productParamsList[i].param_name}`);
          return;
        }
      }
      if (that.data.productParamsList[i].param_type == 'E' && that.data.productParamsList[i].param_meaning == 'C') {
        cCount = cCount + 1
      }
    }

    setTimeout(function () {
      wx.hideLoading();

      let mS = 0; //成功数
      let mF = 0; //失败数
      let cM = 0; //param_meaning=C
      let mA = 0;
      let lastMsg = "";
      let customer_info_id = app.globalData.curr_customer_info_id;
      let user_id = app.globalData.user_id;
      let user_name = app.globalData.user_name;
      if (that.data.productPrice > 0) {
        if (cCount > 0) {
          for (var i = 0; i < that.data.productParamsList.length; i++) {
            //文本框(E)-客户名称(C)需要检查
            if (that.data.productParamsList[i].param_type == 'E' && that.data.productParamsList[i].param_meaning == 'C') {
              cM = cM + 1;

              var customer_name = (that.data.productParamsList[i].param_data).replace(/\s+/g, '');
              let postData = {
                openid: 0,
                cid: customer_info_id,
                ui: user_id,
                un: user_name,
                customer_name: customer_name,
              };

              util.request(api.CheckCustomerNameUrl,
                postData, 'POST').then(function (res) {
                mA = mA + 1;
                if (res.data.success == true) {
                  let curr_customer_info_id = res.data.curr_customer_info_id;
                  let referral_code = res.data.referral_code;
                  mS = mS + 1;
                  if (mA == cM && mS == cM) {
                    that.setData({
                      curr_customer_info_id: curr_customer_info_id,
                      curr_customer_name: customer_name,
                      referral_code: referral_code,
                    })
                    //组建立即购买信息
                    var buyNowInfo = that.buliduBuyNowInfo(paramname);
                    //写入本地存储
                    wx.setStorage({
                      key: "buyNowInfo",
                      data: buyNowInfo
                    });
                    wx.navigateTo({
                      url: "../pay-order/pay-order"
                    })
                    that.closePopupTap();
                  }
                } else {
                  lastMsg = res.data.msg;
                  mF = mF + 1;
                  if (mA == cM && mF > 0) {
                    Toast(lastMsg);
                  }
                  return;
                }
              });
            }
          }
        } else {
          that.setData({
            curr_customer_info_id: customer_info_id,
            curr_customer_name: app.globalData.curr_customer_name,
          })
          //组建立即购买信息
          var buyNowInfo = that.buliduBuyNowInfo(paramname);
          //写入本地存储
          wx.setStorage({
            key: "buyNowInfo",
            data: buyNowInfo
          });
          wx.navigateTo({
            url: "../pay-order/pay-order"
          })
          that.closePopupTap();
        }
      } else {
        Toast('产品价格为0,提交订单失败!');
        return;
      }

    }, 300);

    wx.showLoading({
      title: '订单提交中...',
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },



})