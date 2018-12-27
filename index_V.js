var myLocal = {
  get(key){
    return JSON.parse(window.localStorage.getItem(key));
  },
  save(key,value){
    window.localStorage.setItem(key,JSON.stringify(value));
  }
}
var list = myLocal.get("stuList") || [{name: "姓名",score:"分数"}];
var tempList = {
  name: "",
  score: ""
}

var vm = new Vue({
  el: ".contWrap",
  data : {
    list,
  },
  methods:{
    clearStorage: function(){
      window.localStorage.clear();
      console.log("hehe")
    }
  }
})

function deepClone2(obj){
  return JSON.parse(JSON.stringify(obj))
}

function $(data){
  return document.getElementById(data);
}
function c$(data){
  return document.createElement(data);
}
function chkDtaNum(tarArr) {//更新选取的学生人数
  stuNumber.innerText = tarArr.length;
}
function shuffle(array) {//数组乱序
    return array.sort(function() {
        return Math.random() - 0.5;
    });
}
function selectStu(tempData) {//随机选择学生
  clearInterval(clock);
  clock = self.setInterval(function () {
    luckyName.innerText = tempData[x].stuName;
      x++;
    if(x >= tempData.length){
      x = 0;
    }
  }, 100);
  // setTimeout(function () {
  // 	clearInterval(clock);
  // }, 2000);
}
function addToList(name, value) {
    tempList.name = name;
    tempList.score = value;
    list.push(deepClone2(tempList));//push对象的时候为对象的浅克隆，里面数据会随着tempList的改变而改变，改为深度克隆之后bug解决
    console.log(tempList);
    tempList.name = "";
    tempList.score = "";
    console.log(list)
    myLocal.save("stuList",list);
    
}
function addHistory() {//将当前数据添加到历史记录中
  if(scoreBox.innerText !== ""){
    addToList(luckyName.innerText,scoreBox.innerText);
    
  }else{
    alert("请评分 243");
  }
}
function corSex(male, female) {//判断性别选项
  if(male.checked == true && female.checked == true){
    tmpData("0");
  }else{
    if(male.checked == true){
      tmpData("1");
    }
    if(female.checked == true){
      tmpData("-1");
    }
    if(male.checked == false && female.checked == false){
      alert('请至少选择一个性别');
    }
  }
}
function corClass(classO, classT) {//判断班级
  if(classO.checked == true && classT.checked == true){
    tmpSQL("0");
  }else{
    if(classO.checked == true){
      tmpSQL("1");
    }
    if(classT.checked == true){
      tmpSQL("-1");
    }
    if(classO.checked == false && classT.checked == false){
      alert('请至少选择一个班级');
    }
  }
}
function tmpSQL(result) {//建立临时点名数据库
  if(result == '0'){
    stuSQL = [];
    for(var i in stuDataO){
      stuSQL.push(stuDataO[i]);
    } 
    for(var l in stuDataT){
      stuSQL.push(stuDataT[l]);
    } 
  }
  if(result == '1'){
    stuSQL = [];
    for(var j in stuDataO){
      stuSQL.push(stuDataO[j]);
    } 
  }
  if(result == '-1'){
    stuSQL = [];
    for(var k in stuDataT){
      stuSQL.push(stuDataT[k]);
    } 
  }
}
function tmpData(result) {//根据临时点名数据库，创建临时学生分组，每次开始时更新临时分组
  corClass(classO, classT);
  shuffle(stuSQL);
  if(result == "1"){
    tempData = [];
    for(var i in stuSQL){
      if(stuSQL[i].stuSex == "1"){
        tempData.push(stuSQL[i]);
      }
    }
    chkDtaNum(tempData);
    selectStu(tempData);
  }
  if(result == "-1"){
    tempData = [];
    for(var j in stuSQL){
      if(stuSQL[j].stuSex == "0"){
        tempData.push(stuSQL[j]);
      }
    }
    chkDtaNum(tempData);
    selectStu(tempData);
  }
  if(result == "0"){
    tempData = [];
    for(var k in stuSQL){
      tempData.push(stuSQL[k]);
    }
    chkDtaNum(tempData);
    selectStu(tempData);
  }
}
let startBtn = $("start"),//开始按钮
  stopBtn = $("stop"),//停止按钮
  scoreBox = $("finalScore"),//最终得分
  male = $("male");//男性checkbox
  female = $("female"),//女性checkbox
  stuNumber = $("number"),//选中学生数目
  stuSQL = [],//临时学生数据库
  tempData = [],//临时学生分组
  skiper = $('skiper'),//是否跳过评分
  luckyName = document.getElementsByClassName('lkyName')[0],//幸运学生的姓名
  luckyNumber = document.getElementsByClassName('lkyNo')[0],//幸运学生的学号
  eHistory = document.getElementsByClassName('history')[0],//历史记录
  classO = $('classOne'),//一班
  classT = $('classTwo'),//二班
  x = 0,
  z = 0;//开关

var clock;
$('addScore').onfocus = function () {//分数框聚焦事件
  $('addScore').style.color = "#333";
  if($('addScore').value == "请输入0-9之间的数字"){
    $('addScore').value = "";
  }
}
$('addScore').onblur = function () {//分数框失焦事件
  if($('addScore').value == ""){
    $('addScore').value = "请输入0-9之间的数字";
    $('addScore').style.color = "#ddd";
  }
}
startBtn.addEventListener('click', function () {//startBtn点击事件
  if(luckyName.innerText !== ""){//判断luckyName非空时添加历史记录中
    addHistory();
  }
  if(skiper.checked == true){//跳过按钮
    scoreBox.innerText = "Skip";
  // }else{
  // 	scoreBox.innerText = "";
  }
  if(scoreBox.innerText == "" && luckyName.innerText !== ""){//分数评价判断
    alert('请先评定分数 320');
  }else{
    x = 0;
    if(skiper.checked == false){
      scoreBox.innerText = "";
    }
    $('addScore').value = "";
    startBtn.disabled = true;
    stopBtn.disabled = false;
    corSex(male, female);
    z = 1;
  }
}, false);
stopBtn.addEventListener('click',function (){//stopBtn点击事件
  if(z !== 1){//开关关闭状态时提示信息
    alert('请先开始');
  }else if(z == 1){
    startBtn.disabled = false;
    stopBtn.disabled = true;
    clearInterval(clock);
    clearInterval(time);
    var time = setInterval(function () {
      luckyName.innerText = tempData[x].stuName;
        x++;
      if(x >= tempData.length){
        x = 0;
      }
    }, 800);
    setTimeout(function () {
      clearInterval(time);
      setTimeout(function () {
        luckyName.innerText = tempData[x].stuName;
        luckyNumber.innerText = tempData[x].stuNum;
      }, 800)
    }, 2500);
  }
  z = 0;
})
var cpm = document.getElementsByClassName('comment')[0].onclick = function () {//评分事件
  if(scoreBox.innerText === "Skip"){
    console.log('skip');
  }else{
    if(scoreBox.innerText === "" && luckyName.innerText !== ""){
      $('scoreWrap').style.display = "block";
      $('addScore').value = "请输入0-9之间的数字";
      $('addScore').style.color = "#ddd";
    }else{
      alert('请先开始');
    }
  }
}
$('submitScore').addEventListener('click', function () {//提交分数事件
  var reg = /^\d/;
  var str = $('addScore').value.toString();
  var result = reg.exec(str);
  console.log(result);
  if(result == null){
    alert("请输入0-9之间的数字");
    result = undefined;
  }else{
    scoreBox.innerText = result[0];
    $('scoreWrap').style.display = "none";
  }
},false)
