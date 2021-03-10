// pages/statements/MonthlyBalanceSheet/MonthlyBalanceSheet.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    balanceData:'',
    account_month :util.LastMonth(),
    begin_month:util.LastMonth(),
    end_month:util.LastMonth(),
    isShowQuery:false,
    isShowDown:false,
    top:0
  },
  //控制回到顶部按钮的显示与消失
  scrollTopFun(e){
    console.log(e,'ejdhhdhdhdhd')
    let that = this;
    that.top = e.detail.scrollTop;
   
  },
     /**
   * 日期选择起始
   */
  bindDateChange: function(e) {
    this.setData({
      begin_month: e.detail.value,
    });
    this.compareDate(this.data.begin_month,this.data.end_month)
   
  },
    /**
   * 日期选择结束
   */
  bindDateChangeEnd: function(e) {
    this.setData({
      end_month: e.detail.value,
    });
    this.compareDate(this.data.begin_month,this.data.end_month)
    //this.QueryVoucherReport()
  },
    /**
   * 判断日期1是否大于日期2，只到年月
   * @param {Object} begin_month
   * @param {Object} end_month
   */
  compareDate:function (begin_month,end_month){
    console.log(begin_month,'begin_month')
    console.log(end_month,'end_month')
    var result = false;
    if(begin_month.substring(0,4)<end_month.substring(0,4)){
      console.log(begin_month.substring(0,4),'begin_month.substring(0,4)')
        result = true;
        this.QueryBalanceSheet()
    }else if(begin_month.substring(0,4) == end_month.substring(0,4)){
          if(begin_month.substring(5,7)<=end_month.substring(5,7)){
            console.log(begin_month.substring(5,7),'begin_month.substring(5,7)')
              result = true;
              this.QueryBalanceSheet()
          }else{
            Toast('起始月份不应大于结束月份');
          }
    }else{
      Toast('起始月份不应大于结束月份');
    }
    return result;
  },
  /**
   * 余额表
   */
  QueryBalanceSheet:function(e){
    let that = this;
    wx.showLoading()
    let postData={
      cid:app.globalData.curr_customer_info_id,
      queryBeginDate:that.data.begin_month,
      queryEndDate:that.data.end_month,
    }
    console.log(postData,'postData')
    util.request(api.BillApi.QueryBalanceSheet,postData,'POST').then(function(res){
      console.log(res,'余额表list')
      if(res.data.success==true){
        that.setData({
          balanceData: res.data.balanceData,
          isShowDown:true
        });
        
      }else{
        that.setData({
          balanceData: [],
          isShowDown:false
        });
      }
      wx.hideLoading();
    })
   
  },
  DownExcel:function(){
    let that=this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    if(customer_info_id>0){
      wx.showLoading()
      let postData= {
        queryBeginDate:that.data.begin_month,
        queryEndDate:that.data.end_month,
        cid: customer_info_id,
        cname:app.globalData.curr_customer_name,
      }
      wx.request({     
        url: api.BillApi.ExcelBalanceSheetReport,
        data: postData,
        header: {
          "content-type": "application/json",
          'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token'), //设置验证
        },
        method: "get",
        dataType: "json",
        responseType: "arraybuffer",
        success: (result) => {
          console.log("下载成功！", result);
          if(result.success==false){
            wx.showToast({
              title: result.msg,
              icon: 'none',  
              duration: 2000, 
            })
          }else{
            var fileManager = wx.getFileSystemManager();
            var FilePath = wx.env.USER_DATA_PATH + "/" + new Date().getTime()+".xlsx";
            fileManager.writeFile({
              data: result.data,
              filePath: FilePath,
              encoding: "binary", //编码方式 
              success: result => {
                wx.openDocument({ //成功之后直接打开
                  filePath: FilePath, 
                  showMenu:true,
                  fileType: "xlsx",
                  success: result => {
                    console.log("打开文档成功");
                  },
                  fail: err => {
                    console.log("打开文档失败", err);
                  }
                });
                wx.hideLoading();
              },
              fail: res => {
                wx.showToast({
                  title: '下载失败!',
                  icon: 'none',  
                  duration: 2000, 
                })
                console.log(res);
              }
            })
            wx.hideLoading()
          }
          
        },
        fail(err) {
          console.log(err)
          wx.hideLoading()
        }
  
      })
    }else{
      wx.showToast({
        title: '请选择客户后下载报表!',
        icon: 'none',  
        duration: 2000, 
      })
    }
    
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      account_month:app.globalData.curr_date,
      begin_month:app.globalData.curr_date,
      end_month:app.globalData.curr_date,
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
    let customer_info_id = app.globalData.curr_customer_info_id;
    if(customer_info_id!=''){
      this.setData({
        isShowQuery:true
      })
    }else{
      this.setData({
        isShowQuery:false
      })
    }
    this.QueryBalanceSheet()
  },

  
})