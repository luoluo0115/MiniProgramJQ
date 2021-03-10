var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    isShowMore: false, //查看更多
    custCustomerList: {}, //客户抬头信息
    listCustomer: {}, //客户信息
    CustVendorList: {}, //销售方信息
    enterprise_type: '', //企业类型
    invoice_type: '', //发票类型
    invoice_item_type: '', //项目类型
    listCustomer_tax: [], //税率
    customer_invoice_id: '', //税率ID
    approved_tax_type: '', //税率描述
    formData: {},
    //开票明细
    detailForm: [{
      item_name: '',
      item_spec: '',
      item_qty: 1,
      item_unit: '个',
      item_price: '',
      item_amount: 0,
      item_tax_rate: 0,
      item_tax_price: '',
      item_total_amt: '',
    }],
    invoiceTakeMethodList: [],
    invoice_Take_Method: '',
    isTakeExpress: true,
    im_cust_req_master_id: 0, //开票申请需求ID
    to_email: '',

    invoiceScrapList: [],
    im_cust_inv_info_id: 0,
    im_cust_req_scrap_id: 0,
    invoice_type:'',
    showScrap: false,
    showHC:false,    
    scrap_reason: '',
    remark: '',
    scrap_category: '作废',
    scrapCategoryList: [{
      name: '作废'
    }, {
      name: '红冲'
    }],
  },

  switchTab(event) {
    let that = this;
    let title = event.detail.title;
    if (title == '开票详情') {
      that.editRow();
      wx.setNavigationBarTitle({
        title: '开票详情'
      });
    } else if (title == '发票列表') {
      that.QueryImCustReqScrap();
      wx.setNavigationBarTitle({
        title: '发票列表'
      });
    }
  },
  //展开
  moreChange: function () {
    let that = this;
    that.setData({
      isShowMore: !that.data.isShowMore
    })
  },
  itemPriceChange: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.fieldname;

    //含税金额
    if (type == "item_total_amt") {
      var item_tax_rate = that.data.detailForm[index].item_tax_rate;
      if (item_tax_rate <= 0) {
        Toast("请选择税率");
        return;
      }
      var item_qty = that.data.detailForm[index].item_qty == null ? 0 : that.data.detailForm[index].item_qty;
      if (item_qty <= 0) {
        Toast("请填写数量");
        return;
      }
      var customer_invoice_id = that.data.customer_invoice_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_tax_price]: (that.data.detailForm[index].item_total_amt / that.data.detailForm[index].item_qty).toFixed(2),
              [item_amount]: that.data.detailForm[index].item_total_amt / (1 + data.tax_rate),
            });
            that.setData({
              [item_price]: (that.data.detailForm[index].item_amount / that.data.detailForm[index].item_qty).toFixed(2),
              [item_tax_amt]: (that.data.detailForm[index].item_total_amt - that.data.detailForm[index].item_amount).toFixed(2),
            });
          }
        });
      }
    }
    //单价(含税) 
    if (type == "item_tax_price") {
      var item_tax_rate = that.data.detailForm[index].item_tax_rate;
      if (item_tax_rate <= 0) {
        Toast("请选择税率");
        return;
      }
      var item_qty = that.data.detailForm[index].item_qty == null ? 0 : that.data.detailForm[index].item_qty;
      if (item_qty <= 0) {
        Toast("请填写数量");
        return;
      }
      var customer_invoice_id = that.data.customer_invoice_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';

            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_total_amt]: (that.data.detailForm[index].item_tax_price * that.data.detailForm[index].item_qty).toFixed(2),
            });
            that.setData({
              [item_amount]: that.data.detailForm[index].item_total_amt / (1 + data.tax_rate),
              [item_tax_amt]: (that.data.detailForm[index].item_total_amt - that.data.detailForm[index].item_amount).toFixed(2),
            });
            that.setData({
              [item_price]: (that.data.detailForm[index].item_amount / that.data.detailForm[index].item_qty).toFixed(2),
            });
          }
        });
      }
    }

    //单价(不含税)
    if (type == "item_price") {
      var item_tax_rate = that.data.detailForm[index].item_tax_rate;
      if (item_tax_rate <= 0) {
        Toast("请选择税率");
        return;
      }
      var item_qty = that.data.detailForm[index].item_qty == null ? 0 : that.data.detailForm[index].item_qty;
      if (item_qty <= 0) {
        Toast("请填写数量");
        return;
      }
      var customer_invoice_id = that.data.customer_invoice_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_amount]: that.data.detailForm[index].item_price * that.data.detailForm[index].item_qty,
            });
            that.setData({
              [item_tax_amt]: (that.data.detailForm[index].item_amount * data.tax_rate).toFixed(2),
            });
            that.setData({
              [item_total_amt]: (that.data.detailForm[index].item_amount + that.data.detailForm[index].item_tax_amt),
            });
            that.setData({
              [item_tax_price]: (that.data.detailForm[index].item_total_amt / that.data.detailForm[index].item_qty).toFixed(2),
            });
          }
        });
      }
    }
    //选择税率
    if (type == "item_tax_rate") {
      var item_tax_rate = that.data.detailForm[index].item_tax_rate;
      if (item_tax_rate <= 0) {
        Toast("请选择税率");
        return;
      }
      var item_qty = that.data.detailForm[index].item_qty == null ? 0 : that.data.detailForm[index].item_qty;
      if (item_qty <= 0) {
        Toast("请填写数量");
        return;
      }
      var customer_invoice_id = that.data.customer_invoice_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';

            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_amount]: that.data.detailForm[index].item_amount,
              [item_price]: that.data.detailForm[index].item_price,
              [item_tax_amt]: (that.data.detailForm[index].item_amount * data.tax_rate).toFixed(2),
            });
            that.setData({
              [item_total_amt]: (that.data.detailForm[index].item_amount + that.data.detailForm[index].item_tax_amt),
            });
            that.setData({
              [item_tax_price]: (that.data.detailForm[index].item_total_amt / that.data.detailForm[index].item_qty).toFixed(2),
            });
          }
        });
      }
    }
    //数量
    if (type == "item_qty") {
      var item_tax_rate = that.data.detailForm[index].item_tax_rate;
      if (item_tax_rate <= 0) {
        Toast("请选择税率");
        return;
      }
      var item_qty = that.data.detailForm[index].item_qty == null ? 0 : that.data.detailForm[index].item_qty;
      if (item_qty <= 0) {
        Toast("请填写数量");
        return;
      }
      var customer_invoice_id = that.data.customer_invoice_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_total_amt]: 0,
              [item_amount]: 0,
            });
            that.setData({
              [item_total_amt]: (that.data.detailForm[index].item_total_amt).toFixed(2),
            });
            that.setData({
              [item_tax_price]: (that.data.detailForm[index].item_total_amt / that.data.detailForm[index].item_qty).toFixed(2),
              [item_amount]: (that.data.detailForm[index].item_total_amt / (1 + data.tax_rate)).toFixed(2),
            });
            that.setData({
              [item_price]: (that.data.detailForm[index].item_amount / that.data.detailForm[index].item_qty).toFixed(2),
              [item_tax_amt]: (that.data.detailForm[index].item_total_amt - that.data.detailForm[index].item_amount).toFixed(2),
            });
          }
        });
      }
    }


  },
  /**
   * 详情
   */
  editRow: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.split('-').join("");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let im_cust_req_master_id = that.data.im_cust_req_master_id;
    var data = {
      cid: customer_info_id,
      account_month: curr_month,
      im_cust_req_master_id: im_cust_req_master_id,
    }
    util.request(api.BillApi.QueryCustReqMaterInfo,
      data, 'POST').then(function (res) {      
      if (res.data.success == true) {
        let custReqMasterInfo = res.data.custReqMasterInfo[0];
        let custReqDetailInfo = res.data.custReqDetailInfo;
        let isTakeExpress = false;
        if (custReqMasterInfo.invoice_take_method.indexOf("自取") != -1) {
          isTakeExpress = false;
        } else {
          isTakeExpress = true;
        }
        that.setData({
          formData: custReqMasterInfo,
          //明细项目
          detailForm: custReqDetailInfo,
          enterprise_type: custReqMasterInfo.enterprise_type,
          invoice_item_type: custReqMasterInfo.invoice_item_type,
          invoice_type: custReqMasterInfo.invoice_type,
          invoice_take_method: custReqMasterInfo.invoice_take_method,
          isTakeExpress: isTakeExpress,
        });

        let custCustomerList = {
          im_cust_customer_id: custReqMasterInfo.im_cust_customer_id,
          customer_tax_code: custReqMasterInfo.customer_tax_code,
          customer_address: custReqMasterInfo.customer_address,
          customer_phone: custReqMasterInfo.customer_phone,
          customer_bank_name: custReqMasterInfo.customer_bank_name,
          customer_bank_account: custReqMasterInfo.customer_bank_account,
          customer_name: custReqMasterInfo.customer_name,
        };
        let CustVendorList = {
          vendor_name: custReqMasterInfo.vendor_name,
          vendor_tax_code: custReqMasterInfo.vendor_tax_code,
          vendor_address: custReqMasterInfo.vendor_address,
          vendor_phone: custReqMasterInfo.vendor_phone,
          vendor_bank_name: custReqMasterInfo.vendor_bank_name,
          vendor_bank_account: custReqMasterInfo.vendor_bank_account,
        };
        that.setData({
          custCustomerList: custCustomerList,
          CustVendorList: CustVendorList,
        })

        that.data.detailForm.forEach(function (data, index) {
          let item_tax_price = 'detailForm[' + index + '].item_tax_price';
          let item_total_amt = 'detailForm[' + index + '].item_total_amt';
          that.setData({
            [item_tax_price]: (data.item_total_amt / data.item_qty).toFixed(2),
            [item_total_amt]: (data.item_total_amt).toFixed(2),
          })
        });

        for (let i = 0; i < that.data.invoiceTakeMethodList.length; i++) {
          if (that.data.invoiceTakeMethodList[i].code_name == that.data.invoice_take_method) {
            that.data.invoiceTakeMethodList[i].checked = true;
          } else {
            that.data.invoiceTakeMethodList[i].checked = false;
          }
        }
        that.setData({
          invoiceTakeMethodList: that.data.invoiceTakeMethodList,
        })
      }
    })
  },

  QueryImCustReqScrap: function () {
    let that = this;
    util.request(api.BillApi.QueryImCustReqScrap, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      im_cust_req_master_id: that.data.im_cust_req_master_id,
      pageSize: 100,
      pageIndex: 1
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          invoiceScrapList: res.data.invoiceScrapList
        });
      } else {
        that.setData({
          invoiceScrapList: []
        });
      }
    })
  },
  downInvoiceFile: function (e) {
    var that = this;
    let item = e.currentTarget.dataset.item;
    let invoice_file_guid = item.invoice_file_guid;
    wx.showLoading({
      title: '下载中...',
    });
    wx.downloadFile({
      url: api.FileOssUrl + invoice_file_guid,
      success: function (res) {
        const tempFilePath = res.tempFilePath;
        // 保存文件
        wx.saveFile({
          tempFilePath,
          success: function (res) {
            wx.hideLoading();
            const savedFilePath = res.savedFilePath;
            Toast('下载成功')
            // 打开文件
            wx.openDocument({
              filePath: savedFilePath,
              success: function (res) {
                console.log('打开文档成功')
              },
            });
          },
          fail: function (err) {
            wx.hideLoading();
            Toast('保存失败');
          }
        });
      },
      fail: function (err) {
        wx.hideLoading();
        Toast('下载失败');
      },
    });
  },
  //关闭弹窗
  closeScrap: function () {
    this.setData({
      showScrap: false,
      showHC: false,
    })
  },
  scrapApplyDiv: function (e) {
    var that = this;
    let item = e.currentTarget.dataset.item;
    let im_cust_inv_info_id = e.currentTarget.dataset.im_cust_inv_info_id;
    that.setData({
      showScrap: true,
      im_cust_inv_info_id: im_cust_inv_info_id,
      im_cust_req_scrap_id: item.im_cust_req_scrap_id,
      invoice_type:item.invoice_type,
    })
  },  
  scrapApplyHCDiv: function (e) {
    var that = this;
    let item = e.currentTarget.dataset.item;
    let im_cust_inv_info_id = e.currentTarget.dataset.im_cust_inv_info_id;
    that.setData({
      showHC: true,
      im_cust_inv_info_id: im_cust_inv_info_id,
      im_cust_req_scrap_id: item.im_cust_req_scrap_id,
      invoice_type:item.invoice_type,
    })
  },
  handleFieldChange: function (e) {
    let that = this;
    let fieldname = e.currentTarget.dataset.fieldname
    let newValue = e.detail;
    that.setData({
      [fieldname]: newValue.replace(/\s+/g, ''),
    })
  },
  bindScrapCategoryChange: function (e) {
    this.setData({
      scrap_category: this.data.scrapCategoryList[e.detail.value].name,
    })
  },
  postScrapApply: function (e) {
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
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let im_cust_req_master_id = that.data.im_cust_req_master_id;
    let im_cust_inv_info_id = that.data.im_cust_inv_info_id;
    let im_cust_req_scrap_id = that.data.im_cust_req_scrap_id;
    let invoice_type = that.data.invoice_type;
    let scrap_reason = that.data.scrap_reason;
    let scrap_category = that.data.scrap_category;
    let remark = that.data.remark;
    if (scrap_reason == null || scrap_reason == "" || scrap_reason.length <= 0) {
      Toast("请输入作废理由");
      return
    }
    wx.showLoading({
      title: "提交中...",
      mask: true,
    })
    let formData = {
      cid: customer_info_id,
      curr_month: curr_month,
      ui: user_id,
      un: user_name,
      im_cust_req_master_id: im_cust_req_master_id,
      im_cust_inv_info_id: im_cust_inv_info_id,
      im_cust_req_scrap_id: im_cust_req_scrap_id,
      invoice_type:invoice_type,
      scrap_reason: scrap_reason,
      scrap_category: scrap_category,
      remark: remark,
    };
    util.request(api.BillApi.PostImCustReqScrap, formData, 'POST').then(function (res) {
      wx.hideLoading();
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        that.QueryImCustReqScrap();
        that.setData({
          showScrap: false,
          showHC: false,
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })
  },
  /**
   * 作废申请取消
   */
  scrapApplyCancel: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    wx.showModal({
      title: '提示',
      content: '确认取消发票作废申请吗？',
      success: function (sm) {
        if (sm.confirm) {
          var CancelData = {
            im_cust_req_scrap_id: item.im_cust_req_scrap_id,
            cid: customer_info_id,
            ui: user_id,
            un: user_name
          };
          util.request(api.BillApi.PostImCustReqScrapCancel, CancelData, 'POST').then(function (res) {
            if (res.data.success == true) {
              that.QueryImCustReqScrap();
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.Init();
    that.QueryUserInfo();
    if (options.im_cust_req_master_id) {
      that.setData({
        im_cust_req_master_id: options.im_cust_req_master_id,
      });
      that.editRow();
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


  /**
   * 初始化数据
   */
  Init: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var data = {
      cid: customer_info_id,
      account_month: account_month
    }
    //取票方式
    util.request(api.BillApi.GetCustExpressListType,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          invoiceTakeMethodList: res.data.listInvoiceTakeMethod
        });
      } else {
        that.setData({
          invoiceTakeMethodList: []
        });
      }
    })
  },

  QueryUserInfo: function () {
    let that = this;
    util.request(api.QueryUserInfo, {
      openid: app.globalData.openid,
      cid: app.globalData.curr_customer_info_id,
      user_id: app.globalData.user_id
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          to_email: res.data.customerList[0].user_mail,
        });
      } else {
        that.setData({
          to_email: ''
        });
      }
    })
  },
})