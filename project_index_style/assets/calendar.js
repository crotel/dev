


var cal = {
  // (A) PROPERTIES
  // mName : ["Jan | 01", "Feb | 02", "Mar | 03", "Apr | 04", "May | 05", "Jun | 06", "Jul | 07", "Aug | 08", "Sep | 09", "Oct | 10", "Nov | 11", "Dec | 12"], // Month Names
  mName : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], // Month Names

  data : null, // Events for the selected period
  sDay : 0, // Current selected day
  sMth : 0, // Current selected month
  sYear : 0, // Current selected year
  sMon : false, // Week start on Monday?

  // (B) DRAW CALENDAR FOR SELECTED MONTH
  list : function () {
    // (B1) BASIC CALCULATIONS - DAYS IN MONTH, START + END DAY
    // Note - Jan is 0 & Dec is 11 in JS.
    // Note - Sun is 0 & Sat is 6
    cal.sMth = parseInt(document.getElementById("cal-mth").value); // selected month
    cal.sYear = parseInt(document.getElementById("cal-yr").value); // selected year
    var daysInMth = new Date(cal.sYear, cal.sMth+1, 0).getDate(), // number of days in selected month
        startDay = new Date(cal.sYear, cal.sMth, 1).getDay(), // first day of the month
        endDay = new Date(cal.sYear, cal.sMth, daysInMth).getDay(); // last day of the month

    // (B2) LOAD DATA FROM LOCALSTORAGE
    cal.data = localStorage.getItem("cal-" + cal.sMth + "-" + cal.sYear);
    if (cal.data==null) {
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, "{}");
      cal.data = {};
    } else {
      cal.data = JSON.parse(cal.data);
    }

    // (B3) DRAWING CALCULATIONS
    // Determine the number of blank squares before start of month
    var squares = [];
    if (cal.sMon && startDay != 1) {
      var blanks = startDay==0 ? 7 : startDay ;
      for (var i=1; i<blanks; i++) { squares.push("b"); }
    }
  if (!cal.sMon && startDay != 0) {
    for (var i=0; i<startDay; i++) { squares.push("b"); }
  }

    // Populate the days of the month
    for (var i=1; i<=daysInMth; i++) { squares.push(i); }

    // Determine the number of blank squares after end of month
  if (cal.sMon && endDay != 0) {
    var blanks = endDay==6 ? 1 : 7-endDay;
    for (var i=0; i<blanks; i++) { squares.push("b"); }
  }
