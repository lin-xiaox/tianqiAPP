
let citys
$.ajax({
    url:"https://www.toutiao.com/stream/widget/local_weather/city/",
    type:"get",
    dataType:"jsonp",
    success:function(e){
        citys = e.data
        let str = ""
        for(obj in citys){
            // console.log(obj)
            str+=`<h2>${obj}</h2>`
            str+=`<div class="con">`
            for(key2 in citys[obj]){
                str+=`<div class="city">${key2}</div>`
            }
            str+=`</div>`
        }
        $(str).appendTo($(".main"))
    }
})


$(function(){

$(".header").click(function(){
    // $(".cityBox").css("display","block")
    $(".cityBox").slideDown();
})
$(".cityBox .search span").click(function(){
    // $(".cityBox").css("display","none")
    $(".cityBox").slideUp();
})

$(".cityBox").on("touchstart",function(event){
    if(event.target.className=="city"){
        let citys=event.target.innerHTML;
        $(".cityBox").slideUp();
        $.ajax({
            url:"https://www.toutiao.com/stream/widget/local_weather/data/",
            data:{'city':citys},
            type:"get",
            dataType:"jsonp",
            success:function(e){
                update(e.data)
            }
        })
    }
})

function update(data){
    $(".header #city").text(data.city)//城市
    $(".screen #current_temperature").text(data.weather.current_temperature)//当前气温
    $(".aqi #aqi").text(data.weather.aqi)//空气指数
    $(".aqi #quality_level").text(data.weather.quality_level)//空气质量
    console.log(data)
    
// $(".hours .con").html(str)
let str1 = "";
let x =[];
let high = [];
let low = [];
let weeknum = ["日","一","二","三","四","五","六"]
for(obj of data.weather.forecast_list){
    // console.log(obj)
    let date = new Date(obj.date)
    let yueri = obj.date.slice(5,10)
    let day = date.getDay()//星期几
    high.push(obj.high_temperature);
    low.push(obj.low_temperature);
    x.push(obj.date)
    str1+=`
    <li>
        <p class="tian">星期${weeknum[day]}</p>
        <p class="weekday">${yueri}</p>
        <div class="we_ather">
            <p class="we_weather">${obj.condition}</p>
            <img src="img/${obj.weather_icon_id}.png" alt="">
        </div>
        <div class="we_ather we_ather2">
            <p class="we_weather">多云</p>
            <img src="img/1.png" alt="">
        </div>
        <p class="wind1">${obj.wind_direction}</p>
        <p class="wind1">${obj.wind_level}级</p>  
    </li>
    `
    }
    $(".week .con ul").html(str1)
     // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('myChart'));

     // 指定图表的配置项和数据
    var option = {
        xAxis: {
             data:x,
             show:false
        },
        yAxis: {
            show:false
         },
        grid:{
            left:0,
            right:0
        },
        series: [
            {
             name: '最高气温',
             type: 'line',
             data: high
            },{
                name: '最低气温',
                type: 'line',
                data: low
            }
    ]
    };

     // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);

}   

$(function(){
    $(".audioBtn .icon-voice").click(function(event){
        event.stopPropagation()
        let speech = window.speechSynthesis;
        let speechset = new SpeechSynthesisUtterance()   
        let text = $(".header #city").text()+"当前气温"+$("#current_temperature").text()+"摄氏度"+"空气指数"+$(".aqi #aqi").text();
        speechset.text = text;
        speech.speak(speechset)
    })
})


    $.ajax({
        url:"https://www.toutiao.com/stream/widget/local_weather/data/",
        data:{'city':"太原"},
        type:"get",
        dataType:"jsonp",
        success:function(e){
            update(e.data)
        }
    })

     
})

