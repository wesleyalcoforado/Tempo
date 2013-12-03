function aktualigiTempon() {
  if(localStorage.lat == undefined){
    troviPozicion();
    return;
  }
  
  var unuo = localStorage.unuo;
  if(unuo == undefined) {
    unuo = localStorage.unuo = "c";
  }

  var metriko = (unuo == "c") ? "metric" : "imperial";
  var url = "http://api.openweathermap.org/data/2.5/weather?lat="+localStorage.lat+"&lon="+localStorage.lon+"&units="+metriko;

  $.ajax({
    url: url
  }).done(function(respondo) {
    var temp = Math.round(respondo.main.temp);
    var kodo = respondo.weather[0].id;
    var ikono = respondo.weather[0].icon;

    
    montriRezultaton(temp, kodo, ikono);
  });
}  

function troviPozicion() {
  if(localStorage.urbo != undefined && localStorage.urbo != "") {
    serchiPerUrbo();
    return;
  }

  navigator.geolocation.getCurrentPosition(pozicioTrovita, pozicioNeTrovita);
}

function serchiPerUrbo() {
  var url = "http://api.openweathermap.org/data/2.5/find?cnt=1&q="+localStorage.urbo;
  $.ajax({
    url: url
  }).done(function(respondo){
    var rezulto = respondo.list[0];
    localStorage.urbo = rezulto.name + ", " + rezulto.sys.country;
    localStorage.lat = rezulto.coord.lat;
    localStorage.lon = rezulto.coord.lon;

    aktualigiTempon();
  });
}

function pozicioTrovita(pozicio) {
  var lat = pozicio.coords.latitude;
  var lon = pozicio.coords.longitude;
  
  var url = "http://api.openweathermap.org/data/2.5/find?cnt=1&lat="+lat+"&lon="+lon;

  $.ajax({
    url: url
  }).done(function(respondo){
    var rezulto = respondo.list[0];
    
    localStorage.urbo = rezulto.name + ", " + rezulto.sys.country;
    localStorage.lat = lat;
    localStorage.lon = lon;
    aktualigiTempon();
  });
  
}

function pozicioNeTrovita() {
  localStorage.urbo = "Fortaleza, Brazil";
  
  aktualigiTempon();
}

function montriRezultaton(temp, kodo, ikono) {
  var unuo = localStorage.unuo;
  var bildo = selektiBildon(kodo, ikono);
  
  chrome.browserAction.setBadgeText({text:temp + 'º'+unuo.toUpperCase()});
  chrome.browserAction.setIcon({path:bildo});
  chrome.browserAction.setTitle({title: localStorage.urbo})
}

var bildTabulo = {
  "200": "01.png", //thunderstorm with light rain
  "201": "01.png", //thunderstorm with rain
  "202": "01.png", //thunderstorm with heavy rain
  "210": "01.png", //light thunderstorm
  "211": "01.png", //thunderstorm
  "212": "01.png", //heavy thunderstorm
  "221": "01.png", //ragged thunderstorm
  "230": "01.png", //thunderstorm with light drizzle
  "231": "01.png", //thunderstorm with drizzle
  "232": "01.png", //thunderstorm with heavy drizzle
  "300": "02.png", //light intensity drizzle
  "301": "02.png", //drizzle
  "302": "02.png", //heavy intensity drizzle
  "310": "02.png", //light intensity drizzle rain
  "311": "02.png", //drizzle rain 
  "312": "02.png", //heavy intensity drizzle rain
  "313": "02.png", //shower rain and drizzle
  "314": "02.png", //heavy shower rain and drizzle
  "321": "02.png", //shower drizzle
  "500": "03.png", //light rain 
  "501": "04.png", //moderate rain
  "502": "05.png", //heavy intensity rain
  "503": "05.png", //very heavy rain
  "504": "05.png", //extreme rain
  "511": "06.png", //freezing rain 
  "520": "03.png", //light intensity shower rain
  "521": "04.png", //shower rain 
  "522": "05.png", //heavy intensity shower rain
  "531": "03.png", //ragged shower rain
  "600": "06.png", //light snow
  "601": "07.png", //snow
  "602": "07.png", //heavy snow 
  "611": "08.png", //sleet
  "612": "09.png", //shower sleet
  "615": "06.png", //light rain and snow
  "616": "08.png", //rain and snow
  "620": "06.png", //light shower snow
  "621": "07.png", //shower snow
  "622": "07.png", //heavy shower snow
  "701": "10.png", //mist
  "711": "10.png", //smoke
  "721": "10.png", //haze
  "731": "10.png", //Sand/Dust Whirls
  "741": "10.png", //Fog
  "751": "10.png", //sand
  "761": "10.png", //dust
  "762": "10.png", //VOLCANIC ASH
  "771": "11.png", //SQUALLS
  "781": "12.png", //TORNADO
  "800": "13.png", //sky is clear
  "800n": "14.png", //sky is clear (night)
  "801": "15.png", //few clouds 
  "801n": "16.png", //few clouds 
  "802": "17.png", //scattered clouds
  "803": "18.png", //broken clouds 
  "804": "19.png", //overcast cloud
  "900": "12.png", //tornado
  "901": "20.png", //tropical storm
  "902": "12.png", //hurricane
  "903": "21.png", //cold
  "904": "22.png", //hot
  "905": "11.png", //windy
  "906": "09.png", //hail
  "950": "17.png", //Setting
  "951": "13.png", //Calm
  "951n": "14.png", //Calm
  "952": "11.png", //Light breeze
  "953": "11.png", //Gentle Breeze
  "954": "11.png", //Moderate breeze
  "955": "11.png", //Fresh Breeze
  "956": "20.png", //Strong breeze
  "957": "20.png", //high wind, near gale
  "958": "20.png", //Gale
  "959": "20.png", //Severe Gale
  "960": "05.png", //Storm
  "961": "05.png", //Violent Storm
  "962": "12.png" //Hurricane
}

function selektiBildon(kodo, ikono){
  if(ikono.indexOf("n") != -1){
    if(bildTabulo[kodo + "n"] !== undefined){
      kodo += "n"
    }
  }

  return "bildoj/" + bildTabulo[kodo];
}

$(document).ready(function(){
  aktualigiTempon();
  window.setInterval(aktualigiTempon, 60000);
  chrome.extension.onMessage.addListener(aktualigiTempon);
});  






