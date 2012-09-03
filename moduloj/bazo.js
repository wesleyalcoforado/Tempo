function serchiPerUrbo() {
  var url = "http://where.yahooapis.com/geocode?flags=J&q="+localStorage.urbo;
  $.ajax({
    url: url
  }).done(function(respondo){
    debugger;
    var rezulto = respondo.ResultSet.Results[0];
    if(rezulto.city == "") {
      localStorage.urbo = rezulto.line2 + ", " + rezulto.line4;
      serchiPerUrbo();
    } else {
      localStorage.woeid = rezulto.woeid;
      localStorage.urbo = rezulto.city + ", " + rezulto.country;
      aktualigiTempon();
    }
  });
}

function troviPozicion() {
  if(localStorage.urbo != undefined && localStorage.urbo != "") {
    serchiPerUrbo();
    return;
  }

  navigator.geolocation.getCurrentPosition(pozicioTrovita, pozicioNeTrovita);
}

function pozicioTrovita(pozicio) {
  var lat = pozicio.coords.latitude;
  var lon = pozicio.coords.longitude;
  
  var url = "http://where.yahooapis.com/geocode?gflags=R&flags=J&location="+lat+","+lon;
  $.ajax({
    url: url
  }).done(function(respondo){
    var rezulto = respondo.ResultSet.Results[0];
    
    localStorage.urbo = rezulto.city + ", " + rezulto.country;
    localStorage.woeid = rezulto.woeid;
    if(localStorage.woeid == "") {
      serchiPerUrbo();
      return;
    }
    aktualigiTempon();
  });
  
}

function pozicioNeTrovita() {
  localStorage.woeid = 455913;
  localStorage.urbo = "Sorocaba, Brazil";
  
  aktualigiTempon();
}

function montriRezultaton(temp, kodo) {
  var unuo = localStorage.unuo;
  var bildo = "bildoj/"+kodo+".png";
  
  chrome.browserAction.setBadgeText({text:temp + 'º'+unuo.toUpperCase()});
  chrome.browserAction.setIcon({path:bildo});
  chrome.browserAction.setTitle({title: localStorage.urbo})
}

function aktualigiTempon() {
  var woeid = localStorage.woeid;
  if(woeid == undefined || woeid == "") {
    troviPozicion();
    return;
  }
  
  var unuo = localStorage.unuo;
  if(unuo == undefined) {
    unuo = localStorage.unuo = "c";
  }
  
  var url = 'http://weather.yahooapis.com/forecastrss?w='+woeid+'&u='+unuo;

  $.ajax({
    url: url
  }).done(function(xml) {
    var xPath = xml.evaluate("//*[local-name()='condition']/@temp", xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var temp = xPath.iterateNext().value;
    xPath = xml.evaluate("//*[local-name()='condition']/@code", xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var kodo = xPath.iterateNext().value;
    
    montriRezultaton(temp, kodo);
  });
}

$(document).ready(function(){
  aktualigiTempon();
  window.setInterval(aktualigiTempon, 60000);
  chrome.extension.onMessage.addListener(aktualigiTempon);
});