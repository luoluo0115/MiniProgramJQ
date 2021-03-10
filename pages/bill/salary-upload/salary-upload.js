var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pathV1: '',//月工资
    filenameV1: '',
    is_upV1:false,

    pathV2: '',//劳务
    filenameV2: '',
    is_upV2:false,

    pathV3: '',//年终奖
    filenameV3: '',
    is_upV3:false,
    confirm_salary_user_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  uploadAction(e) {
    let that = this;
    var num = e.currentTarget.dataset.num;    
    console.log(num)
    wx.chooseMessageFile({
      count: 1, //能选择文件的数量
      type: 'file', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      success(res) {
        var size = res.tempFiles[0].size;
        var filename = res.tempFiles[0].name;
        var newfilename = filename + "";
        console.log(newfilename)
        console.log(size)
        //限制了文件大小和具体文件类型
        if (size > 4194304 || (newfilename.indexOf(".xlsx") == -1 && newfilename.indexOf(".xls") == -1)) { 
          wx.showToast({
            title: '文件大小不能超过4MB,格式必须为[xlsx|xls]！',
            icon: "none",
            duration: 2000,
            mask: true
          })
        } else {
          if(num == "1")
          {
            that.setData({
              pathV1: res.tempFiles[0].path, //文件的路径
              filenameV1: filename, //文件名称
              is_upV1: true
            })
            console.log('111'+that.data.filenameV1)
          }else if(num == "2")
          {
            that.setData({
              pathV2: res.tempFiles[0].path, //文件的路径
              filenameV2: filename, //文件名称
              is_upV2: true
            })

          }else if(num =="3")
          {
            that.setData({
              pathV3: res.tempFiles[0].path, //文件的路径
              filenameV3: filename, //文件名称
              is_upV3: true
            })
          }
        }
      }
    })
  },

  uploadFile: function (e) {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var num = e.currentTarget.dataset.num;
    let type ="每月薪资";
    let path ="";
    switch (num) {
      case "1":
          type = "每月薪资";
          path = that.data.pathV1;
          break;
      case "2":
          type = "劳务工资";
          path = that.data.pathV2;
          break;
      case "3":
          type = "年终奖金";
          path = that.data.pathV3;
          break;
      default:
          break;
    }

    if (path == '') {
      Toast('请选择'+type+'文件上传');
      return;
    }
    Toast.loading({
      mask: false,
      duration: 0,
      message: '上传中...'
    });
    wx.uploadFile({
      url: api.BillApi.SalaryUploadFile,  
      filePath: path,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
      },
      formData: {
        'openid': app.globalData.openid,
        'user_id': app.globalData.user_id
      },
      success: function (res) {
        console.log(res);
        var result = JSON.parse(res.data);
        console.log(result);
        if (result.success == true) {

          let SalaryFilePathGuid = result.guid;
          let SalaryFilePath = result.realSavePath;
          let type = type;
          let confirm_salary_user_id = that.data.confirm_salary_user_id;
          var data = {
            cid: customer_info_id,
            curr_month: account_month,
            SalaryFilePathGuid: SalaryFilePathGuid,
            SalaryFilePath: SalaryFilePath,
            type: type,
            confirm_salary_user_id: confirm_salary_user_id,
          }
          util.request(api.BillApi.PostHrEmployeeSalary,
            data, 'POST').then(function (res) {
            console.log(res)
            if (res.data.success == true) {
              Toast.success('上传成功');
              setTimeout(function (e) {
                wx.redirectTo({
                  url: '/pages/bill/salary/salary'
                });
              }, 2000)
            } else {
              Toast.fail(res.data.msg);
            }
          })
  
        } else if (result.success == false) {
          Toast.fail(result.code);
        }

      },
      fail: function (res) {
        console.log(res);
      },
    })
  },

})