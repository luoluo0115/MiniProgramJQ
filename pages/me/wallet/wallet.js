// pages/me/wallet/wallet.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    setMealList: [],
    checked: true,
    activeId: '',
    custom_amt: '', //自定义金额
    balance_amt: 0.00, //账户余额
    deposit_amt: 0, //充值金额
    account_amt: 0, //入账金额
    pay_id: 0, //支付产品ID
    pay_product_name: '', //支付产品名称
    amountMessage: '',
    disabled: '',
    index: 0,
    customer_name: ''
  },
  goRule: function (e) {
    let type = e.currentTarget.dataset.type;
    if (type == "active-rule") {
      wx.navigateTo({
        url: "/pages/me/rule/rule?type=" + type
      })
    }
  },
  goRecord: function () {
    wx.navigateTo({
      url: "/pages/me/payRecord/payRecord"
    })
  },
  /**
   * 账户余额
   */
  QueryCustAccountInfo: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.QueryCustAccountInfo, {
      openid: app.globalData.openid,
      cid: customer_info_id,
      ui: app.globalData.user_id
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        let balance_amt = res.data.custAccountInfo[0].balance_amt;
        that.setData({
          balance_amt: balance_amt,
        });
      } else {
        console.log(res.data.msg)
        that.setData({
          balance_amt: 0,
        });
      }
    })
  },
  /**
   * 充值产品
   */
  QueryCustDepositProd: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.QueryCustDepositProd, {
      openid: app.globalData.openid,
      cid: customer_info_id,
      ui: app.globalData.user_id
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          setMealList: res.data.custDepositProd,
        });

      } else {
        that.setData({
          setMealList: []
        });
      }
    })
  },
  amountChange: function (event) {
    const deposit_amt = event.detail || '';
    console.log(deposit_amt)
    let message = '';
    let disable = '';
    if (deposit_amt) {
      if (/(?!^0*(\.0{1,2})?$)^\d{1,13}(\.\d{1,2})?$/.test(deposit_amt)) {
        message = '';
        disable = false;
      } else {
        message = '输入金额有误';
        disable = true;
      }
    } else {
      message = '金额不能为空',
        disable = true
    }
    this.setData({
      amountMessage: message,
      disabled: disable,
      deposit_amt: deposit_amt,
      account_amt: deposit_amt,
      custom_amt: deposit_amt,
    });
    if (this.data.disabled === true) {
      return false;
    } else {
      return true;
    }
  },

  //充值
  goRecharge: function (e) {
    const that = this;
    console.log(that.data.deposit_amt,'充值金额')
    if (that.data.deposit_amt == 0) {
      wx.showToast({
        title: "请选择充值金额！",
      });
      return;
    }

    var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
    if (!reg.test(that.data.deposit_amt)) {
      wx.showToast({
        title: "请输入数字类型！",
      });
      return;
    }
    if (that.data.checked == false) {
      wx.showToast({
        title: "请选中充值协议！",
      });
      return;
    }

    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let postData = {
      openid: app.globalData.openid,
      ui: app.globalData.user_id,
      un: app.globalData.user_name,
      cid: customer_info_id,
      curr_month: curr_month,
      pay_amount: that.data.deposit_amt,
      account_amt: that.data.account_amt,
      pay_id: that.data.pay_id,
      pay_proudct_name: that.data.pay_proudct_name,
    };
    console.log(postData, 'postData');
    util.request(api.GetPayId,
      postData, 'POST').then(function (res) {
      if (res.data.success == true) {
        var pay_trans_id = res.data.pay_trans_id;
        var pay_app_id = '1600440321';
        that.goPay(pay_trans_id, pay_app_id);
        //Toast(res.data.msg);       
      } else {
        Toast(res.data.msg);
      }
    })
  },
  //支付
  goPay: function (pay_trans_id, pay_app_id) {

    let product_name = this.data.pay_product_name;
    let need_pay_amount = this.data.deposit_amt;
    let appid = app.globalData.AppID;

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

        },
        complete: function (res) {
          //付款完成
          console.log('complete--' + res);
          //支付失败转到待支付订单列表
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {
            wx.showModal({
              title: "提示",
              content: "尚未支付",
              showCancel: false,
              confirmText: "确认",
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: "../../me/wallet/wallet",
                  });
                }
              }
            });
            return;
          }
          if (res.errMsg == "requestPayment:ok") {
            wx.redirectTo({
              url: "../../me/wallet/wallet",
            });
            return;
          }
          wx.navigateBack({
            delta: 0,
          });
        }
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.customer_info_id_list != '') {
      this.setData({
        customer_name: app.globalData.customer_info_id_list[app.globalData.index].customer_name
      })
    } else {

    }


  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.QueryCustDepositProd();
    this.QueryCustAccountInfo();
  },
  onChange(event) {
    this.setData({
      checked: event.detail,
    });
  },
  bindTapSetMeal: function (event) {
    console.log(event, 'event')
    let that =this;
    let product_name = event.currentTarget.dataset.product_name;
    if (product_name != '其它金额') {
      that.setData({
        activeId: event.currentTarget.dataset.id,
        pay_product_name: product_name,
        pay_id: event.currentTarget.dataset.cust_deposit_prod_id,
        account_amt: event.currentTarget.dataset.account_amt,
        deposit_amt: event.currentTarget.dataset.deposit_amt,
      })
    } else {
      that.setData({
        activeId: event.currentTarget.dataset.id,
        pay_product_name: product_name,
        pay_id: event.currentTarget.dataset.cust_deposit_prod_id,
        account_amt: that.data.custom_amt,
        deposit_amt: that.data.custom_amt,
      })
    }
  }
})