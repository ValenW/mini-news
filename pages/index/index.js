const newsListAPI = "https://test-miniprogram.com/api/news/list";
const newsTypes = [
  { name: "国内", type: "gn" },
  { name: "国际", type: "gj" },
  { name: "财经", type: "cj" },
  { name: "娱乐", type: "yl" },
  { name: "军事", type: "js" },
  { name: "体育", type: "ty" },
  { name: "其他", type: "other" },
];

var util = require('../../utils/util.js');

var onMoving = false;
var moveStartX;

Page({
  data: {
    newsTypes: newsTypes,
    selectedIndex: 0,
    hotNews: {
      id: 1519631218506,
      title: "外媒称香港回归15年打破经济将死预言",
      date: "11:32",
      source: "中国新闻网",
      firstImage: "http://img1.gtimg.com/news/pics/hv1/38/85/1076/69988613.jpg",
    },
    newsList: []
  },

  onLoad() {
    this.refreshNews();
  },

  onPullDownRefresh() {
    this.refreshNews(wx.stopPullDownRefresh);
  },

  refreshNews: function (callback) {
    wx.request(util.getRequestObject({
      url: newsListAPI,
      data: { type: newsTypes[this.data.selectedIndex].type },
      success: result => {
        this.setData(this.parseNewsResult(result));
      },
      fieldName: "News List",
      callback: callback
    }));
  },

  parseNewsResult: function (newses) {
    if (newses != null) {
      let firstHaveImage = null;
      newses.forEach(news => {
        news.date = news.date.slice(11, 16);
        if (firstHaveImage == null && news.firstImage != null && news.firstImage != '') {
          firstHaveImage = news;
        }
        if (news.firstImage == '') news.firstImage == '/image/default.png';
        if (news.source == '') news.source = "其他来源";
      });
      newses.splice(newses.indexOf(firstHaveImage), 1);

      return {
        newsList: newses,
        hotNews: firstHaveImage
      };
    }
    return null;
  },

  onNewsTypeTap: function(event) {
    console.log(event);
    let index = event.currentTarget.dataset.index;
    this.setData({ "selectedIndex": index });
    this.refreshNews();
  },

  onNewsTap: function (event) {
    console.log(event);
    let newsId = event.currentTarget.dataset.newsId;
    wx.navigateTo({
      url: '/pages/detail/detail?newsId=' + newsId,
    });
  },


  onTouchStart(event) {
    moveStartX = event.touches[0].pageX;
    onMoving = true;
  },

  onTouchEnd(event) {
    onMoving = false;
  },

  onTouchMove(event) {
    if (onMoving) {
      let moveEnd = event.touches[0].pageX;
      if (moveStartX - moveEnd > 50) { // move right
        this.moveRight();
        onMoving = false;
      } else if (moveStartX - moveEnd < -50) { // move left
        this.moveLeft();
        onMoving = false;
      }
    }
  },

  moveRight() {
    this.tryChangeType(1);
  },

  moveLeft() {
    this.tryChangeType(-1);
  },

  tryChangeType(indexPlus) {
    let minIndex = 0, maxIndex = newsTypes.length - 1, nowIndex = this.data.selectedIndex;
    let newIndex = nowIndex + indexPlus;
    if (newIndex >= minIndex && newIndex <= maxIndex) {
      this.setData({ selectedIndex: newIndex});
      this.refreshNews();
    }
  }
})
