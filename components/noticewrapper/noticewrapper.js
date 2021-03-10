// component/authorize.js

const app = getApp()
var api = require('../../config/api.js');
var util = require('../../utils/util.js');
import Toast from '../../vant-weapp/dist/toast/toast';
Component({
 
  properties: {
    noticetext:{
			type: String
    }, 
    noticenum:{
      type: Number
    }
	},
 
  data: {
    isAuthor:false,//是否已授权
    messageList:[],
    total:0
  },
  lifetimes: {
    // 在组件完全初始化完毕、进入页面节点树后
    attached() {
      this.QueryNewMessage()
    }
  },
 
  methods: {
    QueryNewMessage:function(){
      let that = this;
      let customer_info_id = app.globalData.curr_customer_info_id;
      let user_id = app.globalData.user_id;
      let curr_month = app.globalData.curr_date.replace("-","");
      let postData={
        cid: customer_info_id,
        curr_month: curr_month,
        ui:user_id,
      }
      util.request(api.QueryNewMessage,postData,'POST').then(function(res){
      console.log(res,'res消息')
      if(res.data.success==true){
        that.setData({
          messageList:res.data.messageList,
          total:res.data.total
        })
       
      }else{
        that.setData({
          messageList:[],
          total:0
        })
        
      }
      
    })

    }
  }
})
