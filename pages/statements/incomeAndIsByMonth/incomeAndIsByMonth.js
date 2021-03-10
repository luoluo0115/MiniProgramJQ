// pages/statements/incomeAndIsByMonth/incomeAndIsByMonth.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import F2 from '../../../f2-canvas/lib/f2';
import Toast from '../../../vant-weapp/dist/toast/toast';
var app=getApp();

 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    opts: {
    }
  },
 /**
   * 获取每月收入和利润
   */
  QueryIncomeAndIsByMonth:function(e){
    let that = this;
    util.request(api.QueryIncomeAndIsByMonthUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        account_month:app.globalData.curr_date.split('-').join(""),
        q_type:app.globalData.q_type
  },'POST').then(function(res){

    if(res.data.success==true){
      app.globalData.drReturn=res.data.drReturn;
      that.setData({
        drReturn: res.data.drReturn,
        q_type:app.globalData.q_type
      });
    }else{
      that.setData({
        drReturn: [],
        q_type:[]
      });
    }
  })
    // wx.request({
    //   url: api.QueryIncomeAndIsByMonthUrl, //获取每月收入和利润接口地址
    //   header: {
    //     'content-type': 'application/json' ,// 默认值,
    //     'Authorization':'Bearer '+app.globalData.Token //设置验证
    //   },
    //   data: {
    //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
    //     account_month:app.globalData.curr_date.split('-').join(""),
    //     q_type:app.globalData.q_type
    //   },
    //   method: "POST",
    //   success (res) {
    //     if(res.data.success==true){
    //       app.globalData.drReturn=res.data.drReturn;
    //       that.setData({
    //         drReturn: res.data.drReturn,
    //         q_type:app.globalData.q_type
    //       });
    //     }else{
    //       that.setData({
    //         drReturn: [],
    //         q_type:[]
    //       });
    //     }
        
    //   },
    //   fail:function(err){
    //     console.log(err);
    //     Toast('网络异常');
    //   }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title

    })
    app.globalData.q_type=options.q_type;
    this.QueryIncomeAndIsByMonth(app.globalData.q_type);

    let chart = null;
    const that = this;

    
    function initChart(canvas, width, height) { // 使用 F2 绘制图表
      new Promise(function(resolve,reject){ 

        util.request(api.QueryIncomeAndIsByMonthUrl,{
          openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
            account_month:app.globalData.curr_date.split('-').join(""),
            q_type:app.globalData.q_type
      },'POST').then(function(res){
    
        if(res.data.success==true){
          app.globalData.drReturn=res.data.drReturn;
          const dataNum =  res.data.drReturn;
          for(var i=0 ;i<dataNum.length;i++){
              dataNum[i].val =Number(dataNum[i].val);
          }
          
          resolve(dataNum) // 将数据返回给到new上进行then索取
        }else{
          const dataNum =[];
          resolve(dataNum)
        }
      })
        // wx.request({
        //   url: api.QueryIncomeAndIsByMonthUrl,//请求接口
        //   data: { 
        //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        //     account_month:app.globalData.curr_date.split('-').join(""),
        //     q_type:app.globalData.q_type
        //    },
        //   header: {
        //     'content-type': 'application/json' ,// 默认值,
        //     'Authorization':'Bearer '+app.globalData.Token //设置验证
        //   },
        //   method: "POST",
        // // 请求成功后执行
        //   success: function (res) {
        //     if(res.data.success==true){
        //       app.globalData.drReturn=res.data.drReturn;
        //       const dataNum =  res.data.drReturn;
        //       for(var i=0 ;i<dataNum.length;i++){
        //           dataNum[i].val =Number(dataNum[i].val);
        //       }
              
        //       resolve(dataNum) // 将数据返回给到new上进行then索取
        //     }else{
        //       const dataNum =[];
        //       resolve(dataNum)
        //     }
            
            
        //   },
        //   fail:function(err){
        //     console.log(err);
        //     Toast('网络异常');
        //   }
        // })
      }).then((data) => {

        // 全局设置，所有的图表生效

        chart = new F2.Chart({
              id: 'column-dom',
              el: canvas,
              width,
              height
            });

          chart.source(data.reverse(), {
            value: {
            tickInterval: 750
            }
        });
        chart.tooltip({
          showItemMarker: false,
          onShow: function onShow(ev) {
            var items = ev.items;
            items[0].name = null;
            items[0].name = items[0].title;
            items[0].value = '¥ ' + items[0].value;
          }
        });
        chart.interval().position('month*val').color('l(90) 0:#6823FB 1:#7966FE'); // 定义柱状图渐变色;
        chart.render();
        return chart;

      })
    };
    this.setData({
      opts: {
        onInit: initChart
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