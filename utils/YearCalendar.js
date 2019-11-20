class YearCalendar {

    /**
     * 返回农历y年一整年的总天数
     * @param lunar Year
     * @return Number
     * @eg:var count = this.lYearDays(1987) ;//count=387
     */
    lYearDays(y) {
        var i, sum = 348;
        for(i=0x8000; i>0x8; i>>=1) { sum += (this.lunarInfo[y-1900] & i)? 1: 0; }
        return(sum+this.leapDays(y));
    }

    /**
     * 返回农历y年闰月是哪个月；若y年没有闰月 则返回0
     * @param lunar Year
     * @return Number (0-12)
     * @eg:var leapMonth = this.leapMonth(1987) ;//leapMonth=6
     */
    leapMonth(y) {
        return(this.lunarInfo[y-1900] & 0xf);
    }

    /**
     * 农历年份转换为干支纪年
     * @param  lYear 农历年的年份数
     * @return Cn string
     */
    toGanZhiYear(lYear) {
        var ganKey = (lYear - 3) % 10;
        var zhiKey = (lYear - 3) % 12;
        if(ganKey == 0) ganKey = 10;    //  如果余数为0则为最后一个天干
        if(zhiKey == 0) zhiKey = 12;    //  如果余数为0则为最后一个地支
        return this.Gan[ganKey-1] + this.Zhi[zhiKey-1];
    }

};

export default YearCalendar;
