/**
 * Created by kyn on 19/3/13.
 */
const util = require('../../../utils/util.js');

/**
 * 倒计时函数
 */
function cutDown(_that) {
    let {mainData } = _that.data;
    if (mainData.length > 0) {
        mainData.map(i => {
            i.timeShow = util.timeCountDown(i.time);
            i.time = i.time - 1
        });
    }

    _that.setData({
        mainData: mainData
    });

}


module.exports = {
    cutDown: cutDown
};
