// pages/invoice/calculateTax/calculateTax.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app=getApp();
import Toast from '../../../vant-weapp/dist/toast/toast';
Page({
  data: {
    index1:0,
    index2:0,
    index4:0,
    index3:0,
    enterprise_type: ['一般纳税人', '小规模纳税人'],
    declarer_type: ['月度申报', '季度申报'],
    invoice_type: ['增值税专用发票', '增值税普通发票'],
    tax_rate: ['1%','3%', '5%', '6%',  '9%','13%'],
    radio: '0',
    checked: false,
    tax_list:[],
    columns: [1, 2, 3, 4, 5 , 6 , 7 , 8 , 9 , 10 , 11 ,12],
    showSalaryMonth: false,
    indexMonth:1,
    salaryMonth:1,
    active: 0,
    txtIncomeValue:'',//本月税前工资
    txtInsureValue:0,//五险一金
    txtSpecialValue:0,//专项附加扣除
    totalIncomeValue:0,//累计收入
    totalInsureValue:0,//累计五险一金
    totalSpecialValue:0,//累计专项附加扣除
    totalBaseLineValue:0,//累计减除费用
    totalMonth:0,//累计月,
    WageTaxList:false,
    txtRate:0,
    txtDeduct:0,
    taxPayable:0,
    paidTax:0,
    txtTax:0,
    txtTaxableIncome:0,
    taxedIncome:0,
    taxArray: [
      { level: 1, name: '未超过36,000元的部分', minTax: 0,rate:3, deduct:0 },
      { level: 2, name: '超过36,000至144,000元的部分', minTax: 36000,rate: 10, deduct: 2520 },
      { level: 3, name: '超过144,000至300,000元的部分', minTax: 144000,rate: 20, deduct: 16920},
      { level: 4, name: '超过300,000至420,000元的部分', minTax: 300000,rate: 25, deduct: 31920 },
      { level: 5, name: '超过420,000至660,000元的部分', minTax: 420000,rate: 30, deduct: 52920 },
      { level: 6, name: '超过660,000至960,000元的部分', minTax: 660000,rate: 35, deduct: 85920 },
      { level: 7, name: '超过960,000元的部分', minTax: 960000, rate: 45, deduct: 181920 }    
    ],
    taxNonArray: [
      { level: 1, name: '未超过3,000元的部分', minTax: 0,rate:3, deduct:0 },
      { level: 2, name: '超过3,000至12,000元的部分', minTax: 3000,rate: 10, deduct: 210 },
      { level: 3, name: '超过12,000至25,000元的部分', minTax: 12000,rate: 20, deduct: 1410},
      { level: 4, name: '超过25,000至35,000元的部分', minTax: 25000,rate: 25, deduct: 2660 },
      { level: 5, name: '超过35,000至55,000元的部分', minTax: 35000,rate: 30, deduct: 4410 },
      { level: 6, name: '超过55,000至80,000元的部分', minTax:55000,rate: 35, deduct: 7160 },
      { level: 7, name: '超过80,000元的部分', minTax: 80000, rate: 45, deduct: 15160 }    
    ],
    NonWageTaxList:false,
    txtNonIncomeValue:'',//非居民税前工资
    txtNonInsureValue:0,//非居民五险一金
    txtNonSpecialValue:0,//非居民专项扣除
    txtNonTaxableIncome:0,//非居民应纳税所得额
    txtNonRate:0,//非居民税率
    txtNonDeduct:0,//非居民速算扣除数
    taxNonPayable:0,//非居民应纳税税额
    taxedNonIncome:0,//非居民税后工资
    txtRemFee:0,//劳务扣除费用
    txtRemTaxableIncome:0,//劳务应纳税所得额
    txtRemRate:0,//劳务税率
    txtRemDeduct:0,//劳务速算扣除数
    taxRemPayable:0,//劳务应纳税税额
    taxedRemIncome:0,//劳务税后工资
    RemunerationList:false,
    taxRemArray: [
      { level: 1, name: '未超过20,000元的部分', minTax: 20000,rate:20, deduct:0 },
      { level: 2, name: '超过20,000至50,000元的部分', minTax: 20000,rate: 30, deduct: 2000 },
      { level: 3, name: '超过50,000元', minTax: 50000,rate: 40, deduct: 7000},
   
    ],
    txtBonusValue:'',//年终奖金额
    txtBonusTaxableIncome:0,//年终奖应纳税所得额
    txtBonusAverage:0,//年终奖平均每月
    txtBonusRate:0,//年终奖税率
    txtBonusDeduct:0,//年终奖速算扣除数
    taxBonusPayable:0,//年终奖应纳税税额
    taxedBonusIncome:0,//年终奖税后工资
    BonusList:false,
    taxBonusArray: [
      { level: 1, name: '未超过3,000元的部分', minTax: 0,rate:3, deduct:0 },
      { level: 2, name: '超过3,000至12,000元的部分', minTax: 3000,rate: 10, deduct: 210 },
      { level: 3, name: '超过12,000至25,000元的部分', minTax: 12000,rate: 20, deduct: 1410},
      { level: 4, name: '超过25,000至35,000元的部分', minTax: 25000,rate: 25, deduct: 2660 },
      { level: 5, name: '超过35,000至55,000元的部分', minTax: 35000,rate: 30, deduct: 4410 },
      { level: 6, name: '超过55,000至80,000元的部分', minTax:55000,rate: 35, deduct: 7160 },
      { level: 7, name: '超过80,000元的部分', minTax: 80000, rate: 45, deduct: 15160 }    
    ],
    SelfIncometax_rate:['10%','5%'],//征收率
    indexSelfIncome:0,
    txtSelfIncomeValue:'',//个体工商户收入金额
    taxSelfIncomeArray: [
      { level: 1, name: '未超过15,000元的部分', minTax: 0,rate:5, deduct:0 },
      { level: 2, name: '超过15,000至30,000元的部分', minTax: 3000,rate: 10, deduct: 750 },
      { level: 3, name: '超过30,000至60,000元的部分', minTax: 12000,rate: 20, deduct: 3750},
      { level: 4, name: '超过60,000至100,000元的部分', minTax: 25000,rate: 30, deduct: 9750 },
      { level: 5, name: '超过100,000的部分', minTax: 35000,rate: 35, deduct: 14750 },
  
    ],
    SelfIncomeList:false,
    txtSelfIncomeTaxableIncome:0,
    txtSelfIncomeRate:'0%',
    txtSelfIncomeDeduct:0,
    taxSelfIncomePayable:0,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
    taxedSelfIncomeIncome:0
  },
  //切换标签
  onChangeTab(event) {
    let that=this;
    let tabTitle=event.detail.title
    if(tabTitle=="工资薪金"){
      var timestamp = Date.parse(new Date());
      var date = new Date(timestamp);
      //获取月份  
      var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
      that.whatMonth(M)

    }
  },
 //工资薪金
 onSalaryMonth(e){
   console.log(e,'月份选择')
   let that=this;
   that.setData({
      salaryMonth: e.detail.value,
      totalMonth:parseInt(e.detail.value)+1,
      totalIncomeValue:that.data.txtIncomeValue*(parseInt(e.detail.value)+1),
      totalInsureValue:that.data.txtInsureValue*(parseInt(e.detail.value)+1),
      totalSpecialValue:that.data.txtSpecialValue*(parseInt(e.detail.value)+1)
    })
 },
 onTxtIncomeChange(event) {//输入当月工资
  let that=this;
  let txtIncomeValue=event.detail
  that.setData({
    txtIncomeValue:event.detail,
    totalIncomeValue:txtIncomeValue*that.data.totalMonth
  })
  },
  onTxtInsureChange(event) {//输入五险一金
    let that=this;
    let txtInsureValue=event.detail
    that.setData({
      txtInsureValue:event.detail,
      totalInsureValue:txtInsureValue*that.data.totalMonth
    })
  },
  onTxtSpecialChange(event){
    let that=this;
    let txtSpecialValue=event.detail
    that.setData({
      txtSpecialValue:event.detail,
      totalSpecialValue:txtSpecialValue*that.data.totalMonth
    })
  },
  formWageTaxSubmit: function (e) {
    console.log(e,'eeeeeeee个税查询')
    let that = this;
    let txtIncome=e.detail.value.txtIncome;//本月税前工资
    let txtInsure=e.detail.value.txtInsure;//本月五险一金
    let txtSpecial=e.detail.value.txtSpecial;//本月专项附加扣除
    let txtBaseLine=e.detail.value.txtBaseLine;//减除费用(起征点)
    let totalIncome=e.detail.value.totalIncome;//累计收入
    let totalInsure=e.detail.value.totalInsure;//累计五险一金
    let totalSpecial=e.detail.value.totalSpecial;//累计专项扣除
    let totalBaseLine=e.detail.value.totalBaseLine;//累计减除费用
    let totalIncomeLast=totalIncome-txtIncome;//上月累计收入=累计收入-本月税前工资
    let totalInsureLast=totalInsure-txtInsure;//上月累计五险一金=累计五险一金-五险一金
    let totalSpecialLast=totalSpecial-txtSpecial;//上月累计专项附加扣除 =累计专项附加扣除-专项附加扣除
   
    if(txtIncome==''){
      Toast('输入税前金额为空!');
    }else if(totalIncome==0||totalIncome==''){
      Toast('累计收入数据无效！');
    }
    else{
      let txtTaxableIncome=totalIncome-totalInsure-totalSpecial-totalBaseLine;//应纳税所得额
      let txtTaxableIncomeLast=totalIncomeLast - totalInsureLast - totalSpecialLast- (totalBaseLine-txtBaseLine);//上月应纳税所得额
      if(txtTaxableIncome>0){
        that.setData({
          txtTaxableIncome:txtTaxableIncome,
        })
        if(txtTaxableIncome<=36000){
          that.setData({
            txtRate:'3%',
            txtDeduct:0,
            taxPayable:txtTaxableIncome*0.03-0,
          })
        }else if(txtTaxableIncome>36000&&txtTaxableIncome<=144000){
          that.setData({
            txtRate:'10%',
            txtDeduct:2520,
            taxPayable:txtTaxableIncome*0.1-2520,
            
          })
  
        }else if(txtTaxableIncome>144000&&txtTaxableIncome<=300000){
          that.setData({
            txtRate:'20%',
            txtDeduct:16920,
            taxPayable:txtTaxableIncome*0.2-16920,
           
          })
        }else if(txtTaxableIncome>300000&&txtTaxableIncome<=420000){
          that.setData({
            txtRate:'25%',
            txtDeduct:31920,
            taxPayable:txtTaxableIncome*0.25-31920,
         
          })
  
        }else if(txtTaxableIncome>420000&&txtTaxableIncome<=660000){
          that.setData({
            txtRate:'30%',
            txtDeduct:52920,
            taxPayable:txtTaxableIncome*0.3-52920,
          
          })
  
        }else if(txtTaxableIncome>660000&&txtTaxableIncome<=960000){
          that.setData({
            txtRate:'35%',
            txtDeduct:85920,
            taxPayable:txtTaxableIncome*0.35-85920,
           
          })
  
        }else if(txtTaxableIncome>960000){
          that.setData({
            txtRate:'45%',
            txtDeduct:181920,
            taxPayable:txtTaxableIncome*0.45-181920,
         
          })
  
        }
        if(txtTaxableIncomeLast<=36000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.03-0,
            
          })
        }else if(txtTaxableIncomeLast>36000&&txtTaxableIncomeLast<=144000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.1-2520,
          })
        }else if(txtTaxableIncomeLast>144000&&txtTaxableIncomeLast<=300000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.2-16920,
           
          })
        }else if(txtTaxableIncomeLast>300000&&txtTaxableIncomeLast<=420000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.25-31920,
           
          })
  
        }else if(txtTaxableIncomeLast>420000&&txtTaxableIncomeLast<=660000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.3-52920,
          })
  
        }else if(txtTaxableIncomeLast>660000&&txtTaxableIncomeLast<=960000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.35-85920,
          })
  
        }else if(txtTaxableIncomeLast>960000){
          that.setData({
            paidTax:txtTaxableIncomeLast*0.45-181920,
          })
        }
        that.setData({
          txtTax:that.data.taxPayable-that.data.paidTax,//当月应纳税额 = 累计应纳税额 - 累计已缴纳税额
          taxedIncome:txtIncome-txtInsure-(that.data.taxPayable-that.data.paidTax),//本月税后工资 = 本月税前工资 － 五险一金 － 当月应纳个税
          WageTaxList:true
        })
      }else{
        that.setData({
          txtTaxableIncome:0,
          txtRate:'3%',
          txtDeduct:0,
          taxPayable:0,
          paidTax:0,
          txtTax:0,//当月应纳税额 = 累计应纳税额 - 累计已缴纳税额
          taxedIncome:txtIncome-txtInsure-0,//本月税后工资 = 本月税前工资 － 五险一金 － 当月应纳个税
          WageTaxList:true
        })
      }
      
    }
     
   
  },

