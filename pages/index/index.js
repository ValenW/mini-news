const newsListAPI = "https://test-miniprogram.com/api/news/list";
const newsDetailAPI = "https://test-miniprogram.com/api/news/detail";
const newsTypes = [
  { name: "国内", type: "gn" },
  { name: "国际", type: "gj" },
  { name: "财经", type: "cj" },
  { name: "娱乐", type: "yl" },
  { name: "军事", type: "js" },
  { name: "体育", type: "ty" },
  { name: "其他", type: "other" },
];

Page({
  data: {
    newsTypes: newsTypes,
    selectedType: "gn",
    hotNews: {
      id: 1519631218506,
      title: "外媒称香港回归15年打破经济将死预言",
      date: "2012-04-21T11:32:04.000Z",
      source: "中国新闻网",
      firstImage: "http://img1.gtimg.com/news/pics/hv1/38/85/1076/69988613.jpg",
    },
    newsList: [
      {
        id: 1519631218506,
        title: "外媒称香港回归15年打破经济将死预言",
        date: "2012-04-21T11:32:04.000Z",
        source: "中国新闻网",
        firstImage: "http://img1.gtimg.com/news/pics/hv1/38/85/1076/69988613.jpg",
      },
    ]
  },

  onLoad() {
    this.refreshNews();
  },

  onPullDownRefresh() {
    this.refreshNews(wx.stopPullDownRefresh);
  },

  refreshNews: function (callback) {
    wx.request({
      url: newsListAPI,
      data: {
        type: this.data.selectedType
      },
      success: res => {
        console.log(res);
        let result = this.parsenewsResult(res);
        if (result != null) {
          this.setData({
            hotNews: result.hotNews,
            newsList: result.newsList
          });
        } else {
          this.logFail("Refresh News result parse", res);
        }
      },
      fail: res => {
        this.logFail("Refresh News request", res);
      },
      complete: res => {
        callback && callback();
      }
    });
  },

  parsenewsResult: function(res) {
    if (res.data && res.data.code == "200" && res.data.message == "success") {
      let newses = res.data.result;
      let firstHaveImage = null;

      newses.forEach(news => {
        news.date = news.date.slice(11, 16);
        if (firstHaveImage == null && news.firstImage != null && news.firstImage != '')
          firstHaveImage = news;
        if (news.firstImage == '') news.firstImage == '/image/default.png';
        if (news.source == '') news.source = "其他来源";
      });
      newses.splice(newses.indexOf(firstHaveImage), 1);

      return {
        newsList: newses,
        hotNews: firstHaveImage
      };
    }
  },

  onNewsTypeTap: function(event) {
    console.log(event);
    let index = event.currentTarget.dataset.index;
    this.setData({ "selectedType": newsTypes[index].type });
    this.refreshNews();
  },

  onNewsTap: function (event) {
    console.log(event);
    let newsId = event.currentTarget.dataset.newsId;
    wx.navigateTo({
      url: '/pages/detail/detail?newsId=' + newsId,
    });
  },

  logFail(requestFor, res) {
    console.log("Error when " + requestFor + ":");
    console.log(res);
  },
})
