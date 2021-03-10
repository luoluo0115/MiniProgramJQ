// pages/search/searchCompany/searchCompany.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_List: [],
    index:[],
    class_type_id:[],
    reload:false
  },
  input1:function(e){//输入时 时是调用搜索方法
    this.search(e.detail.value)
  },
  confirm1:function(e){//软键盘搜索
    this.search(e.detail.value)
  },
  search: function(key){
    var that= this;
    var customer_List = wx.getStorage({
      key: 'customer_List',
      success: (res)=>{
        if(key == ""){
          that.setData({customer_List:res.data})
            return;
        }
        var arr =[];//临时数组 用于存放匹配到的数据
        for( let i in res.data){
          res.data[i].show =false;
          if(res.data[i].customer_name.indexOf(key) >=0 ){
            res.data[i].show = true;
            arr.push(res.data[i])
          }

        }
        if(arr.length==0){
          that.setData({
            customer_List:[{show:true,customer_name:'无相关数据'}]
          })
        }else{
          that.setData({
            customer_List:arr//找到相关数据在页面显示
          })
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });

  },
   /*点击当前公司*/
   returnPre:function(e){
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    if(app.globalData.customer_info_id_list!=''){
      for(let i in app.globalData.customer_info_id_list){
        if(e.currentTarget.dataset.customer_info_id===app.globalData.customer_info_id_list[i].customer_info_id){
          app.globalData.index=i;
          
        }
      }
      console.log( app.globalData.index,'index循环');
      
    }

    
    prevPage.setData({
      //customer_info_id: e.currentTarget.dataset.customer_info_id,
      customer_info_id: app.globalData.customer_info_id,
       index: app.globalData.index
      // index:e.currentTarget.dataset.class_type_id
    })
    app.globalData.curr_customer_info_id=e.currentTarget.dataset.customer_info_id
    //app.globalData.index=e.currentTarget.dataset.class_type_id;
    console.log(e.currentTarget.dataset.class_type_id,'index');
    app.globalData.refresh=true;
    wx.navigateBack({
      delta: 1,
    })
    //prevPage.onPullDownRefresh
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  var customer_List= app.globalData.customer_info_id_list;
  console.log(customer_List,'所有公司');
      for(let i in customer_List){
        customer_List[i].show=false;
      }
      wx.setStorage({
        key:'customer_List',
        data:customer_List,
      })
      this.setData({
        customer_List:customer_List//页面加载时 显示所有数据
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

  }
})