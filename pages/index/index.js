const weatherNowAPI = "https://test-miniprogram.com/api/news/list";
const weatherFutureAPI = "https://test-miniprogram.com/api/news/detail";

Page({
  data: {
    
  },

  onLoad() {
    
  },

  onPullDownRefresh() {
    
  },
  
  logFail(requestFor, res) {
    console.log("Error when " + requestFor + ":");
    console.log(res);
  },
})
