// pages/invoice/invoice/invoice.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyList: app.globalData.customer_info_id_list,
    array: app.globalData.customer_info_id_list,
    index: 0,
    customer_info_id_list: [],
    curr_customer_name: '',
    curr_customer_info_id: 0,
    topwrapper: false,
    pickerDate: app.globalData.curr_date,
    customer_info_id: [],
    invoiceShow: true,
    sheetShow: false,
    sumReceivableData: [],
    amt_end_Receivable: [],
    year_accumulated_income: '0.00',
    year_accumulated_is: '0.00',
    sumPayData: [],
    amt_end_pay: [],
    sumAdvanceAccountPayableData: [],
    advanceAccountPayable: [],
    sumAdvanceAccountReceivableData: [],
    advanceAccountReceivable: [],
    bank_and_cash: '0.00',
    paid_in_capital: '0.00',
    accounting_software: [],
    totalStock: '0.00',
    msg: [],

  },
  onPickerDateEvent: function (e) {
    this.setData({
      pickerDate: e.detail.pickerDate,
    })
    app.globalData.curr_date = e.detail.pickerDate;
    //开票查询
    this.QueryImInvoiceStatData();
    //发票库存
    this.QueryImInvoiceStock();
  },
  //**选择公司 */
  onPickerCompanyEvent: function (e) {
    this.setData({
      customer_info_id_list: e.detail.customer_info_id_list,
      curr_customer_info_id: e.detail.curr_customer_info_id,
      curr_customer_name: e.detail.curr_customer_name,
      index: e.detail.index,
    })
    app.globalData.customer_info_id_list = this.data.customer_info_id_list;
    app.globalData.curr_customer_info_id = this.data.curr_customer_info_id;
    app.globalData.curr_customer_name = this.data.curr_customer_name;
    app.globalData.index = e.detail.index;
    //开票查询
    this.QueryImInvoiceStatData();
    //发票库存
    this.QueryImInvoiceStock();
  },
  QueryImInvoiceStatData: function (e) {
    //开票信息
    let that = this;

    util.request(api.QueryImInvoiceStatDataUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join(""),
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          iminvoicestatdata: res.data.iminvoicestatdata
        });
      } else {
        that.setData({
          iminvoicestatdata: []
        });
      }

    })
  },
  QueryImInvoiceStock: function (e) {
    //获取发票库存信息
    let that = this;
    util.request(api.QueryImInvoiceStockUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id
    }, 'POST').then(function (res) {
      console.log(res, '发票库存');
      if (res.data.success == true) {
        that.setData({
          totalStock: res.data.totalStock
        });
      } else {
        that.setData({
          totalStock: 0
        });
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let list = [];
    if (app.globalData.customer_info_id_list != '') {
      this.setData({
        pickerDate: app.globalData.curr_date,
        customer_info_id_list: app.globalData.customer_info_id_list,
        customer_info_id: app.globalData.curr_customer_info_id,
        index: app.globalData.index,
        topwrapper: true,
      });

    } else {
      this.setData({
        pickerDate: app.globalData.curr_date,
        customer_info_id_list: [],
        customer_info_id: [],
        index: 0,
        topwrapper: true
      });
      Toast('暂无数据');
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //时间与公司名列表
    var list = [];
    if (app.globalData.customer_info_id_list != '') {
      this.setData({
        array: list,
        pickerDate: app.globalData.curr_date,
        index: app.globalData.index,
        customer_info_id_list: app.globalData.customer_info_id_list,
      });
      //开票查询
      this.QueryImInvoiceStatData();
      //发票库存
      this.QueryImInvoiceStock();
    } else {
      this.setData({
        array: [],
        pickerDate: app.globalData.curr_date,
        index: 0,
        customer_info_id_list: [],
      });
      Toast('暂无数据');
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //时间与公司名列表
    var list = [];
    this.selectComponent(".top-wrapper").bindCompanyChange();
    this.selectComponent(".noticewrapper").QueryNewMessage();
    if (app.globalData.customer_info_id_list != '') {
      this.setData({
        array: list,
        pickerDate: app.globalData.curr_date,
        index: app.globalData.index,
        customer_info_id_list: app.globalData.customer_info_id_list,
        curr_customer_info_id: app.globalData.curr_customer_info_id
      });
      //开票查询
      this.QueryImInvoiceStatData();
      //发票库存
      this.QueryImInvoiceStock();
    } else {
      this.setData({
        array: [],
        date: app.globalData.curr_date,
        index: 0,
        customer_info_id_list: [],
        curr_customer_info_id: 0
      });
      Toast('暂无数据');
    }
  },
  //跳转消息通知
  onGoNoticeWrapper: function (e) {
    wx.navigateTo({
      url: '/pages/me/message/message',
    })
  },
  //开票申请
  goInvoice: function () {
    let that = this;
    util.request(api.BillApi.GetIsInvoiceService, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join(""),
      ui: app.globalData.user_id,
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        wx.navigateTo({
          url: '/pages/invoice/invoiceInfo/invoiceInfo',
        })
      } else {
        if (res.data.code == "2") {
          Dialog.confirm({
            confirmButtonText: '去关注',
            message: '请先关注微信公众号，方便申请开票后给您推送消息通知'
          }).then(() => {
            wx.redirectTo({
              url: "/pages/home/officialAccount/officialAccount"
            })
          }).catch(() => {});
        } else {
          Toast("未开通开票服务!");
        }
      }
    })
  },
  // tabInvoice:function(){
  //   this.setData({
  //     invoiceShow:true,
  //     sheetShow:false
  //   })
  //   //开票查询
  //   this.QueryImInvoiceStatData();
  //   //发票库存
  //   this.QueryImInvoiceStock();
  // },
  // tabSheet:function(){
  //   this.setData({
  //     invoiceShow:false,
  //     sheetShow:true
  //   })
  //    //应收查询
  //    this.QueryAccountReceivable();
  //    //应付查询
  //    this.QueryAccountPayable();
  //    //本年累计收入和利润
  //    this.QueryTotalIncomeAndIs();
  //    //预收
  //    this.QueryAdvanceAccountReceivable();
  //    //预付
  //    this.QueryAdvanceAccountPayable();
  // },
  onTableTap: function () {
    //应收账款
    let that = this;
    util.request(api.QuerySendMailUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join("")
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        Toast(res.data.msg);

      } else {
        Toast(res.data.msg);

      }

    })
  },
  QueryAccountReceivable: function (e) {
    //应收账款
    let that = this;
    util.request(api.QueryAccountReceivableUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join("")
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          sumReceivableData: res.data.sumData[0],
          amt_end_Receivable: util.priceSwitch(res.data.sumData[0].amt_end)
        });
      } else {
        that.setData({
          sumReceivableData: {
            amt_end: 0.00
          },
          amt_end_Receivable: '0.00'
        });
      }

    })
  },
  QueryAccountPayable: function (e) {
    //应付账款
    let that = this;
    util.request(api.QueryAccountPayableUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join("")
    }, 'POST').then(function (res) {
      console.log(res.data);
      if (res.data.success == true) {
        that.setData({
          sumPayData: res.data.sumData[0],
          amt_end_pay: util.priceSwitch(res.data.sumData[0].amt_end)
        });
      } else {
        that.setData({
          sumPayData: {
            amt_end: 0.00
          },
          amt_end_pay: '0.00'
        });
      }

    })

  },
  QueryTotalIncomeAndIs: function (e) {
    //本年累计收入和利润，货币资金，实收资本
    let that = this;
    util.request(api.QueryTotalIncomeAndIsUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join("")
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          year_accumulated_income: util.priceSwitch(res.data.year_accumulated_income),
          year_accumulated_is: util.priceSwitch(res.data.year_accumulated_is),
          bank_and_cash: util.priceSwitch(res.data.bank_and_cash),
          paid_in_capital: util.priceSwitch(res.data.paid_in_capital)
        });
      } else {
        that.setData({
          bank_and_cash: '0.00',
          paid_in_capital: '0.00'
        });
      }

    })
  },
  QueryAdvanceAccountReceivable: function (e) {
    console.log(app.globalData.openid, '预收openid');
    console.log(app.globalData.curr_customer_info_id, '预收info_id');
    console.log(app.globalData.curr_date.split('-').join(""), '预收month');
    //获取预收账款
    let that = this;
    util.request(api.QueryAdvanceAccountReceivableUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join("")
    }, 'POST').then(function (res) {
      console.log(res, '预收');
      if (res.data.success == true) {
        that.setData({
          advanceAccountReceivable: util.priceSwitch(res.data.sumData[0].amt_begin)
        });
      } else {
        that.setData({
          advanceAccountReceivable: '0.00'
        });
      }
    })

  },
  QueryAdvanceAccountPayable: function (e) {
    //获取预付账款
    let that = this;
    util.request(api.QueryAdvanceAccountPayableUrl, {
      openid: app.globalData.openid,
      customer_info_id: app.globalData.curr_customer_info_id,
      account_month: app.globalData.curr_date.split('-').join("")
    }, 'POST').then(function (res) {
      console.log(res, '预付');
      if (res.data.success == true) {
        that.setData({
          advanceAccountPayable: util.priceSwitch(res.data.sumData[0].amt_end)
        });
      } else {
        that.setData({
          advanceAccountPayable: '0.00'
        });
      }
    })

  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },


})