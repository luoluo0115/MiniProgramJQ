var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {

    address: '请选择地址',
    showAdress: false,
    taxindex: 0,

    info: {},
    invoiceTypeList: [],
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
    invoice_tax_map_id: '', //项目税种ID
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
    invoiceTakeMethodList: [], //取票方式
    invoice_Take_Method: '快递预付', //取票方式
    isTakeExpress: true,
    express_address: '',
    im_cust_req_master_id: 0, //开票申请需求ID
    to_email: '', //邮箱地址


    //-----<付款页面参数start>
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
    //-----<付款页面参数end>

  },

  //展开
  moreChange: function () {
    let that = this;
    that.setData({
      isShowMore: !that.data.isShowMore
    })
  },

  goAddress: function () {
    this.setData({
      showAdress: true
    })
    console.log(this.data.showAdress, 'showAdress')
  },
  onCloseAddres() {
    this.setData({
      showAdress: false
    });
  },

  goEditInvoiceVendor(event) {
    let data = event.currentTarget.dataset.item;
    let CustVendorList = this.data.CustVendorList;
    wx.navigateTo({
      url: "/pages/invoice/invoiceVendor/invoiceVendor?data=" + JSON.stringify(data)
    })
  },

  goAddInvoiceAddr(event) {
    let data = event.currentTarget.dataset.item;
    let im_cust_customer_id = this.data.custCustomerList.im_cust_customer_id;
    wx.navigateTo({
      url: "/pages/invoice/invoiceAddr/invoiceAddr?im_cust_customer_id=" + im_cust_customer_id
    })
  },
  goEditInvoiceCust(event) {
    let data = event.currentTarget.dataset.item;
    wx.navigateTo({
      url: "/pages/invoice/invoiceCust/invoiceCust?fType=1&data=" + JSON.stringify(data)
    })
  },

  radioTakeMethodTap: function (e) {
    let id = e.currentTarget.dataset.id
    let invoice_Take_Method = "";
    for (let i = 0; i < this.data.invoiceTakeMethodList.length; i++) {
      if (this.data.invoiceTakeMethodList[i].code_name == id) {
        this.data.invoiceTakeMethodList[i].checked = true;
        invoice_Take_Method = this.data.invoiceTakeMethodList[i].code_name;
      } else {
        this.data.invoiceTakeMethodList[i].checked = false;
      }
    }
    this.setData({
      invoice_Take_Method: invoice_Take_Method,
      invoiceTakeMethodList: this.data.invoiceTakeMethodList,
    })
    this.takeChange(e);
  },

  //选择取票方式
  takeChange: function (e) {
    var that = this;
    var invoice_take_method = that.data.invoice_Take_Method;
    if (invoice_take_method.indexOf("自取") != -1) {
      that.setData({
        isTakeExpress: false,
        ['formData.express_address']: null,
        ['formData.express_contact_phone']: null,
        ['formData.express_contact_name']: null,
        ['formData.im_cust_express_id']: null,
        ['formData.province']: null,
        ['formData.city']: null,
        ['formData.district']: null,
      })
    } else {
      that.setData({
        isTakeExpress: true,
      })
    }
  },

  bindInvoiceItemTypeChange: function (e) {
    this.setData({      
      invoice_item_type: this.data.listInvoiceItemType[e.detail.value].invoice_item_type,
    })
    this.GetTaxRate();
  },
  bindInvoiceTypeChange: function (e) {
    this.setData({
      invoice_type: this.data.invoiceTypeList[e.detail.value].invoice_category,
    })
    this.GetTaxRate();
  },
  //下拉框单位
  bindItemUnitChange: function (e) {
    let idx = e.currentTarget.dataset.idx;
    let item_unit = 'detailForm[' + idx + '].item_unit';
    this.setData({
      [item_unit]: this.data.info.listUnit[e.detail.value].code_name,
    })
  },
  //下拉框税率
  bindItemTaxRateChange: function (e) {
    let idx = e.currentTarget.dataset.index;
    let tax_name = 'detailForm[' + idx + '].tax_name';
    let item_tax_rate = 'detailForm[' + idx + '].item_tax_rate';
    let customer_invoice_id = 'detailForm[' + idx + '].customer_invoice_id';
    let approved_tax_type = 'detailForm[' + idx + '].approved_tax_type';
    let invoice_item_type = 'detailForm[' + idx + '].invoice_item_type';
    let invoice_tax_map_id = 'detailForm[' + idx + '].invoice_tax_map_id';
    let invoice_item_code = 'detailForm[' + idx + '].invoice_item_code';
    this.setData({
      [tax_name]: this.data.listCustomer_tax[e.detail.value].tax_name,
      [item_tax_rate]: this.data.listCustomer_tax[e.detail.value].tax_rate,
      [customer_invoice_id]: this.data.listCustomer_tax[e.detail.value].customer_invoice_id,
      [approved_tax_type]: this.data.listCustomer_tax[e.detail.value].approved_tax_type,
      [invoice_item_type]: this.data.listCustomer_tax[e.detail.value].item_taxmap_type,
      [invoice_tax_map_id]: this.data.listCustomer_tax[e.detail.value].invoice_tax_map_id,
      [invoice_item_code]: this.data.listCustomer_tax[e.detail.value].invoice_item_code,
      customer_invoice_id: this.data.listCustomer_tax[e.detail.value].customer_invoice_id,
      approved_tax_type: this.data.listCustomer_tax[e.detail.value].approved_tax_type,
      invoice_tax_map_id: this.data.listCustomer_tax[e.detail.value].invoice_tax_map_id,
    })
    this.itemPriceChange(e);
  },
  handleFieldChange: function (e) {
    let that = this;
    let fieldname = e.currentTarget.dataset.fieldname
    let newValue = e.detail;
    let index = e.currentTarget.dataset.index;
    let field = 'detailForm[' + index + '].' + fieldname;
    that.setData({
      [field]: newValue,
    })
    if (fieldname != "item_name" || fieldname != "item_spec") {
      that.itemPriceChange(e);
    }
  },
  formDataChange: function (e) {
    let that = this;
    let fieldname = e.currentTarget.dataset.fieldname
    let newValue = e.detail;
    let field = 'formData.' + fieldname;
    that.setData({
      [field]: newValue,
    })
  },
  /**
   * 计算金额
   */
  itemPriceChangeV2: function (e) {
    var that = this;
    let index = e.currentTarget.dataset.index;
    let type = e.currentTarget.dataset.fieldname;
    if (type == "item_tax_rate") {
      var item_price = that.data.detailForm[index].item_price;
      if (item_price <= 0) {
        Toast("请填写单价(不含税)");
        return;
      }
      var customer_invoice_id = that.data.customer_invoice_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id) {

            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_amount]: that.data.detailForm[index].item_price * that.data.detailForm[index].item_qty,
              [item_tax_amt]: that.data.detailForm[index].item_price * that.data.detailForm[index].item_tax_rate * that.data.detailForm[index].item_qty,
            });
            that.setData({
              [item_tax_price]: (that.data.detailForm[index].item_amount + that.data.detailForm[index].item_tax_amt).toFixed(2),
              [item_total_amt]: (that.data.detailForm[index].item_amount + that.data.detailForm[index].item_tax_amt).toFixed(2),
            });
            console.log(that.data.detailForm)
          }
        });
      }
    } else {
      var item_tax_rate = that.data.detailForm[index].item_tax_rate;
      if (item_tax_rate <= 0) {
        Toast("请选择税率！");
        return;
      } else {
        var item_qty = that.data.detailForm[index].item_qty == null ? 0 : that.data.detailForm[index].item_qty;
        var item_price = that.data.detailForm[index].item_price == null ? 0 : that.data.detailForm[index].item_price;

        if (item_qty > 0 && (item_price > 0)) {
          let item_amount = 'detailForm[' + index + '].item_amount';
          let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
          let item_tax_price = 'detailForm[' + index + '].item_tax_price';
          let item_total_amt = 'detailForm[' + index + '].item_total_amt';
          let item = that.data.detailForm[index];
          that.setData({
            [item_amount]: item.item_price * item.item_qty,
            [item_tax_amt]: item.item_price * item.item_tax_rate * item.item_qty,
          })
          that.setData({
            [item_tax_price]: (item.item_amount + item.item_tax_amt).toFixed(2),
            [item_total_amt]: (item.item_amount + item.item_tax_amt).toFixed(2),
          })
          console.log(that.data.detailForm)
        } else {
          Toast("请填写数量、单价");
        }
      }
    }
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
      //var customer_invoice_id = that.data.customer_invoice_id;
      //var invoice_tax_map_id = that.data.invoice_tax_map_id;
      var customer_invoice_id = that.data.detailForm[index].customer_invoice_id;
      var invoice_tax_map_id = that.data.detailForm[index].invoice_tax_map_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id && data.invoice_tax_map_id == invoice_tax_map_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_tax_price]: (Number(that.data.detailForm[index].item_total_amt) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
              [item_amount]: (Number(that.data.detailForm[index].item_total_amt) / (1 + Number(data.tax_rate))).toFixed(2),
            });
            that.setData({
              [item_price]: (Number(that.data.detailForm[index].item_amount) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
              [item_tax_amt]: (Number(that.data.detailForm[index].item_total_amt) - Number(that.data.detailForm[index].item_amount)).toFixed(2),
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
      var customer_invoice_id = that.data.detailForm[index].customer_invoice_id;
      var invoice_tax_map_id = that.data.detailForm[index].invoice_tax_map_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id && data.invoice_tax_map_id == invoice_tax_map_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';

            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_total_amt]: (Number(that.data.detailForm[index].item_tax_price) * Number(that.data.detailForm[index].item_qty)).toFixed(2),
            });
            that.setData({
              [item_amount]: (Number(that.data.detailForm[index].item_total_amt) / (1 + Number(data.tax_rate))).toFixed(2),
              [item_tax_amt]: (Number(that.data.detailForm[index].item_total_amt) - Number(that.data.detailForm[index].item_amount)).toFixed(2),
            });
            that.setData({
              [item_price]: (Number(that.data.detailForm[index].item_amount) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
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
      var customer_invoice_id = that.data.detailForm[index].customer_invoice_id;
      var invoice_tax_map_id = that.data.detailForm[index].invoice_tax_map_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id && data.invoice_tax_map_id == invoice_tax_map_id) {
            let item_price = 'detailForm[' + index + '].item_price';
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate';
            let item_amount = 'detailForm[' + index + '].item_amount';
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt';
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_rate]: data.tax_rate,
              [item_amount]: (Number(that.data.detailForm[index].item_price) * Number(that.data.detailForm[index].item_qty)).toFixed(2),
            });
            that.setData({
              [item_tax_amt]: (Number(that.data.detailForm[index].item_amount) * Number(data.tax_rate)).toFixed(2),
            });
            that.setData({
              [item_total_amt]: ((that.convertToZero(that.data.detailForm[index].item_amount) + that.convertToZero(that.data.detailForm[index].item_tax_amt))).toFixed(2),
            });
            that.setData({
              [item_tax_price]: (Number(that.data.detailForm[index].item_total_amt) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
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
      var customer_invoice_id = that.data.detailForm[index].customer_invoice_id;
      var invoice_tax_map_id = that.data.detailForm[index].invoice_tax_map_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id && data.invoice_tax_map_id == invoice_tax_map_id) {
            let item_price = 'detailForm[' + index + '].item_price'; //不含税单价
            let item_tax_rate = 'detailForm[' + index + '].item_tax_rate'; //税率
            let item_amount = 'detailForm[' + index + '].item_amount'; //金额 = 数量*单价
            let item_tax_amt = 'detailForm[' + index + '].item_tax_amt'; //税额 = 单价*税率
            let item_tax_price = 'detailForm[' + index + '].item_tax_price'; //含税单价
            let item_total_amt = 'detailForm[' + index + '].item_total_amt'; //含税金额

            let cacl_item_amount = (Number(that.data.detailForm[index].item_price) * Number(that.data.detailForm[index].item_qty)).toFixed(2);
            that.setData({
              [item_tax_rate]: Number(data.tax_rate),
              [item_amount]: Number(cacl_item_amount),
              [item_price]: Number(that.data.detailForm[index].item_price),
              [item_tax_amt]: (Number(cacl_item_amount) * Number(data.tax_rate)).toFixed(2),
            });
            that.setData({
              [item_total_amt]: (Number(that.data.detailForm[index].item_amount) + Number(that.data.detailForm[index].item_tax_amt)).toFixed(2),
            });
            that.setData({
              [item_tax_price]: (Number(that.data.detailForm[index].item_total_amt) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
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
      var customer_invoice_id = that.data.detailForm[index].customer_invoice_id;
      var invoice_tax_map_id = that.data.detailForm[index].invoice_tax_map_id;
      if (that.data.listCustomer_tax.length > 0 || that.data.listCustomer_tax != null) {
        that.data.listCustomer_tax.forEach(function (data, idx) {
          if (data.customer_invoice_id == customer_invoice_id && data.invoice_tax_map_id == invoice_tax_map_id) {
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
              [item_total_amt]: (Number(that.data.detailForm[index].item_total_amt)).toFixed(2),
            });
            that.setData({
              [item_tax_price]: (Number(that.data.detailForm[index].item_total_amt) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
              [item_amount]: (Number(that.data.detailForm[index].item_total_amt) / (1 + Number(data.tax_rate))).toFixed(2),
            });
            that.setData({
              [item_price]: (Number(that.data.detailForm[index].item_amount) / Number(that.data.detailForm[index].item_qty)).toFixed(2),
              [item_tax_amt]: (Number(that.data.detailForm[index].item_total_amt) - Number(that.data.detailForm[index].item_amount)).toFixed(2),
            });
            /*console.log(that.data.detailForm[index].item_tax_rate, 'item_tax_rate')
            console.log(that.data.detailForm[index].item_total_amt, 'item_total_amt')
            console.log(that.data.detailForm[index].item_tax_price, 'item_tax_price')
            console.log(that.data.detailForm[index].item_amount, 'item_amount')
            console.log(that.data.detailForm[index].item_price, 'item_price')
            console.log(that.data.detailForm[index].item_tax_amt, 'item_tax_amt')*/
          }
        });
      }
    }


  },
  //新增一行
  addItem: function () {
    var that = this;
    for (var i = 0; i < that.data.detailForm.length; i++) {
      var item_name = that.data.detailForm[i].item_name;
      var item_qty = that.data.detailForm[i].item_qty;
      var item_price = that.data.detailForm[i].item_price;
      var item_tax_rate = that.data.detailForm[i].item_tax_rate;
      if (item_name == null || item_name == undefined || item_name.length <= 0) {
        Toast("项目名称不能为空");
        return;
      }
      if (item_qty == null || item_qty == undefined || item_qty.length <= 0) {
        Toast("数量不能为空");
        return;
      }
      if (item_price == null || item_price == undefined || item_price.length <= 0) {
        Toast("单价(不含税)不能为空");
        return;
      }
      if (item_tax_rate == null || item_tax_rate == undefined || item_tax_rate.length <= 0) {
        Toast("税率不能为空");
        return;
      }
    }
    var detailForm = {
      item_name: '',
      item_spec: '',
      item_qty: 1,
      item_unit: '个',
      item_price: '',
      item_amount: 0,
      item_tax_rate: 0,
      item_tax_price: '',
      item_total_amt: '',
    }
    that.data.detailForm.push(detailForm);
    that.setData({
      detailForm: that.data.detailForm,
    })
    console.log(that.data.detailForm);
  },
  //删除一行
  removeItem: function (e) {
    var that = this;
    var key = e.currentTarget.dataset.id;
    that.data.detailForm.splice(key, 1);
    that.setData({
      detailForm: that.data.detailForm,
    })
  },

  /**
   * 保存
   */
  postData: function () {
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
    var that = this;
    if (that.data.formData.reqeust_date == null || that.data.formData.reqeust_date == undefined) {
      var reqeustDate = util.formatDataTime(new Date());
      that.data.formData.reqeust_date = reqeustDate;
    }

    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.split('-').join("");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;

    if (that.data.custCustomerList.im_cust_customer_id == null || that.data.custCustomerList.im_cust_customer_id == undefined || that.data.custCustomerList.im_cust_customer_id.length <= 0) {
      Toast("请选择开票申请单位");
      return;
    }

    //服务项目明细
    var tax_count = 0;
    var name_count = 0;
    var price_cooount = 0;
    var check_name_count = 0;
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
    var qty_count = 0; //数量    
    that.data.detailForm.forEach(function (data, index) {
      if (data.item_tax_rate == null || data.item_tax_rate == "" || data.item_tax_rate.length <= 0) {
        tax_count = tax_count + 1;
      } else {
        if (tax_count > 0) {
          tax_count = tax_count - 1;
        }
      }
      if (data.item_name == null || data.item_name == undefined || data.item_name.length <= 0) {
        name_count = name_count + 1;
      } else {
        if (name_count > 0) {
          name_count = name_count - 1;
        }
      }
      if (data.item_name.indexOf("*") >= 0) {
        check_name_count = check_name_count + 1;
      } else {
        if (check_name_count > 0) {
          check_name_count = check_name_count - 1;
        }
      }
      if (data.item_price <= 0 || data.item_price == null || data.item_price == undefined || data.item_price.length <= 0) {
        price_cooount = price_cooount + 1;
      } else {
        if (price_cooount > 0) {
          price_cooount = price_cooount - 1;
        }
      }

      if (!reg.test(data.item_qty) || !reg.test(data.item_price) || !reg.test(data.item_tax_price) || !reg.test(data.item_total_amt)) {
        qty_count = qty_count + 1;
      } else {
        if (qty_count > 0) {
          qty_count = qty_count - 1;
        }
      }

    });
    if (tax_count > 0) {
      Toast("请选择税率");
      return;
    }
    if (name_count > 0) {
      Toast("请填写项目名称");
      return;
    }
    if (check_name_count > 0) {
      Toast("项目名称中不能包含(*)星号");
      return;
    }
    if (price_cooount > 0) {
      Toast("请填写单价");
      return;
    }
    if (qty_count > 0) {
      Toast("请输入数字类型");
      return;
    }
    if (that.data.invoice_type != '增值税电子普通发票' && that.data.invoice_type != '增值税电子专用发票') {
      if (that.data.invoice_Take_Method == null || that.data.invoice_Take_Method == undefined || that.data.invoice_Take_Method.length <= 0) {
        Toast("请选择取票方式！");
        return;
      } else {
        if (that.data.invoice_Take_Method.indexOf("自取") != -1) {} else {
          if (that.data.formData.im_cust_express_id == null || that.data.formData.im_cust_express_id == undefined || that.data.formData.im_cust_express_id.length <= 0) {
            Toast("请选择快递地址！");
            return;
          }
        }
      }
    } else {
      that.setData({
        invoice_Take_Method: "邮件发送",
      })      
      if (that.data.to_email == null || that.data.to_email == undefined || that.data.to_email.length <= 0) {
        Toast("电子发票发送邮件地址为空,请先认证个人邮件!");
        return;
      }
    }

    let formData = {
      im_cust_req_master_id: that.data.im_cust_req_master_id,
      customer_info_id: customer_info_id,
      enterprise_type: that.data.enterprise_type,
      invoice_item_type: that.data.invoice_item_type,
      invoice_type: that.data.invoice_type,
      reqeust_date: that.data.formData.reqeust_date,
      im_cust_customer_id: that.data.custCustomerList.im_cust_customer_id,
      customer_name: that.data.custCustomerList.customer_name,
      customer_tax_code: that.data.custCustomerList.customer_tax_code,
      customer_address: that.data.custCustomerList.customer_address,
      customer_phone: that.data.custCustomerList.customer_phone,
      customer_bank_name: that.data.custCustomerList.customer_bank_name,
      customer_bank_account: that.data.custCustomerList.customer_bank_account,

      im_cust_vendor_id: that.data.CustVendorList.im_cust_vendor_id,
      vendor_name: that.data.CustVendorList.vendor_name,
      vendor_tax_code: that.data.CustVendorList.vendor_tax_code,
      vendor_address: that.data.CustVendorList.vendor_address,
      vendor_phone: that.data.CustVendorList.vendor_phone,
      vendor_bank_name: that.data.CustVendorList.vendor_bank_name,
      vendor_bank_account: that.data.CustVendorList.vendor_bank_account,

      im_cust_express_id: that.data.formData.im_cust_express_id,
      province: that.data.formData.province,
      city: that.data.formData.city,
      district: that.data.formData.district,
      express_address: that.data.formData.express_address,
      express_contact_name: that.data.formData.express_contact_name,
      express_contact_phone: that.data.formData.express_contact_phone,
      express_name: that.data.formData.express_name,
      invoice_take_method: that.data.invoice_Take_Method,
      status: 'N',
      remark: that.data.formData.remark,
      invoice_mail:that.data.to_email,
    };
    util.request(api.BillApi.PostInvoiceApply, {
      formdata: formData,
      detail: that.data.detailForm,
      cid: customer_info_id,
      curr_month: curr_month,
      user_id: user_id,
      user_name: user_name
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        //Toast.success(res.data.msg);
        let im_cust_req_master_id = res.data.master_id;
        let invoice_service_fee = res.data.invoice_service_fee;
        let express_expense = res.data.express_expense;
        let customer_name = res.data.customer_name;
        let total_tax_amt = res.data.total_tax_amt;
        let total_amount = res.data.total_amount;
        let service_type = res.data.operation_category; //服务方式（按次收费   包年预付）
        let dataFrom = {
          im_cust_req_master_id: im_cust_req_master_id,
          invoice_service_fee: invoice_service_fee,
          express_expense: express_expense,
          customer_name: customer_name,
          total_tax_amt: total_tax_amt,
          total_amount: total_amount,
          service_type: service_type,
          operation_category: service_type,
        };

        that.InvoiceSubmit(dataFrom);


      } else {
        Toast(res.data.msg);
      }
    })
  },

  /**
   * 临时保存
   */
  postDataTemp: function () {
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
    var that = this;
    if (that.data.formData.reqeust_date == null || that.data.formData.reqeust_date == undefined) {
      var reqeustDate = util.formatDataTime(new Date());
      that.data.formData.reqeust_date = reqeustDate;
    }

    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.split('-').join("");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;

    if (that.data.custCustomerList.im_cust_customer_id == null || that.data.custCustomerList.im_cust_customer_id == undefined || that.data.custCustomerList.im_cust_customer_id.length <= 0) {
      Toast("请选择开票申请单位");
      return;
    }

    //服务项目明细
    var tax_count = 0;
    var name_count = 0;
    var price_cooount = 0;
    var reg = /(^[\-0-9][0-9]*(.[0-9]+)?)$/
    var qty_count = 0; //数量

    that.data.detailForm.forEach(function (data, index) {
      if (data.item_tax_rate == null || data.item_tax_rate == "" || data.item_tax_rate.length <= 0) {
        tax_count = tax_count + 1;
      } else {
        if (tax_count > 0) {
          tax_count = tax_count - 1;
        }
      }
      if (data.item_name == null || data.item_name == undefined || data.item_name.length <= 0) {
        name_count = name_count + 1;
      } else {
        if (name_count > 0) {
          name_count = name_count - 1;
        }
      }
      if (data.item_price <= 0 || data.item_price == null || data.item_price == undefined || data.item_price.length <= 0) {
        price_cooount = price_cooount + 1;
      } else {
        if (price_cooount > 0) {
          price_cooount = price_cooount - 1;
        }
      }

      if (!reg.test(data.item_qty) || !reg.test(data.item_price) || !reg.test(data.item_tax_price) || !reg.test(data.item_total_amt)) {
        qty_count = qty_count + 1;
      } else {
        if (qty_count > 0) {
          qty_count = qty_count - 1;
        }
      }

    });
    if (tax_count > 0) {
      Toast("请选择税率");
      return;
    }
    if (name_count > 0) {
      Toast("请填写项目名称");
      return;
    }
    if (price_cooount > 0) {
      Toast("请填写单价");
      return;
    }
    if (qty_count > 0) {
      Toast("请输入数字类型");
      return;
    }
    if (that.data.invoice_type != '增值税电子普通发票' && that.data.invoice_type != '增值税电子专用发票') {
      if (that.data.invoice_Take_Method == null || that.data.invoice_Take_Method == undefined || that.data.invoice_Take_Method.length <= 0) {
        Toast("请选择取票方式！");
        return;
      } else {
        if (that.data.invoice_Take_Method.indexOf("自取") != -1) {} else {
          if (that.data.formData.im_cust_express_id == null || that.data.formData.im_cust_express_id == undefined || that.data.formData.im_cust_express_id.length <= 0) {
            Toast("请选择快递地址！");
            return;
          }
        }
      }
    } else {
      that.setData({
        invoice_Take_Method: "邮件发送",
      }) 
      if (that.data.to_email == null || that.data.to_email == undefined || that.data.to_email.length <= 0) {
        Toast("电子发票发送邮件地址为空,请先认证个人邮件!");
        return;
      }
    }

    let formData = {
      im_cust_req_master_id: that.data.im_cust_req_master_id,
      customer_info_id: customer_info_id,
      enterprise_type: that.data.enterprise_type,
      invoice_item_type: that.data.invoice_item_type,
      invoice_type: that.data.invoice_type,
      reqeust_date: that.data.formData.reqeust_date,
      im_cust_customer_id: that.data.custCustomerList.im_cust_customer_id,
      customer_name: that.data.custCustomerList.customer_name,
      customer_tax_code: that.data.custCustomerList.customer_tax_code,
      customer_address: that.data.custCustomerList.customer_address,
      customer_phone: that.data.custCustomerList.customer_phone,
      customer_bank_name: that.data.custCustomerList.customer_bank_name,
      customer_bank_account: that.data.custCustomerList.customer_bank_account,

      im_cust_vendor_id: that.data.CustVendorList.im_cust_vendor_id,
      vendor_name: that.data.CustVendorList.vendor_name,
      vendor_tax_code: that.data.CustVendorList.vendor_tax_code,
      vendor_address: that.data.CustVendorList.vendor_address,
      vendor_phone: that.data.CustVendorList.vendor_phone,
      vendor_bank_name: that.data.CustVendorList.vendor_bank_name,
      vendor_bank_account: that.data.CustVendorList.vendor_bank_account,

      im_cust_express_id: that.data.formData.im_cust_express_id,
      province: that.data.formData.province,
      city: that.data.formData.city,
      district: that.data.formData.district,
      express_address: that.data.formData.express_address,
      express_contact_name: that.data.formData.express_contact_name,
      express_contact_phone: that.data.formData.express_contact_phone,
      express_name: that.data.formData.express_name,
      invoice_take_method: that.data.invoice_Take_Method,
      status: 'N',
      remark: that.data.formData.remark,
      invoice_mail:that.data.to_email,
    };
    util.request(api.BillApi.PostInvoiceApply, {
      formdata: formData,
      detail: that.data.detailForm,
      cid: customer_info_id,
      curr_month: curr_month,
      user_id: user_id,
      user_name: user_name
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        // wx.redirectTo({
        //   url: '/pages/invoice/invoiceInfo/invoiceInfo?tabs=1',
        // })
        let pages = getCurrentPages(); //获取所有页面
        let prevPage = null; //上一个页面
        if (pages.length >= 2) {
          prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
        }
        if (prevPage) {
          prevPage.setData({
            active: 1,
          })
        }
        //1秒后跳转页面     
        setTimeout(function () {
          wx.navigateBack({
            delta: 1,
          })
        }, 1000);
      } else {
        Toast.fail(res.data.msg);
      }
    })
  },

  /**
   * 编辑
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
          invoice_Take_Method: custReqMasterInfo.invoice_take_method,
          isTakeExpress: isTakeExpress,
        });
        ///获取税率
        that.GetTaxRate();

        setTimeout(function () {
          that.data.detailForm.forEach(function (data, index) {
            let item_tax_price = 'detailForm[' + index + '].item_tax_price';
            let item_total_amt = 'detailForm[' + index + '].item_total_amt';
            that.setData({
              [item_tax_price]: (data.item_total_amt / data.item_qty).toFixed(2),
              [item_total_amt]: (data.item_total_amt).toFixed(2),
            })
            for (var i = 0; i < that.data.listCustomer_tax.length; i++) {
              if (data.customer_invoice_id == that.data.listCustomer_tax[i].customer_invoice_id && data.invoice_item_type == that.data.listCustomer_tax[i].item_taxmap_type) {
                let taxindex = 'detailForm[' + index + '].taxindex';

                let customer_invoice_id = 'detailForm[' + index + '].customer_invoice_id';
                let approved_tax_type = 'detailForm[' + index + '].approved_tax_type';
                let invoice_item_type = 'detailForm[' + index + '].invoice_item_type';
                let invoice_tax_map_id = 'detailForm[' + index + '].invoice_tax_map_id';
                let invoice_item_code = 'detailForm[' + index + '].invoice_item_code';
                let tax_name = 'detailForm[' + index + '].tax_name';
                that.setData({
                  [taxindex]: i,
                  [customer_invoice_id]: that.data.listCustomer_tax[i].customer_invoice_id,
                  [approved_tax_type]: that.data.listCustomer_tax[i].approved_tax_type,
                  [invoice_item_type]: that.data.listCustomer_tax[i].item_taxmap_type,
                  [invoice_tax_map_id]: that.data.listCustomer_tax[i].invoice_tax_map_id,
                  [invoice_item_code]: that.data.listCustomer_tax[i].invoice_item_code,
                  [tax_name]: that.data.listCustomer_tax[i].tax_name,
                })
                break;
              }
            }
          });
        }, 800);


        for (let i = 0; i < that.data.invoiceTakeMethodList.length; i++) {
          if (that.data.invoiceTakeMethodList[i].code_name == that.data.invoice_Take_Method) {
            that.data.invoiceTakeMethodList[i].checked = true;
          } else {
            that.data.invoiceTakeMethodList[i].checked = false;
          }
        }
        that.setData({
          invoiceTakeMethodList: that.data.invoiceTakeMethodList,
        })
        console.log(that.data.invoiceTakeMethodList)
        var dataCust = {
          customer_info_id: customer_info_id,
        }
        util.request(api.BillApi.QueryCustCustomerList,
          dataCust, 'POST').then(function (res) {
          console.log(res)
          let listCustCustomer = res.data.data;

          listCustCustomer.forEach(function (data, index) {
            if (data.im_cust_customer_id == that.data.formData.im_cust_customer_id) {
              let custCustomerList = {
                im_cust_customer_id: data.im_cust_customer_id,
                customer_tax_code: data.customer_tax_code,
                customer_address: data.customer_address,
                customer_phone: data.customer_phone,
                customer_bank_name: data.customer_bank_name,
                customer_bank_account: data.customer_bank_account,
                customer_name: data.customer_name,
              };
              that.setData({
                custCustomerList: custCustomerList,
              })

            }
          });
        });

      }
    })
  },

  /**
   * 跳转页面
   */
  goToPage: function () {
    let pages = getCurrentPages(); //获取所有页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) {
      prevPage.setData({
        active: 1,
      })
    }
    setTimeout(function () {
      wx.navigateBack({
        delta: 1,
      })
    }, 500);
  },
  /**
   * 发票提交
   */
  InvoiceSubmit: function (e) {
    var that = this;
    var item = e;
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
              that.goToPage();
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
          that.goToPage();
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
          that.goToPage();
        },
        fail(res) {
          Toast('支付失败!');
        },
        complete: function (res) {
          //付款完成
          console.log('complete--' + res);
          if (res.errMsg == "requestPayment:fail" || res.errMsg == "requestPayment:fail cancel") {
            wx.showModal({
              title: "提示",
              content: "您有开票申请尚未支付",
              showCancel: false,
              confirmText: "确认",
              success: function (res) {
                if (res.confirm) {
                  that.goToPage();
                }
              }
            });
            return;
          }
          if (res.errMsg == "requestPayment:ok") {}
        }
      })
    })

  },

  //选择优惠券
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
    let that = this;
    that.setData({
      showModal: false
    })
    wx.showModal({
      title: "提示",
      content: "您有开票申请尚未支付",
      showCancel: false,
      confirmText: "确认",
      success: function (res) {
        if (res.confirm) {
          that.goToPage();
        }
      }
    });
    //that.goToPage();
  },
  //关闭优惠券弹出
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
    let that = this;
    let data = options.data;
    if (options.data) {
      that.setData({
        custCustomerList: JSON.parse(data),
      });
    }
    var date = util.formatDataTime(new Date());
    that.setData({
      ['formData.reqeust_date']: date, //开票申请日期
    });

    that.Init();
    that.QueryCustomerinfo();
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
  onReachBottom: function () {},



  /**
   * 查询客户信息
   */
  QueryCustomerinfo: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var data = {
      customer_info_id: customer_info_id,
      account_month: account_month
    }
    util.request(api.BillApi.QueryCustomerinfo,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        let enterprise_type = "";
        if (res.data.info[0].tax_type.indexOf("一般") != -1) {
          enterprise_type = "一般纳税人";
        } else {
          enterprise_type = "小规模纳税人";
        }
        that.setData({
          listCustomer: res.data.info[0],
          enterprise_type: enterprise_type
        });
        that.GetTaxRate();
      } else {
        that.setData({
          listCustomer: [],
          enterprise_type: ''
        });
      }
    })
  },
  /**
   * 初始化税率
   */
  GetTaxRate: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var data = {
      customer_info_id: customer_info_id,
      account_month: account_month,
      enterprise_type: that.data.enterprise_type,
      invoice_type: that.data.invoice_type,
      invoice_item_type: that.data.invoice_item_type,
    }
    util.request(api.BillApi.QueryCustInfoice,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          listCustomer_tax: res.data.listCustomer_tax
        });
      } else {
        that.setData({
          listCustomer_tax: []
        });
      }
    })
  },
  /**
   * 获取销售方信息
   */
  GetCustVendor: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var data = {
      customer_info_id: customer_info_id,
      account_month: account_month,
    }
    util.request(api.BillApi.QueryCustVendorList,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          CustVendorList: res.data.vendorList[0]
        });
      } else {
        that.setData({
          CustVendorList: []
        });
      }
    })
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
    //下拉框
    util.request(api.BillApi.GetConditionByInvoice,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          info: res.data.info
        });
      } else {
        that.setData({
          info: []
        });
      }
    })
    //发票类型
    util.request(api.BillApi.GetInvoiceType,
      data, 'POST').then(function (res) {      
      if (res.data.success == true) {
        that.setData({
          invoiceTypeList: res.data.info,
          invoice_type: res.data.info[0].invoice_category,
          listInvoiceItemType:res.data.listInvoiceItemType,
          invoice_item_type:res.data.listInvoiceItemType[0].invoice_item_type,
        });
      } else {
        that.setData({
          invoiceTypeList: []
        });
      }
    })

    //销方信息
    var dataVen = {
      cid: customer_info_id,
      account_month: account_month
    }
    util.request(api.BillApi.PostVendorCustomer,
      dataVen, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.GetCustVendor();
      }
    })

    //取票方式
    util.request(api.BillApi.GetCustExpressListType,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        for (let i = 0; i < res.data.listInvoiceTakeMethod.length; i++) {
          if (res.data.listInvoiceTakeMethod[i].code_name == that.data.invoice_Take_Method) {
            res.data.listInvoiceTakeMethod[i].checked = true;
          } else {
            res.data.listInvoiceTakeMethod[i].checked = false;
          }
        }
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