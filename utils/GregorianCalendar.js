/**
 * @Author Aaron
 * @date 2019-11-20
 * @information 阳历工具
 */

import Utils from "../utils/Utils.js";

class GregorianCalendar {

    /**
     * 公历月、日判断所属星座
     * @param  cMonth [description]
     * @param  cDay [description]
     * @return Cn string
     */
    toAstro(cMonth,cDay) {
        let s   = "\u9b54\u7faf\u6c34\u74f6\u53cc\u9c7c\u767d\u7f8a\u91d1\u725b\u53cc\u5b50\u5de8\u87f9\u72ee\u5b50\u5904\u5973\u5929\u79e4\u5929\u874e\u5c04\u624b\u9b54\u7faf";
        let arr = [20,19,21,21,21,22,23,23,23,23,22,22];
        return s.substr(cMonth*2 - (cDay < arr[cMonth-1] ? 2 : 0),2) + "\u5ea7"; //座
    }

    /**
     * 传入offset偏移量返回干支
     * @param offset 相对甲子的偏移量
     * @return Cn string
     */
    toGanZhi(offset) {
        return this.Gan[offset%10] + this.Zhi[offset%12];
    }

    /**
     * 公历节日
     * 传入月和日期
     * 公历月
     * 公历日
     */
    cregorian(M,D){
        var Ssfw = null;
        var sFtv = this.sFtv;
        let month = Utils.zeroPadding(M);
        let day = Utils.zeroPadding(D);
        let date = `${month}${day}`
        let dayInfo = sFtv.find((el) => {
            return date === el.date;
        }) || null;
        return dayInfo;
    }

};

export default GregorianCalendar;
