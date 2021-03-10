// pages/bill/taxation/taxation.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeIndex:0,//选择的类型下标
    // 上面和下面定位的数据，结构可以根据实际接口更改
    groupArr: [
      { taxName: '税种',span:6,border:"border-right"},
      { taxName: '增值税', span: 18,border:""},
      
    ],
    taxTable:[],
    customer_name:'',
    tax_type:'',
    account_month:'',
    dataDeductTable:[],
    total_amount:0,
    curr_output_goods_vat:0,
    curr_input_vat:0,
    curr_input_vat_out:0,
    curr_output_vat_paid:0,
    last_remained_vat:0,
    curr_payment_vat:0,
    curr_remained_vat:0,
    curr_output_service_vat:0,
    city_construction_rate:0,
    city_construction_tax:0,
    local_education_supplementary_rate:0,
    local_education_supplementary_tax:0,
    education_supplementary_rate:0,
    education_supplementary_tax:0,
    is_more_deduct:0,
    more_deduct_rate:0,
    last_more_deduct_remain:0,
    curr_more_deduct_add:0,
    curr_more_deduct_adjust:0,
    curr_more_deduct_use:0,
    curr_more_deduct_remain:0,
    curr_total_profit:0,
    prior_year_loss:0,
    curr_paid_income_tax:0,
    curr_income_tax:0,
    is_qu:'N',
    is_d_tax:'N',
    dataIndividualTax:0
  },
  QueryMonthlyTaxReport:function() {
    
    let that = this;
    let customer_info_id = app.globalData.curr_customer_info_id;
    let account_month = app.globalData.curr_date.split('-').join("");;
    console.log(customer_info_id,'customer_info_id')
    console.log(account_month,'account_month')
    util.request(api.BillApi.QueryMonthlyTaxReport,
      {cid:customer_info_id,account_month:account_month}
      ,'POST').then(function(res){
        console.log(res)
        if(res.data.success==true){
          that.setData({
            taxTable:res.data.taxTable,
            customer_name:res.data.taxTable[0].customer_name,
            tax_type:res.data.taxTable[0].tax_type,
            account_month:res.data.taxTable[0].account_month,
            dataDeductTable:res.data.dataDeductTable,
            total_amount:res.data.taxTable[0].curr_payment_vat+res.data.taxTable[0].city_construction_tax+res.data.taxTable[0].local_education_supplementary_tax+res.data.taxTable[0].education_supplementary_tax,
            curr_output_goods_vat:res.data.taxTable[0].curr_output_goods_vat,
            curr_input_vat:res.data.taxTable[0].curr_input_vat,
            curr_input_vat_out:res.data.taxTable[0].curr_input_vat_out,
            curr_output_vat_paid:res.data.taxTable[0].curr_output_vat_paid,
            last_remained_vat:res.data.taxTable[0].last_remained_vat,
            curr_payment_vat:res.data.taxTable[0].curr_payment_vat,
            curr_remained_vat:res.data.taxTable[0].curr_remained_vat,
            curr_output_service_vat:res.data.taxTable[0].curr_output_service_vat,
            city_construction_rate:res.data.taxTable[0].city_construction_rate,
            city_construction_tax:res.data.taxTable[0].city_construction_tax,
            local_education_supplementary_rate:res.data.taxTable[0].local_education_supplementary_rate,
            local_education_supplementary_tax:res.data.taxTable[0].local_education_supplementary_tax,
            education_supplementary_rate:res.data.taxTable[0].education_supplementary_rate,
            education_supplementary_tax:res.data.taxTable[0].education_supplementary_tax,
            is_more_deduct:res.data.taxTable[0].is_more_deduct,
            more_deduct_rate:res.data.taxTable[0].more_deduct_rate,
            last_more_deduct_remain:res.data.taxTable[0].last_more_deduct_remain,
            curr_more_deduct_add:res.data.taxTable[0].curr_more_deduct_add,
            curr_more_deduct_adjust:res.data.taxTable[0].curr_more_deduct_adjust,
            curr_more_deduct_use:res.data.taxTable[0].curr_more_deduct_use,
            curr_more_deduct_remain:res.data.taxTable[0].curr_more_deduct_remain,
            curr_total_profit:res.data.taxTable[0].curr_total_profit,
            prior_year_loss:res.data.taxTable[0].prior_year_loss,
            curr_paid_income_tax:res.data.taxTable[0].curr_paid_income_tax,
            curr_income_tax:res.data.taxTable[0].curr_income_tax,
            dataIndividualTax:res.data.dtIndividualTax
          });
          let c_month=that.data.account_month;
          if(c_month.substring(4,6)=='03'||c_month.substring(4,6)=='06'||c_month.substring(4,6)=='09'||c_month.substring(4,6)=='12'){
            that.setData({
              is_qu:"Y"
            })
          }else{
            that.setData({
              is_qu:"N"
            })
          }
           //生产经营个税显示
          if (that.data.dataIndividualTax.length > 0) {
            that.setData({
              is_d_tax:"Y"
            })
          }
          else {
            that.setData({
              is_d_tax :"N"
            })
          }
          console.log(res.data, 'res.data')
         
          // self.dataIndividualTax = receiveData.dtIndividualTax;
          // if (self.dataIndividualTax.length > 0) {
          //     self.accrued_tax.is_d_tax = "Y";
          // }
          // else {
          //     self.accrued_tax.is_d_tax = "N";
          // }
        }else{
          that.setData({
            taxTable:[],
            customer_name:res.data.customer_name,
            tax_type:res.data.tax_type,
            account_month:res.data.account_month,
            dataDeductTable:[],
            total_amount:0,
            curr_output_goods_vat:0,
            curr_input_vat:0,
            curr_input_vat_out:0,
            curr_output_vat_paid:0,
            last_remained_vat:0,
            curr_payment_vat:0,
            curr_remained_vat:0,
            curr_output_service_vat:0,
            city_construction_rate:0,
            city_construction_tax:0,
            local_education_supplementary_rate:0,
            local_education_supplementary_tax:0,
            education_supplementary_rate:0,
            education_supplementary_tax:0,
            is_more_deduct:0,
            more_deduct_rate:0,
            last_more_deduct_remain:0,
            curr_more_deduct_add:0,
            curr_more_deduct_adjust:0,
            curr_more_deduct_use:0,
            curr_more_deduct_remain:0,
            curr_total_profit:0,
            prior_year_loss:0,
            curr_paid_income_tax:0,
            curr_income_tax:0,
            is_qu:'N',
            is_d_tax:'N',
            dataIndividualTax:0
          });
        }
      })
     
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getList();
  },
  scrollTouchStart:function(e){
    if (e.currentTarget.dataset.scroll != this.data.touchTarget){
      this.setData({
        touchTarget: e.currentTarget.dataset.scroll
      })
    }
  },
  // 
  scrolling:function(e){
    if (e.target.dataset.scroll == this.data.touchTarget){
      this.setData({
        left: e.detail.scrollLeft
      })
    }
  },
  // 点击选择类型
  chooseType:function(e){
    this.setData({
      activeIndex: e.currentTarget.dataset.index
    });
    // this.getList();//重新请求数据
  },
  // getList:function(){
  //   // 请求接口，接收数据并渲染
  //   var activeIndex = this.data.activeIndex;//当前选择的类型下标，
  //   //request之后处理数据，如果后台直接返回一行的哪个数据数值最小也就是最便宜的那个，直接渲染，如果后台只是返回具体数字，前端处理一下,如上面的模拟的数据，前端处理
  //   var lists = this.data.lists;
  //   for(var i=0;i<lists.length;i++){
  //     var min = Math.min.apply(null, lists[i].priceArr);
  //     var index = lists[i].priceArr.indexOf(min);
  //     lists[i].minIndex = index;
  //   }
  //   this.setData({
  //     lists:lists
  //   })

  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.QueryMonthlyTaxReport();
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

  }
})
