// pages/statements/account/account.js
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
    customer_info_id_list: [],
    curr_customer_name: '',
    curr_customer_info_id: 0,
    companyList: app.globalData.customer_info_id_list,
    index: 0,
    pickerDate: [],
    showModal: false,
    msg: [],
    stepsArray: [{
        name: '传票',
        time: '',
      },
      {
        name: '记账',
        time: '',
      },
      {
        name: '审核',
        time: '',
      },
      {
        name: '报税',
        time: '',
      },
      {
        name: '缴款',
        time: '',
      }
    ],
    currentVal: 0,
    recv_status: [],
    topwrapper: false,
    openid: app.globalData.openid,

    income_total_amt: 0,
    income_total_tax: 0,
    income_bill_qty: 0,
    expense_total_amt: 0,
    expense_total_tax: 0,
    expense_bill_qty: 0,
    salary_total_amt: 0,
    salary_personal_tax: 0,
    salary_personal_housing_fund: 0,
    salary_personal_social_insurance: 0,
    bank_in_amt: 0,
    bank_out_amt: 0,
    bank_bill_qty: 0,
    bank_balance_amt: 0,
    tax_paid_total_amt: 0,
    tax_paid_bill_qty: 0,
    fa_total_amt: 0,
    fa_net_amt: 0,
    fa_curr_month_depreciation_amt: 0,
    tax_payable_total_amt: 0,
    tax_payable_vat_tax_amt: 0,
    tax_payable_other_tax_amt: 0,
    tax_payable_corp_income_tax_amt: 0,
    tax_type: 'N',
    tax_certification_method: "", //进项认认证委托
    tax_invoice_method: "", //开票方式
    personnel_agency: "", ///人事代理
    verify_bill_qty: 0,
    verify_total_amt: 0,
    verify_total_tax: 0,
    verify_out_bill_qty: 0,
    verify_out_amt: 0,
    verify_out_tax: 0,
    salary_person_qty: 0,
    fa_asset_qty: 0,
    amortization_qty: 0,
    amortization_net_amt: 0,
    curr_month_amortization_amt: 0,
    amortization_total_amt: 0,

    balance_amt: 0,
    est_service_amt: 0,
    est_voucher_qty: 0,
    base_service_amt: 0,
    isbalance_amt: true, //是否账户付款
    balancepayment: 0, //账户付款
    codepayment: 0, //在线支付金额
    nian: '',
    yue: '',
    curr_total_profit: 0,
    total_tax: 0,
    act_voucher_qty: 0,
    amt: 0, //余额
    file_qty: 0, //票据数
    btnDisabled: false, //禁用汇总确认
    payDisabled: false, //禁用确认付款

    showTax: false,
    showModal: false,
    showCoupon: false, //显示优惠券
    couponUseList: [], //优惠券列表
    couponLength: 0, //优惠券个数    
    radio: '',
    coupon_amount: 0, //优惠券金额
    promotion_coupon_user_id: 0,
    promotion_coupon_id: 0,
    pre_product_id: "999999",
    pay_amount: 0, //支付金额
    isConfirmStat: false, //汇总确认
    isConfirmPay: false, //缴款确认
    taxName: '', //抄税清卡名称
    taxMoney: 0, //抄税清卡金额
    bank_bill_fee: 0, //银行取单费
    hr_fee: 0, //人事代理费
    other_cost: 0, //其它综合费用（如抄卡清水，银行取单费等）
    is_hr_agent: 'N', //是否人事代理
    pay_customer_info_id: 0, //代理支付客户ID,
    pay_customer_name: '', //代理支付客户
    pay_balance_amt: 0, //代理支付账户余额
    pay_reserve_amt: 0, //代理支付预留金额
    agentpayment: 0, //代理支付金额 

    showagentpayment: 0, //显示代理支付金额
    showbalancepayment: 0, //显示账户付款
    showcodepayment: 0, //显示在线支付金额

    currMonthlyTax: {}, //当期应纳税
    return_flag: '', //是否退回标志
  },
  onPickerDateEvent: function (e) {
    this.setData({
      pickerDate: e.detail.pickerDate,
    })
    app.globalData.curr_date = e.detail.pickerDate;
    this.QueryStatus();
    this.QueryMonthlyDashBoard();
  },
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
    this.QueryStatus();
    this.QueryMonthlyDashBoard();
  },
  //跳转消息通知
  onGoNoticeWrapper: function (e) {
    wx.navigateTo({
      url: '/pages/me/message/message',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var list = [];
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
        customer_info_id: 0,
        index: 0,
        topwrapper: true
      });
      Toast('暂无数据');
    }
  },
  QueryStatus: function () {
    let that = this;
    console.log(app.globalData.curr_customer_info_id, 'curr_customer_info_id1234')
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");;
    console.log(customer_info_id, 'customer_info_id')
    console.log(account_month, 'account_month')
    util.request(api.BillApi.QueryStatus, {
      cid: customer_info_id,
      account_month: account_month
    }, 'POST').then(function (res) {
      console.log(res, '步骤')
      wx.setStorageSync('curr_status', res.data.recv_status);
      wx.setStorageSync('is_verify_cust_confirm', res.data.is_verify_cust_confirm);
      if (res.data.success == true) {
        that.setData({
          recv_status: res.data.recv_status,
          recipient_end_time: res.data.recipient_end_time,
          sheetmaker_end_time: res.data.sheetmaker_end_time,
          auditor_end_time: res.data.auditor_end_time,
          declarer_end_time: res.data.declarer_end_time,
          declarer_tax_success_time: res.data.declarer_tax_success_time,
          amt: res.data.money,
          file_qty: res.data.qty,
          return_flag: res.data.return_flag,
        });
        if (that.data.recv_status == 'N') {
          that.setData({
            currentVal: 1,
            isConfirmStat: true,
            isConfirmPay: false,
          })
        } else if (that.data.recv_status == 'P') {
          that.setData({
            currentVal: 2,
            isConfirmStat: false,
            isConfirmPay: false,
          })
        } else if (that.data.recv_status == 'S') {
          that.setData({
            currentVal: 3,
            isConfirmStat: false,
            isConfirmPay: false,
          })
        } else if (that.data.recv_status == 'B') {
          that.setData({
            currentVal: 4,
            isConfirmStat: false,
            isConfirmPay: false,
          })
        } else if (that.data.recv_status == 'J') {
          let is_tax_confirm = res.data.is_tax_confirm;
          let isConfirmPay = that.data.isConfirmPay;
          if (is_tax_confirm == "Y") {
            isConfirmPay = false;
          } else {
            isConfirmPay = true;
          }
          that.setData({
            currentVal: 5,
            isConfirmStat: false,
            isConfirmPay: isConfirmPay,
          })
        } else {
          that.setData({
            currentVal: 6
          })
        }
        console.log(that.data.stepsArray, 'self.stepArray')
        for (var i = 0; i < that.data.stepsArray.length; i++) {
          that.data.stepsArray[i].name === '传票' ? that.data.stepsArray[i].time = that.data.recipient_end_time : that.data.stepsArray[i].time = '';
          that.data.stepsArray[i].name === '记账' ? that.data.stepsArray[i].time = that.data.sheetmaker_end_time : that.data.stepsArray[i].time = '';
          that.data.stepsArray[i].name === '审账' ? that.data.stepsArray[i].time = that.data.auditor_end_time : that.data.stepsArray[i].time = '';
          that.data.stepsArray[i].name === '报税' ? that.data.stepsArray[i].time = that.data.declarer_end_time : that.data.stepsArray[i].time = '';
          that.data.stepsArray[i].name === '缴款' ? that.data.stepsArray[i].time = that.data.declarer_tax_success_time : that.data.stepsArray[i].time = '';

        }
        console.log(res.data.recv_status, "步骤");
      } else {
        that.setData({
          recv_status: [],
          recipient_end_time: '',
          sheetmaker_end_time: '',
          auditor_end_time: '',
          declarer_end_time: '',
          declarer_tax_success_time: '',
          currentVal: 0,
          amt: res.data.money,
          file_qty: 0,
          isConfirmStat: false,
          isConfirmPay: false,
          return_flag: '',
        });
      }
    })

  },
  /**
   * 看板数据
   */
  QueryMonthlyDashBoard: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");;

    util.request(api.BillApi.QueryMonthlyDashBoard, {
      cid: customer_info_id,
      curr_month: account_month
    }, 'POST').then(function (res) {
      if (res.data.success == true) {

        var receiveData = res.data;
        var tax_type = receiveData.tax_type;
        if (tax_type.indexOf("一般") != -1) {
          tax_type = "Y";
        } else {
          tax_type = "N";
        }
        //进项认证
        var tax_certification_method = receiveData.tax_certification_method;
        //开票方式
        var tax_invoice_method = receiveData.tax_invoice_method;
        ///人事代理
        var personnel_agency = receiveData.personnel_agency;

        if (personnel_agency == "五险一金") {
          personnel_agency = "(委托)"; //"人事代理无需上传";
        } else {
          personnel_agency = "";
        }
        if (tax_invoice_method.indexOf("委托") != -1) {
          tax_invoice_method = "(委托)"; //"委托开票无需上传";
        } else {
          tax_invoice_method = "";
        }
        if (tax_certification_method.indexOf("进项认证") != -1) {
          tax_certification_method = "(委托)"; //"委托认证无需上传";
          wx.setStorageSync('is_entrust', "Y");
        } else {
          tax_certification_method = "";
          wx.setStorageSync('is_entrust', "N");
        }
        that.setData({
          income_total_amt: parseFloat(receiveData.income_total_amt).toFixed(2),
          income_total_tax: parseFloat(receiveData.income_total_tax).toFixed(2),
          income_bill_qty: receiveData.income_bill_qty,
          expense_total_amt: parseFloat(receiveData.expense_total_amt).toFixed(2),
          expense_total_tax: parseFloat(receiveData.expense_total_tax).toFixed(2),
          expense_bill_qty: receiveData.expense_bill_qty,
          salary_total_amt: parseFloat(receiveData.salary_total_amt).toFixed(2),
          salary_personal_tax: parseFloat(receiveData.salary_personal_tax).toFixed(2),
          salary_personal_housing_fund: parseFloat(receiveData.salary_personal_housing_fund).toFixed(2),
          salary_personal_social_insurance: parseFloat(receiveData.salary_personal_social_insurance).toFixed(2),
          bank_in_amt: parseFloat(receiveData.bank_in_amt).toFixed(2),
          bank_out_amt: parseFloat(receiveData.bank_out_amt).toFixed(2),
          bank_bill_qty: receiveData.bank_bill_qty,
          bank_balance_amt: parseFloat(receiveData.bank_balance_amt).toFixed(2),
          tax_paid_total_amt: parseFloat(receiveData.tax_paid_total_amt).toFixed(2),
          tax_paid_bill_qty: receiveData.tax_paid_bill_qty,
          fa_total_amt: parseFloat(receiveData.fa_total_amt).toFixed(2),
          fa_net_amt: parseFloat(receiveData.fa_net_amt).toFixed(2),
          fa_curr_month_depreciation_amt: parseFloat(receiveData.fa_curr_month_depreciation_amt).toFixed(2),
          tax_payable_total_amt: parseFloat(receiveData.tax_payable_total_amt).toFixed(2),
          tax_payable_vat_tax_amt: parseFloat(receiveData.tax_payable_vat_tax_amt).toFixed(2),
          tax_payable_other_tax_amt: parseFloat(receiveData.tax_payable_other_tax_amt).toFixed(2),
          tax_payable_corp_income_tax_amt: parseFloat(receiveData.tax_payable_corp_income_tax_amt).toFixed(2),
          verify_bill_qty: receiveData.verify_bill_qty,
          verify_total_amt: parseFloat(receiveData.verify_total_amt).toFixed(2),
          verify_total_tax: parseFloat(receiveData.verify_total_tax).toFixed(2),
          verify_out_bill_qty: receiveData.verify_out_bill_qty,
          verify_out_amt: parseFloat(receiveData.verify_out_amt).toFixed(2),
          verify_out_tax: parseFloat(receiveData.verify_out_tax).toFixed(2),
          salary_person_qty: receiveData.salary_person_qty,
          fa_asset_qty: receiveData.fa_asset_qty,
          amortization_net_amt: parseFloat(receiveData.amortization_net_amt).toFixed(2),
          curr_month_amortization_amt: parseFloat(receiveData.curr_month_amortization_amt).toFixed(2),
          amortization_total_amt: parseFloat(receiveData.amortization_total_amt).toFixed(2),
          amortization_qty: receiveData.amortization_qty,
          tax_type: tax_type,
          personnel_agency: personnel_agency,
          tax_invoice_method: tax_invoice_method,
          tax_certification_method: tax_certification_method,
        });
      } else {
        that.setData({
          est_voucher_qty: 0,
          est_service_amt: 0,
          income_total_amt: 0,
          income_total_tax: 0,
          income_bill_qty: 0,
          expense_total_amt: 0,
          expense_total_tax: 0,
          expense_bill_qty: 0,
          salary_total_amt: 0,
          salary_personal_tax: 0,
          salary_personal_housing_fund: 0,
          salary_personal_social_insurance: 0,
          bank_in_amt: 0,
          bank_out_amt: 0,
          bank_bill_qty: 0,
          bank_balance_amt: 0,
          tax_paid_total_amt: 0,
          tax_paid_bill_qty: 0,
          fa_total_amt: 0,
          fa_net_amt: 0,
          fa_curr_month_depreciation_amt: 0,
          tax_payable_total_amt: 0,
          tax_payable_vat_tax_amt: 0,
          tax_payable_other_tax_amt: 0,
          tax_payable_corp_income_tax_amt: 0,
          verify_bill_qty: 0,
          verify_total_amt: 0,
          verify_total_tax: 0,
          verify_out_bill_qty: 0,
          verify_out_amt: 0,
          verify_out_tax: 0,
          salary_person_qty: 0,
          fa_asset_qty: 0,
          amortization_net_amt: 0,
          curr_month_amortization_amt: 0,
          amortization_total_amt: 0,
          amortization_qty: 0,
          tax_type: "N",
          personnel_agency: '',
          tax_invoice_method: '',
          tax_certification_method: '',
        });
      }
    })
  },
  /**
   * 刷新看板数据
   */
  QueryRefhz: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");;
    util.request(api.BillApi.PsotRefhz, {
      cid: customer_info_id,
      curr_month: account_month
    }, 'POST').then(function (res) {
      console.log(res)
      that.QueryMonthlyDashBoard();
    })
  },
  /**
   * 汇总确认
   */
  Affirm: function (e) {
    console.log(e, 'e')
    var that = this;

    let type = e.currentTarget.dataset.type;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    if (type == 'P') {
      Toast("已确认过")
      return;
    }
    if (type != 'N') {
      Toast("不在上传票据阶段")
      return;
    }
    that.setData({
      btnDisabled: true,
      payDisabled: false,
    })
    wx.showLoading({
      title: "费用预估中...",
      duration: 5000,
      mask: true,
    })
    let taxName = "抄税清卡费";
    if (that.data.tax_type == "N") {
      taxName = "抄税清卡费";
    } else {
      taxName = "抄税清卡认证费";
    }
    util.request(api.BillApi.PostAffirm, {
      cid: customer_info_id,
      curr_month: curr_month,
      ui: user_id
    }, 'POST').then(function (res) {
      if (res.data.code == "0") {
        console.log(res.data.msg);
        var msg = res.data.msg.split('|')
        var coupons = res.data.coupons;
        msg[0] = parseFloat(msg[0]); //账号余额
        msg[1] = parseFloat(msg[1]); //预留金额
        msg[2] = parseFloat(msg[2]); //服务费用
        msg[3] = parseFloat(msg[3]); //凭证数量
        msg[4] = parseFloat(msg[4]); //基础服务费
        msg[5] = parseFloat(msg[5]); //预估利润
        msg[6] = parseFloat(msg[6]); //税金
        msg[7] = parseFloat(msg[7]); //调整凭证数
        msg[8] = parseFloat(msg[8]); //代付客户ID
        msg[9] = parseFloat(msg[9]); //代付客户余额
        msg[10] = parseFloat(msg[10]); //代付客户预留金额
        msg[11] = parseFloat(msg[11]); //抄税清卡金额
        msg[13] = parseFloat(msg[13]); //银行取单费
        msg[14] = parseFloat(msg[14]); //人事代理费

        if (msg[14] < 0) {
          if (msg[14] == -1) {
            Toast("您本月委托的人事代理服务还未完成,待人事代理完成后再进行汇总确认,谢谢!")
            return;
          }
          msg[14] = 0;
        }
        let other_cost = msg[11] + msg[13] + msg[14];
        that.setData({
          balance_amt: msg[0] - msg[1],
          est_service_amt: msg[2],
          est_voucher_qty: msg[3],
          base_service_amt: msg[4],
          curr_total_profit: msg[5],
          total_tax: msg[6],
          act_voucher_qty: msg[7],
          taxMoney: msg[11], //抄税清卡金额
          pay_customer_name: msg[12], //代理支付客户名称
          pay_customer_info_id: msg[8], //代理支付客户ID,
          pay_balance_amt: msg[9], //代理支付账户余额
          pay_reserve_amt: msg[10], //代理支付预留金额
          bank_bill_fee: msg[13], //银行取单费
          hr_fee: msg[14], //人事代理费
          is_hr_agent: msg[15], //是否人事代理
          other_cost: other_cost,

          taxName: taxName,
          agentpayment: 0, //代理支付金额
          showagentpayment: 0, //显示代理支付金额
          showbalancepayment: 0, //显示账户付款
          showcodepayment: 0, //显示在线支付金额
        })

        if (msg[0] - msg[1] < msg[2] + other_cost) {
          let iscode = true;
          if (that.data.pay_customer_info_id != 0) {
            let payment = (msg[2] + other_cost).toFixed(2);
            if (msg[9] - msg[10] > payment) {
              iscode = false;
              that.setData({
                isbalance_amt: true,
                balancepayment: 0,
                agentpayment: payment,
                showagentpayment: payment,
              })
            } else {
              iscode = true;
            }
          }
          if (iscode) {

            that.setData({
              isbalance_amt: false,
              balancepayment: (msg[0] - msg[1]).toFixed(2),
              codepayment: ((msg[2] + other_cost) - msg[0] - msg[1]).toFixed(2),
            })

            that.PostUpdateCoupons(0);
          }
        } else {
          that.setData({
            isbalance_amt: true,
            balancepayment: (msg[2] + other_cost).toFixed(),
          })
        }
        let account_month = app.globalData.curr_date
        let nian = account_month.substring(0, 4);
        let yue = account_month.substring(5);
        that.QueryMyCoupon();
        that.setData({
          showModal: true, //显示弹窗
          nian: nian,
          yue: yue,
        })

      } else if (res.data.code == "1") {
        Toast(res.data.msg)
      } else if (res.data.code == "3") {
        Toast(res.data.msg)
      } else if (res.data.code == "4") {
        Dialog.confirm({
          confirmButtonText: '去关注',
          message: '请先关注微信公众号,方便给您推送做账消息通知'
        }).then(() => {
          wx.redirectTo({
            url: "/pages/home/officialAccount/officialAccount"
          })
        }).catch(() => {});
      }
      that.setData({
        btnDisabled: false,
        showagentpayment: that.data.agentpayment, //显示代理支付金额
        showbalancepayment: that.data.balancepayment, //显示账户付款
        showcodepayment: that.data.codepayment, //显示在线支付金额
      })
      console.log(that.data.showagentpayment)
      console.log(that.data.showbalancepayment)
      console.log(that.data.showcodepayment)
      wx.hideLoading();
    })
  },
  //确认(退回)
  AffirmAgain: function (e) {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let est_service_amt = that.data.est_service_amt;
    if (est_service_amt > 0) {
      Dialog.confirm({
        message: '确认提交汇总确认吗?'
      }).then(() => {
        that.setData({
          payDisabled: true
        })
        wx.showLoading({
          title: "确认中...",
        })
        util.request(api.BillApi.PostAffirmAgain, {
          cid: customer_info_id,
          curr_month: curr_month,
          ui: user_id,
          un: user_name,
        }, 'POST').then(function (res) {
          if (res.data.success) {
            Toast(res.data.msg);
            that.setData({
              showModal: false,
            })
            that.QueryStatus();
            that.QueryMonthlyDashBoard();
          } else {
            Toast(res.data.msg);
          }
          that.setData({
            payDisabled: false
          })
        })
        wx.hideLoading();
      }).catch(() => {});
    } else {
      Toast("服务费用估算异常,请联系服务人员核对后确认");
    }
  },
  //确认付款
  AffirmPay: function (e) {
    let that = this;
    let isbalance_amt = that.data.isbalance_amt;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let promotion_coupon_user_id = that.data.promotion_coupon_user_id;
    let est_service_amt = that.data.est_service_amt;
    if (est_service_amt > 0) {
      that.setData({
        payDisabled: true
      })
      //在线支付
      if (!isbalance_amt) {
        wx.showLoading({
          title: "支付中...",
          duration: 5000,
        })
        util.request(api.BillApi.PostPayTrans, {
          cid: customer_info_id,
          curr_month: curr_month,
          money: that.data.codepayment,
          amt: that.data.balance_amt,
          ui: user_id,
        }, 'POST').then(function (res) {
          console.log(res);
          if (res.data.success == true) {
            let pay_trans_id = res.data.id;
            that.goPay(pay_trans_id, '记账费用(' + curr_month + ')', '1600440321');
          }
        })
      }
      //余额支付
      else {
        wx.showLoading({
          title: "确认付款中...",
          duration: 5000,
        })
        util.request(api.BillApi.PostAffirmPay, {
          cid: customer_info_id,
          curr_month: curr_month,
          ui: user_id,
          coupon: promotion_coupon_user_id,
        }, 'POST').then(function (res) {
          if (res.data.code == '0') {
            Toast("完成");
            that.setData({
              showModal: false,
            })
            that.QueryStatus();
            that.QueryMonthlyDashBoard();
          }
          if (res.data.code == '1') {
            Toast(res.data.msg);
          }
          that.setData({
            payDisabled: false
          })
        })
      }
      wx.hideLoading();
    } else {
      Toast("服务费用估算异常,请联系服务人员核对后确认支付");
    }
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
          that.QueryStatus();
          that.QueryMonthlyDashBoard();
        },
        fail(res) {
          Toast('支付失败!');
        },
        complete: function (res) {
          //付款完成
          console.log('complete--' + res);
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {}
          if (res.errMsg == "requestPayment:ok") {}
          that.setData({
            payDisabled: false,
          })
        }
      })
    })

  },
  //关闭弹窗
  close: function () {
    this.setData({
      showModal: false
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
    if (radio != '') {
      let couponUseList = that.data.couponUseList[radio]
      let coupon_category = that.data.couponUseList[radio].coupon_category
      let coupon_amount = 0;
      if (coupon_category == "减免") {
        coupon_amount = that.data.est_service_amt
      } else {
        coupon_amount = that.data.couponUseList[radio].coupon_amount;
      }
      //1.在线支付金额为0,则为账户支付
      if (that.data.showcodepayment == 0) {
        //全额抵扣
        if (coupon_category == "减免") {
          //账户余额大于抄税金额,否则代理支付账户
          if (that.data.balance_amt >= that.data.other_cost) {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: that.data.other_cost,
              agentpayment: 0,
            })
          } else {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: 0,
              agentpayment: that.data.other_cost,
            })
          }
        } else {
          if (that.data.showbalancepayment > 0) {
            let balancepayment = (that.data.showbalancepayment - coupon_amount) > that.data.other_cost ? (that.data.showbalancepayment - coupon_amount).toFixed(2) : that.data.other_cost;
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: balancepayment,
              agentpayment: 0,
            })

          } else {
            let agentpayment = (that.data.showagentpayment - coupon_amount) > that.data.other_cost ? (that.data.showagentpayment - coupon_amount).toFixed(2) : that.data.other_cost;
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
          if (that.data.showbalancepayment >= that.data.other_cost) {
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              balancepayment: that.data.other_cost,
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
              codepayment: (that.data.other_cost - that.data.showbalancepayment).toFixed(2),
            })
          }
        } else {
          ////如果余额大于快递费
          if (that.data.showbalancepayment >= that.data.other_cost) {
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
            let codepayment = (that.data.showcodepayment - coupon_amount) >= that.data.other_cost ? that.data.showcodepayment - coupon_amount : that.data.other_cost;
            that.setData({
              showCoupon: false,
              coupon_amount: coupon_amount,
              promotion_coupon_user_id: couponUseList.promotion_coupon_user_id,
              promotion_coupon_id: couponUseList.promotion_coupon_id,
              codepayment: codepayment,
            })
          }
        }
        //在线支付时处理未支付优惠券回退
        that.PostUpdateCoupons(that.data.promotion_coupon_user_id);
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
  //关闭优惠券弹窗
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
        pay_amount: that.data.est_service_amt, //服务费总额
      }, 'POST').then(function (res) {
      console.log(res, 'res.data.couponUseList');
      if (res.data.success == true) {
        that.setData({
          couponUseList: res.data.couponUseList,
          couponLength: res.data.couponUseList.length,
          radio: '',
          coupon_amount: 0,
          promotion_coupon_user_id: 0,
          promotion_coupon_id: 0,
        });
      } else {
        that.setData({
          couponUseList: [],
          couponLength: 0,
          msg: res.data.msg,
          radio: '',
          coupon_amount: 0,
          promotion_coupon_user_id: 0,
          promotion_coupon_id: 0,
        });
      }
    })
  },

  //处理未使用成功优惠券
  PostUpdateCoupons: function (coupon) {
    let that = this;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let customer_info_id = app.globalData.curr_customer_info_id
    util.request(api.rootUrl + "/SearchAccount/PostUpdateCoupons", {
      openid: app.globalData.openid,
      ui: app.globalData.user_id,
      curr_month: curr_month,
      cid: customer_info_id,
      coupon: coupon,
    }, 'POST').then(function (res) {})
  },


  //关闭弹窗
  closeTax: function () {
    this.setData({
      showTax: false
    })
  },
  //缴款确认
  AffirmTaxPayDiv: function (e) {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    wx.showLoading({
      title: "加载中...",
      mask: true,
    })
    util.request(api.BillApi.QueryTaxPayable, {
      cid: customer_info_id,
      account_month: curr_month,
      ui: user_id
    }, 'POST').then(function (res) {
      if (res.data.success) {
        let currMonthlyTax = {
          total_tax: res.data.total_tax,
          curr_payment_vat: res.data.curr_payment_vat,
          local_education_supplementary_tax: res.data.local_education_supplementary_tax,
          education_supplementary_tax: res.data.education_supplementary_tax,
          city_construction_tax: res.data.city_construction_tax,
          curr_income_tax: res.data.curr_income_tax,
          dtIndividualtax: res.data.dtIndividualtax,
        };
        that.setData({
          showTax: true, //显示弹窗
          currMonthlyTax: currMonthlyTax,
        })
      } else {
        let currMonthlyTax = {
          total_tax: 0,
          curr_payment_vat: 0,
          local_education_supplementary_tax: 0,
          education_supplementary_tax: 0,
          city_construction_tax: 0,
          curr_income_tax: 0,
          dtIndividualtax: [],
        };
        that.setData({
          showTax: true, //显示弹窗
          currMonthlyTax: currMonthlyTax,
        })
      }
      wx.hideLoading();
    })
  },
  //缴款确认
  AffirmTaxPay: function (e) {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let promotion_coupon_user_id = that.data.promotion_coupon_user_id;
    wx.showModal({
      title: '提示',
      content: '确定已经缴款吗？',
      success: function (sm) {
        if (sm.confirm) {
          that.setData({
            payDisabled: true
          })
          wx.showLoading({
            title: "缴款确认中...",
            mask: true,
          })
          util.request(api.BillApi.PostAffirmTaxPay, {
            cid: customer_info_id,
            curr_month: curr_month,
            ui: user_id,
            coupon: promotion_coupon_user_id,
          }, 'POST').then(function (res) {
            if (res.data.msg == 'Y') {
              Toast("确认成功");
              that.QueryStatus();
              that.QueryMonthlyDashBoard();
            } else {
              Toast(res.data.msg);
            }
            that.setData({
              payDisabled: false,
              showTax: false,
            })
          })
          wx.hideLoading();
        } else if (sm.cancel) {}
      }
    })
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
    let that = this;
    var list = [];
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
        customer_info_id: 0,
        index: 0,
        topwrapper: true
      });
      Toast('暂无数据');
    }
    that.QueryStatus()
    that.QueryMonthlyDashBoard();
    that.selectComponent(".noticewrapper").QueryNewMessage();
    that.selectComponent(".top-wrapper").bindCompanyChange();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    this.selectComponent(".noticewrapper").QueryNewMessage();
    this.selectComponent(".top-wrapper").bindCompanyChange();
    this.QueryRefhz();
    this.QueryStatus();
    wx.stopPullDownRefresh();

    setTimeout(function () {
      wx.hideLoading()
    }, 1000)
  },
})