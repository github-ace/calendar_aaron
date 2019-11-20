/**
 * @Author Aaron
 * @date 2019-11-20
 * @information 农历工具
 */

import Utils from "../utils/Utils.js";

class AccordingCalendar {

    /**
     * 返回农历y年闰月的天数 若该年没有闰月则返回0
     * @param lunar Year
     * @return Number (0、29、30)
     * @eg:var leapMonthDay = this.leapDays(1987) ;//leapMonthDay=29
     */
    leapDays(y) {
        if(this.leapMonth(y))  { 
            return((this.lunarInfo[y-1900] & 0x10000)? 30: 29); 
        }
        return(0);
    }

    /**
     * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
     * @param lunar Year
     * @return Number (-1、29、30)
     * @eg:var MonthDay = this.monthDays(1987,9) ;//MonthDay=29
     */
    monthDays(y,m) {
        if(m>12 || m<1) {return -1} //  月份参数从1至12，参数错误返回-1
        return( (this.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
    }

    /**
     * 返回农历y年m月（非闰月）的总天数，计算m为闰月时的天数请使用leapDays方法
     * @param lunar Year
     * @return Number (-1、29、30)
     * @eg:var MonthDay = this.monthDays(1987,9) ;//MonthDay=29
     */
    monthDays(y,m) {
        if(m>12 || m<1) {return -1}//月份参数从1至12，参数错误返回-1
        return( (this.lunarInfo[y-1900] & (0x10000>>m))? 30: 29 );
    }

    /**
    * 返回公历(!)y年m月的天数
    * @param solar Year
    * @return Number (-1、28、29、30、31)
    * @eg:var solarMonthDay = this.leapDays(1987) ;//solarMonthDay=30
    */
    solarDays(y,m) {
        if(m>12 || m<1) {return -1}; //若参数错误 返回-1
        let ms = m-1;
        if(ms==1) { //2月份的闰平规律测算后确认返回28或29
            return(((y%4 == 0) && (y%100 != 0) || (y%400 == 0))? 29: 28);
        }else {
            return(this.solarMonth[ms]);
        }
    }

    /**
     * 传入公历(!)y年获得该年第n个节气的公历日期
     * @param y公历年(1900-2100)；n二十四节气中的第几个节气(1~24)；从n=1(小寒)算起 
     * @return day Number
     * @eg:var _24 = this.getTerm(1987,3) ;//_24=4;意即1987年2月4日立春
     */
    getTerm(y,n) {
        if(y<1900 || y>2100) {return -1;}
        if(n<1 || n>24) {return -1;}
        var _table = this.sTermInfo[y-1900];
        var _info = [
            parseInt('0x'+_table.substr(0,5)).toString() ,
            parseInt('0x'+_table.substr(5,5)).toString(),
            parseInt('0x'+_table.substr(10,5)).toString(),
            parseInt('0x'+_table.substr(15,5)).toString(),
            parseInt('0x'+_table.substr(20,5)).toString(),
            parseInt('0x'+_table.substr(25,5)).toString()
        ];
        var _calday = [
            _info[0].substr(0,1),
            _info[0].substr(1,2),
            _info[0].substr(3,1),
            _info[0].substr(4,2),
            
            _info[1].substr(0,1),
            _info[1].substr(1,2),
            _info[1].substr(3,1),
            _info[1].substr(4,2),
            
            _info[2].substr(0,1),
            _info[2].substr(1,2),
            _info[2].substr(3,1),
            _info[2].substr(4,2),
            
            _info[3].substr(0,1),
            _info[3].substr(1,2),
            _info[3].substr(3,1),
            _info[3].substr(4,2),
            
            _info[4].substr(0,1),
            _info[4].substr(1,2),
            _info[4].substr(3,1),
            _info[4].substr(4,2),

            _info[5].substr(0,1),
            _info[5].substr(1,2),
            _info[5].substr(3,1),
            _info[5].substr(4,2),
        ];
        return parseInt(_calday[n-1]);
    }

    /**
     * 传入农历数字月份返回汉语通俗表示法
     * @param lunar month
     * @return Cn string
     * @eg:var cnMonth = this.toChinaMonth(12) ;//cnMonth='腊月'
     */
    toChinaMonth(m) { // 月 => \u6708
        if(m>12 || m<1) {return -1} //若参数错误 返回-1
        var s = this.nStr3[m-1];
        s+= "\u6708";//加上月字
        return s;
    }

    /**
     * 传入农历日期数字返回汉字表示法
     * @param lunar day
     * @return Cn string
     * @eg:var cnDay = this.toChinaDay(21) ;//cnMonth='廿一'
     */
    toChinaDay(d){ //日 => \u65e5
        var s;
        switch (d) {
            case 10:
            s = '\u521d\u5341'; break;
        case 20:
            s = '\u4e8c\u5341'; break;
            break;
        case 30:
            s = '\u4e09\u5341'; break;
            break;
        default :
            s = this.nStr2[Math.floor(d/10)];
            s += this.nStr1[d%10];
        }
        return(s);
    }

    /**
     * 年份转生肖[!仅能大致转换] => 精确划分生肖分界线是“立春”
     * @param y year
     * @return Cn string
     * @eg:var animal = this.getAnimal(1987) ;//animal='兔'
     */
    getAnimal(y) {
        return this.Animals[(y - 4) % 12]
    }

    /**
     * 传入农历年月日以及传入的月份是否闰月获得详细的公历、农历object信息 <=>JSON
     * @param y  lunar year
     * @param m  lunar month
     * @param d  lunar day
     * @param isLeapMonth  lunar month is leap or not.[如果是农历闰月第四个参数赋值true即可]
     * @return JSON object
     * @eg:console.log(this.lunar2solar(1987,9,10));
     */
    lunar2solar(y,m,d,isLeapMonth) {   //参数区间1900.1.31~2100.12.1
        var isLeapMonth = !!isLeapMonth;
        var leapOffset  = 0;
        var leapMonth   = this.leapMonth(y);
        var leapDay     = this.leapDays(y);
        if(isLeapMonth&&(leapMonth!=m)) {return -1;}//传参要求计算该闰月公历 但该年得出的闰月与传参的月份并不同
        if(y==2100&&m==12&&d>1 || y==1900&&m==1&&d<31) {return -1;}//超出了最大极限值 
        var day  = this.monthDays(y,m); 
        var _day = day;
        //bugFix 2016-9-25 
        //if month is leap, _day use leapDays method 
        if(isLeapMonth) {
            _day = this.leapDays(y,m);
        }
        if(y < 1900 || y > 2100 || d > _day) {return -1;}//参数合法性效验
        
        //计算农历的时间差
        var offset = 0;
        for(var i=1900;i<y;i++) {
            offset+=this.lYearDays(i);
        }
        var leap = 0,isAdd= false;
        for(var i=1;i<m;i++) {
            leap = this.leapMonth(y);
            if(!isAdd) {//处理闰月
                if(leap<=i && leap>0) {
                    offset+=this.leapDays(y);isAdd = true;
                }
            }
            offset+=this.monthDays(y,i);
        }
        //转换闰月农历 需补充该年闰月的前一个月的时差
        if(isLeapMonth) {offset+=day;}
        //1900年农历正月一日的公历时间为1900年1月30日0时0分0秒(该时间也是本农历的最开始起始点)
        var stmap   =   Date.UTC(1900,1,30,0,0,0);
        var calObj  =   new Date((offset+d-31)*86400000+stmap);
        var cY      =   calObj.getUTCFullYear();
        var cM      =   calObj.getUTCMonth()+1;
        var cD      =   calObj.getUTCDate();

        return this.solar2lunar(cY,cM,cD);
    }

    /**
     * 农历节日
     * 传入月和日期
     * 农历月
     * 农历日
     * 农历最后一天是几号
     */
    farmers(lMonth,lDay,env){
        let lFtv = this.lFtv;
        let Slfw = null;
        let month = Utils.zeroPadding(lMonth);
        let day = Utils.zeroPadding(lDay);
        let date = `${month}${day}`;
        Slfw = lFtv.find((el) => el.date === date) || null;
        if (12==lMonth && env==lDay){    //判断是否为除夕
            Slfw = this.eve;
        }
        return Slfw;
    }

}

export default AccordingCalendar;
