var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    incomeCategoryList: [],
    listEmp: [],
    info: {},
    empIndex: 0,
    hr_employee_id: 0,
    emp_default: '请选择',
    salary_pay_method:'其它', 
    SalaryList: [],
    active: '月工资',
    income_category: '月工资',
    identification_type: '居民身份证',
    is_show_labour: true,
    is_show_salary: true,
    is_show_bonus: true,
    isEdit: 'add',
    hr_monthly_salary_id: 0,
  },
  onChange(event) {
    console.log(event, 'event')
    let that = this;
    let title = event.detail.title;
    if (title == '工资奖金') {
      that.setData({
        income_category: "月工资",
        active: "月工资",
      });
    } else if (title == '劳务报酬') {
      that.setData({
        active: "劳务报酬",
        income_category: "劳务报酬所得",
      });
    } else if (title == '年终奖') {
      that.setData({
        active: "年终奖",
        income_category: "数月奖金",
      });
    }
  },
  bindPayMethodChange: function (e) {
    this.setData({
      salary_pay_method: this.data.info.salaryPayMethodList[e.detail.value].code_name,
    })    
  },
  bindEmpNameChange: function (e) {
    console.log('picker emp 发生选择改变，携带值为', e);

    var base_salary = 'SalaryList.base_salary';
    var job_salary = 'SalaryList.job_salary';
    var mobile_phone = 'SalaryList.mobile_phone';
    var salary_pay_method = 'salary_pay_method';
    var children_edu_deduct_amount = 'SalaryList.children_edu_deduct_amount';
    var housing_rent_deduct_amount = 'SalaryList.housing_rent_deduct_amount';
    var loan_interest_deduct_amount = 'SalaryList.loan_interest_deduct_amount';
    var support_elder_deduct_amount = 'SalaryList.support_elder_deduct_amount';
    var diploma_edu_deduct_amount = 'SalaryList.diploma_edu_deduct_amount';
    var vocational_edu_deduct_amount = 'SalaryList.vocational_edu_deduct_amount';

    var social_insurance_base_amount = 'SalaryList.social_insurance_base_amount';
    var personal_medical_insurance = 'SalaryList.personal_medical_insurance';
    var personal_unemployment_insurance = 'SalaryList.personal_unemployment_insurance';
    var personal_pension_insurance = 'SalaryList.personal_pension_insurance';
    var housing_fund_base_amount = 'SalaryList.housing_fund_base_amount';
    var personal_housing_fund = 'SalaryList.personal_housing_fund';

    this.setData({
      empIndex: e.detail.value,
      emp_default: this.data.listEmp[e.detail.value].emp_name,
      hr_employee_id: this.data.listEmp[e.detail.value].hr_employee_id,

      [base_salary]:this.convertToZero(this.data.listEmp[e.detail.value].base_salary),
      [job_salary]: this.convertToZero(this.data.listEmp[e.detail.value].job_salary),
      [mobile_phone]: this.data.listEmp[e.detail.value].mobile_phone,
      [salary_pay_method]: this.data.listEmp[e.detail.value].salary_pay_method,
      [children_edu_deduct_amount]: this.data.listEmp[e.detail.value].children_edu_deduct_amount,
      [housing_rent_deduct_amount]: this.data.listEmp[e.detail.value].housing_rent_deduct_amount,
      [loan_interest_deduct_amount]: this.data.listEmp[e.detail.value].loan_interest_deduct_amount,
      [support_elder_deduct_amount]: this.data.listEmp[e.detail.value].support_elder_deduct_amount,
      [diploma_edu_deduct_amount]: this.data.listEmp[e.detail.value].diploma_edu_deduct_amount,
      [vocational_edu_deduct_amount]: this.data.listEmp[e.detail.value].vocational_edu_deduct_amount,

      [social_insurance_base_amount]: this.data.listEmp[e.detail.value].social_insurance_base_amount,
      [personal_medical_insurance]: this.data.listEmp[e.detail.value].personal_medical_insurance,
      [personal_unemployment_insurance]: this.data.listEmp[e.detail.value].personal_unemployment_insurance,
      [personal_pension_insurance]: this.data.listEmp[e.detail.value].personal_pension_insurance,
      [housing_fund_base_amount]: this.data.listEmp[e.detail.value].housing_fund_base_amount,
      [personal_housing_fund]: this.data.listEmp[e.detail.value].personal_housing_fund,
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
    let housing_fund_base_amountV2 = 'SalaryList.housing_fund_base_amount';
    let social_insurance_base_amountV2 = 'SalaryList.social_insurance_base_amount';
    that.setData({
      [housing_fund_base_amountV2]: base_salary,
      [social_insurance_base_amountV2]: base_salary
    })
    
    //社保
    let social_insurance_base_amount = that.data.SalaryList.social_insurance_base_amount;
    let personal_pension_insurance = 'SalaryList.personal_pension_insurance';
    let personal_medical_insurance = 'SalaryList.personal_medical_insurance';
    let personal_unemployment_insurance = 'SalaryList.personal_unemployment_insurance';
    this.setData({
      [personal_pension_insurance]: Math.ceil(social_insurance_base_amount * 0.08 * 10) / 10,
      [personal_medical_insurance]: Math.ceil(social_insurance_base_amount * 0.02 * 10) / 10,
      [personal_unemployment_insurance]: Math.ceil(social_insurance_base_amount * 0.005 * 10) / 10,
    })
    //公积金
    let housing_fund_base_amount = that.data.SalaryList.housing_fund_base_amount;
    let personal_housing_fund = 'SalaryList.personal_housing_fund';
    this.setData({
      [personal_housing_fund]: Math.ceil((housing_fund_base_amount * 0.07).toFixed(1))
    })
},
  //月工资
  bindSave: function (e) {
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    console.log(e, 'save')
    const that = this;
    let hr_monthly_salary_id = that.data.hr_monthly_salary_id;
    let hr_employee_id = that.data.hr_employee_id;
    let income_category = that.data.income_category;
    let base_salary = that.convertToZero(e.detail.value.base_salary);
    let job_salary = that.convertToZero(e.detail.value.job_salary);
    let oevrtime_salary = that.convertToZero(e.detail.value.oevrtime_salary);
    let bonus_salary = that.convertToZero(e.detail.value.bonus_salary);
    let allowance_salary = that.convertToZero(e.detail.value.allowance_salary);
    let deduct_salary = that.convertToZero(e.detail.value.deduct_salary);
    let mobile_phone = that.convertToZero(e.detail.value.mobile_phone);
    let salary_pay_method = that.data.salary_pay_method;
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

    
    if (hr_employee_id == "" || hr_employee_id <= 0) {
      wx.showModal({
        title: '提示',
        content: '请选择员工名称',
        showCancel: false
      })
      return
    }
    if (base_salary == "" || base_salary < 0) {
      wx.showModal({
        title: '提示',
        content: '请填写基本工资',
        showCancel: false
      })
      return
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
        return;
      }
    }

    if (loan_interest_deduct_amount > 0 && housing_rent_deduct_amount > 0) {
      wx.showModal({
        title: '提示',
        content: '租房租金抵扣和住房贷款抵扣不能同时享用',
        showCancel: false
      })
      return
    }

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
      hr_monthly_salary_id: hr_monthly_salary_id,
      hr_employee_id: hr_employee_id,
      customer_info_id: customer_info_id,
      income_category: income_category,
      base_salary: base_salary,
      job_salary: job_salary,
      oevrtime_salary: oevrtime_salary,
      bonus_salary: bonus_salary,
      allowance_salary: allowance_salary,
      deduct_salary: deduct_salary,
      mobile_phone: mobile_phone,
      remark: remark,
      expense_category: "管理",
      nationality: "中国",
      //salary_pay_method: "其它",
      salary_pay_method:salary_pay_method,
      taxpayer_type: "居民",

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
      back_social_insurance_months: 0,
      back__housing_fund_months: 0,
      back_personal_medical_insurance: 0,
      back_personal_unemployment_insurance: 0,
      back_personal_pension_insurance: 0,
      back_personal_housing_fund: 0,
      back_ent_medical_insurance: 0,
      back_ent_unemployment_insurance: 0,
      back_ent_pension_insurance: 0,
      back_ent_maternity_insurance: 0,
      back_ent_injury_insurance: 0,
      back_ent_housing_fund: 0,
      housing_fund_base_amount: housing_fund_base_amount,
      social_insurance_base_amount: social_insurance_base_amount,
      supp_personal_housing_fund: 0,
      supp_ent_housing_fund: 0,
      back_supp_personal_housing_fund: 0,
      backup_supp_ent_housing_fund: 0,
      income_amt: 0,
      income_tax: 0,
      tax_deduct_amount: 5000,
      children_edu_deduct_amount: children_edu_deduct_amount,
      housing_rent_deduct_amount: housing_rent_deduct_amount,
      loan_interest_deduct_amount: loan_interest_deduct_amount,
      support_elder_deduct_amount: support_elder_deduct_amount,
      diploma_edu_deduct_amount: diploma_edu_deduct_amount,
      vocational_edu_deduct_amount: vocational_edu_deduct_amount
    };

    util.request(api.BillApi.PostSalary, {
      formdata: formData,
      cid: customer_info_id,
      curr_month: curr_month
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        wx.redirectTo({
          url: '/pages/bill/salary/salary',
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })

  },
  //年终奖
  bindSaveBonus: function (e) {
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    console.log(e, 'save')
    const that = this;
    let hr_monthly_salary_id = that.data.hr_monthly_salary_id;
    let hr_employee_id = that.data.hr_employee_id;
    let income_category = that.data.income_category;
    let base_salary = that.convertToZero(e.detail.value.base_salary);
    let job_salary = that.convertToZero(e.detail.value.job_salary);
    let oevrtime_salary = that.convertToZero(e.detail.value.oevrtime_salary);
    let bonus_salary = that.convertToZero(e.detail.value.bonus_salary);
    let allowance_salary = that.convertToZero(e.detail.value.allowance_salary);
    let deduct_salary = that.convertToZero(e.detail.value.deduct_salary);
    let mobile_phone = that.convertToZero(e.detail.value.mobile_phone);
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

    console.log(personal_medical_insurance)
    if (hr_employee_id == "" || hr_employee_id <= 0) {
      wx.showModal({
        title: '提示',
        content: '请选择员工名称',
        showCancel: false
      })
      return
    }
    if (bonus_salary == "" || bonus_salary <= 0) {
      wx.showModal({
        title: '提示',
        content: '请填写奖金工资',
        showCancel: false
      })
      return
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
        return;
      }
    }

    if (loan_interest_deduct_amount > 0 && housing_rent_deduct_amount > 0) {
      wx.showModal({
        title: '提示',
        content: '租房租金抵扣和住房贷款抵扣不能同时享用',
        showCancel: false
      })
      return
    }

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
      hr_monthly_salary_id: hr_monthly_salary_id,
      hr_employee_id: hr_employee_id,
      customer_info_id: customer_info_id,
      income_category: income_category,
      base_salary: base_salary,
      job_salary: job_salary,
      oevrtime_salary: oevrtime_salary,
      bonus_salary: bonus_salary,
      allowance_salary: allowance_salary,
      deduct_salary: deduct_salary,
      mobile_phone: mobile_phone,
      remark: remark,
      expense_category: "管理",
      nationality: "中国",
      salary_pay_method: "其它",
      taxpayer_type: "居民",

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
      back_social_insurance_months: 0,
      back__housing_fund_months: 0,
      back_personal_medical_insurance: 0,
      back_personal_unemployment_insurance: 0,
      back_personal_pension_insurance: 0,
      back_personal_housing_fund: 0,
      back_ent_medical_insurance: 0,
      back_ent_unemployment_insurance: 0,
      back_ent_pension_insurance: 0,
      back_ent_maternity_insurance: 0,
      back_ent_injury_insurance: 0,
      back_ent_housing_fund: 0,
      housing_fund_base_amount: housing_fund_base_amount,
      social_insurance_base_amount: social_insurance_base_amount,
      supp_personal_housing_fund: 0,
      supp_ent_housing_fund: 0,
      back_supp_personal_housing_fund: 0,
      backup_supp_ent_housing_fund: 0,
      income_amt: 0,
      income_tax: 0,
      tax_deduct_amount: 0,
      children_edu_deduct_amount: children_edu_deduct_amount,
      housing_rent_deduct_amount: housing_rent_deduct_amount,
      loan_interest_deduct_amount: loan_interest_deduct_amount,
      support_elder_deduct_amount: support_elder_deduct_amount,
      diploma_edu_deduct_amount: diploma_edu_deduct_amount,
      vocational_edu_deduct_amount: vocational_edu_deduct_amount
    };

    util.request(api.BillApi.PostSalary, {
      formdata: formData,
      cid: customer_info_id,
      curr_month: curr_month
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        wx.redirectTo({
          url: '/pages/bill/salary/salary',
        })
      } else {
        Toast.fail(res.data.msg);
      }
    })

  },
  //劳务
  bindSaveLabour: function (e) {
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    console.log(e, 'save')
    const that = this;
    let hr_monthly_salary_id = that.data.hr_monthly_salary_id;
    let hr_employee_id = that.data.hr_employee_id;
    let emp_name = e.detail.value.emp_name;
    let income_category = that.data.income_category;
    let base_salary = that.convertToZero(e.detail.value.base_salary);
    let job_salary = that.convertToZero(e.detail.value.job_salary);
    let oevrtime_salary = that.convertToZero(e.detail.value.oevrtime_salary);
    let bonus_salary = that.convertToZero(e.detail.value.bonus_salary);
    let allowance_salary = that.convertToZero(e.detail.value.allowance_salary);
    let deduct_salary = that.convertToZero(e.detail.value.deduct_salary);
    let mobile_phone = that.convertToZero(e.detail.value.mobile_phone);
    let remark = e.detail.value.remark;
    let identification_number = e.detail.value.identification_number;
    let identification_type = that.data.identification_type; //证件类型

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

    console.log(personal_medical_insurance)
    if (emp_name == null || emp_name == undefined || emp_name.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请输入员工名称',
        showCancel: false
      })
      return
    }
    if (base_salary == "" || base_salary <= 0) {
      wx.showModal({
        title: '提示',
        content: '请填写劳务工资',
        showCancel: false
      })
      return
    }
    if (identification_number == undefined || identification_number == null || identification_number.length <= 0) {
      wx.showModal({
        title: '提示',
        content: '请填写身份证号码',
        showCancel: false
      })
      return
    } else {
      var regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证号码正则
      if (regIdNo.test(identification_number) === false) {
        wx.showModal({
          title: '提示',
          content: '身份证号格式不正确',
          showCancel: false
        })
        return;
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
        return;
      }
    }

    if (loan_interest_deduct_amount > 0 && housing_rent_deduct_amount > 0) {
      wx.showModal({
        title: '提示',
        content: '租房租金抵扣和住房贷款抵扣不能同时享用',
        showCancel: false
      })
      return
    }

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
      hr_monthly_salary_id: hr_monthly_salary_id,
      hr_employee_id: hr_employee_id,
      emp_name: emp_name,
      customer_info_id: customer_info_id,
      income_category: income_category,
      base_salary: base_salary,
      job_salary: job_salary,
      oevrtime_salary: oevrtime_salary,
      bonus_salary: bonus_salary,
      allowance_salary: allowance_salary,
      deduct_salary: deduct_salary,
      mobile_phone: mobile_phone,
      remark: remark,
      identification_number: identification_number,
      identification_type: identification_type,
      expense_category: "管理",
      nationality: "中国",
      salary_pay_method: "其它",
      taxpayer_type: "居民",

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
      back_social_insurance_months: 0,
      back__housing_fund_months: 0,
      back_personal_medical_insurance: 0,
      back_personal_unemployment_insurance: 0,
      back_personal_pension_insurance: 0,
      back_personal_housing_fund: 0,
      back_ent_medical_insurance: 0,
      back_ent_unemployment_insurance: 0,
      back_ent_pension_insurance: 0,
      back_ent_maternity_insurance: 0,
      back_ent_injury_insurance: 0,
      back_ent_housing_fund: 0,
      housing_fund_base_amount: housing_fund_base_amount,
      social_insurance_base_amount: social_insurance_base_amount,
      supp_personal_housing_fund: 0,
      supp_ent_housing_fund: 0,
      back_supp_personal_housing_fund: 0,
      backup_supp_ent_housing_fund: 0,
      income_amt: 0,
      income_tax: 0,
      tax_deduct_amount: 0,
      children_edu_deduct_amount: children_edu_deduct_amount,
      housing_rent_deduct_amount: housing_rent_deduct_amount,
      loan_interest_deduct_amount: loan_interest_deduct_amount,
      support_elder_deduct_amount: support_elder_deduct_amount,
      diploma_edu_deduct_amount: diploma_edu_deduct_amount,
      vocational_edu_deduct_amount: vocational_edu_deduct_amount
    };

    util.request(api.BillApi.PostSalary, {
      formdata: formData,
      cid: customer_info_id,
      curr_month: curr_month
    }, 'POST').then(function (res) {
      console.log(res);
      if (res.data.success == true) {
        Toast.success(res.data.msg);
        wx.redirectTo({
          url: '/pages/bill/salary/salary',
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
    let item = options.item;
    if (options.item) {
      that.setData({
        SalaryList: JSON.parse(options.item),
        isEdit: options.type
      });
      console.log(that.data.SalaryList)
      if (that.data.SalaryList.income_category == "劳务报酬所得") {
        that.setData({
          active: "劳务报酬",
          income_category: "劳务报酬所得",
          hr_monthly_salary_id: that.data.SalaryList.hr_monthly_salary_id,
          identification_type:that.data.SalaryList.identification_type,
          is_show_labour: true,
          is_show_bonus: false,
          is_show_salary: false,
        });
      } else if (that.data.SalaryList.income_category == "数月奖金") {
        that.setData({
          active: "年终奖",
          income_category: "数月奖金",
          hr_monthly_salary_id: that.data.SalaryList.hr_monthly_salary_id,
          hr_employee_id: that.data.SalaryList.hr_employee_id,
          emp_default: that.data.SalaryList.emp_name,
          is_show_bonus: true,
          is_show_labour: false,
          is_show_salary: false,
        });
      } else {
        that.setData({
          active: "月工资",
          income_category: "月工资",
          hr_monthly_salary_id: that.data.SalaryList.hr_monthly_salary_id,
          hr_employee_id: that.data.SalaryList.hr_employee_id,
          emp_default: that.data.SalaryList.emp_name,
          salary_pay_method:that.data.SalaryList.salary_pay_method,
          is_show_salary: true,
          is_show_bonus: false,
          is_show_labour: false,
        });
      }
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
    this.init();
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

    var personal_pension_insurance = 'SalaryList.personal_pension_insurance';
    var personal_medical_insurance = 'SalaryList.personal_medical_insurance';
    var personal_unemployment_insurance = 'SalaryList.personal_unemployment_insurance';

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
    var personal_housing_fund = 'SalaryList.personal_housing_fund';
    this.setData({
      [personal_housing_fund]: Math.ceil((housing_fund_base_amount * 0.07).toFixed(1))
    })
  },
  /**
   * 初始化下拉框
   */
  init: function () {
    var that = this;
    var api_name = api + "SalaryAccount/GetEmpInfo"
    let customer_info_id = app.globalData.curr_customer_info_id;
    let curr_month = app.globalData.curr_date.replace("-", "");
    var data = {
      cid: customer_info_id,
      account_month: curr_month
    }
    util.request(api.BillApi.GetEmpInfo,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          listEmp: res.data.listEmp
        });
      } else {
        that.setData({
          listEmp: []
        });
      }
    });
    util.request(api.BillApi.GetDdlList,
      data, 'POST').then(function (res) {
      if (res.data.success == true) {
        that.setData({
          incomeCategoryList: res.data.incomeCategoryList
        });
      } else {
        that.setData({
          incomeCategoryList: []
        });
      }
    });
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
  },

})