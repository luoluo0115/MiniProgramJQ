var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    curr_status:'',
    showModal: false,
    invoiceFileList: [],
    msg: '',
    FileOssUrl: api.FileOssUrl,
    src: "",
    filePath: '', //文件路径
    fileName: '', //文件名称
    is_up: false,
    pageIndex: 1,
    pageSize: 100,
    type: '1',
    type_desc: '增值税专用发票汇总',

    zInvoiceQty: 0,
    zInvoiceAmount: 0,
    zInvoiceTax: 0,
    pInvoiceQty: 0,
    pInvoiceAmount: 0,
    pInvoiceTax: 0,
    InvoiceQty: 0,
    InvoiceAmount: 0,
    InvoiceTax: 0,
  },

  addUpload: function () {
    this.setData({
      showModal: true
    })
  },
  //关闭
  close: function () {
    this.setData({
      showModal: false
    })
  },
  QueryInvoiceCount: function (type) {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryInvoiceCount, {
      cid: customer_info_id,
      curr_month: curr_month,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        if (type == 2) {
          that.setData({
            zInvoiceQty: res.data.data.dt3[0].zys,
            zInvoiceAmount: res.data.data.dt3[0].zym,
            zInvoiceTax: res.data.data.dt3[0].zye,

            InvoiceQty: res.data.data.dt[0].zys,
            InvoiceAmount: res.data.data.dt[0].zym,
            InvoiceTax: res.data.data.dt[0].zye,
          });
        } else {
          that.setData({
            zInvoiceQty: res.data.data.dt2[0].zys,
            zInvoiceAmount: res.data.data.dt2[0].zym,
            zInvoiceTax: res.data.data.dt2[0].zye,
            pInvoiceQty: res.data.data.dt3[0].zys,
            pInvoiceAmount: res.data.data.dt3[0].zym,
            pInvoiceTax: res.data.data.dt3[0].zye,
            InvoiceQty: res.data.data.dt[0].zys,
            InvoiceAmount: res.data.data.dt[0].zym,
            InvoiceTax: res.data.data.dt[0].zye,
          });
        }
      } else {
        that.setData({
          zInvoiceQty: 0,
          zInvoiceAmount: 0,
          zInvoiceTax: 0,
          pInvoiceQty: 0,
          pInvoiceAmount: 0,
          pInvoiceTax: 0,
          InvoiceQty: 0,
          InvoiceAmount: 0,
          InvoiceTax: 0,
        });
      }
    })
  },
  QueryInvoiceFile: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryInvoiceDetailHZ, {
      cid: customer_info_id,
      curr_month: curr_month,
      type: that.data.type,
      pageIndex: 1,
      pageSize: 100
    }, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success != null && res.data.list != '') {
        that.setData({
          invoiceFileList: res.data.list,
          msg: ''
        });
      } else {
        that.setData({
          invoiceFileList: [],
          msg: '暂无数据'
        });
      }
    })

  },
  chooseFile() {
    let that = this;
    wx.chooseMessageFile({
      count: 1, //选择文件的数量
      type: 'file', //选择文件的类型,这里只允许上传文件.还有视频,图片,或者都可以
      success(res) {
        var size = res.tempFiles[0].size;
        var filename = res.tempFiles[0].name;
        var newfilename = filename + "";
        console.log(newfilename)
        //限制了文件大小和具体文件类型
        if (size > 4194304 || (newfilename.indexOf(".xlsx") == -1 && newfilename.indexOf(".xls") == -1 && newfilename.indexOf(".csv") == -1)) {
          wx.showToast({
            title: '文件大小不能超过4MB,格式必须为[xlsx|xls|csv]！',
            icon: "none",
            duration: 2000,
            mask: true
          })
        } else {
          that.setData({
            filePath: res.tempFiles[0].path, //文件的路径
            fileName: filename, //文件名称
          })
          that.uploadFile();
        }
      }
    })
  },

  uploadFile: function () {
    let that = this;
    if (that.data.filePath == '') {
      Toast('请选择发票汇总表上传');
      return;
    }

    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;;
    let account_month = app.globalData.curr_date.replace("-", "");

    let url = api.BillApi.PostInvoiceExcelUpload + "?cid=" + customer_info_id + "&cname=" + customer_name + "&account_month=" + account_month;
    Toast.loading({
      mask: false,
      duration: 0,
      message: '文件上传中...'
    });
    wx.uploadFile({
      url: url,
      filePath: that.data.filePath,
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
      },
      formData: {
        'cid': customer_info_id,
        'cname': customer_name,
        'account_month': account_month,
      },
      success: function (res) {
        console.log(res);
        var result = JSON.parse(res.data);
        console.log(result);
        if (result.success == true) {
          that.setData({
            showModal: false,
            filePath: ''
          })
          that.QueryInvoiceFile();
          that.QueryInvoiceCount(that.data.type);
          Toast.success(result.msg);
        } else if (result.success == false) {
          Toast.fail(result.msg);
        }

      },
      fail: function (res) {
        console.log(res);
      },
    })
  },
  /**
   * 清除数据
   */
  deleteFileData: function (event) {
    let that = this;
    let type = that.data.type;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    console.log(type)
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          util.request(api.BillApi.PostInvoiceDeleteHz, {
            cid: customer_info_id,
            curr_month: curr_month,
            code: type
          }, 'POST').then(function (res) {
            if (res.data.success == true) {
              that.QueryInvoiceFile();
              that.QueryInvoiceCount(that.data.type);
              Toast.success("删除成功");
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
    var type = options.type
    var type_desc = '增值税专用发票汇总';
    if (type == 2) {
      type_desc = "增值税普通发票汇总";
    }
    this.setData({
      type: type,
      type_desc: type_desc,
      curr_status: wx.getStorageSync('curr_status'),
    })
    this.QueryInvoiceFile();
    this.QueryInvoiceCount(type);
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
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})