//初始化数据
function tabbarinit() {
    return [
        {
            "selectedIconPath": "/images/home_on.png",
            "iconPath": "/images/home_in.png",
            "pagePath": "/pages/index/index",
            "text": "首页"
        }, {
            "selectedIconPath": "/images/auction_on.png",
            "iconPath": "/images/auction_in.png",
            "pagePath": "/pages/goodsPublish/goodsPublish",
            "text": "发布"
        },{
            "selectedIconPath": "/images/information_on.png",
            "iconPath": "/images/information_in.png",
            "pagePath": "/pages/information/information",
            "text": "资讯"
        },{
            "selectedIconPath": "/images/my_on.png",
            "iconPath": "/images/my_in.png",
            "pagePath": "/pages/my/my",
            "text": "我的"
        }
    ]
}
//tabbar 主入口
function tabbarmain(bindName = "tabdata", id, target) {
    var that = target;
    var bindData = {};
    var otabbar = tabbarinit();
    otabbar[id]['iconPath'] = otabbar[id]['selectedIconPath']; //换当前的icon
    otabbar[id]['current'] = 1;
    bindData[bindName] = otabbar;
    that.setData({ bindData });
}

module.exports = {
    tabbar: tabbarmain
};