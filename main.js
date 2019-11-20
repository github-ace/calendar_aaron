import Mixins from "./utils/Mixins.js";

import Configuration from "./component/Configuration.js";
import AccordingCalendar from "./utils/AccordingCalendar.js";
import GregorianCalendar from "./utils/GregorianCalendar.js";
import YearCalendar from "./utils/YearCalendar.js";

const mixins = new Mixins();
let mixinArr = [Configuration,AccordingCalendar,GregorianCalendar,YearCalendar];
const mixinClass = mixins.mix(...mixinArr);

class Calendar extends mixinClass {

    constructor(...arg){
        super();
        this.mountDictionary();
    }

    setGregorianHoliday(holidayArr = []){
        this.testParameters(holidayArr);
        this.sFtv = [...this.sFtv,...holidayArr];
    }

    deleteGregorianHoliday(arr){
        this.deleteHoliday('sFtv',arr);
    }

    replaceGregorianHoliday(arr){
        
        this.replaceHoliday('sFtv',arr);
    }

    setAccordingHoliday(holidayArr = []){
        this.lFtv = [...this.lFtv,...holidayArr];
    }

    deleteAccordingHoliday(arr){
        this.deleteHoliday('lFtv',arr);
    }

    replaceAccordingHoliday(arr){
        this.replaceHoliday('lFtv',arr);
    }

    replaceHoliday(key,arr){
        this[key] = arr;
    }

    deleteHoliday(key,arr){
        let cArr = [...arr];
        while (cArr.length) {
            let date = cArr.pop();
            if(key === 'lFtv' && date === '1230') this.isEve();
            this[key] = this[key].filter(el => {
                return el.date !== date;
            });
        }
    }

    isEve(){
        this.eve = null;
    }

    /**
     * 传入阳历年月日获得详细的公历、农历object信息 <=>JSON
     * @param y  solar year
     * @param m  solar month
     * @param d  solar day
     * @return JSON object
     * @eg:console.log(this.conversion(1987,11,01));
     */
    conversion (y,m,d) { //参数区间1900.1.31~2100.12.31
        if(y<1900 || y>2100) {return -1;}//年份限定、上限
        if(y==1900&&m==1&&d<31) {return -1;}//下限
        if(!y) { //未传参  获得当天
            var objDate = new Date();
        }else {
            var objDate = new Date(y,parseInt(m)-1,d)
        }
        var i, leap=0, temp=0;
        //修正ymd参数
        var y = objDate.getFullYear(),m = objDate.getMonth()+1,d = objDate.getDate();
        var offset   = (Date.UTC(objDate.getFullYear(),objDate.getMonth(),objDate.getDate()) - Date.UTC(1900,0,31))/86400000;
        for(i=1900; i<2101 && offset>0; i++) { temp=this.lYearDays(i); offset-=temp; }
        if(offset<0) { offset+=temp; i--; }
        
        //是否今天
        var isTodayObj = new Date(),isToday=false;
        if(isTodayObj.getFullYear()==y && isTodayObj.getMonth()+1==m && isTodayObj.getDate()==d) {
            isToday = true;
        }
        //星期几
        var nWeek = objDate.getDay(),cWeek = this.nStr1[nWeek];
        if(nWeek==0) {nWeek =7;}//数字表示周几顺应天朝周一开始的惯例
        //农历年
        var year = i;
        
        var leap = this.leapMonth(i); //闰哪个月
        var isLeap = false;
        
        //效验闰月
        for(i=1; i<13 && offset>0; i++) {
            //闰月
            if(leap>0 && i==(leap+1) && isLeap==false){ 
                --i;
                isLeap = true; temp = this.leapDays(year); //计算农历闰月天数
            }
            else{
                temp = this.monthDays(year, i);//计算农历普通月天数
            }
            //解除闰月
            if(isLeap==true && i==(leap+1)) { isLeap = false; }
            offset -= temp;
        }
        
        if(offset==0 && leap>0 && i==leap+1)
        if(isLeap){
            isLeap = false;
        }else{ 
            isLeap = true; --i;
        }
        if(offset<0){ offset += temp; --i; }
        //农历月
        var month = i;
        //农历日
        var day = offset + 1;
        
        //天干地支处理
        var sm = m-1;
        var gzY = this.toGanZhiYear(year);
        
        //月柱 1900年1月小寒以前为 丙子月(60进制12)
        var firstNode = this.getTerm(year,(m*2-1)); // 返回当月「节」为几日开始
        var secondNode = this.getTerm(year,(m*2));  // 返回当月「节」为几日开始

        //依据12节气修正干支月
        var gzM = this.toGanZhi((y-1900)*12+m+11);
        if(d>=firstNode) {
            gzM = this.toGanZhi((y-1900)*12+m+12);
        }

        //传入的日期的节气与否
        var isTerm = false;
        var Term   = null;
        if(firstNode==d) {
            isTerm  = true;
            Term    = this.solarTerm[m*2-2];
        }
        if(secondNode==d) {
            isTerm  = true;
            Term    = this.solarTerm[m*2-1];
        }
        var env = 0;
        var lX = isLeap? this.leapDays(year): this.monthDays(year,month);
        if (month==12){env=lX}

        //日柱 当月一日与 1900/1/1 相差天数
        var dayCyclical = Date.UTC(y,sm,1,0,0,0,0)/86400000+25567+10;
        var gzD = this.toGanZhi(dayCyclical+d-1);
        //该日期所属的星座
        var astro = this.toAstro(m,d);
        var holiday = this.cregorian(sm+1,d);
        var farmers = this.farmers(month,day,env);
        return {
            'lYear':year,
            'lMonth':month,
            'lDay':day,
            'Animal':this.getAnimal(year),
            'IMonthCn':(isLeap?"\u95f0":'')+this.toChinaMonth(month),
            'IDayCn':this.toChinaDay(day),
            'cYear':y,
            'cMonth':m,
            'cDay':d,
            'gzYear':gzY,
            'gzMonth':gzM,
            'gzDay':gzD,
            'isToday':isToday,
            'isLeap':isLeap,
            'nWeek':nWeek,
            'ncWeek':"\u661f\u671f"+cWeek,
            'isTerm':isTerm,
            'Term':Term,
            'astro':astro,
            'Holiday':holiday,
            'Farmers':farmers
        }
    }

}

export default Calendar;
