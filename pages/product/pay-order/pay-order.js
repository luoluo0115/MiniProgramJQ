// pages/product/pay-order/pay-order.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodPrice: [],
    goodsList: [],
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null, // 当前选择使用的优惠券
    isHidden: true,
    token: null,
    showCoupon: false,
    radio: '',
    couponUseList: '',
    coupon_amount: 0,
    couponLength: 0,
    last_amount: 0,
    promotion_coupon_user_id: 0,
    promotion_coupon_id: 0,
    couponUseList1: [],
    list: ['a', 'b', 'c'],
    result: '',
    referral_code: "", //推荐码
    radioPay: '1', //支付方式
    available_balance: 0, //可用余额
    balance_amt: 0, //账户金额
    reserve_amt: 0, //账户预留金额
    customer_name:'',//账户名称
    par_balance_amt: 0, //代理账户金额
    par_reserve_amt: 0, //代理账户预留金额
    par_available_balance: 0, //代理账户可用余额
    par_customer_name: '', //代理账户名称
    agent_pay: false,
  },
  onPayChange(event) {
    this.setData({
      radioPay: event.detail,
    });
  },
  onClick(event) {
    let name = event.currentTarget.dataset.name;
    this.setData({
      radioPay: name,
    });
  },

  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  /*不使用优惠券*/
  noCoupon: function () {
    let that = this;
    let price = that.data.goodPrice
    let last_amount = price;
    this.setData({
      showCoupon: false,
      coupon_amount: 0,
      last_amount: last_amount,
      radio: '',
      couponUseList: '',
      promotion_coupon_user_id: 0,
      promotion_coupon_id: 0,
    })

  },
  /*使用优惠券*/
  userCoupon: function (e) {
    let that = this;
    let radio = that.data.radio;
    let result = that.data.result;
    let price = that.data.goodPrice
    if (radio != '') {
      let couponUseList = that.data.couponUseList1[radio]
      let coupon_amount = that.data.couponUseList1[radio].coupon_amount
      let last_amount = price - coupon_amount
      this.setData({
        showCoupon: false,
        coupon_amount: coupon_amount,
        last_amount: last_amount,
        couponUseList: couponUseList,
        promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
        promotion_coupon_id: couponUseList.promotion_coupon_id,
      })

    } else {
      let last_amount = price;
      this.setData({
        showCoupon: false,
        coupon_amount: 0,
        last_amount: last_amount,
        couponUseList: '',
        promotion_coupon_user_id: 0,
        promotion_coupon_id: 0,
      })
    }
  },
  /*获取优惠券*/
  goCoupon: function () {
    this.setData({
      showCoupon: true
    })
  },
  //查询优惠券
  QueryMyCoupon: function (e) {
    console.log(e, 'e111')
    let that = this;
    util.request(api.QueryPromotionCouponUseUrl, //查询优惠券
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id,
        pre_product_id: e.goodsId,
        order_amount: e.price
      }, 'POST').then(function (res) {
      console.log(res, 'res.data.couponUseList');
      if (res.data.success == true) {
        that.setData({
          couponUseList1: res.data.couponUseList,
          couponLength: res.data.couponUseList.length
        });
      } else {
        that.setData({
          couponUseList1: [],
          msg: res.data.msg,
          couponLength: 0
        });
      }
    })
  },
  //账户余额
  QueryCustAccountInfo: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.QueryCustAccountInfo, {
      cid: customer_info_id,
      ui: user_id,
      un: user_name,
      curr_month: curr_month
    }, 'POST').then(function (res) {
      console.log(res, 'res.data.QueryCustAccountInfo');
      if (res.data.success == true) {
        let par_balance_amt = 0;
        let par_reserve_amt = 0;
        let par_available_balance = 0;
        let par_customer_name ='';
        let balance_amt = res.data.custAccountInfo[0].balance_amt;
        let reserve_amt = res.data.custAccountInfo[0].reserve_amt;
        let available_balance = res.data.custAccountInfo[0].available_balance;
        let customer_name = res.data.custAccountInfo[0].customer_name;
        if (res.data.custAgentPay.length>0) {
          par_balance_amt = res.data.custAgentPay[0].balance_amt;
          par_reserve_amt = res.data.custAgentPay[0].reserve_amt;
          par_available_balance = res.data.custAgentPay[0].available_balance;
          par_customer_name = res.data.custAgentPay[0].customer_name;
        }
        let agent_pay = false;
        if (par_available_balance >= that.data.goodPrice && available_balance < that.data.goodPrice) {
          agent_pay = true;
        }
        that.setData({
          available_balance: available_balance,
          balance_amt: balance_amt,
          reserve_amt: reserve_amt,
          customer_name: customer_name,
          par_balance_amt: par_balance_amt,
          par_reserve_amt: par_reserve_amt,
          par_available_balance: par_available_balance,
          par_customer_name: par_customer_name,
          agent_pay: agent_pay,
        });
      } else {
        that.setData({
          available_balance: 0,
          balance_amt: 0,
          reserve_amt: 0,
          par_balance_amt: 0,
          par_reserve_amt: 0,
          par_available_balance: 0,
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.iphone == true) {
      this.setData({
        iphone: 'iphone'
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onClose() {
    this.setData({
      showCoupon: false
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    let shopList = [];
    let parent_referral_code = wx.getStorageSync("parent_referral_code");
    let referral_code = "";
    //立即下单
    var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
    if (buyNowInfoMem && buyNowInfoMem.shopList) {
      shopList = buyNowInfoMem.shopList;
      referral_code = buyNowInfoMem.shopList[0].referral_code;
    }
    if (referral_code == undefined || referral_code == null || referral_code == "") {
      referral_code = parent_referral_code;
    }
    that.setData({
      goodsList: shopList,
      goodPrice: shopList[0].price,
      referral_code: referral_code
    });
    that.QueryMyCoupon(that.data.goodsList[0]);
    that.QueryCustAccountInfo();
  },

  //立即下单
  createOrder: function (e) {
    //wx.showLoading();
    if (this.data.payButtonClicked) {
      wx.showToast({
        title: '休息一下~',
        icon: 'none'
      })
      return
    }
    this.data.payButtonClicked = true
    setTimeout(() => {
      this.data.payButtonClicked = false
    }, 1000)
    // 防止连续点击--结束
    const that = this;
    let remark = ""; // 备注信息
    let referral_code = ""; //推荐码
    let curr_customer_info_id = that.data.goodsList[0].curr_customer_info_id;
    if (e) {
      remark = e.detail.value.remark; // 备注信息
      referral_code = e.detail.value.referral_code;
    }
    let last_amount = that.data.goodsList[0].price - that.data.coupon_amount;
    that.setData({
      last_amount: last_amount,
    })
    let pay_method = that.data.radioPay;
    let available_balance = that.data.available_balance;
    available_balance = available_balance == undefined ? 0 : available_balance;
    let par_available_balance = that.data.par_available_balance;
    par_available_balance = par_available_balance == undefined ? 0 : par_available_balance;
    if (pay_method == "" || pay_method == null || pay_method == undefined) {
      wx.showToast({
        title: '请选择支付方式',
        icon: 'none'
      })
      return
    }
    if (pay_method == 2) {
      if (last_amount > available_balance) {
        wx.showToast({
          title: '可用余额不足',
          icon: 'none'
        })
        return
      }
    }
    if (pay_method == 3) {
      if (last_amount > par_available_balance) {
        wx.showToast({
          title: '代理账户可用余额不足',
          icon: 'none'
        })
        return
      }
    }
    let postData = {
      openid: app.globalData.openid,
      pre_product_id: that.data.goodsList[0].goodsId,
      order_amount: Number(that.data.last_amount),
      user_id: app.globalData.user_id,
      customer_info_id: curr_customer_info_id,
      pre_product_price_id: that.data.goodsList[0].pre_product_price_id,
      param_data: that.data.goodsList[0].label,
      productConfig:that.data.goodsList[0].propertyProductConfig,
      promotion_coupon_user_id: that.data.promotion_coupon_user_id,
      promotion_coupon_id: that.data.promotion_coupon_id,
      coupon_amount: that.data.coupon_amount,
      remark: remark,
      referralCode: referral_code,

    };
    console.log(postData, 'postData');
    util.request(api.GeneratePreOrderUrl, //生成前置订单
      postData, 'POST').then(function (res) {
      console.log(res, '下单');
      if (res.data.success == true) {
        var orderInfo = res.data.preOrderInfo[0];
        var status = orderInfo.status;
        if (status == "A") {
          if (pay_method == 2) {
            that.orderPay(res.data.preOrderInfo[0]);
          } else if (pay_method == 3) {
            that.orderPay(res.data.preOrderInfo[0]);
          } else {
            that.wxpay(res.data.preOrderInfo[0]);
          }
        } else {
          Toast('订单未支付成功!');
          wx.showModal({
            title: "提示",
            content: "该订单价格需要提供企业信息评估后才能付款，请在咨询界面与专属服务人员沟通确认调整价格后支付，谢谢配合！",
            showCancel: false,
            confirmText: "确认",
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "../../me/myOrder/myOrder?status=S",
                });
              }
            }
          });
        }
      } else {
        Toast('提交订单失败!');
      }
    })


  },

  //订单支付
  orderPay: function (event) {
    let cid = app.globalData.curr_customer_info_id;
    let ui = app.globalData.user_id;
    let pre_order_id = event.pre_order_id;
    let pay_trans_id = event.pay_trans_id;
    let product_name = event.product_name;
    let need_pay_amount = event.need_pay_amount;
    let pay_app_id = event.pay_app_id;
    let appid = app.globalData.AppID;
    let openid = app.globalData.openid;
    let that = this;
    let _msg = '订单金额: ' + need_pay_amount + ' 元'
    if (that.data.available_balance > 0 && that.data.radioPay == 2) {
      _msg += ',可用余额为 ' + that.data.available_balance + ' 元'
    }
    if (that.data.par_available_balance > 0 && that.data.radioPay == 3) {
      _msg += ',代理账户余额为 ' + (that.data.par_available_balance) + ' 元'
    }
    wx.showModal({
      title: '请确认支付',
      content: _msg,
      confirmText: "确认支付",
      cancelText: "取消支付",
      success: function (res) {
        console.log(res);
        if (res.confirm) {
          wx.showLoading({
            title: "订单支付中",
            mask: true,
          });

          var data = {
            openid: openid,
            pre_order_id: pre_order_id,
            pay_trans_id: pay_trans_id,
            pay_method: that.data.radioPay,
            money: need_pay_amount,
            cid: cid,
            ui: ui,
          }
          util.request(api.PostOrderAffirmPay, data, "POST").then(function (res) {
            console.log(res);
            wx.hideLoading();
            if (res.data.success == true) {
              Toast(res.data.msg);
              wx.redirectTo({
                url: "../../me/myOrder/myOrder?status=R",
              });
            } else {
              Toast(res.data.msg);
              wx.showModal({
                title: "提示",
                content: "订单支付失败",
                showCancel: false,
                confirmText: "确认",
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: "../../me/myOrder/myOrder?status=S",
                    });
                  }
                }
              });
            }
          })
        } else {

          wx.showModal({
            title: "提示",
            content: "订单尚未支付",
            showCancel: false,
            confirmText: "确认",
            success: function (res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: "../../me/myOrder/myOrder?status=S",
                });
              }
            }
          });
        }
      }
    });
  },
  //微信支付
  wxpay: function (event) {
    let pre_order_id = event.pre_order_id;
    let pay_trans_id = event.pay_trans_id;
    let product_name = event.product_name;
    let need_pay_amount = event.need_pay_amount;
    let pay_app_id = event.pay_app_id;
    let appid = app.globalData.AppID;
    console.log("订单信息" + JSON.stringify(event));
    let that = this;
    wx.showLoading({
      title: "正在支付",
      mask: true,
    });
    let openid = app.globalData.openid;
    console.log(openid)
    if (!openid || openid == undefined) {
      wx.showToast({
        title: "未授权登录.请授权登录后支付!",
      });
      return;
    }
    var data = {
      openid: openid,
      money: need_pay_amount,
      name: product_name,
      id: pay_trans_id,
      orderType: 'BA',
      pay_app_id: pay_app_id,
      appid: appid
    }
    //预交款
    console.log('data' + JSON.stringify(data))
    util.request(api.WxPayOrderPrepaidUrl, data, "POST").then(function (res) {
      console.log(res);
      wx.hideLoading();
      //发起缴款
      wx.requestPayment({
        timeStamp: res.data.timeStamp,
        nonceStr: res.data.noneStr,
        package: "prepay_id=" + res.data.packge,
        signType: 'MD5',
        paySign: res.data.paySign,
        success(res) {
          console.log(res);
          Toast('支付成功!');

        },
        fail(res) {
          console.log(res);
          Toast('支付失败!');
          wx.navigateTo({
            //url: '../../pages/product/payFailure',//付款失败
          })
        },
        complete: function (res) {
          //付款完成
          console.log('complete--' + res);
          //支付失败转到待支付订单列表
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {
            wx.showModal({
              title: "提示",
              content: "订单尚未支付",
              showCancel: false,
              confirmText: "确认",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "../../me/myOrder/myOrder?status=S",
                  });
                }
              }
            });
            return;
          }
          if (res.errMsg == "requestPayment:ok") {
            wx.redirectTo({
              url: "../../me/myOrder/myOrder?status=R",
            });
            return;
          }
          wx.navigateBack({
            delta: 2,
          });
        }
      })
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