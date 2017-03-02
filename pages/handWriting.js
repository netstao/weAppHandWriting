// pages/handWriting.js
Page({
  data: {
    id: 'handWriting',
    lastLoc: { x: 0, y: 0 },
    isOnMoveDown: false,
    lastTimestamp: 0,
    lastLineWidth: -1
  },
  mouseDown() {
    this.setData({
      isOnMoveDown: true
    })
  },
  uploadScaleStart(e) {
    console.log(e)
    let [touch0, touch1] = e.touches
    var curLoc = {
      x: touch0.x,
      y: touch0.y
    }

    this.setData({
      lastLoc: curLoc,
      lastTimestamp: new Date().getTime(),
      isOnMoveDown: true,
      lastLineWidth: -1
    })
  },
  uploadScaleMove(e) {
    // console.log(e)
    let [touch0, touch1] = e.changedTouches
    //draw 
    var isOnMoveDown = this.data.isOnMoveDown;
    if (isOnMoveDown) {
      var ctx = this.data.ctx

      var curLoc = touch0
      var lastLoc = this.data.lastLoc
      var currTimestamp = new Date().getTime()
      var s = this.calcDistance(curLoc, lastLoc)
      var t = currTimestamp - this.data.lastTimestamp
      var lineWidth = this.calcLineWidth(t, s)
      ctx.beginPath()
      ctx.moveTo(lastLoc.x, lastLoc.y)
      ctx.lineTo(curLoc.x, curLoc.y)
      ctx.setStrokeStyle('black')
      ctx.setLineCap('round')
      ctx.setLineJoin('round')
      ctx.setLineWidth(lineWidth)

      ctx.stroke()
      ctx.draw(true)
      //console.log(touch0, touch1);
      this.setData({
        lastLoc: curLoc,
        lastTimestamp: currTimestamp,
        lastLineWidth: lineWidth
      })
    }

  },
  retDraw: function () {
    this.data.ctx.clearRect(0, 0, 700, 730)
    this.data.ctx.draw()
    //this.data.ctx.restore()
    //this.drawBg()
  },
  calcLineWidth: function (t, s) {
    var v = s / t
    var retLineWidth
    if (v <= 0.1) {
      retLineWidth = 10
    } else if (v >= 10) {
      retLineWidth = 1
    } else {
      retLineWidth = 10 - (v - 0.1) / (10 - 0.1) * (10 - 1)
    }

    if (this.data.lastLineWidth == -1)
      return retLineWidth

    return this.data.lastLineWidth * 9 / 10 + retLineWidth * 1 / 10
  },
  calcDistance: function (loc1, loc2) {
    return Math.sqrt((loc1.x - loc2.y) * (loc1.x - loc2.y) + (loc1.y - loc2.y) * (loc1.y - loc2.y))
  },
  uploadScaleEnd: function () {
    this.setData({
      lastLineWidth: -1,
      lastTimestamp: new Date().getTime()
    })
  },
  onLoad: function (options) {
    //this.drawBg()
    // this.getSysInfo();
    var id = this.data.id
    var ctx = wx.createCanvasContext(id)
    this.setData({
      ctx: ctx
    })
  },
  getSysInfo: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var pix = res.pixelRatio
        that.setData({
          width: res.windowWidth * pix,
          height: res.windowHeight * pix
        })
      }
    })
  },
  drawBg: function () {
    var that = this
    wx.getImageInfo({
      src: '/image/qian.png',
      success: function (res) {
        var id = that.data.id
        var ctx = wx.createCanvasContext(id)
        ctx.drawImage('/image/qian.png', 0, 0, res.width, res.height)
        ctx.save()
        ctx.draw(true)
        that.setData({
          ctx: ctx
        })
      }
    })
  },
  subCanvas: function () {
    var that = this
    console.log('subCanvas')
    wx.canvasToTempFilePath({
      canvasId: 'handWriting',
      success: function (res) {
        console.log(res.tempFilePath)
      },
      fail: function (res) {
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})