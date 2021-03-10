// pages/statements/accountingAnalysis/accountingAnalysis.js
var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import F2 from '../../../f2-canvas/lib/f2';
import Toast from '../../../vant-weapp/dist/toast/toast';
var app=getApp();
let that=null;

let chart = null;


Page({

  /**
   * 页面的初始数据
   */
  
  data: {
    dtData:[],
    
  },
  QueryAccountingAnalysis: function(e){
    //财务分析
    
    util.request(api.QueryAccountingAnalysisUrl,{
      openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      account_month:app.globalData.curr_date.split('-').join("")
  },'POST').then(function(res){
    if(res.data.success==true){
      console.log(res,'财务分析')
      
      that.setData({
        dtData: res.data.dt[0],
       
      });   
    }else{
      that.setData({
        dtData: []
      });
    }
    });
   
     
    
    console.log(that.data.dtData); 
    function initChart(canvas, width, height) { // 使用 F2 绘制图表
      new Promise(function(resolve,reject){ 
        // wx.request({
        //   url: api.QueryAccountingAnalysisUrl,//请求接口
        //   data: { 
        //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        //     account_month:app.globalData.curr_date.split('-').join("")
        //    },
        //   header: {
        //     'content-type': 'application/json' ,// 默认值,
        //     'Authorization':'Bearer '+app.globalData.Token //设置验证
        //   },
        //   method: "POST",
        // // 请求成功后执行
        //   success: function (res) {
        //     if(res.data.success==true){
        //       app.globalData.dtData=res.data.dt[0];
              
        //         const dataNum =[{
        //           brand: '预警上限',
        //           sales: res.data.dt[0].column_val_03,
        //           const: 100
        //         }, {
        //           brand: '可增加收入',
        //           sales: res.data.dt[0].column_val_03-res.data.dt[0].column_val_01,
        //           const: 100
        //         },{
        //           brand: '开票收入',
        //           sales: res.data.dt[0].column_val_01,
        //           const: 100
        //         } ];
              
        //       resolve(dataNum) // 将数据返回给到new上进行then索取
        //     }else{
        //       const dataNum =[];
        //       resolve(dataNum)
        //     }
            
            
        //   },
        //   fail:function(err){
        //     console.log(err);
        //     Toast('网络异常');
        //   }
        // })
      }).then((data) => {

        // 全局设置，所有的图表生效

        chart = new F2.Chart({
          el: canvas,
          width,
          height,
          padding: [20, 20, 5]
        });
      
        function numberToMoney(n) {
          return String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
       
        chart.source(data);
        chart.coord({
          transposed: true
        });
        chart.axis(false);
        chart.tooltip(false);
        chart.interval().position('brand*const').color('#d9e4eb').size(10).animate(false);
        chart.interval().position('brand*sales').color('#1e6ce8').size(10).style({
          radius: [0, 5, 5, 0]
        });
      
        // 绘制文本
        data.map(function(obj) {
          chart.guide().text({
            position: [obj.brand, 'min'],
            content: obj.brand,
            style: {
              textAlign: 'start',
              textBaseline: 'bottom'
            },
            offsetY: -12
          });
          chart.guide().text({
            position: [obj.brand, 'max'],
            content: '¥' + numberToMoney(obj.sales),
            style: {
              textAlign: 'end',
              textBaseline: 'bottom'
            },
            offsetY: -8
          });
        });
        chart.render();
        
        return chart;

      })
    };
    function initpieChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
      new Promise(function(resolve,reject){ 
        util.request(api.QueryAccountingAnalysisUrl,{
          openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
            account_month:app.globalData.curr_date.split('-').join("")
        },'POST').then(function(res){
          if(res.data.success==true){
            app.globalData.dtData=res.data.dt[0];

            const map = {
              '销售费用': res.data.dt[0].column_val_19<0?0:res.data.dt[0].column_val_19,
              '管理费用': res.data.dt[0].column_val_21<0?0:res.data.dt[0].column_val_21,
              '财务费用': res.data.dt[0].column_val_23<0?0:res.data.dt[0].column_val_23
            };
            const total=(res.data.dt[0].column_val_19<0?0:res.data.dt[0].column_val_19)+(res.data.dt[0].column_val_21<0?0:res.data.dt[0].column_val_21)+(res.data.dt[0].column_val_23<0?0:res.data.dt[0].column_val_23)
            const data = [
              { name: '销售费用', percent: (res.data.dt[0].column_val_19<0?0:res.data.dt[0].column_val_19)/total, a: '1' },
              { name: '管理费用', percent: (res.data.dt[0].column_val_21<0?0:res.data.dt[0].column_val_21)/total, a: '1' },
              { name: '财务费用', percent: (res.data.dt[0].column_val_23<0?0:res.data.dt[0].column_val_23)/total, a: '1' }
            ];
            
            resolve({map,data}) // 将数据返回给到new上进行then索取
          }else{
            const map =[];
            const data =[];
            resolve({map,data})
          }
          
          
        })
        // wx.request({
        //   url: api.QueryAccountingAnalysisUrl,//请求接口
        //   data: { 
        //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        //     account_month:app.globalData.curr_date.split('-').join("")
        //    },
        //   header: {
        //     'content-type': 'application/json' ,// 默认值,
        //     'Authorization':'Bearer '+app.globalData.Token //设置验证
        //   },
        //   method: "POST",
        // // 请求成功后执行
        //   success: function (res) {
          
        //   },
        //   fail:function(err){
        //     console.log(err);
        //     Toast('网络异常');
        //   }
        // })
      }).then((obj) => {

        // 全局设置，所有的图表生效

        chart = new F2.Chart({
          el: canvas,
          width,
          height
          
        });
      
        chart.source(obj.data, {
          percent: {
            formatter(val) {
              return val * 100 + '%';
            }
          }
        });
        chart.legend({
          position: 'right',
          itemFormatter(val) {
            return val + '  ' + obj.map[val];
          }
        });
        chart.tooltip(false);
        chart.coord('polar', {
          transposed: true,
          radius: 0.85
        });
        chart.axis(false);
        chart.interval()
          .position('a*percent')
          .color('name', [ '#FACC14', '#1e6ce8', '#1890FF','#2FC25B', '#13C2C2', '#8543E0'])
          .adjust('stack')
          .style({
            lineWidth: 1,
            stroke: '#fff',
            lineJoin: 'round',
            lineCap: 'round'
          })
          .animate({
            appear: {
              duration: 1200,
              easing: 'bounceOut'
            }
          });
      
        chart.render();
        return chart;

      })
    };
    /**
   * 收入预警
   */
    function initgaugeChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
      new Promise(function(resolve,reject){ 
        
        util.request(api.QueryAccountingAnalysisUrl,{
          openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
            account_month:app.globalData.curr_date.split('-').join("")
        },'POST').then(function(res){
          if(res.data.success==true){
            app.globalData.dtData=res.data.dt[0];
            var num="";
            if(res.data.dt[0].column_val_01.toFixed(2)/10000>500){
              num=600;
            }else{
              num=res.data.dt[0].column_val_01.toFixed(2)/10000;
            }
            var datas = [
              { pointer: '连续12个月收入', value:num, length: 2, y: 1.05 },
              {lint:res.data.dt[0]}
            ];
            
            resolve(datas) // 将数据返回给到new上进行then索取
          }
          else{
            var datas =[];
            resolve(datas)
          }
          
          })
        // wx.request({
        //   url: api.QueryAccountingAnalysisUrl,//请求接口
        //   data: { 
        //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
        //     account_month:app.globalData.curr_date.split('-').join("")
        //    },
        //   header: {
        //     'content-type': 'application/json' ,// 默认值,
        //     'Authorization':'Bearer '+app.globalData.Token //设置验证
        //   },
        //   method: "POST",
        // // 请求成功后执行
        //   success: function (res) {
        //     console.log(1)
        //     console.log(res);
           
            
        //   },
        //   fail:function(err){
        //     console.log(err);
        //     Toast('网络异常');
        //   }
        // })
      }).then((data) => {

        console.log(data);
        // 全局设置，所有的图表生效
        var num1=data[1].lint.column_val_03*0.2/10000;
        var num2=data[1].lint.column_val_03*0.4/10000;
        var num3=data[1].lint.column_val_03*0.6/10000;
        var num4=data[1].lint.column_val_03*0.8/10000;
        var num5=data[1].lint.column_val_03/10000;
        chart = new F2.Chart({
          el: canvas,
          width,
          height
          
        });
        const Shape = F2.Shape;
      //自定义绘制数据的的形状
      Shape.registerShape('point', 'dashBoard', {
        getPoints: function (cfg) {
          const x = cfg.x;
          var y = cfg.y;

          return [
            { x: x, y: y },
            { x: x, y: 0.4 }
          ];
        },
        draw: function (cfg, container) {
          var point1 = cfg.points[0];
          var point2 = cfg.points[1];
          point1 = this.parsePoint(point1);
          point2 = this.parsePoint(point2);

          var line = container.addShape('Polyline', {
            attrs: {
              points: [point1, point2],
              stroke: '#1890FF',
              lineWidth: 2
            }
          });

          var text = cfg.origin._origin.value.toString();
          var text1 = container.addShape('Text', {
            attrs: {
              text:  (data[1].lint.column_val_01/10000).toFixed(2)+'万',
              x: cfg.center.x,
              y: cfg.center.y+10,
              fill: '#1890FF',
              fontSize: 18,
              textAlign: 'center',
              textBaseline: 'bottom'
            }
          });
          var text2 = container.addShape('Text', {
            attrs: {
              text: cfg.origin._origin.pointer,
              x: cfg.center.x,
              y: cfg.center.y+50,
              fillStyle: '#000000',
              textAlign: 'center',
              textBaseline: 'top'
            }
          });

          return [line, text1, text2];
        }
      });

     
      chart.source(data, {
        value: {
          type: 'linear',
          min: 0,
          max: 15,
          ticks: [0, num1, num2, num3,num4,num5],
          nice: false
        },
        length: { type: 'linear', min: 0, max: 10 },
        y: { type: 'linear', min: 0, max: 1 }
      });

      chart.coord('polar', {
        inner: 0,
        startAngle: -1.25 * Math.PI,
        endAngle: 0.25 * Math.PI,
        radius: 0.8
      });

      //配置value轴刻度线
      chart.axis('value', {
        tickLine: {
          strokeStyle: '#ccc',
          lineWidth: 2,
          length:6
        },
        label: null,
        grid: null,
        line: null
      });

      chart.axis('y', false);

      //绘制仪表盘辅助元素
      chart.guide().arc({
        start: [0, 1.3],
        end: [num3, 1.3],
        style: {
          strokeStyle: '#3bbd79',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
        chart.guide().arc({
        start: [num3, 1.3],
        end: [num4, 1.3],
        style: {
          strokeStyle: '#FFCC00',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
        chart.guide().arc({
        start: [num4, 1.3],
        end: [num5, 1.3],
        style: {
          strokeStyle: '#FF0000',
          lineWidth: 5,
          lineCap: 'round'
        }
      });
      chart.guide().arc({
        start: [0, 1.4],
        end: [num5, 1.4],
        style: {
          strokeStyle: '#ccc',
          lineWidth: 1
        }
      });

      chart.guide().text({
        position: [0, 1.8],
        content: '0',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart.guide().text({
        position: [num1,1.8],
        content: num1+'万',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
       chart.guide().text({
        position: [num2,1.8],
        content: num2+'万',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
           chart.guide().text({
        position: [num3,1.8],
        content: num3+'万',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart.guide().text({
        position: [num4, 1.8],
        content: num4+'万',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });
      chart.guide().text({
        position: [num5, 1.8],
        content: num5+'万',
        style: {
          fillStyle: '#ccc',
          font: '18px Arial',
          textAlign: 'center'
        }
      });

      chart.point().position('value*y')
        .size('length')
        .color('#1890FF')
        .shape('dashBoard');
      chart.render();
      return chart;

    })
  }
  /**
   * 职工福利费
   */
  function initwelfareChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
    new Promise(function(resolve,reject){ 

      util.request(api.QueryAccountingAnalysisUrl,{
        openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
          account_month:app.globalData.curr_date.split('-').join("")
      },'POST').then(function(res){
        console.log(res);
          if(res.data.success==true){
            app.globalData.dtData=res.data.dt[0];
            var num="";
            if(res.data.dt[0].column_val_65>14){
              num=15;
            }else{
              num=res.data.dt[0].column_val_65;
            }
            var datas = [
              { pointer: '职工福利费比率(年)', value:num, length: 2, y: 1.05 },
              {lint:res.data.dt[0]}
            ];
            
            resolve(datas) // 将数据返回给到new上进行then索取
          }
         
          else{
            var datas =[];
            resolve(datas)
          }
          
        })
      // wx.request({
      //   url: api.QueryAccountingAnalysisUrl,//请求接口
      //   data: { 
      //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      //     account_month:app.globalData.curr_date.split('-').join("")
      //    },
      //   header: {
      //     'content-type': 'application/json' ,// 默认值,
      //     'Authorization':'Bearer '+app.globalData.Token //设置验证
      //   },
      //   method: "POST",
      // // 请求成功后执行
      //   success: function (res) {
         
          
      //   },
      //   fail:function(err){
      //     console.log(err);
      //     Toast('网络异常');
      //   }
      // })
     
    }).then((data) => {

      console.log(data);
      // 全局设置，所有的图表生效
    
     var num1=(data[1].lint.column_val_62*0.8).toFixed(1);
     var num2=(data[1].lint.column_val_62*0.9).toFixed(1);
     var num3=data[1].lint.column_val_62;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
        
      });
      const Shape = F2.Shape;
    //自定义绘制数据的的形状
    Shape.registerShape('point', 'dashBoard', {
      getPoints: function (cfg) {
        const x = cfg.x;
        var y = cfg .y;

        return [
          { x: x, y: y },
          { x: x, y: 0.4 }
        ];
      },
      draw: function (cfg, container) {
        var point1 = cfg.points[0];
        var point2 = cfg.points[1];
        point1 = this.parsePoint(point1);
        point2 = this.parsePoint(point2);

        var line = container.addShape('Polyline', {
          attrs: {
            points: [point1, point2],
            stroke: '#1890FF',
            lineWidth: 2
          }
        });

        var text = cfg.origin._origin.value.toString();
        var text1 = container.addShape('Text', {
          attrs: {
            text: data[1].lint.column_val_65+'%',
            x: cfg.center.x,
            y: cfg.center.y+10,
            fill: '#1890FF',
            fontSize: 18,
            textAlign: 'center',
            textBaseline: 'bottom'
          }
        });
        var text2 = container.addShape('Text', {
          attrs: {
            text: cfg.origin._origin.pointer,
            x: cfg.center.x,
            y: cfg.center.y+70,
            fillStyle: '#000000',
            textAlign: 'center',
            textBaseline: 'top'
          }
        });

        return [line, text1, text2];
      }
    });

   
    chart.source(data, {
      value: {
        type: 'linear',
        min: 0,
        max: num2,
        ticks: [0,num1,num2,num3],
        nice: false
      },
      length: { type: 'linear', min: 0, max: 10 },
      y: { type: 'linear', min: 0, max: 1  }
    });

    chart.coord('polar', {
      inner: 0,
      startAngle: -1.25 * Math.PI,
      endAngle: 0.25 * Math.PI,
      radius: 0.8
    });

    //配置value轴刻度线
    chart.axis('value', {
      tickLine: {
        strokeStyle: '#ccc',
        lineWidth: 2,
        length:6
      },
      label: null,
      grid: null,
      line: null
    });

    chart.axis('y', false);

    //绘制仪表盘辅助元素
   
      chart.guide().arc({
      start: [0, 1.3],
      end: [num1, 1.3],
      style: {
        strokeStyle: '#3bbd79',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
      chart.guide().arc({
      start: [num1, 1.3],
      end: [num2, 1.3],
      style: {
        strokeStyle: '#FFCC00',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [num2, 1.3],
      end: [num3, 1.3],
      style: {
        strokeStyle: '#FF0000',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [0, 1.4],
      end: [num3, 1.4],
      style: {
        strokeStyle: '#ccc',
        lineWidth: 1
      }
    });

    chart.guide().text({
      position: [0, 1.8],
      content: '0%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num1, 1.8],
      content: num1+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num2, 1.8],
      content: num2+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num3, 1.8],
      content: num3+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });

    chart.point().position('value*y')
      .size('length')
      .color('#1890FF')
      .shape('dashBoard');
    chart.render();
    return chart;

  })
}
/**
   * 职工教育经费
   */
  function initeducationChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
    new Promise(function(resolve,reject){ 
      util.request(api.QueryAccountingAnalysisUrl,{
        openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
          account_month:app.globalData.curr_date.split('-').join("")
      },'POST').then(function(res){
      if(res.data.success==true){
          app.globalData.dtData=res.data.dt[0];
          var num="";
          if(res.data.dt[0].column_val_71>8){
            num=9;
          }else{
            num=res.data.dt[0].column_val_71;
          }
          var datas = [
            { pointer: '职工教育费(年)', value:num ,length: 2, y: 1.05 },
            {lint:res.data.dt[0]}
          ];
          
          resolve(datas) // 将数据返回给到new上进行then索取
        }
      
        else{
          var datas =[];
          resolve(datas)
        }
          
          
        })
      // wx.request({
      //   url: api.QueryAccountingAnalysisUrl,//请求接口
      //   data: { 
      //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      //     account_month:app.globalData.curr_date.split('-').join("")
      //    },
      //   header: {
      //     'content-type': 'application/json' ,// 默认值,
      //     'Authorization':'Bearer '+app.globalData.Token //设置验证
      //   },
      //   method: "POST",
      // // 请求成功后执行
      //   success: function (res) {
      //     console.log(res);
    
          
      //   },
      //   fail:function(err){
      //     console.log(err);
      //     Toast('网络异常');
      //   }
      // })


     
    }).then((data) => {

      console.log(data);
      // 全局设置，所有的图表生效
    
     var num1=(data[1].lint.column_val_69*0.8).toFixed(1);
     var num2=(data[1].lint.column_val_69*0.9).toFixed(1);
     var num3=data[1].lint.column_val_69;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
        
      });
      const Shape = F2.Shape;
    //自定义绘制数据的的形状
    Shape.registerShape('point', 'dashBoard', {
      getPoints: function (cfg) {
        const x = cfg.x;
        var y = cfg.y;

        return [
          { x: x, y: y },
          { x: x, y: 0.4 }
        ];
      },
      draw: function (cfg, container) {
        var point1 = cfg.points[0];
        var point2 = cfg.points[1];
        point1 = this.parsePoint(point1);
        point2 = this.parsePoint(point2);

        var line = container.addShape('Polyline', {
          attrs: {
            points: [point1, point2],
            stroke: '#1890FF',
            lineWidth: 2
          }
        });

        var text = cfg.origin._origin.value.toString();
        var text1 = container.addShape('Text', {
          attrs: {
            text: data[1].lint.column_val_71+'%',
            x: cfg.center.x,
            y: cfg.center.y+10,
            fill: '#1890FF',
            fontSize: 18,
            textAlign: 'center',
            textBaseline: 'bottom'
          }
        });
        var text2 = container.addShape('Text', {
          attrs: {
            text: cfg.origin._origin.pointer,
            x: cfg.center.x,
            y: cfg.center.y+70,
            fillStyle: '#000000',
            textAlign: 'center',
            textBaseline: 'top'
          }
        });

        return [line, text1, text2];
      }
    });

   
    chart.source(data, {
      value: {
        type: 'linear',
        min: 0,
        max: num2,
        ticks: [0,num1,num2,num3],
        nice: false
      },
      length: { type: 'linear', min: 0, max: 10 },
      y: { type: 'linear', min: 0, max: 1 }
    });

    chart.coord('polar', {
      inner: 0,
      startAngle: -1.25 * Math.PI,
      endAngle: 0.25 * Math.PI,
      radius: 0.8
    });

    //配置value轴刻度线
    chart.axis('value', {
      tickLine: {
        strokeStyle: '#ccc',
        lineWidth: 2,
        length:6
      },
      label: null,
      grid: null,
      line: null
    });

    chart.axis('y', false);

    //绘制仪表盘辅助元素
   
      chart.guide().arc({
      start: [0, 1.3],
      end: [num1, 1.3],
      style: {
        strokeStyle: '#3bbd79',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
      chart.guide().arc({
      start: [num1, 1.3],
      end: [num2, 1.3],
      style: {
        strokeStyle: '#FFCC00',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [num2, 1.3],
      end: [num3, 1.3],
      style: {
        strokeStyle: '#FF0000',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [0, 1.4],
      end: [num3, 1.4],
      style: {
        strokeStyle: '#ccc',
        lineWidth: 1
      }
    });

    chart.guide().text({
      position: [0, 1.8],
      content: '0%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num1, 1.8],
      content: num1+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num2, 1.8],
      content: num2+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num3, 1.8],
      content: num3+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });

    chart.point().position('value*y')
      .size('length')
      .color('#1890FF')
      .shape('dashBoard');
    chart.render();
    return chart;

  })
}
/**
   * 工会经费
   */
  function initUnionChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
    new Promise(function(resolve,reject){ 
      wx.request({
        url: api.QueryAccountingAnalysisUrl,//请求接口
        data: { 
          openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
          account_month:app.globalData.curr_date.split('-').join("")
         },
        header: {
          'content-type': 'application/json' ,// 默认值,
          'Authorization':'Bearer '+app.globalData.Token //设置验证
        },
        method: "POST",
      // 请求成功后执行
        success: function (res) {
          console.log(res);
          if(res.data.success==true){
            app.globalData.dtData=res.data.dt[0];
            var num="";
            if(res.data.dt[0].column_val_76>2){
              num=3;
            }else{
              num=res.data.dt[0].column_val_76;
            }
            var datas = [
              { pointer: '工会比率(年)', value:num, length: 2, y: 1.05 },
              {lint:res.data.dt[0]}
            ];
            
            resolve(datas) // 将数据返回给到new上进行then索取
          }
          // if(res.data.success!=true)
          // {
          //   var datas =[];
          // resolve(datas)
          // }
          else{
            var datas =[];
            resolve(datas)
          }
          
          
        },
        fail:function(err){
          console.log(err);
          Toast('网络异常');
        }
      })
    }).then((data) => {

      console.log(data);
      // 全局设置，所有的图表生效
    
     var num1=(data[1].lint.column_val_74*0.8).toFixed(1);
     var num2=(data[1].lint.column_val_74*0.9).toFixed(1);
     var num3=data[1].lint.column_val_74;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
        
      });
      const Shape = F2.Shape;
    //自定义绘制数据的的形状
    Shape.registerShape('point', 'dashBoard', {
      getPoints: function (cfg) {
        const x = cfg.x;
        var y = cfg.y;

        return [
          { x: x, y: y },
          { x: x, y: 0.4 }
        ];
      },
      draw: function (cfg, container) {
        var point1 = cfg.points[0];
        var point2 = cfg.points[1];
        point1 = this.parsePoint(point1);
        point2 = this.parsePoint(point2);

        var line = container.addShape('Polyline', {
          attrs: {
            points: [point1, point2],
            stroke: '#1890FF',
            lineWidth: 2
          }
        });

        var text = cfg.origin._origin.value.toString();
        var text1 = container.addShape('Text', {
          attrs: {
            text: data[1].lint.column_val_76+'%',
            x: cfg.center.x,
            y: cfg.center.y+10,
            fill: '#1890FF',
            fontSize: 24,
            textAlign: 'center',
            textBaseline: 'bottom'
          }
        });
        var text2 = container.addShape('Text', {
          attrs: {
            text: cfg.origin._origin.pointer,
            x: cfg.center.x,
            y: cfg.center.y+50,
            fillStyle: '#ccc',
            textAlign: 'center',
            textBaseline: 'top'
          }
        });

        return [line, text1, text2];
      }
    });

   
    chart.source(data, {
      value: {
        type: 'linear',
        min: 0,
        max: num2,
        ticks: [0,num1,num2,num3],
        nice: false
      },
      length: { type: 'linear', min: 0, max: 10 },
      y: { type: 'linear', min: 0, max: 1 }
    });

    chart.coord('polar', {
      inner: 0,
      startAngle: -1.25 * Math.PI,
      endAngle: 0.25 * Math.PI,
      radius: 0.8
    });

    //配置value轴刻度线
    chart.axis('value', {
      tickLine: {
        strokeStyle: '#ccc',
        lineWidth: 2,
        length:6
      },
      label: null,
      grid: null,
      line: null
    });

    chart.axis('y', false);

    //绘制仪表盘辅助元素
   
      chart.guide().arc({
      start: [0, 1.3],
      end: [num1, 1.3],
      style: {
        strokeStyle: '#3bbd79',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
      chart.guide().arc({
      start: [num1, 1.3],
      end: [num2, 1.3],
      style: {
        strokeStyle: '#FFCC00',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [num2, 1.3],
      end: [num3, 1.3],
      style: {
        strokeStyle: '#FF0000',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [0, 1.4],
      end: [num3, 1.4],
      style: {
        strokeStyle: '#ccc',
        lineWidth: 1
      }
    });

    chart.guide().text({
      position: [0, 1.8],
      content: '0%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num1, 1.8],
      content: num1+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num2, 1.8],
      content: num2+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num3, 1.8],
      content: num3+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });

    chart.point().position('value*y')
      .size('length')
      .color('#1890FF')
      .shape('dashBoard');
    chart.render();
    return chart;

  })
}
/**
   * 业务招待费
   */
  function initBusinessChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
    new Promise(function(resolve,reject){ 
      util.request(api.QueryAccountingAnalysisUrl,{
        openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
          account_month:app.globalData.curr_date.split('-').join("")
      },'POST').then(function(res){
          
          if(res.data.success==true){
            app.globalData.dtData=res.data.dt[0];
            var num="";
            if(res.data.dt[0].column_val_86>5){
              num=6;
            }else{
              num=res.data.dt[0].column_val_86;
            }
            var datas = [
              { pointer: '业务招待费当前比率(年)', value:num, length: 2, y: 1.05 },
              {lint:res.data.dt[0]}
            ];
            
            resolve(datas) // 将数据返回给到new上进行then索取
          }
          // if(res.data.success!=true)
          // {
          //   var datas =[];
          // resolve(datas)
          // }
          else{
            var datas =[];
            resolve(datas)
          }
          
          
        })
      // wx.request({
      //   url: api.QueryAccountingAnalysisUrl,//请求接口
      //   data: { 
      //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      //     account_month:app.globalData.curr_date.split('-').join("")
      //    },
      //   header: {
      //     'content-type': 'application/json' ,// 默认值,
      //     'Authorization':'Bearer '+app.globalData.Token //设置验证
      //   },
      //   method: "POST",
      // // 请求成功后执行
      //   success: function (res) {
    
          
      //   },
      //   fail:function(err){
      //     console.log(err);
      //     Toast('网络异常');
      //   }
      // })



    }).then((data) => {

      console.log(data);
      // 全局设置，所有的图表生效
    
     var num1=(data[1].lint.column_val_85*0.8).toFixed(1);
     var num2=(data[1].lint.column_val_85*0.9).toFixed(1);
     var num3=data[1].lint.column_val_85;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
        
      });
      const Shape = F2.Shape;
    //自定义绘制数据的的形状
    Shape.registerShape('point', 'dashBoard', {
      getPoints: function (cfg) {
        const x = cfg.x;
        var y = cfg.y;

        return [
          { x: x, y: y },
          { x: x, y: 0.4 }
        ];
      },
      draw: function (cfg, container) {
        var point1 = cfg.points[0];
        var point2 = cfg.points[1];
        point1 = this.parsePoint(point1);
        point2 = this.parsePoint(point2);

        var line = container.addShape('Polyline', {
          attrs: {
            points: [point1, point2],
            stroke: '#1890FF',
            lineWidth: 2
          }
        });

        var text = cfg.origin._origin.value.toString();
        var text1 = container.addShape('Text', {
          attrs: {
            text: data[1].lint.column_val_86+'‰',
            x: cfg.center.x,
            y: cfg.center.y+10,
            fill: '#1890FF',
            fontSize: 18,
            textAlign: 'center',
            textBaseline: 'bottom'
          }
        });
        var text2 = container.addShape('Text', {
          attrs: {
            text: cfg.origin._origin.pointer,
            x: cfg.center.x,
            y: cfg.center.y+80,
            fillStyle: '#000000',
            textAlign: 'center',
            textBaseline: 'top'
          }
        });

        return [line, text1, text2];
      }
    });

   
    chart.source(data, {
      value: {
        type: 'linear',
        min: 0,
        max: num2,
        ticks: [0,num1,num2,num3],
        nice: false
      },
      length: { type: 'linear', min: 0, max: 10 },
      y: { type: 'linear', min: 0, max: 1 }
    });

    chart.coord('polar', {
      inner: 0,
      startAngle: -1.25 * Math.PI,
      endAngle: 0.25 * Math.PI,
      radius: 0.8
    });

    //配置value轴刻度线
    chart.axis('value', {
      tickLine: {
        strokeStyle: '#ccc',
        lineWidth: 2,
        length:6
      },
      label: null,
      grid: null,
      line: null
    });

    chart.axis('y', false);

    //绘制仪表盘辅助元素
   
      chart.guide().arc({
      start: [0, 1.3],
      end: [num1, 1.3],
      style: {
        strokeStyle: '#3bbd79',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
      chart.guide().arc({
      start: [num1, 1.3],
      end: [num2, 1.3],
      style: {
        strokeStyle: '#FFCC00',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [num2, 1.3],
      end: [num3, 1.3],
      style: {
        strokeStyle: '#FF0000',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [0, 1.4],
      end: [num3, 1.4],
      style: {
        strokeStyle: '#ccc',
        lineWidth: 1
      }
    });

    chart.guide().text({
      position: [0, 1.8],
      content: '0‰',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num1, 1.8],
      content: num1+'‰',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num2, 1.8],
      content: num2+'‰',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num3, 1.8],
      content: num3+'‰',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });

    chart.point().position('value*y')
      .size('length')
      .color('#1890FF')
      .shape('dashBoard');
    chart.render();
    return chart;

  })
}
  /**
   * 广告费和业务宣传费
   */
  function initadvertisingChart(canvas, width, height) { // 使用 F2 绘制三大报表图表
    new Promise(function(resolve,reject){ 
      util.request(api.QueryAccountingAnalysisUrl,{
        openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
          account_month:app.globalData.curr_date.split('-').join("")
      },'POST').then(function(res){
               
          if(res.data.success==true){
            app.globalData.dtData=res.data.dt[0];
            var num="";
            if(res.data.dt[0].column_val_84>15){
              num=16;
            }else{
              num=res.data.dt[0].column_val_84;
            }
            var datas = [
              { pointer:'广告费和业务宣传费\n支出占比率(年)', value:num, length: 2, y: 1.05 },
              {lint:res.data.dt[0]}
            ];
            
            resolve(datas) // 将数据返回给到new上进行then索取
          }
          else{
            var datas =[];
            resolve(datas)
          }
          
          
        })
      // wx.request({
      //   url: api.QueryAccountingAnalysisUrl,//请求接口
      //   data: { 
      //     openid:app.globalData.openid,customer_info_id:app.globalData.curr_customer_info_id,
      //     account_month:app.globalData.curr_date.split('-').join("")
      //    },
      //   header: {
      //     'content-type': 'application/json' ,// 默认值,
      //     'Authorization':'Bearer '+app.globalData.Token //设置验证
      //   },
      //   method: "POST",
      // // 请求成功后执行
      //   success: function (res) {
    
          
          
      //   },
      //   fail:function(err){
      //     console.log(err);
      //     Toast('网络异常');
      //   }
      // })
    }).then((data) => {

      console.log(data);
      // 全局设置，所有的图表生效
    
     var num1=(data[1].lint.column_val_83*0.8).toFixed(1);
     var num2=(data[1].lint.column_val_83*0.9).toFixed(1);
     var num3=data[1].lint.column_val_83;
      chart = new F2.Chart({
        el: canvas,
        width,
        height
        
      });
      const Shape = F2.Shape;
    //自定义绘制数据的的形状
    Shape.registerShape('point', 'dashBoard', {
      getPoints: function (cfg) {
        const x = cfg.x;
        var y = cfg.y;

        return [
          { x: x, y: y },
          { x: x, y: 0.4 }
        ];
      },
      draw: function (cfg, container) {
        var point1 = cfg.points[0];
        var point2 = cfg.points[1];
        point1 = this.parsePoint(point1);
        point2 = this.parsePoint(point2);

        var line = container.addShape('Polyline', {
          attrs: {
            points: [point1, point2],
            stroke: '#1890FF',
            lineWidth: 2
          }
        });

        var text = cfg.origin._origin.value.toString();
        var text1 = container.addShape('Text', {
          attrs: {
            text: data[1].lint.column_val_84+'%',
            x: cfg.center.x,
            y: cfg.center.y+10,
            fill: '#1890FF',
            fontSize: 18,
            textAlign: 'center',
            textBaseline: 'bottom'
          }
        });
        var text2 = container.addShape('Text', {
          attrs: {
            text: cfg.origin._origin.pointer,
            x: cfg.center.x,
            y: cfg.center.y+60,
            fillStyle: '#000000',
            textAlign: 'center',
            textBaseline: 'top'
          }
        });

        return [line, text1, text2];
      }
    });

   
    chart.source(data, {
      value: {
        type: 'linear',
        min: 0,
        max: num2,
        ticks: [0,num1,num2,num3],
        nice: false
      },
      length: { type: 'linear', min: 0, max: 10 },
      y: { type: 'linear', min: 0, max: 1 }
    });

    chart.coord('polar', {
      inner: 0,
      startAngle: -1.25 * Math.PI,
      endAngle: 0.25 * Math.PI,
      radius: 0.8
    });

    //配置value轴刻度线
    chart.axis('value', {
      tickLine: {
        strokeStyle: '#ccc',
        lineWidth: 2,
        length:6
      },
      label: null,
      grid: null,
      line: null
    });

    chart.axis('y', false);

    //绘制仪表盘辅助元素
   
      chart.guide().arc({
      start: [0, 1.3],
      end: [num1, 1.3],
      style: {
        strokeStyle: '#3bbd79',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
      chart.guide().arc({
      start: [num1, 1.3],
      end: [num2, 1.3],
      style: {
        strokeStyle: '#FFCC00',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [num2, 1.3],
      end: [num3, 1.3],
      style: {
        strokeStyle: '#FF0000',
        lineWidth: 5,
        lineCap: 'round'
      }
    });
    chart.guide().arc({
      start: [0, 1.4],
      end: [num3, 1.4],
      style: {
        strokeStyle: '#ccc',
        lineWidth: 1
      }
    });

    chart.guide().text({
      position: [0, 1.8],
      content: '0%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num1, 1.8],
      content: num1+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num2, 1.8],
      content: num2+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });
    chart.guide().text({
      position: [num3, 1.8],
      content: num3+'%',
      style: {
        fillStyle: '#ccc',
        font: '18px Arial',
        textAlign: 'center'
      }
    });

    chart.point().position('value*y')
      .size('length')
      .color('#1890FF')
      .shape('dashBoard');
    chart.render();
    return chart;

  })
}

    that.setData({
      mountNodeRadial: {
        onInit: initChart
      },
      pieSelectRadial :{
        onInit: initpieChart
      },
      gaugedomRadial :{
        onInit: initgaugeChart
      },
      welfareRadial:{
        onInit:initwelfareChart
      },
      educationRadial:{
        onInit:initeducationChart
      },
      UnionRadial:{
        onInit:initUnionChart
      },
      BusinessRadial:{
        onInit:initBusinessChart
      },
      AdvertisingRadial:{
        onInit:initadvertisingChart
      }



  })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date:  app.globalData.curr_date,
    });
    that= this;
    console.log(that.data);  
    this.QueryAccountingAnalysis();
    let chart = null;
   
   console.log(that.data.dtData)
   
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});