if (!cal.sMon && endDay != 6) {
  var blanks = endDay==0 ? 6 : 6-endDay;
  for (var i=0; i<blanks; i++) { squares.push("b"); }
}

    // (B4) DRAW HTML CALENDAR
    // Container
    var container = document.getElementById("cal-container"),
    cTable = document.createElement("table");
    cTable.id = "calendar";
    container.innerHTML = "";
    container.appendChild(cTable);

    // First row - Day names
    var cRow = document.createElement("tr"),
    cCell = null,
    days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
    if (cal.sMon) { days.push(days.shift()); }
    for (var d of days) {
      cCell = document.createElement("td");
      cCell.innerHTML = d;
      cRow.appendChild(cCell);
    }
    cRow.classList.add("head");
    cTable.appendChild(cRow);

    // Days in Month
    var total = squares.length;
    cRow = document.createElement("tr");
    cRow.classList.add("day");
    for (var i=0; i<total; i++) {
      cCell = document.createElement("td");
      if (squares[i]=="b") { cCell.classList.add("blank"); }
      else {
        cCell.innerHTML = "<div class='dd'>"+squares[i]+"</div>";
        if (cal.data[squares[i]]) {
          // console.log(squares);
          cCell.innerHTML = "<div class='dd note'>"+squares[i]+"</div>";
          // cCell.innerHTML += "<div class='evt'>" + cal.data[squares[i]] + "</div>";
        }
        cCell.addEventListener("click", function(){
          cal.show(this);
        });
      }
      cRow.appendChild(cCell);
      if (i!=0 && (i+1)%7==0) {
        cTable.appendChild(cRow);
        cRow = document.createElement("tr");
        cRow.classList.add("day");
      }
    }

    // (B5) REMOVE ANY PREVIOUS ADD/EDIT EVENT DOCKET
    cal.close();
    setTimeout(function(){
      // document.getElementById("cal-dth").innerText = new Date().getDate()
        //let tmN = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"], // Month Names
        td = new Date().getDate().toString(),
        ty = new Date().getFullYear(),
        tm = new Date().getMonth() + 1;
        document.querySelectorAll('div.dd').forEach(function(e){

          if(cal.sYear === ty && cal.sMth + 1 === tm && e.innerHTML === td){
            e.parentElement.setAttribute("class", "today")
            e.setAttribute("class", "dd today")
          }
        });
        document.querySelectorAll('.head > td')[0].innerHTML += '<br>周日';
        document.getElementById("cal-bg").innerHTML = tm.toString().length === 2 ? tm.toString() : ['0',tm.toString()].join('');//tmN[tm - 1];
      },0);
  },

  // (C) SHOW EDIT EVENT DOCKET FOR SELECTED DAY
  show : function (el) {
    // (C1) FETCH EXISTING DATA
    cal.sDay = el.getElementsByClassName("dd")[0].innerHTML;

    // (C2) DRAW EVENT FORM
    var tForm = "<h1>" + (cal.data[cal.sDay] ? "EDIT" : "ADD") + " NOTE</h1>";
//     tForm += "<div id='evt-date'>" + cal.sDay + " " + cal.mName[cal.sMth] + " " + cal.sYear + "</div>"; 
    tForm += "<div id='evt-date'>" + cal.sDay + " " + (cal.sMth + 1) + " " + cal.sYear + "</div>";
    tForm += "<textarea id='evt-details' required>" + (cal.data[cal.sDay] ? cal.data[cal.sDay] : "") + "</textarea>";
    tForm += "<input type='button' value='Close' onclick='cal.close()'/>";
    tForm += "<input type='button' value='Delete' onclick='cal.del()'/>";
    tForm += "<input type='submit' value='Save'/>";
//     tForm += "<input type='button' value='Today?' onclick='lunar()'/>";
    tForm += "<input type='button' value='Today?' />";


    // (C3) ATTACH EVENT FORM
    var eForm = document.createElement("form");
    eForm.addEventListener("submit", cal.save);
    eForm.innerHTML = tForm;
    var container = document.getElementById("cal-event");
    container.innerHTML = "";
    container.appendChild(eForm);
  },

  // (D) CLOSE EVENT DOCKET
  close : function () {
    document.getElementById("cal-event").innerHTML = "";
  },

  // (E) SAVE EVENT
  save : function (evt) {
    evt.stopPropagation();
    evt.preventDefault();
    cal.data[cal.sDay] = document.getElementById("evt-details").value;
    localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
    cal.list();
  },

  // (F) DELETE EVENT FOR SELECTED DATE
  del : function () {
    if (confirm("Remove Note?")) {
      delete cal.data[cal.sDay];
      localStorage.setItem("cal-" + cal.sMth + "-" + cal.sYear, JSON.stringify(cal.data));
      cal.list();
    }
  }
};

