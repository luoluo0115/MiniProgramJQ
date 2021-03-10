var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceCustList: [], //发票抬头
    custCustomerName: '',//申请企业名称搜索
    CustomerNameSearch: '',//列表企业名称搜索
    active: 0,
    InvoiceApplyList: [], //开票列表
    msg: '',
    showModal: false,
    showCoupon: false, //显示优惠券
    couponUseList: [], //优惠券列表
    couponLength: 0, //优惠券个数    
    radio: '',
    coupon_amount: 0,
    invoice_service_fee: 0, //开票服务费
    express_expense: 0, //快递服务费
    sumPAY: 0, //服务费总计
    balance_amt: 0, //账户余额
    amt_reserve: 0, //预留金额
    balancepayment: 0, //需付费用
    showbalancepayment: 0, //显示需付费用
    promotion_coupon_user_id: 0,
    promotion_coupon_id: 0,
    pre_product_id: "999998",
    isbalance_amt: true, //是否账户扣款(账户+代理账户)
    balancepay_show: false, //是否账户扣款
    payDisabled: false,
    im_cust_req_master_id: 0,
    service_type: "按次付费",
    agentpay_show: false, //是否显示代理支付账户
    pay_customer_info_id: 0, //代理支付客户ID,
    codepayment: 0, //在线支付金额
    showcodepayment: 0, //显示在线支付金额
    pay_customer_name: '', //代理支付客户
    pay_balance_amt: 0, //代理支付账户余额
    agentpayment: 0, //代理支付金额
    showagentpayment: 0, //显示代理支付金额  

  },

  switchTab(event) {
    let that = this;
    let title = event.detail.title;
    if (title == '开票申请') {
      that.QueryInvoiceCust();
      wx.setNavigationBarTitle({
        title: '开票申请'
      });
    } else if (title == '开票列表') {
      that.QueryInvoiceApplyList();
      wx.setNavigationBarTitle({
        title: '开票列表'
      });
    }
  },
  custChange: function (e) {
    this.setData({
      custCustomerName: e.detail,
    })
  },
  onSearch: function () {
    this.QueryInvoiceCust();
  },

  custChangeSearch: function (e) {
    this.setData({
      CustomerNameSearch: e.detail,
    })
  },
  onSearchList: function () {
    this.QueryInvoiceApplyList();
  },
  /**
   * 查询开票客户
   */
  QueryInvoiceCust: function () {
    let that = this;
    let custCustomerName = that.data.custCustomerName;
    util.request(api.BillApi.QueryInvoiceCust, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      customer_name: custCustomerName,
      pageSize: 100,
      pageIndex: 1
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          invoiceCustList: res.data.data
        });
      } else {
        that.setData({
          invoiceCustList: []
        });
      }
    })
  },

  bindTapInvoiceApply(event) {
    let data = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/invoice/invoiceApply/invoiceApply?data=" + JSON.stringify(data)
    })
  },
  goAddInvoiceCust(event) {
    let data = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/invoice/invoiceCust/invoiceCust"
    })
  },
  goEditInvoiceCust(event) {
    let data = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/invoice/invoiceCust/invoiceCust?fType=0&data=" + JSON.stringify(data)
    })
  },

  goEdit: function (event) {
    let type = event.currentTarget.dataset.type;
    let data = event.currentTarget.dataset.item;
    let im_cust_req_master_id = data.im_cust_req_master_id;
    wx.navigateTo({
      url: "/pages/invoice/invoiceApply/invoiceApply?im_cust_req_master_id=" + im_cust_req_master_id + "&type=" + type + "&item=" + JSON.stringify(data)
    })
  },

  goDetail: function (event) {
    let data = event.currentTarget.dataset.item;
    let im_cust_req_master_id = data.im_cust_req_master_id;
    wx.navigateTo({
      url: "/pages/invoice/invoiceDetail/invoiceDetail?im_cust_req_master_id=" + im_cust_req_master_id
    })
  },
  goScrap: function (event) {
    let data = event.currentTarget.dataset.item;
    let im_cust_req_master_id = data.im_cust_req_master_id;
    wx.navigateTo({
      url: "/pages/invoice/invoiceScrap/invoiceScrap?im_cust_req_master_id=" + im_cust_req_master_id
    })
  },
  /**
   * 查询开票申请
   */
  QueryInvoiceApplyList: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryInvoiceApplyList, {
      cid: customer_info_id,
      curr_month: curr_month,
      customer_name: that.data.CustomerNameSearch,
      invoice_type: '',
      apply_date: '',
      status: '',
      pageSize: 100,
      pageIndex: 1,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        that.setData({
          InvoiceApplyList: res.data.list,
        });
      } else {
        that.setData({
          InvoiceApplyList: [],
          msg: '暂无开票数据'
        });
      }
    })
  },
  /**
   * 删除开票申请
   */
  deleteApply: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var deleteData = {
            im_cust_req_master_id: item.im_cust_req_master_id
          };
          console.log(deleteData)
          util.request(api.BillApi.DeleteApply, deleteData, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryInvoiceApplyList();
              Toast.success("删除成功");
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },

  /**
   * 发票提交
   */
  InvoiceSubmit: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_name = app.globalData.user_name;
    let im_cust_req_master_id = item.im_cust_req_master_id;
    let invoice_service_fee = item.invoice_service_fee;
    let express_expense = item.express_expense;
    let customer_name = item.customer_name;
    let total_tax_amt = item.total_tax_amt;
    let total_amount = item.total_amount;
    let balancepayment = Number(invoice_service_fee) + Number(express_expense);
    let sumPAY = balancepayment;
    let service_type = item.operation_category; //服务方式（按次收费   包年预付）
    let is_service_fee = true; //是否显示服务费
    if (item.operation_category == "按次收费") {
      is_service_fee = true;
    } else {
      is_service_fee = false;
    }
    //初始化
    that.setData({
      payDisabled: false,
      radio: '',
      coupon_amount: 0,
      invoice_service_fee: 0, //开票服务费
      express_expense: 0, //快递服务费
      sumPAY: 0, //服务费总计    
      balance_amt: 0, //账户余额
      amt_reserve: 0, //预留金额
      balancepayment: 0, //需付费用
      showbalancepayment: 0, //显示需付费用
      promotion_coupon_user_id: 0,
      promotion_coupon_id: 0,
      isbalance_amt: true, //是否账户扣款(账户+代理账户)
      balancepay_show: false, //是否账户扣款
      service_type: service_type,
      agentpay_show: false, //是否显示代理支付账户
      pay_customer_info_id: 0, //代理支付客户ID,
      codepayment: 0, //在线支付金额
      showcodepayment: 0, //显示在线支付金额
      pay_customer_name: '', //代理支付客户
      pay_balance_amt: 0, //代理支付账户余额
      agentpayment: 0, //代理支付金额 
      showagentpayment: 0, //显示代理支付金额
      customer_name: customer_name,
      total_tax_amt: total_tax_amt,
      total_amount: total_amount,
      is_service_fee: is_service_fee,
    });
    var data = {
      im_cust_req_master_id: im_cust_req_master_id,
      cid: customer_info_id,
      user_name: user_name
    };
    //否是按次付费
    util.request(api.BillApi.GetOpeninviceCategory, data, 'POST').then(function (res) {
      if (res.data.code == 0 || (item.operation_category == "包年预付" && item.express_expense == 0)) {
        let item = {
          im_cust_req_master_id: im_cust_req_master_id,
          service_type: service_type,
        }
        that.sureSubmit(item);
      } else {
        let accountinfo = res.data.info[0];
        let balance_amt = that.convertToZero(accountinfo.balance_amt); //账户余额
        let reserve_amt = that.convertToZero(accountinfo.reserve_amt); //预留余额
        that.setData({
          invoice_service_fee: invoice_service_fee,
          express_expense: express_expense,
          balancepayment: balancepayment,
          showbalancepayment: balancepayment,
          sumPAY: sumPAY,
          balance_amt: (balance_amt - reserve_amt).toFixed(2),
          amt_reserve: reserve_amt,
          im_cust_req_master_id: im_cust_req_master_id,
        });
        let pre_product_id = that.data.pre_product_id;
        util.request(api.BillApi.QueryPromotionCouponUseCommonUrl, //查询优惠券
          {
            openid: app.globalData.openid,
            user_id: app.globalData.user_id,
            pre_product_id: pre_product_id,
            customer_info_id: customer_info_id,
            pay_amount: that.data.invoice_service_fee,
          }, 'POST').then(function (res) {
          //有优惠券
          if (res.data.success == true) {
            that.setData({
              couponUseList: res.data.couponUseList,
              couponLength: res.data.couponUseList.length
            });
            //账户余额-预留金额  
            if (balance_amt > balancepayment && (balance_amt - reserve_amt > balance_amt - balancepayment)) {
              that.setData({
                showModal: true,
                isbalance_amt: true,
                balancepay_show: true,
              })
            } else {
              //1.账户余额不足
              //2.代理支付账户支付
              util.request(api.BillApi.QueryCmAgentPay, {
                openid: app.globalData.openid,
                ui: app.globalData.user_id,
                cid: customer_info_id,
              }, 'POST').then(function (res) {
                if (res.data.success == true) {

                  var balance_amt = that.convertToZero(res.data.data[0].balance_amt);
                  var reserve_amt = that.convertToZero(res.data.data[0].reserve_amt);
                  if (balance_amt > (invoice_service_fee + express_expense) && (balance_amt - reserve_amt) > balance_amt - (invoice_service_fee + express_expense)) {
                    that.setData({
                      showModal: true,
                      agentpayList: res.data.data,
                      pay_customer_info_id: res.data.data[0].pay_customer_info_id,
                      pay_customer_name: res.data.data[0].customer_name,
                      pay_balance_amt: (balance_amt - reserve_amt).toFixed(2),
                      agentpay_show: true,
                      isbalance_amt: true,
                      agentpayment: Number(invoice_service_fee) + Number(express_expense),
                      balancepayment: 0,
                      codepayment: 0,
                      sumPAY: Number(invoice_service_fee) + Number(express_expense),
                    })
                  } else {
                    that.setData({
                      showModal: true,
                      agentpayList: [],
                      pay_customer_info_id: 0,
                      agentpay_show: false,
                      isbalance_amt: false,
                      balancepayment: that.data.balance_amt - that.data.amt_reserve,
                      codepayment: (Number(invoice_service_fee) + Number(express_expense) - (that.data.balance_amt - that.data.amt_reserve)).toFixed(2),
                    })
                  }
                } else {
                  that.setData({
                    showModal: true,
                    agentpayList: [],
                    pay_customer_info_id: 0,
                    agentpay_show: false,
                    isbalance_amt: false,
                    balancepayment: that.data.balance_amt - that.data.amt_reserve,
                    codepayment: (Number(invoice_service_fee) + Number(express_expense) - (that.data.balance_amt - that.data.amt_reserve)).toFixed(2),
                  })
                }
                that.setData({
                  showcodepayment: that.data.codepayment,
                  showbalancepayment: that.data.balancepayment,
                  showagentpayment: that.data.agentpayment,
                });
              })
            }
          } else {
            //无优惠券
            that.setData({
              couponUseList: [],
              couponLength: 0,
              promotion_coupon_user_id: 0,
              promotion_coupon_id: 0,
            });
            //余额满足直接扣款余额             
            if (balance_amt > balancepayment && (balance_amt - reserve_amt > balance_amt - balancepayment)) {
              that.setData({
                showModal: true,
                isbalance_amt: true,
                balancepay_show: true,
                balancepayment: Number(invoice_service_fee) + Number(express_expense),
                sumPAY: Number(invoice_service_fee) + Number(express_expense),
              })
            } else {
              //1.无优惠券无账户余额 
              //2.代理账户支付
              util.request(api.BillApi.QueryCmAgentPay, {
                openid: app.globalData.openid,
                ui: app.globalData.user_id,
                cid: customer_info_id,
              }, 'POST').then(function (res) {
                if (res.data.success == true) {
                  var balance_amt = that.convertToZero(res.data.data[0].balance_amt);
                  var reserve_amt = that.convertToZero(res.data.data[0].reserve_amt);
                  if (balance_amt > (invoice_service_fee + express_expense) && (balance_amt - reserve_amt) > balance_amt - (invoice_service_fee + express_expense)) {

                    that.setData({
                      showModal: true,
                      agentpayList: res.data.data,
                      pay_customer_info_id: res.data.data[0].pay_customer_info_id,
                      pay_customer_name: res.data.data[0].customer_name,
                      pay_balance_amt: (balance_amt - reserve_amt).toFixed(2),
                      agentpay_show: true,
                      isbalance_amt: true,
                      agentpayment: Number(invoice_service_fee) + Number(express_expense),
                      balancepayment: 0,
                      codepayment: 0,
                      sumPAY: Number(invoice_service_fee) + Number(express_expense),
                    })

                  } else {
                    that.setData({
                      showModal: true,
                      agentpayList: [],
                      pay_customer_info_id: 0,
                      agentpay_show: false,
                      isbalance_amt: false,
                      balancepayment: that.data.balance_amt - that.data.amt_reserve,
                      codepayment: (Number(invoice_service_fee) + Number(express_expense) - (that.data.balance_amt - that.data.amt_reserve)).toFixed(2),
                    })
                  }
                } else {
                  that.setData({
                    showModal: true,
                    agentpayList: [],
                    pay_customer_info_id: 0,
                    agentpay_show: false,
                    isbalance_amt: false,
                    balancepayment: that.data.balance_amt - that.data.amt_reserve,
                    codepayment: (Number(invoice_service_fee) + Number(express_expense) - (that.data.balance_amt - that.data.amt_reserve)).toFixed(2),
                  })
                }
                that.setData({
                  showcodepayment: that.data.codepayment,
                  showbalancepayment: that.data.balancepayment,
                  showagentpayment: that.data.agentpayment,
                });
              })
            }
          }
        })
      }
    })
  },

  /**
   * 确认提交
   */
  sureSubmit: function (e) {
    var that = this;
    var item = e;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    var user_name = app.globalData.user_name;;
    wx.showModal({
      title: '提示',
      content: '确认提交开票数据吗？',
      success: function (sm) {
        if (sm.confirm) {
          var data = {
            im_cust_req_master_id: item.im_cust_req_master_id,
            cid: customer_info_id,
            user_name: user_name
          };
          util.request(api.BillApi.PostInvoiceSbmitNoPay, data, 'POST').then(function (res) {
            if (res.data.success == true) {
              Toast.success("您的开票需求已经提交，我们会尽快处理，谢谢！");
              self.QueryInvoiceApplyList();
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },
  /**
   * 确认付款
   */
  AffirmPay: function (e) {
    let that = this;
    let isbalance_amt = that.data.isbalance_amt;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;

    let balance_amt = that.data.balance_amt;
    let amt_reserve = that.data.amt_reserve;
    let balancepayment = that.data.balancepayment;
    let promotion_coupon_user_id = that.data.promotion_coupon_user_id;
    let promotion_coupon_id = that.data.promotion_coupon_id;

    let pay_customer_info_id = that.data.pay_customer_info_id;
    let invoice_service_fee = that.data.invoice_service_fee;
    let express_expense = that.data.express_expense;

    if (that.data.agentpay_show == false || that.data.codepayment <= 0) {
      pay_customer_info_id = 0;
    }
    var amt = that.data.balancepayment;
    if (pay_customer_info_id > 0) {
      amt = that.data.agentpayment;
    }

    that.setData({
      payDisabled: true
    })
    //在线支付
    if (!isbalance_amt || that.data.codepayment > 0) {
      wx.showLoading({
        title: "支付中...",
        duration: 2000,
      })
      util.request(api.BillApi.PostInvoiceGetPayID, {
        cid: customer_info_id,
        account_month: curr_month,
        im_cust_req_master_id: that.data.im_cust_req_master_id,
        money: that.data.codepayment,
        balance_amt: that.data.balance_amt,
        user_id: user_id,
        user_name: user_name,
        promotion_coupon_user_id: promotion_coupon_user_id,
        invoice_service_fee: invoice_service_fee,
        express_expense: express_expense,
      }, 'POST').then(function (res) {
        console.log(res);
        if (res.data.success == true) {
          let pay_trans_id = res.data.payid;
          that.goPay(pay_trans_id, '开票费用(' + curr_month + ')', '1600440321');
        }
      })
    }
    //余额支付
    else {
      wx.showLoading({
        title: "确认付款中...",
        duration: 2000,
      })
      util.request(api.BillApi.PostInvoiceSbmit, {
        cid: customer_info_id,
        customer_name: customer_name,
        account_month: curr_month,
        user_id: user_id,
        user_name: user_name,
        im_cust_req_master_id: that.data.im_cust_req_master_id,
        balance_amt: balance_amt,
        amt: amt,
        amt_reserve: amt_reserve,
        promotion_coupon_user_id: promotion_coupon_user_id,
        promotion_coupon_id: promotion_coupon_id,

        pay_customer_info_id: pay_customer_info_id,
        invoice_service_fee: invoice_service_fee,
        express_expense: express_expense
      }, 'POST').then(function (res) {
        console.log(res)
        if (res.data.success == true) {
          Toast(res.data.msg);
          that.setData({
            showModal: false,
          })
          that.QueryInvoiceApplyList();
          that.QueryMyCoupon();
        } else {
          Toast(res.data.msg);
        }
        that.setData({
          payDisabled: false
        })
      })
    }
    wx.hideLoading();
  },

  //支付
  goPay: function (paytransid, name, payappid) {
    let that = this;
    let pay_trans_id = paytransid;
    let product_name = name;
    let need_pay_amount = that.data.codepayment;
    let pay_app_id = payappid;
    let appid = app.globalData.AppID;
    wx.showLoading({
      title: "正在支付",
      mask: true,
    });
    let openid = app.globalData.openid;
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
          Toast('支付成功!');
          that.setData({
            showModal: false,
          })
          that.QueryInvoiceApplyList();
          that.QueryMyCoupon();
        },
        fail(res) {
          Toast('支付失败!');
        },
        complete: function (res) {
          //付款完成
          console.log('complete--' + res);
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {}
          if (res.errMsg == "requestPayment:ok") {}
        }
      })
    })

  },

  onChange(event) {
    this.setData({
      radio: event.detail
    });
  },

  /*不使用优惠券*/
  noCoupon: function () {
    let that = this;
    if (that.data.showcodepayment == 0) {
      that.setData({
        showCoupon: false,
        coupon_amount: 0,
        radio: '',
        promotion_coupon_user_id: 0,
        promotion_coupon_id: 0,
        balancepayment: that.data.showbalancepayment,
        agentpayment: that.data.agentpayment,
      });
    } else {
      that.setData({
        showCoupon: false,
        coupon_amount: 0,
        radio: '',
        promotion_coupon_user_id: 0,
        promotion_coupon_id: 0,
        balancepayment: that.data.showbalancepayment,
        codepayment: that.data.showcodepayment,
        isbalance_amt: false,
      })
    }

  },
  /*使用优惠券*/
  userCoupon: function (e) {
    let that = this;
    let radio = that.data.radio;
    let result = that.data.result;
    let invoice_service_fee = that.data.invoice_service_fee
    if (radio != '') {
      let couponUseList = that.data.couponUseList[radio]
      let coupon_category = that.data.couponUseList[radio].coupon_category
      let coupon_amount = 0;
      if (coupon_category == "减免") {
        coupon_amount = that.data.invoice_service_fee
      } else {
        coupon_amount = that.data.couponUseList[radio].coupon_amount;
      }
      //1.在线支付金额为0,则为账户支付
      if (that.data.showcodepayment == 0) {
        //全额抵扣
        if (coupon_category == "减免") {
          //账户余额大于快递费用,否则代理支付账户
          if (that.data.balance_amt >= that.data.express_expense) {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: that.data.express_expense,
              agentpayment: 0,
            })
          } else {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: 0,
              agentpayment: that.data.express_expense,
            })
          }
        } else {
          if (that.data.showbalancepayment > 0) {
            let balancepayment = (that.data.showbalancepayment - coupon_amount) > that.data.express_expense ? (that.data.showbalancepayment - coupon_amount).toFixed(2) : that.data.express_expense;
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: balancepayment,
              agentpayment: 0,
            })

          } else {
            let agentpayment = (that.data.showagentpayment - coupon_amount) > that.data.express_expense ? (that.data.showagentpayment - coupon_amount).toFixed(2) : that.data.express_expense;
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: 0,
              agentpayment: agentpayment,
            })
          }
        }
      } else {
        //在线支付
        that.setData({
          isbalance_amt: false,
          balancepayment: that.data.showbalancepayment,
        });
        if (coupon_category == "减免") {
          if (that.data.showbalancepayment >= that.data.express_expense) {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: that.data.express_expense,
              codepayment: 0,
              isbalance_amt: true,
            })
          } else {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: that.data.showbalancepayment,
              codepayment: (that.data.express_expense - that.data.showbalancepayment).toFixed(2),
            })
          }
        } else {
          ////如果余额大于快递费
          if (that.data.showbalancepayment >= that.data.express_expense) {
            if (that.data.showcodepayment - coupon_amount >= 0) {
              that.setData({
                showCoupon: false,
                coupon_amount: coupon_amount,
                promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
                promotion_coupon_id: couponUseList.promotion_coupon_id,
                codepayment: (that.data.showcodepayment - coupon_amount).toFixed(2),
              })
            } else {
              that.setData({
                showCoupon: false,
                coupon_amount: coupon_amount,
                promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
                promotion_coupon_id: couponUseList.promotion_coupon_id,
                codepayment: 0,
                balancepayment: that.data.showbalancepayment - (coupon_amount - that.data.showcodepayment),
                isbalance_amt: true,
              })
            }
          } else {
            //如果余额小于抄税金额，扫码金额大于优惠劵金额 则充值优惠后金额，否则充值抄税金额
            let codepayment = (that.data.showcodepayment - coupon_amount) >= that.data.express_expense ? that.data.showcodepayment - coupon_amount : that.data.express_expense;
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              codepayment: codepayment,
            })
          }
        }
      }
    } else {
      this.setData({
        showCoupon: false,
        coupon_amount: 0,
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
  //关闭弹窗
  close: function () {
    this.setData({
      showModal: false
    })
  },
  onClose() {
    this.setData({
      showCoupon: false
    });
  },
  //查询优惠券
  QueryMyCoupon: function (e) {
    let that = this;
    let pre_product_id = that.data.pre_product_id;
    let customer_info_id = app.globalData.curr_customer_info_id
    util.request(api.BillApi.QueryPromotionCouponUseCommonUrl, //查询优惠券
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id,
        pre_product_id: pre_product_id,
        customer_info_id: customer_info_id,
        pay_amount: that.data.invoice_service_fee,
      }, 'POST').then(function (res) {
      console.log(res, 'res.data.couponUseList');
      if (res.data.success == true) {
        that.setData({
          couponUseList: res.data.couponUseList,
          couponLength: res.data.couponUseList.length
        });
      } else {
        that.setData({
          couponUseList: [],
          couponLength: 0,
          msg: res.data.msg,
          promotion_coupon_user_id: 0,
          promotion_coupon_id: 0,
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryInvoiceCust();
    this.QueryInvoiceApplyList();
    this.QueryMyCoupon();
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
   * 转换空字符
   */
  convertToZero: function (num) {
    if (num == null || num == "" || num == undefined) {
      return 0;
    }
    return parseFloat(num);
  },
})