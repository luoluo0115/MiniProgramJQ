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
            scrap_apply_reason: ''
        },  
        invoice_category:'',
        scrap_category:'',
        cust_invoice_apply_id:0,//发票信息ID 
        customerInvoiceApplyList:{}, 
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
   * 保存
  */
  postDataTemp(){
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
    let scrap_apply_reason=that.data.formData.scrap_apply_reason;
 
    if (scrap_apply_reason == null || scrap_apply_reason == undefined || scrap_apply_reason.length <= 0) {
        Toast("请输入发票作废理由！");
        return;
    }
 
    util.request(api.BillApi.PostCustInvoiceApplyScarpUrl, {  
        ui:user_id,
        un:user_name, 
        cust_invoice_apply_id: that.data.cust_invoice_apply_id,
        scrap_apply_reason: that.data.formData.scrap_apply_reason,
        scrap_category: that.data.scrap_category,
        invoice_category: that.data.invoice_category,
        scrap_apply_status:'N'
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
   * 保存并提交
  */
 postData(){
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
    let scrap_apply_reason=that.data.formData.scrap_apply_reason;
 
    if (scrap_apply_reason == null || scrap_apply_reason == undefined || scrap_apply_reason.length <= 0) {
        Toast("请输入发票作废理由！");
        return;
    }
 
    util.request(api.BillApi.PostCustInvoiceApplyScarpUrl, {  
        ui:user_id,
        un:user_name, 
        cust_invoice_apply_id: that.data.cust_invoice_apply_id,
        scrap_apply_reason: that.data.formData.scrap_apply_reason,
        scrap_category: that.data.scrap_category,
        invoice_category: that.data.invoice_category,
        scrap_apply_status:'S'
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
            console.log(customerInvoiceInfoList.scrap_category_desc)
            that.setData({
                formData: customerInvoiceInfoList, 
                invoice_category:customerInvoiceInfoList.invoice_category,    //发票类型
                scrap_category:customerInvoiceInfoList.scrap_category_desc,   //发票作废类型
                invoice_category:customerInvoiceInfoList.invoice_category
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
        if (options.cust_invoice_apply_id>0) {
            wx.setNavigationBarTitle({
                title: '发票作废申请'
            }); 
            that.setData({
                cust_invoice_apply_id: options.cust_invoice_apply_id,
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
     * 用户点击右上角分享
     */
    // onShareAppMessage: function () {

    // }
})