const newsDetailAPI = "https://test-miniprogram.com/api/news/detail";

var util = require('../../utils/util.js');

Page({
  data: {
    newsId: "1523074607650",
    title: "外媒称香港回归15年打破“经济将死”预言",
    source: "中国新闻网",
    date: "09:34",
    readCount: 1231,
    content: {}
  },

  onLoad(options) {
    this.setData({ newsId: options.newsId });
    this.loadNewsDetail();
  },

  onPullDownRefresh() {
    this.loadNewsDetail(wx.stopPullDownRefresh);
  },

  loadNewsDetail: function(callback) {
    wx.request(util.getRequestObject({
      url: newsDetailAPI,
      data: { id: this.data.newsId },
      success: result => {
        this.setData(this.parseResult(result));
      },
      fileldName: "News Detail",
      callback: callback
    }));
  },

  parseResult(result) {
    result.date = result.date.slice(11, 16);
    if (result.source == "") result.source = "其他来源";
    console.log(result);
    return result;
  },
})