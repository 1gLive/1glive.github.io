document.write(unescape("%3Cscript src='" + (document.location.protocol == "https:" ?"https://sb" : "http://b") + ".scorecardresearch.com/beacon.js' %3E%3C/script%3E"));
var nUA = navigator.userAgent;
var os = "Unknown sys_name";
var osVersion = "Unknown sys_version";
if (/Windows/.test(nUA)) {
	osVersion = /Windows (.*)/.exec(nUA)[1];
        os = 'Windows';
}
if (/Mac OS X/.test(nUA)) {
    osVersionTmp = /Mac OS X (\d+)[\.\_](\d+)?[\.\_]?(\d+)?/.exec(nUA);
	osVersion = osVersionTmp[1] + '.' + osVersionTmp[2] + '.' + (osVersionTmp[3] | 0);
	os = 'Mac';
}

//var domain="http://t.hypers.com/abc?";
var domain="http://t.hypers.com/hvt?";
var _ua=21;
var type;
var v_id;
var spend=0;
var progress=0;
var upid=Math.floor((Math.random() * 10000000000) + 1);
var sr=screen.width+"X"+screen.height;
var url=encodeURIComponent(window.location.href);
var r=Math.floor((Math.random() * 10000000) + 1);
var sd=screen.colorDepth;
var lang;
var charset="UTF-8";
var muid;
var _t="i";
var jsonp="_1A2B3";
var app_name;
var app_version;
var p_device_type;
var sys_name=os;
var sys_version=osVersion;

var p_customer_stage;
var p_video_stage;


var ord=Math.random();
var interval=10;
var clientID=9457498;
var nielsenSubCat;
var timer;
var sec_timer;
var cat; 
var subCat; 
var title; 
var dType;
var pType;
var extraTag;
var onPause=false;
var onResume=false;
var onEnded=false;
var sec_duration=1;
var usingNielsen=1;
var usingComScore=2;
var isUsingNielsen=true;
var isUsingComScore=true;
var videoStarted = false;
var video_element="";
var c6="vc,c03";
var referer_url=encodeURIComponent(window.location.href);

// function videoStartTracking(cat,subCat,title,dType,pType,extraTag,video_id,trackingUsing){
function videoInitTracking(wenv, wvideo_element, wv_id, wlang, wmuid, wproduct, wproductVer, wp_device_type,wp_customer_stage,wp_video_stage){
 
	env = wenv;
 
domain = "http://t.hypers.com/hvt?";
  
  video_element = wvideo_element;
  v_id = wv_id;
  if(wlang == "tc"){
  	 lang = "zh-hk";
  }else if(wlang == "en"){
 	 lang = "en-us";
  }else{
  	lang = wlang;
  }
  
  muid = wmuid;
  app_name = wproduct;
  app_version = wproductVer;
  p_device_type = wp_device_type;
  p_customer_stage =wp_customer_stage;
  p_video_stage =wp_video_stage;
  
 

 	onPause=false;
 	onResume=false;
  if(onPause || onResume){
    videoResumeTracking();
    onPause=false;
    onResume=false;
  }else{
    sec_duration=1;
    onEnded=false;

    // Neilsen
    videoStartTracking();
  }
 
}
function videoStartTracking(){
	
	 type = "start";
	if(isUsingNielsen){
	//alert("about to fire dav0");
      $('#'+video_element).append('<img src="'+domain+'_ua='+_ua+'&type='+type+'&v_id='+v_id+'&spend='+spend*1000+'&progress='+sec_duration*1000+'&upid='+upid+'&sr='+sr+'&url='+url+'&r='+r+'&sd='+sd+'&lang='+lang+'&char='+charset+'&muid='+muid+'&_t='+_t+'&jsonp='+jsonp+'&app_name='+app_name+'&app_version='+app_version+'&p_device_type='+p_device_type+'&sys_name='+sys_name+'&sys_version='+sys_version+'&p_customer_stage='+p_customer_stage+'&p_video_stage='+p_video_stage+'&p_quality_label='+slvars.quality_lable+'" width="1" height="1" style="display:none">');
      videoResumeTracking();
    }
    videoStarted = true;
}
function videoPauseTracking(){

  if(!onEnded){
    onPause = true;
    onResume = false;

    // Neilsen
    if(isUsingNielsen){
      stopTimer();
    }
  }
}

function videoResumeTracking(){
  onPause = false;
  onResume = true;

  // Neilsen
  if(isUsingNielsen){
    stopTimer();
    startTimer("dav1");
    startTimer("sec");
  }
}

function videoEndTracking(){

  onPause = false;
  onEnded = true;
  type = "end";
  if(videoStarted){
    // Neilsen
    if(isUsingNielsen){
      stopTimer();
      ord=Math.floor((Math.random() * 10000000) + 1);
      $('#'+video_element).append('<img src="'+domain+'_ua='+_ua+'&type='+type+'&v_id='+v_id+'&spend='+sec_duration*1000+'&progress='+sec_duration*1000+'&upid='+upid+'&sr='+sr+'&url='+url+'&r='+ord+'&sd='+sd+'&lang='+lang+'&char='+charset+'&muid='+muid+'&_t='+_t+'&jsonp='+jsonp+'&app_name='+app_name+'&app_version='+app_version+'&p_device_type='+p_device_type+'&sys_name='+sys_name+'&sys_version='+sys_version+'&p_customer_stage='+p_customer_stage+'&p_video_stage='+p_video_stage+'&p_quality_label='+slvars.quality_lable+'" width="1" height="1" style="display:none">');
    }
    videoStarted=false;
    dType="";
  }
}

function dav1(){
  if(videoStarted){
  type="heart_beat";
    // Neilsen
    if(isUsingNielsen){
      ord=Math.floor((Math.random() * 10000000) + 1);
      $('#'+video_element).append('<img src="'+domain+'_ua='+_ua+'&type='+type+'&v_id='+v_id+'&spend='+sec_duration*1000+'&progress='+sec_duration*1000+'&upid='+upid+'&sr='+sr+'&url='+url+'&r='+ord+'&sd='+sd+'&lang='+lang+'&char='+charset+'&muid='+muid+'&_t='+_t+'&jsonp='+jsonp+'&app_name='+app_name+'&app_version='+app_version+'&p_device_type='+p_device_type+'&sys_name='+sys_name+'&sys_version='+sys_version+'&p_customer_stage='+p_customer_stage+'&p_video_stage='+p_video_stage+'&p_quality_label='+slvars.quality_lable+'" width="1" height="1" style="display:none">');
    }
  }
}

function stopTimer(){
  clearInterval(timer);
  clearInterval(sec_timer);
}

function startTimer(type){
  if(type=="dav1"){
    clearInterval(timer);
    timer=setInterval("dav1();", interval*1000);
  }
  if(type=="sec"){
    clearInterval(sec_timer);
    sec_timer=setInterval("addsec();", 1000);
  }
}

function addsec(){
  sec_duration = sec_duration + 1;
}

function htmlEntities(str){
  return String(str).replace(/&/g, '&amp;').replace(//g, '&gt;').replace(/"/g, '&quot;');
}
