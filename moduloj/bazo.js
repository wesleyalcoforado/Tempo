/*
function discoverPosition(position){
    localStorage.latitude = position.coords.latitude * 1000000;
    localStorage.longitude = position.coords.longitude * 1000000;
    updateWeather();
}

function hasGeoposition(){
    return (localStorage.latitude != null && localStorage.latitude != "" && localStorage.longitude != null && localStorage.longitude != "");
}

//para descobrir
http://where.yahooapis.com/geocode?q=moscovo

*/

function aktualigiTempon() {
  var urbo = localStorage.urbo;
  if(urbo == undefined || urbo == "") {
    urbo = 455827;
  }
  
  var unuo = localStorage.unuo;
  var url = 'http://weather.yahooapis.com/forecastrss?w='+urbo+'&u='+unuo;

  $.ajax({
    url: url
  }).done(function(xml) {
    var xPath = xml.evaluate("//*[local-name()='condition']/@temp", xml, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
    var temp = xPath.iterateNext().value;
    
    chrome.browserAction.setBadgeText({text:temp + 'º'+unuo.toUpperCase()});
  });
}

$(document).ready(function(){
  aktualigiTempon();
  window.setInterval(aktualigiTempon, 60000);
  chrome.extension.onMessage.addListener(aktualigiTempon);
});