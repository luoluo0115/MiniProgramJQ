const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    path: "",
    is_up: false,
    filePath: '', //文件路径
    fileName: '', //文件名称
    expense_name: '',
    expense_desc: '',
    payCategory: '个人垫付', //支付类型
    emp_show: true,
    listEmp: {},
    empIndex: 0,
    hr_employee_id: 0,
    emp_name: '',
    fileList: [],
    radio: 0,
    type: "0",
    buttonClicked: false,
    curr_status: wx.getStorageSync('curr_status'), //当前做账状态
    msg: '',
    FileOssUrl: api.FileOssUrl,
    expendFileList: [],
    upload_from:'O',//文件上传来自界面 V:进行认证 O:其他
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = JSON.parse(options.data)
    let upload_from = "O";
    if (options.upload_from) {
      upload_from = options.upload_from;
    }
    let expense_name = data.expense_name;
    let expense_desc = data.expense_desc;
    this.setData({
      expense_name: expense_name,
      expense_desc: expense_desc,
      upload_from: upload_from,
    })
    wx.setNavigationBarTitle({
      title: '上传' + data.expense_name
    });
    this.QueryExpendFile();
    this.init();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
      curr_status: wx.getStorageSync('curr_status'),
    })
  },

  radioChange: function (e) {
    this.setData({
      payCategory: e.detail.value,
      emp_show: true,
    })
  },
  radioHTChange: function (e) {
    this.setData({
      type: e.detail.value,
    })
  },
  bindEmpNameChange: function (e) {
    if (this.data.listEmp != null) {
      this.setData({
        empIndex: e.detail.value,
        emp_name: this.data.listEmp[e.detail.value].emp_name,
        hr_employee_id: this.data.listEmp[e.detail.value].hr_employee_id
      })
    }
  },

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
    //this.uploadImg();
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
  uploadFile: function (event) {
    let that = this;
    if (that.data.filePath == '') {
      Toast('请选择PDF发票上传');
      return;
    }
    if (that.data.expense_name == '') {
      Toast('请先选择费用类型');
      return;
    }
    if (that.data.payCategory == '') {
      Toast('请选择支付类型');
      return;
    }
    if (that.data.payCategory == "个人垫付") {
      if (that.data.emp_name == null || that.data.emp_name == '' || that.data.hr_employee_id <= 0) {
        Toast("请选择垫付人员");
        return;
      }
    } else {
      that.setData({
        emp_name: '',
        hr_employee_id: 0,
      })
    }
    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let account_month = app.globalData.curr_date.replace("-", "");
    let type = that.data.type;
    var payCategory = that.data.payCategory; //支付方式
    let fytype = that.data.expense_name; //费用类型
    let payid = that.data.hr_employee_id; //用户ID
    let payname = that.data.emp_name; //用户姓名
    let invoice = "O";
    let paytype = "费用";
    let upload_from = that.data.upload_from;
    let url = api.BillApi.PostRecognition + "?cid=" + customer_info_id + "&cname=" + customer_name + "&invoice=" + invoice + "&type=0&payCategory=" + payCategory + "&fytype=" + fytype + "&payid=" + payid + "&payname=" + payname + "&paytype=" + paytype + "&account_month=" + account_month+ "&upload_from=" + upload_from;
    that.setData({
      buttonClicked: true
    })
    wx.showLoading({
      title: "票据识别中...",
      mask: true,
    })
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
        'upload_from': upload_from,
      },
      success: function (res) {
        console.log(res);
        var result = JSON.parse(res.data);
        if (result.success == true) {
          Toast.success(result.msg);
          // setTimeout(function (e) {
          //   wx.navigateBack({
          //     delta: 1
          //   });
          // }, 1000)
          that.QueryExpendFile();
        } else {
          Toast.fail(result.msg);
        }
        that.setData({
          fileList: [],
          filePath: '',
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
        that.setData({
          buttonClicked: false
        })
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
            path: res.tempFilePaths,
            is_up: true
          })
          that.uploadImg();
        }
      }
    })
  },
  uploadImg: function (event) {
    let that = this;
    if (that.data.path == '') {
      Toast('请选择票据上传');
      return;
    }
    if (that.data.expense_name == '') {
      Toast('请先选择费用类型');
      return;
    }
    if (that.data.payCategory == '') {
      Toast('请选择支付类型');
      return;
    }
    if (that.data.payCategory == "个人垫付") {
      if (that.data.emp_name == null || that.data.emp_name == '' || that.data.hr_employee_id <= 0) {
        Toast("请选择垫付人员");
        return;
      }
    } else {
      that.setData({
        emp_name: '',
        hr_employee_id: 0,
      })
    }
    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let account_month = app.globalData.curr_date.replace("-", "");
    let type = that.data.type;
    var payCategory = that.data.payCategory; //支付方式
    let fytype = that.data.expense_name; //费用类型
    let payid = that.data.hr_employee_id; //用户ID
    let payname = that.data.emp_name; //用户姓名
    let invoice = "O";
    let paytype = "费用";
    let upload_from = that.data.upload_from;
    let url = api.BillApi.PostRecognition + "?cid=" + customer_info_id + "&cname=" + customer_name + "&invoice=" + invoice + "&type=0&payCategory=" + payCategory + "&fytype=" + fytype + "&payid=" + payid + "&payname=" + payname + "&paytype=" + paytype + "&account_month=" + account_month+ "&upload_from=" + upload_from;
    // Toast.loading({
    //   mask: false,
    //   duration: 0,
    //   message: '票据识别中...'
    // });
    that.setData({
      buttonClicked: true
    })
    wx.showLoading({
      title: "票据识别中..."
    })
    wx.uploadFile({
      url: url,
      filePath: that.data.path[0],
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
        'upload_from': upload_from,
      },
      success: function (res) {
        console.log(res);
        var result = JSON.parse(res.data);
        if (result.success == true) {
          Toast.success(result.msg);
          // setTimeout(function (e) {
          //   wx.navigateBack({
          //     delta: 1
          //   });
          // }, 1000)
          that.QueryExpendFile();
        } else {
          Toast.fail(result.msg);
        }
        that.setData({
          fileList: [],
          path: '',
        });
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        wx.hideLoading();
        that.setData({
          buttonClicked: false
        })
      }
    })
  },
  /**
   * 初始化下拉框
   */
  init: function () {
    var that = this;
    var customer_info_id = app.globalData.curr_customer_info_id;
    var curr_month = app.globalData.curr_date.replace("-", "");
    var user_name = app.globalData.user_name;
    var data = {
      cid: customer_info_id,
      account_month: curr_month,
      un: user_name
    }
    util.request(api.BillApi.QueryExpendEmp,
      data, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        that.setData({
          listEmp: res.data.data
        });
      } else {
        that.setData({
          listEmp: []
        });
      }
      //设置默认人员
      that.setData({
        emp_name: that.data.listEmp[that.data.empIndex].emp_name,
        hr_employee_id: that.data.listEmp[that.data.empIndex].hr_employee_id
      })
    });
  },
  /**
   * 查询支出费用类别
   */
  QueryExpendFile: function () {
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    util.request(api.BillApi.QueryExpendFileDetail, {
      cid: customer_info_id,
      curr_month: curr_month,
      type: that.data.expense_name,
      pageIndex: 1,
      pageSize: 100
    }, 'POST').then(function (res) {
      if (res.data.list != null && res.data.list != '') {
        that.setData({
          expendFileList: res.data.list,
        });
      } else {
        that.setData({
          expendFileList: [],
          msg: '暂无数据'
        });
      }
    })

  },
  /**
   * 删除上传文件
   */
  deleteFile: function (event) {
    let that = this;
    let item = event.currentTarget.dataset.item;
    let process_recv_file_id = event.currentTarget.dataset.id;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    if (item.file_upload_from_ui == that.data.upload_from) {
      wx.showModal({
        title: '提示',
        content: '确定删除吗？',
        success: function (sm) {
          if (sm.confirm) {
            util.request(api.BillApi.PostExpendFileDelete, {
              cid: customer_info_id,
              curr_month: curr_month,
              fileid: process_recv_file_id
            }, 'POST').then(function (res) {
              if (res.data == true) {
                Toast.success("删除成功");
                that.QueryExpendFile();
  
              } else {
                Toast.fail(res.data.msg);
              }
            })
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else{
      Toast('进项认证上传的票据不能在此处删除');
    }
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


})