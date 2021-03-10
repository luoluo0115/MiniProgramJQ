// pages/me/authorization/authorization.js
const app = getApp()
var api = require('../../../config/api.js');
var util = require('../../../utils/util.js');
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    tabs: 0,
    imgPath: '', //图片路径
    imgName: '', //图片名称
    resultList: {
      id_type: '居民身份证'
    },
    resultShow: false,
    enterprise_name: '', //企业名称
    legal_person: '', //法人姓名
    phone: '', //法人手机号
    smscode: '', //输入验证码
    username: '', //申请人
    syscode: '', //验证码
    isClick: false, //获取验证码按钮，默认允许点击
    btntext: '获取验证码',
    custList: [], //员工申请授权列表
    verifyCustList: [], //认证公司列表
    license_verify_id: 0,
    btnDisabled: false, //禁用申请授权按钮    
    idTypeList: ['居民身份证', '护照', '港澳通行证', '台湾通行证'],
  },

  onChange(event) {
    if (event.detail.title == '公司认证') {
      this.QueryVerifyInfo();
    } else if (event.detail.title == '授权申请') {
      this.QueryVerifyCustList();
    }
  },
  bindIdTypeChange: function (e) {
    this.setData({
      ['resultList.id_type']: this.data.idTypeList[e.detail.value],
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
        //限制文件大小
        if (size > 2097152) {
          wx.showToast({
            title: '文件大小不能超过2MB',
            icon: "none",
            duration: 2000,
            mask: true
          })
        } else {
          that.setData({
            imgPath: res.tempFilePaths,
          })
          that.uploadImg();
        }
      },
      fail: function () {
        wx.showToast({
          title: '文件上传失败!请不要选择原图,文件大小不能超过2MB',
          mask: true
        })
      },
      complete: function () {}
    })
  },
  uploadImg: function () {
    let that = this;
    if (that.data.imgPath == '') {
      Toast('请选择营业执照上传');
      return;
    }

    let customer_info_id = app.globalData.curr_customer_info_id;
    let customer_name = app.globalData.curr_customer_name;
    let account_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let url = api.PostBusinesslicense + '?user_id=' + user_id + "&user_name=" + user_name;
    Toast.loading({
      mask: true,
      duration: 0,
      message: '营业执照识别中...'
    });
    wx.uploadFile({
      url: url,
      filePath: that.data.imgPath[0],
      name: 'file',
      header: {
        "Content-Type": "multipart/form-data", //记得设置
        'Authorization': 'Bearer ' + wx.getStorageSync('qh_access_token') //设置验证
      },
      formData: {
        'cid': customer_info_id,
        'account_month': account_month,
        'user_id': user_id,
        'user_name': user_name
      },
      success: function (res) {
        Toast.clear()
        var result = JSON.parse(res.data);
        if (result.success == true) {
          let customer_name = result.enterprise_name;
          let license_verify_id = result.identityV;
          that.QueryIdentifyResults(license_verify_id);
          that.setData({
            resultShow: true,
            license_verify_id: license_verify_id,
          });
          Toast.success(result.msg);

        } else if (result.success == false) {
          if (result.status == 'N') {
            let customer_name = result.enterprise_name;
            let license_verify_id = result.identityV;
            that.setData({
              resultShow: true,
              license_verify_id: license_verify_id,
            });
            that.QueryIdentifyResults(license_verify_id);

          } else {
            Toast.fail(result.msg);
          }
        }
      },
      fail: function (res) {
        console.log(res);
      },
    })
  },

  QueryIdentifyResults: function (license_verify_id) {
    let that = this;
    util.request(api.QueryIdentifyResults, {
      openid: app.globalData.openid,
      user_id: app.globalData.user_id,
      license_verify_id: license_verify_id
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          resultList: res.data.resultList[0],
        });
      } else {
        that.setData({
          resultList: [],
        });

      }
    })
  },
  //开始认证
  goAuth: function (e) {

    const that = this;
    var user_id = app.globalData.user_id;
    var user_name = app.globalData.user_name;
    var legal_person = that.data.resultList.legal_person;
    var id_no = that.data.resultList.id_no;
    var license_verify_id = that.data.license_verify_id;
    if (legal_person == '') {
      wx.showToast({
        title: "法人代表人不能为空!"
      });
      return;
    }

    if (id_no == null || id_no == undefined || id_no.length <= 0) {
      wx.showToast({
        title: "请填写身份证号!"
      });
      return;
    } else {
      var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号码正则

      if (reg.test(id_no) === false) {
        wx.showToast({
          title: "身份证号格式不正确!"
        });
        return;
      }
    }
    if (license_verify_id == undefined || license_verify_id <= 0) {
      wx.showToast({
        title: "认证信息不齐全!"
      });
      return;
    }
    var data = {
      license_verify_id: license_verify_id,
      id_no: id_no,
      user_name: user_name,
      user_id: user_id,
      enterprise_name: that.data.resultList.enterprise_name,
    };
    util.request(api.PostUpdateVerifyId, data, 'POST').then(function (res) {
      console.log(res)
      if (res.data.success == true) {
        wx.navigateTo({
          url: '../certification/certification?id_no=' + id_no + '&legal_person=' + legal_person + '&license_verify_id=' + license_verify_id
        });
      } else {
        Toast(res.data.msg);
      }
    })
  },
  //提交审核
  goVerify: function (e) {
    const that = this;
    var user_id = app.globalData.user_id;
    var user_name = app.globalData.user_name;
    var legal_person = that.data.resultList.legal_person;
    var id_no = that.data.resultList.id_no;
    var id_type = that.data.resultList.id_type;
    var license_verify_id = that.data.license_verify_id;    
    if (license_verify_id <= 0) {
      Toast("未找到营业执照认证数据");
      return;
    }
    if (id_type.length <= 0) {
      Toast("请选择证件类型");
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认提交公司认证资料审核吗?',
      success: function (sm) {
        if (sm.confirm) {
          var data = {
            license_verify_id: license_verify_id,
            user_name: user_name,
            user_id: user_id,
            id_no: id_no,
            enterprise_name: that.data.resultList.enterprise_name,
          };
          util.request(api.PostSubmitAuditW, data, 'POST').then(function (res) {
            if (res.data.success == true) {              
              Toast(res.data.msg);
              wx.redirectTo({
                url: '../authorization/authorization'
              })
            } else {
              Toast(res.data.msg);
            }
          })
        } else if (sm.cancel) {}
      }
    })
  },
  idnoInput: function (e) {
    //获取输入身份证号
    this.setData({
      ['resultList.id_no']: e.detail
    })
  },
  enterprisenameInput: function (e) {
    //获取输入企业名称
    this.setData({
      enterprise_name: e.detail
    })
  },
  legalpersonInput: function (e) {
    //获取输入用户名
    this.setData({
      legal_person: e.detail
    })
  },
  phoneInput: function (e) {
    //获取输入手机号
    this.setData({
      phone: e.detail
    })
  },
  smscodeInput: function (e) {
    //获取输入验证码
    this.setData({
      smscode: e.detail
    })
  },
  usernameInput: function (e) {
    //获取输入申请人姓名
    this.setData({
      username: e.detail
    })
  },
  //获取验证码
  getCode: function () {
    let that = this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
    //提示
    if (that.data.enterprise_name == '' || that.data.enterprise_name == null) {
      const text = second => `请输入公司名称`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }
    if (that.data.legal_person == '' || that.data.legal_person == null) {
      const text = second => `请输入法人代表`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }
    if (that.data.phone == '' || that.data.phone == null) {
      const text = second => `请输入手机号`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else if (that.data.phone.length < 11) {
      const text = second => `输入手机号长度有误`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else if (!myreg.test(that.data.phone)) {
      const text = second => `输入手机号有误`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else {

      var _this = this
      //验证公司名称+公司法人
      util.request(api.VerifyConsistentUrl, {
        customer_name: that.data.enterprise_name,
        legal_person: that.data.legal_person,
        legal_phone: that.data.phone
      }, 'POST').then(function (res) {
        if (res.data.success) {

          //获取验证码
          var coden = 60 // 定义60秒的倒计时
          _this.setData({ // _this这里的作用域不同了
            btntext: '60后重新发送',
            isClick: true,
          })
          var codeV = setInterval(function () {
            _this.setData({ // _this这里的作用域不同了
              btntext: '重新获取(' + (--coden) + 's)',
            })
            if (coden == -1) { // 清除setInterval倒计时，这里可以做很多操作，按钮变回原样等
              clearInterval(codeV)
              _this.setData({
                btntext: '获取验证码',
                isClick: false
              })
            }
          }, 1000)

          //获取验证码
          util.request(api.PostVerifyUserCodeUrl, {
            openid: app.globalData.openid,
            user_name: app.globalData.user_name,
            user_id: app.globalData.user_id,
            user_phone: that.data.phone,
            customer_name: that.data.enterprise_name,
            legal_person: that.data.legal_person,
          }, 'POST').then(function (res) {
            console.log(res)
            //获取验证码成功
            that.setData({
              syscode: res.data.code,
              license_verify_id: res.data.identityV,
            })
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
          });
        }
      })
    }
  },
  //员工授权
  VerifyEmp: function () {
    let that = this;
    if (that.data.enterprise_name == '' || that.data.enterprise_name == null) {
      const text = second => `请输入公司名称`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }
    if (that.data.legal_person == '' || that.data.legal_person == null) {
      const text = second => `请输入法人代表`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }

    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
    if (that.data.phone == '' || that.data.phone == null || that.data.phone == undefined) {
      const text = second => `请输入手机号`;
      const toast = Toast({
        message: text(3)
      });
      return;
    } else {
      if (!myreg.test(that.data.phone)) {
        const text = second => `法人手机号码格式不正确`;
        const toast = Toast({
          message: text(3)
        });
        return;
      }
    }
    if (that.data.smscode == '' || that.data.smscode == null) {
      const text = second => `请输入验证码`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }
    if (that.data.syscode == '' || that.data.syscode == null) {
      const text = second => `请先获取验证码`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }
    if (that.data.smscode != that.data.syscode) {
      const text = second => `输入验证码不正确`;
      const toast = Toast({
        message: text(3)
      });
      return;
    };
    if (that.data.username == null || that.data.username == undefined || that.data.username.length <= 0) {
      const text = second => `请输入申请人姓名`;
      const toast = Toast({
        message: text(3)
      });
      return;
    }
    that.setData({
      btnDisabled: true
    })
    wx.showLoading({
      title: "授权申请...",
    })
    //提交
    util.request(api.PostVerifyEmpUrl, {
      openid: app.globalData.openid,
      applicant_name: that.data.username,
      legal_person: that.data.legal_person,
      customer_name: that.data.enterprise_name,
      verify_code: that.data.smscode,
      user_name: app.globalData.user_name,
      user_id: app.globalData.user_id,
      identityV: that.data.license_verify_id,
    }, 'POST').then(function (res) {
      if (res.data.success) {
        let cid = res.data.customer_info_id;
        wx.redirectTo({
          url: '../authorization/authorization?tabs=1&cid=' + cid
        });
        //that.QueryVerifyCustList();
        Toast.success(res.data.msg);
      } else {
        Toast.fail(res.data.msg);
      }
      that.setData({
        btnDisabled: false
      })
      wx.hideLoading();
    });
  },
  /**
   * 公司认证列表
   */
  QueryVerifyInfo: function () {
    let that = this;
    util.request(api.QueryVerifyInfo, {
      openid: app.globalData.openid,
      user_id: app.globalData.user_id,
      customer_info_id: app.globalData.curr_customer_info_id
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          verifyCustList: res.data.info,
        });
      } else {
        that.setData({
          verifyCustList: [],
        });
      }
    })

  },

  /**
   * 员工申请列表
   */
  QueryVerifyCustList: function () {

    let that = this;

    util.request(api.QueryVerifyEmp, {
      openid: app.globalData.openid,
      ui: app.globalData.user_id,
      cname: app.globalData.curr_customer_name
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          custList: res.data.dataList,
        });
      } else {
        that.setData({
          custList: [],
        });

      }
    })

  },
  /**
   * 删除公司认证
   */
  deleteVerify: function (e) {
    var self = this;
    var item = e.currentTarget.dataset.item;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let license_verify_id = item.license_verify_id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          var deleteData = {
            id: license_verify_id,
            user_name: user_name
          };
          console.log(deleteData)
          util.request(api.PostDeleteVerify, deleteData, 'POST').then(function (res) {
            if (res.data.success == true) {
              self.QueryVerifyInfo();
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
   * 未认证继续认证
   */
  verifyEdit: function (e) {
    let that = this;
    var item = e.currentTarget.dataset.item;
    that.setData({
      license_verify_id: item.license_verify_id,
      resultList: item,
      resultShow: true,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let tabs = options.tabs;
    if (tabs == 1) {
      this.setData({
        active: 1,
      })
    }
    //认证通过自动切到对应的公司
    if (options.cid) {
      let cid = options.cid;
      this.QueryUserCustomerList(cid);
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
    this.QueryVerifyInfo();
    this.QueryVerifyCustList();
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
    this.uploadIdTypeImg();
  },
  uploadIdTypeImg: function () {
    let that = this;    
    if (that.data.path == '') {
      Toast('请选择证件文件');
      return;
    }
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    var id_type = that.data.resultList.id_type;
    var license_verify_id = that.data.license_verify_id;
    let url = api.PostVerityIdTypeFile + '?ui=' + user_id + "&un=" + user_name + "&license_verify_id=" + license_verify_id + "&id_type=" + id_type;
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
        'license_verify_id': license_verify_id,
        'id_type': id_type
      },
      success: function (res) {
        Toast.clear()
        var result = JSON.parse(res.data);
        if (result.success == true) {
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

  /**
   * 查询当前公司
   */
  QueryUserCustomerList: function (cid) {
    let that = this;
    let customer_info_id = cid;
    util.request(api.QueryUserCustomerListUrl, //查询所有公司列表
      {
        openid: app.globalData.openid
      }, 'POST').then(function (res) {
      if (res.data.success == true) {
        app.globalData.customer_info_id_list = res.data.customerList;
        for (let i in app.globalData.customer_info_id_list) {
          if (customer_info_id == app.globalData.customer_info_id_list[i].customer_info_id) {
            app.globalData.index = i;
          }
        }
        console.log(app.globalData.index, 'index循环');
        let index = app.globalData.index;
        app.globalData.curr_customer_info_id = res.data.customerList[index].customer_info_id;
        app.globalData.curr_customer_name = res.data.customerList[index].customer_name;
      } else {
        app.globalData.customer_info_id_list = [];
        app.globalData.curr_customer_info_id = 0;
        app.globalData.curr_customer_name = '';
      }
    })
  },
})