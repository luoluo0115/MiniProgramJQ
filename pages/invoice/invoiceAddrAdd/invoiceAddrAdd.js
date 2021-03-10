var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
import province_list from '../../../utils/area.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaList: [],
    val: '选择/省/市/区',
    showArea: false,
    expressData: {
      im_cust_customer_id: 0,
      express_contact_name: '',
      express_contact_phone: '',
      province: '',
      city: '',
      district: '',
      express_address: '',
      remark: ''
    },
    im_cust_customer_id: 0,
    cust_customer_name:'',
    type: "Add",
    listCustCustomer: [], //购买方信息
  },

  handleFieldChange: function (e) {
    let that = this;
    let fieldName = e.currentTarget.dataset.fieldname
    let newValue = e.detail.value;

    let field = 'expressData.' + fieldName;
    this.setData({
      [field]: newValue,
    })
  },

  bindSave: function (e) {
    const that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    let user_name = app.globalData.user_name;
    let im_cust_customer_id = that.data.im_cust_customer_id;

    let im_cust_express_id = that.data.expressData.im_cust_express_id;
    let express_contact_name = that.data.expressData.express_contact_name;
    let express_contact_phone = that.data.expressData.express_contact_phone;
    let express_address = that.data.expressData.express_address;
    let remark = that.data.expressData.remark;
    let province = that.data.expressData.province;
    let city = that.data.expressData.city;
    let district = that.data.expressData.district;
    
    if (im_cust_customer_id == null || im_cust_customer_id == undefined || im_cust_customer_id == 0) {
      Toast('客户名称(购买方)不能为空');
      return;
    }
    if (express_contact_name == null || express_contact_name == undefined || express_contact_name.length <= 0) {
      Toast('请输入联系人');
      return;
    }
    if (express_contact_phone == null || express_contact_phone == undefined || express_contact_phone.length <= 0) {
      Toast('请输入联系人电话');
      return;
    } else {
      var phonereg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/; //手机号码正则
      var telreg = /^[0][1-9]{2,3}-[0-9]{5,10}$/; //座机号正则
      if (phonereg.test(express_contact_phone) === false && telreg.test(express_contact_phone) === false) {
        Toast('电话号码格式不正确(座机例:021-XXXXXXXX)');
        return;
      }
    }
    if (province == null || province == undefined || province.length <= 0) {
      Toast('请输入省市区');
      return;
    }
    if (express_address == null || express_address == undefined || express_address.length <= 0) {
      Toast('请输入详细地址');
      return;
    }
    let formExpressData = {
      im_cust_express_id: im_cust_express_id,
      im_cust_customer_id: im_cust_customer_id,
      customer_info_id: customer_info_id,
      express_contact_name: express_contact_name,
      express_contact_phone: express_contact_phone,
      express_address: express_address,
      remark: remark,
      province: province,
      city: city,
      district: district,
    };
    util.request(api.BillApi.PostExpress, {
      formExpressData: formExpressData,
      cid: customer_info_id,
      curr_month: curr_month,
      user_name: user_name
    }, 'POST').then(function (res) {
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        wx.navigateBack({
          delta: 1,
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })
  },


  onConfirm(val) {
    let selectVal = `${val.detail.values[0].name}${val.detail.values[1].name}${val.detail.values[2].name}`
    let province = val.detail.values[0].name;
    let city = val.detail.values[1].name;
    let district = val.detail.values[2].name;
    this.setData({
      showArea: false,
      val: selectVal,
      ['expressData.province']: province,
      ['expressData.city']: city,
      ['expressData.district']: district,
    })
  },
  selectArea() {
    this.setData({
      showArea: true,
      areaList: province_list
    })
  },
  onClose() {
    this.setData({
      showArea: false
    });
  },
  cancel() {
    this.setData({
      showArea: false
    });
  },
  //下拉框客户名称(购买方)
  bindCustCustomerChange: function (e) {
    let idx = e.currentTarget.dataset.idx;
    this.setData({
      im_cust_customer_id: this.data.listCustCustomer[e.detail.value].im_cust_customer_id,
      cust_customer_name:this.data.listCustCustomer[e.detail.value].customer_name,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let im_cust_customer_id = options.im_cust_customer_id;
    let type = options.type;
    if (options.im_cust_customer_id) {
      that.setData({
        im_cust_customer_id: options.im_cust_customer_id,
        type: options.type,
      });
    }
    if (options.item) {
      let expressData = JSON.parse(options.item);
      that.setData({
        expressData: expressData,
        val: expressData.province + expressData.city + expressData.district,
      });
    }
    if (type == "Edit" || type == "EditAll") {
      wx.setNavigationBarTitle({
        title: '修改地址'
      });
    } else {
      wx.setNavigationBarTitle({
        title: '新增地址'
      });
    }
    that.Init();
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

  Init: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var data = {
      customer_info_id: customer_info_id
    }
    //下拉框购买方
    util.request(api.BillApi.QueryCustCustomerList,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          listCustCustomer: res.data.data
        });
      } else {
        that.setData({
          listCustCustomer: []
        });
      }
    })
  },
})