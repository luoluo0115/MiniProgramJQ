var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast'; 
Page({

    /**
     * 页面的初始数据
     */
    data: {
        formData:{
            invoice_amount:0,
            invoice_category:'增值税普通发票',
            invoice_item_name:'',
            invoice_item_detail:'',
            invoice_remark:'',
            remark:'',
            remained_invoice_total:0,
        }, 
        invoiceTypeList: [],//发票分类
        listInvoiceTax:[],//发票税率
        customer_info_id_JQ:0,//机巧客户ID
        remaindAmt:0,//剩余可开票金额
        info:[],//发票项目 
        cust_invoice_apply_id:0,//发票信息ID
        moneyAmt:0,
        invoiceCustList:{},
        customerInvoiceApplyList:{}, 
    },

    /**
     * 获取开票税率
     */
    GetInvoiceApplyTaxList:function(){
        var that=this;  
        var data = {
            customer_info_id: that.data.customer_info_id_JQ,
            invoice_category:that.data.invoice_category
        } 
        console.log("data",data)
        util.request(api.BillApi.QueryInvoiceApplyTaxListUrl,
            data, 'POST').then(function (res) {
            if (res.data.success == true) {  
                that.setData({
                    listInvoiceTax: res.data.dt
                });
            } else {
                that.setData({
                    listInvoiceTax: []
                });
            } 
            setTimeout(function(){
                if(that.data.listInvoiceTax.length>0){
                    that.setData({ 
                        tax_name: that.data.listInvoiceTax[0].tax_name,
                        invoice_rate:  that.data.listInvoiceTax[0].tax_rate,
                        customer_invoice_id : that.data.listInvoiceTax[0].customer_invoice_id,
                        approved_tax_type : that.data.listInvoiceTax[0].approved_tax_type,
                        invoice_item_type : that.data.listInvoiceTax[0].item_taxmap_type,
                        invoice_item_code : that.data.listInvoiceTax[0].invoice_item_code  
                    });
                }else{
                    that.setData({ 
                        tax_name: '',
                        invoice_rate:  0,
                    }); 
                }
            },200);

        })
    },
    /**
     * 获取税率
    */
    GetTaxList:function(){
        var that=this; 
        var data = {
            customer_info_id: that.data.customer_info_id_JQ,
            invoice_category:that.data.invoice_category
        }
        //机巧开票税率
        util.request(api.BillApi.QueryInvoiceApplyTaxListUrl,
            data, 'POST').then(function (res) {
            if (res.data.success == true) {  
                that.setData({
                    listInvoiceTax: res.data.dt
                });
            } else {
                that.setData({
                    listInvoiceTax: []
                });
            }
            if(that.data.listInvoiceTax.length>0){ 
                for (var i = 0; i < that.data.listInvoiceTax.length; i++) {
                    if (that.data.invoice_rate == that.data.listInvoiceTax[i].tax_rate) {
                        that.setData({ 
                            tax_name: that.data.listInvoiceTax[i].tax_name,
                            invoice_rate: that.data.listInvoiceTax[i].tax_rate
                        }); 
                        break;
                    }
                } 
            }
        })
    },

    /**
    * 跳转页面
   */
  goToPage: function () {
    var that=this;
    let pages = getCurrentPages(); //获取所有页面
    let prevPage = null; //上一个页面
    if (pages.length >= 2) {
      prevPage = pages[pages.length - 2]; //获取上一个页面，将其赋值
    }
    if (prevPage) { 
        //that.QueryInvoiceApplyList();  
        prevPage.setData({
            active:1,
        })
    }
    setTimeout(function () {
      wx.navigateBack({
        delta: 1,
      })
    }, 500);
  },
  /**
   * 查询开票申请  
   */
  QueryInvoiceApplyList: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryCustInvoiceApplyListAllUrl, {
      cid: customer_info_id,
      curr_month: curr_month,
      cname: '',
      invoice_category: '',
      creation_date: '',
      oper_category:'',
      status: '',
      pageSize: 100,
      pageIndex: 1,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) { 
        that.setData({
            customerInvoiceApplyList: res.data.list,
        });
      } else {
        that.setData({
          customerInvoiceApplyList: [],
          msg: '暂无发票申请数据！'
        });
      }
    })
  },

    /**
     * 新增时获取客户剩余可开票金额
    */
    GetAmt:function(){ 
        var that = this;
        let customer_info_id = app.globalData.curr_customer_info_id;  
        var data = {
            cid: customer_info_id
        }
         util.request(api.BillApi.QueryRemainedInvoiceAmtUrl,
            data, 'POST').then(function (res) {
            if (res.data.success == true) { 
                let amt=res.data.amt;
                that.setData({  
                    remained_invoice_total:res.data.amt
                });
            } else {
                that.setData({ 
                    remained_invoice_total:0
                });
            }
        })
    }, 
    formDataChange: function (e) {
        let that = this;
        let fieldname = e.currentTarget.dataset.fieldname 
        let newValue = e.detail; 
        let field = 'formData.' + fieldname;
        // console.log("fieldname",fieldname)
        // console.log("newValue",newValue) 
        that.setData({
            [field]: newValue
        })  
    }, 
    /**
     * 编辑
    */
    editRow:function(){
        var that = this;
        let customer_info_id = app.globalData.curr_customer_info_id; 
        let user_id = app.globalData.user_id;
        let user_name = app.globalData.user_name;
        let cust_invoice_apply_id = that.data.cust_invoice_apply_id;
        var data = {
            customer_info_id: customer_info_id, 
            cust_invoice_apply_id: cust_invoice_apply_id,
        } 
        util.request(api.BillApi.QueryCustomerInvoiceApplyByIDUrl,
            data, 'POST').then(function (res) {
            if (res.data.success == true) {
                let customerInvoiceInfoList = res.data.info[0];   
                that.setData({
                    formData: customerInvoiceInfoList, 
                    invoice_category:customerInvoiceInfoList.invoice_category, 
                    invoice_rate:customerInvoiceInfoList.invoice_rate,
                    invoice_item_name:customerInvoiceInfoList.invoice_item_name,
                    remained_invoice_total:customerInvoiceInfoList.remained_invoice_total
                });   
                setTimeout(function(){
                    if(that.data.info.invoiceItemNameList.length>0){ 
                        for (var i = 0; i < that.data.info.invoiceItemNameList.length; i++) {
                            if (that.data.invoice_item_name == that.data.info.invoiceItemNameList[i].code_name) {
                                that.setData({ 
                                    invoice_item_name: that.data.info.invoiceItemNameList[i].code_name, 
                                }); 
                                break;
                            }
                        } 
                    }
                    that.GetTaxList(); 
                },100); 
            } 
        })
    },

    /**
     * 绑定发票分类
    */
    bindInvoiceTypeChange: function (e) {
        this.setData({
            invoice_category: this.data.invoiceTypeList[e.detail.value].invoice_category,
        })
        this.GetInvoiceApplyTaxList();
    },
    /**
     * 绑定发票项目
    */
    bindInvoiceItemTypeChange:function(e){
        this.setData({
            invoice_item_name: this.data.info.invoiceItemNameList[e.detail.value].code_name,
        })
    },

    /**
     * 绑定发票税率
     * @param {*} e 
     */
    bindListInvoiceTaxChange:function(e){  
        var that=this;
        if(that.data.listInvoiceTax.length>0){
            this.setData({
                tax_name: this.data.listInvoiceTax[0].tax_name,
                invoice_rate: this.data.listInvoiceTax[0].tax_rate,
                customer_invoice_id : this.data.listInvoiceTax[0].customer_invoice_id,
                approved_tax_type : this.data.listInvoiceTax[0].approved_tax_type,
                invoice_item_type : this.data.listInvoiceTax[0].item_taxmap_type,
                invoice_item_code : this.data.listInvoiceTax[0].invoice_item_code  
            })   
        }else{
            this.setData({
                tax_name: '',
                invoice_rate: 0
            })   
        }
          
    },

    getTaxTypeList(){
        util.request(api.BillApi.QueryCustomerInfoJQUrl,
            data,'POST').then(function (res) {
              if (res.data.success == true) {
                  that.setData({
                      invoiceTypeList: res.data.info,
                      invoice_category:res.data.info[0].invoice_category,
                      customer_info_id_JQ:res.data.customer_info_id_JQ
                  });
                  setTimeout(function(){ 
                      that.GetInvoiceApplyTaxList();
                  },200); 
              } else {
                  that.setData({
                      invoiceTypeList: [],
                      invoice_category:'',
                      customer_info_id_JQ:0
                  });
              }
          })  
    },

    /**
     * 保存
    */
    bindSave:function(){
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
        let customer_info_id = app.globalData.curr_customer_info_id; 
        let user_id = app.globalData.user_id;
        let user_name = app.globalData.user_name;
  
        let cust_invoice_apply_id= that.data.cust_invoice_apply_id;
        let invoice_category=that.data.invoice_category;
        let invoice_item_name=that.data.invoice_item_name;
        let invoice_rate=that.data.invoice_rate; 

        let customer_invoice_id=that.data.customer_invoice_id; 
        let approved_tax_type=that.data.approved_tax_type; 
        let invoice_item_type=that.data.invoice_item_type; 
        let invoice_item_code=that.data.invoice_item_code; 

        let remained_invoice_total=that.data.remained_invoice_total;
        let invoice_item_detail=that.data.formData.invoice_item_detail;
        let invoice_amount=that.data.formData.invoice_amount;
        let invoice_remark=that.data.formData.invoice_remark;
        let remark=that.data.formData.remark;
 
        if (invoice_rate == null || invoice_rate == undefined || invoice_rate.length <= 0) {
            Toast("请选择发票开票税率");
            return;
        }

        if (invoice_amount == null || invoice_amount == undefined || invoice_amount.length <= 0) {
            Toast("请填写申请开票金额");
            return;
        }else{
            console.log("invoice_amount",invoice_amount)
            if (invoice_amount <= 0) {
                Toast("申请开票金额必须大于0！");
                return;
            } else if (invoice_amount > 0 && invoice_amount > remained_invoice_total) {
                Toast("申请开票金额超出剩余可开金额！");
                return;
            }
        }

        if (invoice_item_name == null || invoice_item_name == undefined || invoice_item_name.length <= 0) {
            Toast("请选择发票项目");
            return;
        } 
        
        let formData = { 
            customer_info_id: customer_info_id, 
            cust_invoice_apply_id: cust_invoice_apply_id,
            invoice_category:invoice_category,
            invoice_item_name:invoice_item_name,
            invoice_rate:invoice_rate, 
            remained_invoice_total:remained_invoice_total,
            invoice_item_detail:invoice_item_detail,
            invoice_amount:invoice_amount,
            invoice_remark:invoice_remark,
            remark:remark,
            customer_invoice_id : customer_invoice_id,
            approved_tax_type : approved_tax_type,
            invoice_item_type : invoice_item_type,
            invoice_item_code : invoice_item_code  
        }; 
        util.request(api.BillApi.PostCustInvoiceApplyAddUrl, {
            formdata: formData, 
            cid: customer_info_id, 
            ui:user_id,
            un:user_name, 
        }, 'POST').then(function (res) {
            console.log(res);
            if (res.data.success == true) {
                Toast.success(res.data.msg);
                that.goToPage();

                // wx.redirectTo({
                //   url: '/pages/me/customerInvoiceInfo/customerInvoiceInfo',
                // }) 
            } else {
                Toast.fail(res.data.msg);
            }
        }) 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this; 
        let data = options.data; 
        that.Init();   
        // console.log("data",data)
        // console.log("options.cust_invoice_apply_id",options.cust_invoice_apply_id)
        if (options.cust_invoice_apply_id>0) {
            wx.setNavigationBarTitle({
                title: '编辑发票申请'
            });
            // that.setData({
            //     invoiceCustList: JSON.parse(data),
            // }); 
            that.setData({
                cust_invoice_apply_id: options.cust_invoice_apply_id,
            });
            that.editRow();
        }else{
            wx.setNavigationBarTitle({
                title: '新增发票申请'
            });   
            that.GetAmt(); 
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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    /**
     * 初始化数据
     * */ 
    Init:function(){
        var that = this;
        let customer_info_id = app.globalData.curr_customer_info_id;  
        var data = {
            cid: customer_info_id
        }
         //机巧信息以及机巧可开票类型
        util.request(api.BillApi.QueryCustomerInfoJQUrl,
          data,'POST').then(function (res) {
            if (res.data.success == true) {
                that.setData({
                    invoiceTypeList: res.data.info,
                    // invoice_category:res.data.info[0].invoice_category,
                    customer_info_id_JQ:res.data.customer_info_id_JQ
                });
                if(that.data.cust_invoice_apply_id<=0 || that.data.cust_invoice_apply_id==undefined || that.data.cust_invoice_apply_id==null ){
                    that.setData({ 
                        invoice_category:res.data.info[0].invoice_category, 
                    });
                    setTimeout(function(){ 
                        that.GetInvoiceApplyTaxList();
                    },200); 
                }
               
            } else {
                that.setData({
                    invoiceTypeList: [],
                    invoice_category:'',
                    customer_info_id_JQ:0
                });
            }
        })  
 
        //客户剩余开票金额
        util.request(api.BillApi.QueryRemainedInvoiceAmtUrl,
            data, 'POST').then(function (res) {
            if (res.data.success == true) { 
                that.setData({ 
                    moneyAmt:res.data.amt
                });
            } else {
                that.setData({ 
                    moneyAmt:0
                });
            }
        })
        //获取开票项目 invoiceItemNameList
        util.request(api.BillApi.QueryInvoiceItemUrl,
            'POST').then(function (res) {
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

        
    }, 
})