whatMonth: function(M) {
  console.log(M,'M值')
  let indexMonth = '';
  
  switch (M) {
   case '01':
    indexMonth = '0';
    break;
   case '02':
    indexMonth = '1';
    break;
   case '03':
    indexMonth = '2';
    break;
    case '04':
    indexMonth = '3';
    break;
    case '05':
    indexMonth = '4';
    break;
    case '06':
    indexMonth = '5';
    break;
    case '07':
    indexMonth = '6';
    break;
    case '08':
    indexMonth = '7';
    break;
    case '09':
    indexMonth = '8';
    break;
    case '10':
    indexMonth = '9';
    break;
    case '11':
    indexMonth = '10';
    break;
    default :
    indexMonth = '11';
    
  }
  console.log(indexMonth,'indexMonth')
  this.setData({
    salaryMonth:indexMonth,
    totalMonth:parseInt(indexMonth)+1
  })
  return indexMonth;
 },

//非居民工资
formNonWageTaxSubmit: function (e) {
  console.log(e,'eeeeeeee非居民个税')
  let that = this;
  let txtNonIncome=e.detail.value.txtNonIncome;//本月税前工资
  console.log(txtNonIncome,'税前工资')
  let txtNonInsure=e.detail.value.txtNonInsure;//本月五险一金
  console.log(txtNonInsure,'五险一金')
  let txtNonSpecial=e.detail.value.txtNonSpecial;//本月专项附加扣除
  console.log(txtNonSpecial,'专项附加扣除')
  let txtNonBaseLine=e.detail.value.txtNonBaseLine;//减除费用(起征点)
  console.log(txtNonBaseLine,'减除费用')
 
  if(txtNonIncome==''){
    Toast('输入税前金额为空!');
  }else{
    let txtNonTaxableIncome=txtNonIncome-txtNonInsure-txtNonSpecial-txtNonBaseLine;//应纳税所得额 =税前工资收入金额 － 五险一金(个人缴纳部分) － 专项扣除 － 起征点(5000元)
    console.log(txtNonTaxableIncome,'应纳税所得额')
    if (txtNonTaxableIncome>0){
      that.setData({
        txtNonTaxableIncome:txtNonTaxableIncome,
      })
      if(txtNonTaxableIncome<=3000){
        that.setData({
          txtNonRate:'3%',
          txtNonDeduct:0,
          taxNonPayable:txtNonTaxableIncome*0.03-0,
        })
      }else if(txtNonTaxableIncome>3000&&txtNonTaxableIncome<=12000){
        that.setData({
          txtNonRate:'10%',
          txtNonDeduct:210,
          taxNonPayable:txtNonTaxableIncome*0.1-210,
          
        })

      }else if(txtNonTaxableIncome>12000&&txtNonTaxableIncome<=25000){
        that.setData({
          txtNonRate:'20%',
          txtNonDeduct:1410,
          taxNonPayable:txtNonTaxableIncome*0.2-1410,
        
        })
      }else if(txtNonTaxableIncome>25000&&txtNonTaxableIncome<=35000){
        that.setData({
          txtNonRate:'25%',
          txtNonDeduct:2660,
          taxNonPayable:txtNonTaxableIncome*0.25-2660,
      
        })

      }else if(txtNonTaxableIncome>35000&&txtNonTaxableIncome<=55000){
        that.setData({
          txtNonRate:'30%',
          txtNonDeduct:4410,
          taxNonPayable:txtNonTaxableIncome*0.3-4410,
        
        })

      }else if(txtNonTaxableIncome>55000&&txtNonTaxableIncome<=80000){
        that.setData({
          txtNonRate:'35%',
          txtNonDeduct:7160,
          taxNonPayable:txtNonTaxableIncome*0.35-7160,
        
        })

      }else if(txtNonTaxableIncome>80000){
        that.setData({
          txtNonRate:'45%',
          txtNonDeduct:15160,
          taxNonPayable:txtNonTaxableIncome*0.45-15160,
      
        })

      }
      console.log(that.data.taxNonPayable, '应纳税额')
      that.setData({
        taxedNonIncome:txtNonIncome-txtNonInsure-that.data.taxNonPayable,//税后工资 = 税前工资 － 五险一金 － 应纳个税
        NonWageTaxList:true
      })
    }else{
      that.setData({
        txtNonTaxableIncome:0,
        txtNonRate:'0%',
        txtNonDeduct:0,
        taxNonPayable:0,
        taxedNonIncome:txtNonIncome-txtNonInsure-0,//税后工资 = 税前工资 － 五险一金 － 应纳个税
        NonWageTaxList:true
      })
    }
    
  }
   
 
},

