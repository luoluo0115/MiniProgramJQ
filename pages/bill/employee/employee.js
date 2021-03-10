var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ArdDate: '', //入职日期
    resign_date: '',
    enabled: true,
    hr_employee_id: 0,
    emp_no: 0,
    //员工列表
    empList: {
      tax_deduct_amount: 5000
    },
    isEdit: 'add',
    info: {}, //下拉框列表
    salary_pay_method: '其它', //薪资发放方式
    identification_type: '居民身份证', //证件类型
  },

  changeArdDate(e) {
    this.setData({
      ArdDate: e.detail.value
    });
  },
  changeResignDate(e) {
    this.setData({
      resign_date: e.detail.value
    });
  },
  changeEnabled: function (e) {
    this.setData({
      enabled: e.detail.value
    });
  },
  goQuestion: function () {
    Toast('请填写正确的入职日期(入职日期不能大于申报月份),否则影响薪资申报记录错误!');
  },
  /**
   * 保存
   */
  bindSave: function (e) {
    const that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.split('-').join("");
    let user_id = app.globalData.user_id;
    let user_name = app.globalData.user_name;
    let hr_employee_id = that.data.hr_employee_id;
    let org_info_id = that.data.empList.org_info_id;
    let emp_no = that.data.emp_no;
    let emp_name = e.detail.value.emp_name;
    let ard_date = that.data.ArdDate;
    let resign_date = that.data.resign_date; //离职日期
    let identification_number = e.detail.value.identification_number;
    let identification_type = that.data.identification_type; //证件类型

    let mobile_phone = e.detail.value.mobile_phone;
    let salary_pay_method = that.data.salary_pay_method;
    let base_salary = e.detail.value.base_salary;
    let job_salary = e.detail.value.job_salary; //岗位工资
    let enabled = that.data.enabled;
    let tax_deduct_amount = that.data.empList.tax_deduct_amount;
    let remark = e.detail.value.remark;

    let housing_fund_base_amount = that.convertToZero(e.detail.value.housing_fund_base_amount);
    let social_insurance_base_amount = that.convertToZero(e.detail.value.social_insurance_base_amount);
    let personal_medical_insurance = that.convertToZero(e.detail.value.personal_medical_insurance);
    let personal_unemployment_insurance = that.convertToZero(e.detail.value.personal_unemployment_insurance);
    let personal_pension_insurance = that.convertToZero(e.detail.value.personal_pension_insurance);
    let personal_housing_fund = that.convertToZero(e.detail.value.personal_housing_fund);

    let children_edu_deduct_amount = that.convertToZero(e.detail.value.children_edu_deduct_amount);
    let housing_rent_deduct_amount = that.convertToZero(e.detail.value.housing_rent_deduct_amount);
    let loan_interest_deduct_amount = that.convertToZero(e.detail.value.loan_interest_deduct_amount);
    let support_elder_deduct_amount = that.convertToZero(e.detail.value.support_elder_deduct_amount);
    let diploma_edu_deduct_amount = that.convertToZero(e.detail.value.diploma_edu_deduct_amount);
    let vocational_edu_deduct_amount = that.convertToZero(e.detail.value.vocational_edu_deduct_amount);


    if (emp_name == "" || emp_name == null) {
      wx.showModal({
        title: '提示',
        content: '请填写员工名称',
        showCancel: false
      })
      return
    }
    if (ard_date == "" || ard_date == null) {
      wx.showModal({
        title: '提示',
        content: '入职日期不能为空',
        showCancel: false
      })
      return
    }
    if (identification_type == null || identification_type == undefined || identification_type.length <= 0) {
      Toast("请选择证件类型");
      return;
    }
    if (identification_number == undefined || identification_number == null || identification_number.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请填写身份证号码',
        showCancel: false
      })
      return
    } else {
      if (identification_type == "居民身份证") {
        //var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号码正则
        var regIdNo = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/; //身份证号码正则      
        if (regIdNo.test(identification_number) === false) {
          wx.showModal({
            title: '提示',
            content: '身份证号格式不正确',
            showCancel: false
          })
          return;
        }
      }
    }
    if (mobile_phone.length <= 0 || mobile_phone == null || mobile_phone == undefined) {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    } else {
      var regPhone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}|(19[0-9]{1})))+\d{8})$/;
      if (!regPhone.test(mobile_phone)) {
        wx.showModal({
          title: '提示',
          content: '手机号码格式不正确',
          showCancel: false
        })
        return
      }
    }
    if (base_salary == "" || base_salary == null) {
      wx.showModal({
        title: '提示',
        content: '请填写基本工资',
        showCancel: false
      })
      return
    }
    if (loan_interest_deduct_amount > 0 && housing_rent_deduct_amount > 0) {
      wx.showModal({
        title: '提示',
        content: '租房租金抵扣和住房贷款抵扣不能同时享用',
        showCancel: false
      })
      return
    }

    let sex = this.IdCard(identification_number, 2);
    let birthday_date = this.IdCard(identification_number, 1);
    let nationality = "中国";
    let taxpayer_type = "居民";
    let income_category = "月工资";

    var amount = social_insurance_base_amount;
    let ent_pension_insurance = 0;
    let ent_medical_insurance = 0;
    let ent_unemployment_insurance = 0;
    let ent_maternity_insurance = 0;
    let ent_injury_insurance = 0;
    if (social_insurance_base_amount != "") {
      ent_pension_insurance = Math.ceil(amount * 0.16 * 10) / 10;
      ent_medical_insurance = Math.ceil(amount * 0.095 * 10) / 10;
      ent_unemployment_insurance = Math.ceil(amount * 0.005 * 10) / 10;
      ent_maternity_insurance = Math.ceil(amount * 0.01 * 10) / 10;
      ent_injury_insurance = Math.ceil(amount * 0.0016 * 10) / 10;
    }
    let ent_housing_fund = 0;
    if (housing_fund_base_amount != "") {
      ent_housing_fund = Math.ceil((housing_fund_base_amount * 0.07).toFixed(1));
    }

    let formData = {
      hr_employee_id: hr_employee_id,
      org_info_id: org_info_id,
      emp_no: emp_no,
      emp_name: emp_name,
      customer_info_id: customer_info_id,
      income_category: income_category,
      ard_date: ard_date,
      resign_date: resign_date,
      identification_number: identification_number,
      mobile_phone: mobile_phone,
      salary_pay_method: salary_pay_method,
      enabled: enabled,
      sex: sex,
      birthday_date: birthday_date,
      nationality: nationality,
      identification_type: identification_type,
      taxpayer_type: taxpayer_type,

      tax_deduct_amount: tax_deduct_amount,
      base_salary: base_salary,
      job_salary: job_salary,
      remark: remark,

      personal_medical_insurance: personal_medical_insurance,
      personal_unemployment_insurance: personal_unemployment_insurance,
      personal_pension_insurance: personal_pension_insurance,
      personal_housing_fund: personal_housing_fund,
      ent_medical_insurance: ent_medical_insurance,
      ent_unemployment_insurance: ent_unemployment_insurance,
      ent_pension_insurance: ent_pension_insurance,
      ent_maternity_insurance: ent_maternity_insurance,
      ent_injury_insurance: ent_injury_insurance,
      ent_housing_fund: ent_housing_fund,

      housing_fund_base_amount: housing_fund_base_amount,
      social_insurance_base_amount: social_insurance_base_amount,

      children_edu_deduct_amount: children_edu_deduct_amount,
      housing_rent_deduct_amount: housing_rent_deduct_amount,
      loan_interest_deduct_amount: loan_interest_deduct_amount,
      support_elder_deduct_amount: support_elder_deduct_amount,
      diploma_edu_deduct_amount: diploma_edu_deduct_amount,
      vocational_edu_deduct_amount: vocational_edu_deduct_amount
    };
    util.request(api.BillApi.PostEmployee, {
      formdata: formData,
      cid: customer_info_id,
      curr_month: curr_month,
      ui: user_id,
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        Toast.success('保存成功!');
        wx.redirectTo({
          url: '/pages/bill/salary/salary?tabs=1',
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    var date = util.formatDataTime(new Date());
    that.setData({
      ArdDate: date,
    });
    that.init();
    if (options.item) {
      that.setData({
        empList: JSON.parse(options.item),
        isEdit: options.type
      });
      that.setData({
        hr_employee_id: that.data.empList.hr_employee_id,
        ArdDate: that.data.empList.ard_date,
        enabled: that.data.empList.enabled,
        resign_date: that.data.empList.resign_date,
        identification_type: that.data.empList.identification_type,
      });
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


  bindPayMethodChange: function (e) {
    this.setData({
      salary_pay_method: this.data.info.salaryPayMethodList[e.detail.value].code_name,
    })
  },
  bindIdentificationTypeChange: function (e) {
    this.setData({
      identification_type: this.data.info.identityList[e.detail.value].code_name,
    })
  },
  baseSalaryChange: function (e) {
    var that = this;
    let base_salary = e.detail.value;
    let housing_fund_base_amountV2 = 'empList.housing_fund_base_amount';
    let social_insurance_base_amountV2 = 'empList.social_insurance_base_amount';
    that.setData({
      [housing_fund_base_amountV2]: base_salary,
      [social_insurance_base_amountV2]: base_salary
    })

    //社保
    let social_insurance_base_amount = that.data.empList.social_insurance_base_amount;
    let personal_pension_insurance = 'empList.personal_pension_insurance';
    let personal_medical_insurance = 'empList.personal_medical_insurance';
    let personal_unemployment_insurance = 'empList.personal_unemployment_insurance';
    this.setData({
      [personal_pension_insurance]: Math.ceil(social_insurance_base_amount * 0.08 * 10) / 10,
      [personal_medical_insurance]: Math.ceil(social_insurance_base_amount * 0.02 * 10) / 10,
      [personal_unemployment_insurance]: Math.ceil(social_insurance_base_amount * 0.005 * 10) / 10,
    })
    //公积金
    let housing_fund_base_amount = that.data.empList.housing_fund_base_amount;
    let personal_housing_fund = 'empList.personal_housing_fund';
    this.setData({
      [personal_housing_fund]: Math.ceil((housing_fund_base_amount * 0.07).toFixed(1))
    })
  },

  /**
   * 转换空字符
   */
  convertToZero: function (num) {
    if (num == null || num == "" || num == undefined) {
      return 0;
    }
    return parseFloat(num);
  },
  /**
   * 计算社保
   */
  insuranceChange: function (e) {
    let social_insurance_base_amount = e.detail.value;

    var personal_pension_insurance = 'empList.personal_pension_insurance';
    var personal_medical_insurance = 'empList.personal_medical_insurance';
    var personal_unemployment_insurance = 'empList.personal_unemployment_insurance';

    this.setData({
      [personal_pension_insurance]: Math.ceil(social_insurance_base_amount * 0.08 * 10) / 10,
      [personal_medical_insurance]: Math.ceil(social_insurance_base_amount * 0.02 * 10) / 10,
      [personal_unemployment_insurance]: Math.ceil(social_insurance_base_amount * 0.005 * 10) / 10,
    })
  },
  /**
   * 计算公积金
   */
  housingChange: function (e) {
    let housing_fund_base_amount = e.detail.value;
    var personal_housing_fund = 'empList.personal_housing_fund';
    this.setData({
      [personal_housing_fund]: Math.ceil((housing_fund_base_amount * 0.07).toFixed(1))
    })
  },
  /**
   * 初始化下拉框
   */
  init: function () {
    var that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");
    var data = {
      cid: customer_info_id,
      account_month: account_month
    }
    util.request(api.BillApi.GetCondition,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          info: res.data.info
        });
      } else {
        that.setData({
          info: []
        });
      }
    })

    util.request(api.BillApi.GetEmpNO,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          emp_no: res.data.emp_no
        });
      } else {
        that.setData({
          emp_no: 0
        });
      }
    })
  },
  /**
   * 根据身份证号获取 性别、出生日期、年龄
   */
  IdCard: function (UUserCard, num) {
    if (num == 1) {
      //获取出生日期
      var birth = UUserCard.substring(6, 10) + "-" + UUserCard.substring(10, 12) + "-" + UUserCard.substring(12, 14);
      return birth;
    }
    if (num == 2) {
      //获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 == 1) {
        //男
        return "男";
      } else {
        //女
        return "女";
      }
    }
    if (num == 3) {
      //获取年龄
      var myDate = new Date();
      var month = myDate.getMonth() + 1;
      var day = myDate.getDate();
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1;
      if (UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) == month && UUserCard.substring(12, 14) <= day) {
        age++;
      }
      return age;
    }
  },


})