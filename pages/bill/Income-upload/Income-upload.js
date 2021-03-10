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
    invoiceFileList:[],
    msg: '',
    FileOssUrl: api.FileOssUrl,
    src: "",
    is_up: false,
    filePath: '', //文件路径
    fileName: '', //文件名称

    zInvoiceQty:0,
    zInvoiceAmount:0,
    zInvoiceTax:0,
    pInvoiceQty:0,
    pInvoiceAmount:0,
    pInvoiceTax:0,
    InvoiceQty:0,
    InvoiceAmount:0,
    InvoiceTax:0,
  },
 
  //弹窗
  addUpload: function () {
    this.setData({
      showModal: true
    })
  },
 
  // 禁止屏幕滚动
  preventTouchMove: function () {
  },
 
  // 弹出层里面的弹窗
  close: function () {
    this.setData({
      showModal: false
    })
  },
  QueryInvoiceCount: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-","");
    util.request(api.BillApi.QueryInvoiceCount, {
      cid: customer_info_id,
      curr_month: curr_month,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        that.setData({
          zInvoiceQty:res.data.data.dt2[0].zys,
          zInvoiceAmount:res.data.data.dt2[0].zym,
          zInvoiceTax:res.data.data.dt2[0].zye,
          pInvoiceQty:res.data.data.dt3[0].zys,
          pInvoiceAmount:res.data.data.dt3[0].zym,
          pInvoiceTax:res.data.data.dt3[0].zye,
          InvoiceQty:res.data.data.dt[0].zys,
          InvoiceAmount:res.data.data.dt[0].zym,
          InvoiceTax:res.data.data.dt[0].zye,
        });
      } else {
        that.setData({
          zInvoiceQty:0,
          zInvoiceAmount:0,
          zInvoiceTax:0,
          pInvoiceQty:0,
          pInvoiceAmount:0,
          pInvoiceTax:0,
          InvoiceQty:0,
          InvoiceAmount:0,
          InvoiceTax:0,
        });
      }
    })
  },
  QueryInvoiceFile: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryInvoiceDetail, {
      cid: customer_info_id,
      curr_month: curr_month,
      pageIndex: 1,
      pageSize: 100
    }, 'POST').then(function (res) {
      if (res.data.list != null && res.data.list != '') {
        that.setData({
          invoiceFileList: res.data.list,
        });
      } else {
        that.setData({
          invoiceFileList: [],
          msg: '暂无数据'
        });
      }
    })

  },
  chooseImg() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {

        var size = res.tempFiles[0].size;
        var filename = res.tempFiles[0].name;
        var newfilename = filename + "";
        //限制了文件大小
        if (size > 4194304) {
          wx.showToast({
            title: '文件大小不能超过4MB！',
            icon: "none",
            duration: 2000,
            mask: true
          })
        } else {
          // tempFilePath可以作为img标签的src属性显示图片
          that.setData({
            src: res.tempFilePaths,
            is_up: true
          })
          that.uploadImg();
        }
      }
    })
  },
  uploadImg: function () {
    let that = this;
    if (that.data.src == '') {
      Toast('请选择发票上传');
      return;
    }

    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let account_month = app.globalData.curr_date.replace("-", "");
    let type = 0;
    let payCategory = '公司转账'; 
    let fytype = '';
    let payid = ''; 
    let payname = '';
    let invoice = "I";
    let paytype = "收入";   
    let url = api.BillApi.PostInvoiceUpload + "?cid=" + customer_info_id + "&cname=" + customer_name + "&invoice=" + invoice + "&type=0&payCategory=" + payCategory + "&fytype=" + fytype + "&payid=" + payid + "&payname=" + payname + "&paytype=" + paytype + "&account_month=" + account_month;
    Toast.loading({
      mask: false,
      duration: 0,
      message: '发票识别中...'
    });
    wx.uploadFile({
      url: url,
      filePath: that.data.src[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
      },
      formData: {
        'cid': customer_info_id,
        'cname': customer_name,
        'account_month': account_month,
        'type': type,
        'payCategory': payCategory,
        'fytype': fytype,
        'payid': payid,
        'payname': payname,
        'invoice': invoice,
        'paytype': paytype,
      },
      success: function (res) {
        console.log(res);
        var result = JSON.parse(res.data);
        console.log(result);
        if (result.success == true) {
          that.setData({
            showModal: false,
            src:''
          })
          Toast.success(result.msg);
          that.QueryInvoiceFile();
          that.QueryInvoiceCount();
        } else if (result.success == false) {
          Toast.fail(result.msg);
        }

      },
      fail: function (res) {
        console.log(res);
      },
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
        if (size > 4194304 || (newfilename.indexOf(".PDF") == -1 && newfilename.indexOf(".pdf") == -1)) { 
          wx.showToast({
            title: '文件大小不能超过4MB,格式必须为[PDF]！',
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
      Toast('请选择发票文件上传');
      return;
    }
    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let account_month = app.globalData.curr_date.replace("-", "");
    let type = 0;
    let payCategory = '公司转账'; 
    let fytype = '';
    let payid = ''; 
    let payname = '';
    let invoice = "I";
    let paytype = "收入";   
    let url = api.BillApi.PostInvoiceUpload + "?cid=" + customer_info_id + "&cname=" + customer_name + "&invoice=" + invoice + "&type=0&payCategory=" + payCategory + "&fytype=" + fytype + "&payid=" + payid + "&payname=" + payname + "&paytype=" + paytype + "&account_month=" + account_month;
    Toast.loading({
      mask: false,
      duration: 0,
      message: '发票文件上传中...'
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
        'type': type,
        'payCategory': payCategory,
        'fytype': fytype,
        'payid': payid,
        'payname': payname,
        'invoice': invoice,
        'paytype': paytype,
      },
      success: function (res) {
        var result = JSON.parse(res.data);
        if (result.success == true) {
          that.setData({
            showModal: false,
            filePath:''
          })
          Toast.success(result.msg);
          that.QueryInvoiceFile();
          that.QueryInvoiceCount();
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
   * 删除上传文件
   */
  deleteFile: function (event) {
    let that = this;
    let process_recv_file_id = event.currentTarget.dataset.id;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    wx.showModal({
      title: '提示',
      content: '确定删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          util.request(api.BillApi.PostInvoiceDelete, {
            cid: customer_info_id,
            curr_month: curr_month,
            fileid: process_recv_file_id
          }, 'POST').then(function (res) {
            if (res.data == true) {
              Toast.success("删除成功");
              that.QueryInvoiceFile();
              that.QueryInvoiceCount();
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      curr_status: wx.getStorageSync('curr_status'),
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
    this.QueryInvoiceFile();
    this.QueryInvoiceCount();
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
  }
})