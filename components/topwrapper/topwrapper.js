// component/authorize.js

const app = getApp()
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Toast from '../../vant-weapp/dist/toast/toast';
Component({
 
  properties: {
		customerlist: {
      type: Array,
      value:''
		},
    pickerDate:{
			type: String
    }, 
    customerindex:{
      type: Number
    }
	},
 
  data: {
    isAuthor:false,//是否已授权
    numindex:0,
    curr_customer_info_id:0,
    customer_info_id_list: [],
  },
  lifetimes: {
    // 在组件完全初始化完毕、进入页面节点树后
    attached() {
      
    }
  },
 
  methods: {
    /**
     * 日期选择
     */
    bindDateChange: function(e) {
      this.setData({
        pickerDate: e.detail.value,
      })
      this.triggerEvent('pickerdateevent', { pickerDate: e.detail.value });
      app.globalData.curr_date=e.detail.value;
    },
    /* 公司选择
    */
   bindCompanyChange: function(e) {
     let that = this;
     if(e!=undefined){
      util.request(api.QueryUserCustomerListUrl,//查询所有公司列表
        {openid:app.globalData.openid}
        ,'POST').then(function(res){
          if(res.data.success==true ){
            that.setData({
              customer_info_id_list: res.data.customerList,
              curr_customer_info_id:res.data.customerList[e.detail.value].customer_info_id,
              curr_customer_name:res.data.customerList[e.detail.value].customer_name,
              index: e.detail.value,
            });
          }else{
            that.setData({
              customer_info_id_list: [],
              curr_customer_info_id:0,
              curr_customer_name:'',
              index:0
            });
            Toast('暂无数据');
          }
          that.triggerEvent('pickercompanyevent', { index: e.detail.value,curr_customer_info_id:that.data.curr_customer_info_id ,curr_customer_name:that.data.curr_customer_name ,customer_info_id_list:that.data.customer_info_id_list});
        })
     }else{
      util.request(api.QueryUserCustomerListUrl,//查询所有公司列表
        {openid:app.globalData.openid}
        ,'POST').then(function(res){
          if(res.data.success==true ){
            that.setData({
              customer_info_id_list: res.data.customerList,
              curr_customer_info_id:res.data.customerList[that.data.customerindex].customer_info_id,
              curr_customer_name:res.data.customerList[that.data.customerindex].customer_name,
              index: that.data.customerindex,
            });
          }else{
            that.setData({
              customer_info_id_list: [],
              curr_customer_info_id:0,
              curr_customer_name:'',
              index:0
            });
            Toast('暂无数据');
          }
          that.triggerEvent('pickercompanyevent', { index: that.data.customerindex,curr_customer_info_id:that.data.curr_customer_info_id ,curr_customer_name:that.data.curr_customer_name ,customer_info_id_list:that.data.customer_info_id_list});
        })
     }
   },
  }
})
