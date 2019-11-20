## Calendar


这是一个将公历日期转换为阴历日期的工具包，其中包括24节气，星座，所属年份等等信息。

This is a Gregorian calendar date conversion to the lunar calendar date kit, including 24 solar terms, constellation, year and so on information.

#### 示例(The sample)

```
const calendar = new Calendar();
console.log(calendar.conversion(2020,1,24))
```

> 其他方法(Other methods)

**添加公历/阴历节日**  
**Add Gregorian/lunar calendar festivals**

第一个参数为需要填入的节日，以数组形式传入，数组中包含对象，其中键(name,date,value)必需存在。  
The first parameter is the festival that needs to be filled in, which is passed in as an array. The array contains the object, in which the key (name,date,value) must exist.

```
const calendar = new Calendar();
//  添加公历节日
//  Add Gregorian calendar holidays.
calendar.setGregorianHoliday([
    name:"生日",
    date:"1201",
    value:"birthday"
]);
//  添加农历节日
//  Add lunar festivals.
calendar.setAccordingHoliday([
    name:"生日",
    date:"1201",
    value:"birthday"
]);
```

**删除原有公历/农历节日**  
**Delete the original Gregorian calendar/lunar festival**

第一个参数为需要删除原有节日的数组，只需填写日期即可。  
The first parameter is to delete the array of the original festival, just fill in the date.

```
const calendar = new Calendar();
//  删除公历节日
//  Delete calendar festivals
calendar.deleteGregorianHoliday(["0928"]);
//  删除农历节日
//  Delete lunar festivals
calendar.deleteAccordingHoliday(["1230"]);
```
