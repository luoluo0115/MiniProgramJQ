const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
var WxParse = require('../../../wxParse/wxParse.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    onlinePublicList: '',
    NoData: '',
    cs_confirm_remark: '',
    cs_confirm_file_name_guids: [],
    cs_confirm_file_names: [],
    confirm_file_name_guids: [],
    FileOssUrl: api.FileOssUrl,
  },
  showPopup() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  bindDateChange(e) {
    this.setData({
      account_year: e.detail.value
    });
    this.QueryOnlinePublic();
  },
  handleFieldChange: function (e) {
    let that = this;
    let fieldname = e.currentTarget.dataset.fieldname
    let newValue = e.detail;
    let field = fieldname;
    that.setData({
      [field]: newValue,
    })
  },
  /**
   * 查询年度网上公示
   */
  QueryOnlinePublic: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let account_year = that.data.account_year;
    let postData = {
      openid: app.globalData.openid,
      cid: customer_info_id,
      account_year: account_year,
      ui: app.globalData.user_id,
    }
    util.request(api.QueryOnlinePublic,
      postData, 'POST').then(function (res) {
      console.log(res, 'res')
      if (res.data.success == true) {
        let cs_confirm_file_name_guids = res.data.onlinePublicList[0].cs_confirm_file_name_guid;
        cs_confirm_file_name_guids = cs_confirm_file_name_guids == null ? "" : cs_confirm_file_name_guids.split("|");
        let cs_confirm_file_names = res.data.onlinePublicList[0].cs_confirm_file_name;
        cs_confirm_file_names = cs_confirm_file_names == null ? "" : cs_confirm_file_names.split("|");
        let confirm_file_name_guids = res.data.onlinePublicList[0].confirm_file_name_guid;
        confirm_file_name_guids = confirm_file_name_guids == null ? "" : confirm_file_name_guids.split("|");
        that.setData({
          onlinePublicList: res.data.onlinePublicList[0],
          cs_confirm_file_name_guids: cs_confirm_file_name_guids,
          cs_confirm_file_names: cs_confirm_file_names,
          confirm_file_name_guids: confirm_file_name_guids,
          NoData: '',
        });
      } else {
        that.setData({
          onlinePublicList: [],
          NoData: res.data.msg,
        });
      }
    })
  },
  /**
   * 确认
   */
  ConfirmOnlinePublic: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let openid = app.globalData.openid;
    let online_public_id = item.online_public_id;
    let account_year = item.account_year;
    wx.showModal({
      title: '提示',
      content: '确认提交' + account_year + '年度网上公示吗？',
      success: function (sm) {
        if (sm.confirm) {
          util.request(api.PostOnlinePublic, {
            cid: customer_info_id,
            ui: user_id,
            un: user_name,
            openid: openid,
            online_public_id: online_public_id,
          }, 'POST').then(function (res) {
            if (res.data.success == true) {
              that.QueryOnlinePublic();
              Toast.success(res.data.msg);
            } else {
              Toast.fail(res.data.msg);
            }
          })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //选择文件
  afterRead(event) {
    let file = event.detail;
    let fileList = [];
    let path = event.detail.file.path;
    fileList.push({
      url: path,
      deletable: true,
    });
    this.setData({
      fileList: fileList,
      path: path,
    });
  },
  //上传文件
  uploadFile: function (e) {
    let that = this;
    var item = e.currentTarget.dataset.item;
    let online_public_id = item.online_public_id;
    if (online_public_id == '' || online_public_id == null || online_public_id == undefined) {
      Toast('未找到年度公示信息');
      return;
    }
    if (that.data.path == '') {
      Toast('请选择年度公示文件');
      return;
    }
    let customer_info_id = app.globalData.curr_customer_info_id;
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let cs_confirm_remark = that.data.cs_confirm_remark;
    let url = api.PostOPUploadFile + '?ui=' + user_id + "&un=" + user_name + "&cid=" + customer_info_id + "&online_public_id=" + online_public_id + "&cs_confirm_remark=" + cs_confirm_remark;
    Toast.loading({
      mask: true,
      duration: 0,
      message: '上传中...'
    });
    wx.uploadFile({
      url: url,
      filePath: that.data.path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
      },
      formData: {
        'ui': user_id,
        'un': user_name,
        'cid': customer_info_id,
        'online_public_id': online_public_id,
        'cs_confirm_remark': cs_confirm_remark
      },
      success: function (res) {
        Toast.clear()
        var result = JSON.parse(res.data);
        if (result.success == true) {
          that.setData({
            show: false
          });
          that.QueryOnlinePublic();
          Toast.fail(result.msg);
        } else {
          Toast.fail(result.msg);
        }
      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
  //图片上传-点击删除
  deleteImages(event) {
    var image_index = event.detail.index
    var fileList_new = this.data.fileList;
    fileList_new.splice(image_index, 1);
    this.setData({
      fileList: fileList_new,
      path: fileList_new,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var year = date.getFullYear();
    that.setData({
      account_year: year - 1,
    })
    that.QueryOnlinePublic();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

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

  //下载模板
  downloadFile: function (e) {
    let type = e.currentTarget.dataset.type;
    let url = api.ImgUrl + "A015";
    wx.showLoading({
      title: '下载中...',
    })
    wx.downloadFile({
      url: url,
      header: {},
      success: function (res) {
        var filePath = res.tempFilePath;
        console.log(filePath);
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            Toast("模板打开成功");
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            wx.hideLoading();
          }
        })
      },
      fail: function (res) {
        wx.hideLoading();
        Toast("模板下载失败");
      },
      complete: function (res) {
        wx.hideLoading();
      },
    })
  },

  downFile: function (e) {
    let index = e.currentTarget.dataset.index;
    let guid = this.data.cs_confirm_file_name_guids[index];
    let url = api.FileOssUrl + guid;
    wx.setClipboardData({
      data: url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功,请前往浏览器粘贴下载地址',
              icon: 'none',
            })
          }
        })
      }
    })
  },
  /**
   * 预览图片
   */
  previewImage: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: [imgList] // 需要预览的图片http链接列表
    })
  },
  //复制下载文件
  copyText: function (e) {
    let type = e.currentTarget.dataset.type;
    let url = "";
    if (type == "excel") {
      url = api.ImgUrl + "A015";
    } else {
      let index = e.currentTarget.dataset.index;
      let guid = this.data.cs_confirm_file_name_guids[index];
      url = api.FileOssUrl + guid;        
    }    
    wx.setClipboardData({
      data: url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功,请前往浏览器粘贴下载地址',
              icon: 'none',
            })
          }
        })
      }
    })
  },
})