Component({
  data: {
    num: 0
  },
  properties: {
    data: {
      type: Array,
      observer(newVal) {
        this.setData({
          basicsList: newVal
        })
      }
    },
    type: {
      type: String,
      observer(newVal) {
        this.setData({
          stepType: newVal || 'basic1'
        })
      }
    },
    active: {
      type: Number,
      observer(newVal) {
        this.setData({
          num: newVal || 0
        })
      }
    },
    color: {
      type: String,
      observer(newVal) {
        this.setData({
          stepActives: newVal || '#e54d42'
        })
      }
    },
    uncolor: {
      type: String,
      observer(newVal) {
        this.setData({
          stepUnActives: newVal || '#ccc'
        })
      }
    }
  },
  methods: {

  },
  //用户点击tab时调用
  titleClick: function (e) {
    console.log(123);
  },
  onChange(event){
    console.log(123);
  }
  
})