// (G) INIT - DRAW MONTH & YEAR SELECTOR
window.addEventListener("load", function () {
  // (G1) DATE NOW
  var now = new Date(),
  nowMth = now.getMonth(),
  nowYear = parseInt(now.getFullYear());

  // (G2) APPEND MONTHS SELECTOR
  var month = document.getElementById("cal-mth");
  for (var i = 0; i < 12; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = cal.mName[i];
    if (i==nowMth) { opt.selected = true; }
    month.appendChild(opt);
  }

  // (G3) APPEND YEARS SELECTOR
  // Set to 10 years range. Change this as you like.
  var year = document.getElementById("cal-yr");
  for (var i = nowYear-100; i<=nowYear+10; i++) {
    var opt = document.createElement("option");
    opt.value = i;
    opt.innerHTML = i;
    if (i==nowYear) { opt.selected = true; }
    year.appendChild(opt);
  }

  // (G4) START - DRAW CALENDAR
//   // document.getElementById("cal-set").addEventListener("click", cal.list);
let control = () => {  
  document.getElementById("cal-yr").addEventListener('change', function(){cal.list();lunar()}); // cal.list);
  document.getElementById("cal-mth").addEventListener('change',function(){cal.list();lunar()});  // cal.list);
  document.querySelector('input[value="Today?"]').addEventListener('click', function(){cal.list();lunar()});
//   document.getElementById("calendar").addEventListener('dbclick', function(){cal.list();lunar()});
}
setTimeout(control,50);
  cal.list();
  // custom time
  let time = () => {
    // let date = new Date();
    let y = now.getFullYear();
    let m = now.getMonth() + 1;
    let d = now.getDate();
    let getTime = new Intl.DateTimeFormat("en-GB", {
      hour: "numeric",
      minute: "numeric",
      second: "numeric"
    }).format(now).split(':');
    return {
      h: getTime[0],
      m: getTime[1],
      s: getTime[2],
      year : y,
      month : m,
      day: d
    };
  };
  let drawTime = (el, tl) => {
    document.querySelector(el).innerHTML = tl;
  };
  let timeSplit = (el) => {
    let h = (e) => {return e.setAttribute('style', 'visibility: hidden;')};
    let v = (e) => {return e.setAttribute('style', 'visibility: visible;')};
    document.querySelectorAll(el).forEach((e)=>{
      e.getAttribute('style') === 'visibility: visible;' ? h(e) : v(e);
    })
  };
  let timer = () => {
    ['#hour', '#min', '#sec', '#timeSplit'].forEach(function(e) {
      e === '#hour' ? drawTime('#hour', time().h) : (
        e === '#min' ? drawTime('#min', time().m) : (
          e === '#sec' ? drawTime('#sec', time().s) : timeSplit('#timeSplit')
          )
        )
    })
  }
  let parentHeight = document.querySelector('#cal-container').clientHeight;
  let parentWidth = document.querySelector('#cal-container').clientWidth;
  document.querySelector('#cal-time').setAttribute('style',`top: calc(${parentHeight}px * 1.25); font-size: calc(${parentWidth}px / 8)`);
  setInterval(timer, 1000);
  let lunar = () => {
    var today = Solar.fromDate(now);

    var renderTime = function(year,month,day){
      var l = [];
      l.push(Solar.fromYmdHms(year,month,day,0,0,0).getLunar());
      for(var i=0;i<12;i++){
        l.push(Solar.fromYmdHms(year,month,day,(i+1)*2-1,0,0).getLunar());
      }
      var s = '<table><tbody>';

      s += '<tr><td width="9%">时辰</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td width="7%">'+l[i].getTimeInGanZhi()+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>时刻</td><td>0:00-0:59</td>';
      for(var i=0;i<12;i++){
        s += '<td>'+((i+1)*2-1)+':00-'+((i+1)*2-(i<11?0:1))+':59'+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>天神</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeTianShen()+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>黑黄道</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeTianShenType()+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>吉凶</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeTianShenLuck()+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>冲</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeChongDesc()+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>煞</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeSha()+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>宜</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeYi().join(' ')+'</td>';
      }
      s += '</tr>';

      s += '<tr><td>忌</td>';
      for(var i=0,j=l.length;i<j;i++){
        s += '<td>'+l[i].getTimeJi().join(' ')+'</td>';
      }
      s += '</tr>';

      s += '</tbody></table>';
    //$('#times').html(s);
    document.querySelector('#times').innerHTML = s;
  };

  var compute = function(){
    try{
      var year = cal.sYear === 0 ? time().year.toString():cal.sYear.toString();
      var month = cal.sMth === 0 ? time().month.toString():(cal.sMth + 1).toString();
      var day = cal.sDay === 0 ? time().day.toString():cal.sDay.toString();
//       var year = time().year.toString();
//       var month = time().month.toString();
//       var day = time().day.toString();
      if(year.length!=4){
        return;
      }
      if(year<1901||year>2099){
        return;
      }
      if(month<1||month>12){
        return;
      }
      if(day<1||day>31){
        return;
      }
      year = parseInt(year,10);
      month = parseInt(month,10);
      day = parseInt(day,10);
      var s = Solar.fromYmd(year,month,day);
      var d = s.getLunar();
      $('#yuexiang').html(d.getYueXiang());
      $('#a').html(d.getYearInGanZhi()+'年 <br>生肖：属'+d.getYearShengXiao()+' <br>纳音五行：'+d.getYearNaYin());
      $('#a1').html(d.getMonthInGanZhi()+'月 <br>生肖：属'+d.getMonthShengXiao()+' <br>纳音五行：'+d.getMonthNaYin());
      $('#a2').html(d.getDayInGanZhi()+'日 <br>生肖：属'+d.getDayShengXiao()+' <br>纳音五行：'+d.getDayNaYin());
      $('#a3').html(s.getJulianDay());
      $('#b').html(d.getYearInChinese()+'年 '+d.getMonthInChinese()+'月 '+d.getDayInChinese()+' (阴历)');
      $('#c').html(s.getYear()+'年 '+s.getMonth()+'月 '+s.getDay()+'日 星期'+s.getWeekInChinese()+' '+s.getXingZuo()+'座 (阳历)');
      $('#m').html(d.getSeason());
      $('#d').html(d.getPengZuGan()+' '+d.getPengZuZhi());
      $('#yj').html('<span style="color:green">宜</span>：'+d.getDayYi().join(' ')+'<br><span style="color:red">忌</span>：'+d.getDayJi().join(' '));
      $('#e').html(d.getDayShengXiao()+'日 冲'+d.getChongDesc());
      $('#js').html(d.getDayJiShen().join(' '));
      $('#xs').html(d.getDayXiongSha().join(' '));
      $('#f').html(d.getSha());
      $('#g').html(d.getGong()+'方'+d.getXiu()+d.getZheng()+d.getAnimal()+' ('+d.getXiuLuck()+')');
      $('#g1').html(d.getXiuSong());
      $('#h').html('阳贵神：'+d.getPositionYangGuiDesc()+' <br>阴贵神：'+d.getPositionYinGuiDesc());
      $('#i').html(d.getPositionXiDesc());
      $('#i1').html(d.getPositionFuDesc());
      $('#i2').html(d.getPositionCaiDesc());
      $('#i3').html(d.getMonthPositionTai());
      $('#i4').html(d.getDayPositionTai());
      $('#x').html(d.getFestivals().join('、')+' '+s.getFestivals().join('、'));
      $('#y').html(d.getOtherFestivals().join('、')+' '+s.getOtherFestivals().join('、'));
      $('#j').html(d.getZhiXing());
      $('#k').html(d.getDayTianShen()+'('+d.getDayTianShenType()+') '+ d.getDayTianShenLuck());
      var p = d.getPrevJieQi(),n = d.getNextJieQi();
      $('#p').html(p.getName()+' '+p.getSolar().toYmdHms()+' 星期'+p.getSolar().getWeekInChinese());
      $('#n').html(n.getName()+' '+n.getSolar().toYmdHms()+' 星期'+n.getSolar().getWeekInChinese());
      var jiuxing = d.getDayNineStar();
      $('#jiuxing').html(jiuxing.getNumber()+jiuxing.getColor()+' - '+jiuxing.getNameInTaiYi()+'星('+jiuxing.getWuXing()+') - '+jiuxing.getTypeInTaiYi());
      $('#jiuxing-song').html(jiuxing.getSongInTaiYi());
      
      renderTime(year,month,day);
    }catch(e){
      console.log(e);
    }
  };

  compute();
  let parentHeight2 = document.querySelector('#cal-container').clientHeight;
  document.querySelector('.huangli').setAttribute('style',`top: calc(${parentHeight}px + ${parentHeight2}px);`);

  setTimeout(()=>{
    document.querySelectorAll('tr').forEach((e)=>{
      e.querySelectorAll('td')[0].setAttribute('style','width: fit-content!important;white-space: nowrap!important;padding-right: 1em!important;')
    })
  },0);


}
setTimeout(lunar,0);
});

window.addEventListener("resize", function () {
 let parentHeight = document.querySelector('#cal-container').clientHeight;
 let parentWidth = document.querySelector('#cal-container').clientWidth;
 document.querySelector('#cal-time').setAttribute('style',`top: calc(${parentHeight}px * 1.25); font-size: calc(${parentWidth}px / 8)`);
 setTimeout(()=>{
  let parentHeight2 = document.querySelector('#cal-container').clientHeight;
  document.querySelector('.huangli').setAttribute('style',`top: calc(${parentHeight}px + ${parentHeight2}px);`);
},0);
 

},false)
