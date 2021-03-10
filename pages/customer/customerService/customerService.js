// pages/customer/customerService/customerService.js
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Dialog from '../../../vant-weapp/dist/dialog/dialog';
import Toast from '../../../vant-weapp/dist/toast/toast';
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    customer_in_charge_number: [],
    customer_in_charge_ext: [],
    customerList: [],
    commonInfo: [],
    friendId: '',
    friendName: '',
    friendAvatarUrl: '',
    ownerAvatarUrl: '',
    friendOpenId: '',
    complete: 0, // 是否还有历史消息可以拉取，1 - 表示没有，0 - 表示有
    content: '', // 输入框的文本值
    lock: false, // 发送消息锁 true - 加锁状态 false - 解锁状态
    scroll_height: wx.getSystemInfoSync().windowHeight - 55,
    openid: "",
    increase: false, //图片添加区域隐藏
    aniStyle: true, //动画效果
    previewImgList: [],
    currPageIndex: 1,
    maxPageIndex: 1,
    imgUrls:[],
    imgWoman:api.ImgUrl+'A006',
    imgMan:api.ImgUrl+'A007'
  
  },
  //查询我的客服
  QueryCustService: function(e) {
    let that = this;
    util.request(api.QueryCustServiceUrl, //查询客服
      {
        openid: app.globalData.openid,
        user_id: app.globalData.user_id
      }, 'POST').then(function(res) {
      if (res.data.success == true) {
        console.log(res)
        that.setData({
          commonInfo: res.data.commonInfo[0]
        });
      } else {
        that.setData({
          commonInfo: []
        })
      }
    })
  },
  onClickConfirm() {
    const message = '电话:' + this.data.commonInfo.service_mp;
    wx.makePhoneCall({
      phoneNumber: this.data.commonInfo.service_mp,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.QueryCustService();
    that.setData({
      messages: [],
      maxPageIndex: 1
    });
    //that.getHistoryList(app.globalData.openid);


  },



  scrollEvent: function(data) {

    var that = this;
    var currPageIndex = that.data.currPageIndex;
    var maxPageIndex = that.data.maxPageIndex;
    if (currPageIndex < maxPageIndex) {

      that.setData({
        currPageIndex: currPageIndex + 1
      });
      that.getHistoryList(app.globalData.openid);
    }



  },
  getHistoryList: function(openid) {

    var that = this;
    util.request(api.QueryCustServiceMessage, //查询客服
      {
        openid: openid,
        page_index: that.data.currPageIndex,
        page_size: 10
      }, 'POST').then(function(res) {
        wx.hideLoading();
        console.log(res);
        if (res.data.success == true) {
          console.log("测试"); 
          that.setData({
            messages: res.data.msgList,
            maxPageIndex: res.data.maxCount
          });

        } else {
          that.setData({
            messages: [],
            maxPageIndex: []
          });
          
        }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that= this;
    
    //that.QueryCustService();
    that.getHistoryList(app.globalData.openid);
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  onSwitchTab:function(e){
    var ulrl = e.currentTarget.dataset.url; 
    console.log(ulrl);

    wx.navigateTo({
      url: "/"+ulrl,
    });
  },  

  previewImg: function(e) {

    var that = this;

    var list = that.data.previewImgList //页面的图片集合数组
    that.data.previewImgList = [];
    var res = e.target.dataset.src;
    if (list.indexOf(res) == -1) {

      that.data.previewImgList.push(res)

    }



    wx.previewImage({

      current: res, // 当前显示图片的http链接

      urls: that.data.previewImgList // 需要预览的图片http链接列表

    })


  },
})