//劳务报酬
formRemunerationSubmit: function (e) {
  console.log(e,'eeeeeeee劳务报酬')
  let that = this;
  let txtRemuneration=e.detail.value.txtRemuneration;//劳务报酬金额
  console.log(txtRemuneration,'劳务报酬')
 
  if(txtRemuneration==''){
    Toast('输入劳务报酬金额为空!');
  }else if(txtRemuneration>800&&txtRemuneration<4000){
    that.setData({
      txtRemFee:800,
      txtRemTaxableIncome:txtRemuneration-800,
      txtRemRate:'20%',
      txtRemDeduct:0,
      taxRemPayable:(txtRemuneration-800)*0.2-0,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
      taxedRemIncome:txtRemuneration-((txtRemuneration-800)*0.2-0)//税后收入 = 劳务报酬 － 应纳税额
    })

  }else if(txtRemuneration>=4000){
    that.setData({
      txtRemFee:txtRemuneration*0.2,
      txtRemTaxableIncome:txtRemuneration-txtRemuneration*0.2,
    })
    
    if(that.data.txtRemTaxableIncome>0&&that.data.txtRemTaxableIncome<=20000){
      that.setData({
        txtRemRate:'20%',
        txtRemDeduct:0,
        taxRemPayable:that.data.txtRemTaxableIncome*0.2-0,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedRemIncome:txtRemuneration-(that.data.txtRemTaxableIncome*0.2-0)//税后收入 = 劳务报酬 － 应纳税额
      })

    }else if(that.data.txtRemTaxableIncome>20000&&that.data.txtRemTaxableIncome<=50000){
      that.setData({
        txtRemRate:'30%',
        txtRemDeduct:2000,
        taxRemPayable:that.data.txtRemTaxableIncome*0.3-2000,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedRemIncome:txtRemuneration-(that.data.txtRemTaxableIncome*0.3-2000)//税后收入 = 劳务报酬 － 应纳税额
      })
    }else if(that.data.txtRemTaxableIncome>50000){
      that.setData({
        txtRemRate:'40%',
        txtRemDeduct:7000,
        taxRemPayable:that.data.txtRemTaxableIncome*0.4-7000,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedRemIncome:txtRemuneration-(that.data.txtRemTaxableIncome*0.4-2000)//税后收入 = 劳务报酬 － 应纳税额
      })
    }

  }else if(txtRemuneration>0&&txtRemuneration<=800){
    that.setData({
      txtRemFee:0,
      txtRemTaxableIncome:0,
      txtRemRate:'20%',
      txtRemDeduct:0,
      taxRemPayable:0,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
      taxedRemIncome:txtRemuneration//税后收入 = 劳务报酬 － 应纳税额
    })
  }
  that.setData({
    RemunerationList:true,
  })
  
},
//年终奖金
formBonusSubmit: function (e) {
  console.log(e,'eeeeeeee年终奖金')
  let that = this;
  let txtBonus=e.detail.value.txtBonus;//年终奖金金额
  console.log(txtBonus,'年终奖金')
 
  if(txtBonus==''){
    Toast('输入年终奖金额为空!');
  }else if(txtBonus>0){
    that.setData({
      txtBonusTaxableIncome:txtBonus,//应纳税所得额
      txtBonusAverage:txtBonus/12
    })
    if(that.data.txtBonusAverage>0&&that.data.txtBonusAverage<=3000){
      that.setData({
        txtBonusRate:'3%',
        txtBonusDeduct:0,
        taxBonusPayable:txtBonus*0.03-0,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.03-0)//税后年终奖 = 税前年终奖 － 应纳税额
      })
  
    }else if(that.data.txtBonusAverage>3000&&that.data.txtBonusAverage<=12000){
      that.setData({
        txtBonusRate:'10%',
        txtBonusDeduct:210,
        taxBonusPayable:txtBonus*0.1-210,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.1-210)//税后年终奖 = 税前年终奖 － 应纳税额
      })

    }else if(that.data.txtBonusAverage>12000&&that.data.txtBonusAverage<=25000){
      that.setData({
        txtBonusRate:'20%',
        txtBonusDeduct:1410,
        taxBonusPayable:txtBonus*0.2-1410,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.2-1410)//税后年终奖 = 税前年终奖 － 应纳税额
      })
      
    }else if(that.data.txtBonusAverage>25000&&that.data.txtBonusAverage<=35000){
      that.setData({
        txtBonusRate:'25%',
        txtBonusDeduct:2660,
        taxBonusPayable:txtBonus*0.25-2660,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.25-2660)//税后年终奖 = 税前年终奖 － 应纳税额
      })
      
    }else if(that.data.txtBonusAverage>35000&&that.data.txtBonusAverage<=55000){
      that.setData({
        txtBonusRate:'30%',
        txtBonusDeduct:4410,
        taxBonusPayable:txtBonus*0.3-4410,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.3-4410)//税后年终奖 = 税前年终奖 － 应纳税额
      })
      
    }else if(that.data.txtBonusAverage>55000&&that.data.txtBonusAverage<=80000){
      that.setData({
        txtBonusRate:'35%',
        txtBonusDeduct:7160,
        taxBonusPayable:txtBonus*0.35-7160,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.35-7160)//税后年终奖 = 税前年终奖 － 应纳税额
      })
      
    }else if(that.data.txtBonusAverage>80000){
      that.setData({
        txtBonusRate:'45%',
        txtBonusDeduct:15160,
        taxBonusPayable:txtBonus*0.45-15160,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus-(txtBonus*0.45-15160)//税后年终奖 = 税前年终奖 － 应纳税额
      })
      
    }else{
      that.setData({
        txtBonusRate:'0%',
        txtBonusDeduct:0,
        taxBonusPayable:txtBonus,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedBonusIncome:txtBonus//税后年终奖 = 税前年终奖 － 应纳税额
      })
    }

  }
  
  that.setData({
    BonusList:true,
  })
  
},
//经营所得税
bindPickerSelfIncomeType(e){
  console.log(e,'征收率选择')
  let that=this;
  that.setData({
    indexSelfIncome: e.detail.value,
   })
},
formSelfIncomeSubmit: function (e) {
  console.log(e,'eeeeeeee生产经营')
  let that = this;
  let txtSelfIncome=e.detail.value.txtSelfIncome;//生产经营金额
  console.log(txtSelfIncome,'生产经营金额')
  let SelfIncometax_rate=this.data.SelfIncometax_rate[this.data.indexSelfIncome].replace(/%/g,'')/100;
  console.log(SelfIncometax_rate,'SelfIncometax_rate税率')
  if(txtSelfIncome==''){
    Toast('输入生产经营金额为空!');
  }else if(txtSelfIncome>0){
    that.setData({
      txtSelfIncomeTaxableIncome:txtSelfIncome*SelfIncometax_rate,//应纳税所得额
    })
    let txtSelfIncomeTaxableIncome=that.data.txtSelfIncomeTaxableIncome
    if(that.data.txtSelfIncomeTaxableIncome>0&&that.data.txtSelfIncomeTaxableIncome<=15000){
      that.setData({
        txtSelfIncomeRate:'5%',
        txtSelfIncomeDeduct:0,
        taxSelfIncomePayable:txtSelfIncomeTaxableIncome*0.05-0,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedSelfIncomeIncome:txtSelfIncome-(txtSelfIncomeTaxableIncome*0.05-0)//税后收入 = 生产经营金额 － 应纳税额
      })
  
    }else if(that.data.txtSelfIncomeTaxableIncome>15000&&that.data.txtSelfIncomeTaxableIncome<=30000){
      that.setData({
        txtSelfIncomeRate:'10%',
        txtSelfIncomeDeduct:750,
        taxSelfIncomePayable:txtSelfIncomeTaxableIncome*0.1-750,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedSelfIncomeIncome:txtSelfIncome-(txtSelfIncomeTaxableIncome*0.1-750)//税后收入 = 生产经营金额 － 应纳税额
      })

    }else if(that.data.txtSelfIncomeTaxableIncome>30000&&that.data.txtSelfIncomeTaxableIncome<=60000){
      that.setData({
        txtSelfIncomeRate:'20%',
        txtSelfIncomeDeduct:3750,
        taxSelfIncomePayable:txtSelfIncomeTaxableIncome*0.2-3750,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedSelfIncomeIncome:txtSelfIncome-(txtSelfIncomeTaxableIncome*0.2-3750)//税后收入 = 生产经营金额 － 应纳税额
      })
      
    }else if(that.data.txtSelfIncomeTaxableIncome>60000&&that.data.txtSelfIncomeTaxableIncome<=100000){
      that.setData({
        txtSelfIncomeRate:'30%',
        txtSelfIncomeDeduct:9750,
        taxSelfIncomePayable:txtSelfIncomeTaxableIncome*0.3-9750,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedSelfIncomeIncome:txtSelfIncome-(txtSelfIncomeTaxableIncome*0.3-9750)//税后收入 = 生产经营金额 － 应纳税额
      })
      
    }else if(that.data.txtSelfIncomeTaxableIncome>100000){
      that.setData({
        txtSelfIncomeRate:'35%',
        txtSelfIncomeDeduct:14750,
        taxSelfIncomePayable:txtSelfIncomeTaxableIncome*0.35-14750,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedSelfIncomeIncome:txtSelfIncome-(txtSelfIncomeTaxableIncome*0.35-14750)//税后收入 = 生产经营金额 － 应纳税额
      })
      
    }else{
      that.setData({
        txtBonusRate:'0%',
        txtBonusDeduct:0,
        taxBonusPayable:txtSelfIncomeTaxableIncome,//应纳税额 = 应纳税所得额 × 适用税率 － 速算扣除数
        taxedSelfIncomeIncome:txtSelfIncomeTaxableIncome//税后收入 = 生产经营金额 － 应纳税额
      })
    }

  }
  
  that.setData({
    SelfIncomeList:true,
  })
  
},

  //企业类型
  bindPickerEnterpriseType: function (e) {
   
    this.setData({
      index1: e.detail.value,

    })
    let that =this;
    console.log(e.detail.value,'选择');
    if(e.detail.value==0){
      that.setData({
        tax_rate: ['6%', '9%', '13%'],
        index4:0,
        declarer_type: ['月度申报'],
      });
     
    }else{
      that.setData({
        tax_rate: ['1%','3%', '5%'],
        index4:0,
        declarer_type: ['月度申报', '季度申报'],
      });
      
    }
    // app.globalData.index=e.detail.value
  },
  //申报类型
  bindPickerDeclarationType: function (e) {

    this.setData({
      index2: e.detail.value,
    })
  },
   //发票类型
   bindPickerInvoiceType: function (e) {
     console.log(e.detail.value,'发票类型')

    this.setData({
      index3: e.detail.value,

    })
  },
  //税费
  bindPickerTaxRate: function (e) {
    console.log(e.detail.value,'税费');
    this.setData({
      index4: e.detail.value,
    })
  },
  //收入含税
  onChangeSwitch(event) {
    this.setData({ 
      checked: event.detail 
    });
  },

  formSubmit: function (e) {
    let that = this;
    let is_contain_tax;//是否含税
    if(e.detail.value.is_contain_tax==true){
      is_contain_tax="Y";
    }else{
      is_contain_tax="N";

    }
    let invoice_amt=Number(e.detail.value.invoice_amt);//总额
    let tax_rate=this.data.tax_rate[this.data.index4].replace(/%/g,'')/100;
    let enterprise_type=this.data.enterprise_type[this.data.index1];
    let declarer_type=this.data.declarer_type[this.data.index2];
    let invoice_type=this.data.invoice_type[this.data.index3];
    if(invoice_amt==''){
      Toast('输入金额为空');
    }else{
      util.request(api.CalculateTaxUrl,//税金计算器
        {   
          openid:app.globalData.openid,
          customer_info_id:app.globalData.curr_customer_info_id,
          invoice_amt:invoice_amt,
          enterprise_type:enterprise_type,
          declarer_type:declarer_type,
          invoice_type:invoice_type,
          tax_rate:tax_rate, 
          is_contain_tax:is_contain_tax

        }
        ,'POST').then(function(res){
          if(res.data.success==true ){
           console.log(res,'税金数据');
           that.setData({
            tax_list:res.data.tax_list
          });
          }else{
            that.setData({
              tax_list: []
            });
            Toast('暂无数据');
          }
        })
    }
     
   
  },

  // 搜索页面跳回
  onLoad: function (options) {

  
    let that = this;
    let index1=0;
    if(index1==0){
      that.setData({
        tax_rate: ['6%', '9%', '13%'],
        declarer_type: ['月度申报'],
      });
     
    }else{
      that.setData({
        tax_rate: ['1%','3%','5%'],
        declarer_type: ['月度申报', '季度申报'],
      });
    }

   
  },






})
