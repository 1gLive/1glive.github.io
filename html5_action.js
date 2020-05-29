var is_video_start = false;
var isVideoJoin = false;
var videoHistoryTimer = null;
var watermarkTimer = null;
var fixWatermarkTimer = null;
var geoCheckTimer = null;
var watermarkDisplayTxt = "";
var is_historyTimer_fire = false;
var is_fixTimer_called = false;
var is_hideTimer_calling = false;
var playerContainer;
var displayWatermarkTimer = null;
var displayNextEPTimer = null;
var is_nextep_fire = false;
var is_nextep_fire_once = false;
var is_error_occur = false;
var videoPlayingTime = null;
var seekfrom = "";
var playHeadTime = 0;
var isSeeking = false;
var isSeeked = false;
var firstWatermark = true;
function init_html5_action() {
    playerContainer = $('#videoContainer');
    videoElement = document.getElementById('video');
    videoElement.addEventListener('timeupdate', videoIsPlaying);
    videoElement.addEventListener('play', videoOpen);
    videoElement.addEventListener('playing', videoResume);
    videoElement.addEventListener('pause', videoPause);
    videoElement.addEventListener('seeking', videoSeeking);
    videoElement.addEventListener('seeked', videoSeeked);
    videoElement.addEventListener('ended', videoEnd);
    window.addEventListener('beforeunload',videoStop);
    $(document).bind('keypress', function(event) {
        if (event.which === 87 && event.shiftKey) {
            $('#errLogs').css("display", "block");
            $('#controlsContainer').css("display", "none");
        }
        if (event.which === 27 || event.which === 0 || event.which === 113) {
            $('#errLogs').css("display", "none");
            $('#controlsContainer').css("display", "block");
        }
    });
    var isTouchDevice = 'ontouchstart' in window || 'onmsgesturechange' in window;
    var fontSize;
    // fix windows chrome subtitle
    if (!!window.chrome && !!window.chrome.webstore && window.navigator.userAgent.indexOf("Windows") != -1) {
        if (isTouchDevice) {
            fontSize = "0.6";
        } else {
            fontSize = "1.2";
        }
        var s = document.createElement("style");
        s.type = "text/css";
        s.innerHTML = "#video::cue{" +
            "font-size: " + fontSize + "em!important;" +
            "}";
        document.head.appendChild(s);
    }

    try {
        ana.reg("video", "player");
    } catch (e) {
        //console.log("ads error =" + e);
    }
}

//only for vod
function setVideoHistory(current_time) {
    printLog("setVideoHistory:: current_time= " + current_time);
    if (current_time != null && hpvars.videoType != "live") {
        try {
            var formated_time = parseInt(current_time);
            viewHistory.addRecord(formated_time);
        } catch (e) {
            console.log("setVideoHistory error");
        }
    }
}

function videoIsPlaying() {
    videoPlayingTime = videoElement.currentTime;
	if(typeof(hpvars.playhead) !== 0){
		playHeadTime = hpvars.playhead;
		//sendCurrentTime(hpvars.playhead);
	}
	//playHeadTime = parseInt(hpvars.playhead);
    if (videoElement.currentTime > videoElement.duration - 60 && !is_nextep_fire && hpvars.videoType != "live" && !is_nextep_fire_once) {
        if (hpvars.nextVID != "") {
            is_nextep_fire = true;
            is_nextep_fire_once = true;
            onShowNextEp();
        }
    }
	if(hpvars.videoType != "live"){
		seekfrom = hpvars.seekfrom;
	}
}

// for tracking
function initTracking() {
    printLog("initTracking::");
    if (!is_video_start) {
        var wvideo_element = "video";
        //update
        //setQualityLabel(hpvars.quality_label);
        //videoInitTracking(wvideo_element, hpvars);
        streamView.streamViewTracking(wvideo_element, hpvars);
		if(hpvars.videoType == "live"){
			seekfrom = playHeadTime;
		}
		hpvars.prevSeekfrom = 0;
    }
}

function videoOpen() {
    printLog("videoOpen::");
    initTracking();
    videoStart();
}

function videoStart() {
    printLog("videoStart::");
    $("#adContainer").css("display", "none");
    if (!is_video_start) {
        try {
			hpvars.haveSurvey = survey.checkVideoEnd();
			printLog("haveSurvey= "+hpvars.haveSurvey);
            is_video_start = true;
            setVideoHistory(videoElement.currentTime);
            streamView.eventTigger("start", 0, playHeadTime);
            //videoStartTracking();
        } catch (e) {
            is_video_start = true;
        }
    } else {
        //videoResumeTracking(playHeadTime);
    	seekfrom = playHeadTime;
    	printLog("videoStart::::: seekfrom= "+seekfrom);
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        startWatermarkFixedTimer();
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        startWatermarkRandomTimer();
    }
    if (is_hideTimer_calling == true) {
        startHideWatermarkTimer();
    }
    if (is_nextep_fire) {
        startHideNextEpTimer();
    }
    //startHistoryTImer();
}

function videoResume() {
    printLog("videoResume::");
    //startHistoryTImer();

    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        startWatermarkFixedTimer();
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        startWatermarkRandomTimer();
    }
    if (is_hideTimer_calling == true) {
        startHideWatermarkTimer();
    }
    if (is_nextep_fire) {
        startHideNextEpTimer();
    }
	if(isVideoJoin){
		printLog("videoResume::: isSeeking= "+isSeeking+", isSeeked= "+isSeeked);
		if(!isSeeking){
    		//videoResumeTracking(playHeadTime);
			streamView.eventTigger("play", 0, playHeadTime);
		} else {
			isSeeked = false;
		}
		$("#giantPlayButtonContainer").css("display","none");
	} else {
		isVideoJoin = true;
		//videoStartTracking(playHeadTime);
		streamView.eventTigger("play", 0, playHeadTime);
		//streamView.eventTigger("start", 0, playHeadTime);
	}
}

function videoPause() {
    printLog('videoPause::');
	if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        clearInterval(fixWatermarkTimer);
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        clearInterval(watermarkTimer);
    }
    if (is_hideTimer_calling == true) {
        clearTimeout(displayWatermarkTimer);
    }
    //clearInterval(videoHistoryTimer);
	printLog("videoPause:: isSeeking= "+isSeeking+", isSeeked= "+isSeeked+", seekfrom="+seekfrom+", hpvars.playhead="+hpvars.playhead);
	if(!isSeeking){
		//videoPauseTracking(playHeadTime);
    	streamView.eventTigger("pause", 0, seekfrom);
    	//streamView.eventTigger("pause", 0, playHeadTime);
	} else {
		isSeeked = false;
		printLog("videoPause:: isSeeking= "+isSeeking+", isSeeked= "+isSeeked);
    	streamView.eventTigger("pause", 0, seekfrom);
	}
    clearInterval(displayNextEPTimer);
}
function videoStop(){
  printLog("videoStop::");
  //videoEndTracking(playHeadTime); //Nielsen
  streamView.eventTigger("stop", 0, playHeadTime); //GTM
}
function videoEnd() {
    printLog("videoEnd::");
	var havePostRoll = false;
	// check post roll
	if(typeof(adsManager) !== "undefined"){
		var havePostRoll = adsManager.getCuePoints().filter(function(item){return item==-1}).length ? true : false;
	}
	if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        clearInterval(fixWatermarkTimer);
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        clearInterval(watermarkTimer);
    }
    if (is_hideTimer_calling == true) {
        clearTimeout(displayWatermarkTimer);
    }
    //clearInterval(videoHistoryTimer);
    clearInterval(geoCheckTimer);

    //if(is_video_start){
    //videoEndTracking(playHeadTime);
    streamView.eventTigger("finish", 0, playHeadTime);
    //}
    contentEndedListener();

	if(!havePostRoll){
		if(hpvars.haveSurvey){
			survey.videoEndCall(hpvars.nextVID);
		} else if(hpvars.nextVID != ""){
			nextEpURL(hpvars.nextVID);
		}
	}
    onHideNextEp();
	playerCall.onVideoEnd();
}

function videoSeeking() {
    var timeShift;
	isSeeking = true;
    //if (is_video_start) {
    if (isVideoJoin) {
    //if (isVideoJoin && !isSeeking) {
		printLog("videoSeeking:: seekfrom= "+seekfrom+", hpvars.prevSeekfrom= "+hpvars.prevSeekfrom);
		if(!hpvars.changeSetting && (seekfrom !== hpvars.prevSeekfrom || seekfrom === 0)){
			//videoSeekFromTracking(seekfrom);
    		streamView.eventTigger("seekfrom", "0", seekfrom);
		}
        if (videoElement.currentTime > videoPlayingTime) {
            timeShift = parseInt(videoElement.currentTime) - parseInt(videoPlayingTime);
	    if(timeShift > 500000000)
			timeShift = 0;
            videoSeekForward(timeShift,seekfrom);
        } else if (videoElement.currentTime < videoPlayingTime) {
            timeShift = parseInt(videoPlayingTime) - parseInt(videoElement.currentTime);
            if(timeShift > 500000000)
                timeShift = 0;
            videoSeekBackward(timeShift,seekfrom);
        }
		hpvars.prevSeekfrom = seekfrom;
		//isSeeking = true;
		//videoSeeked();
    }
}

function videoSeeked() {
	printLog("videoSeeked:: is_video_start= "+is_video_start+", isVideoJoin= "+isVideoJoin+", hpvars.changeSetting= "+hpvars.changeSetting);
    if (isVideoJoin) {
    //if (is_video_start) {
		if(!hpvars.changeSetting){
			//videoSeekToTracking(playHeadTime);
    		streamView.eventTigger("seekto", "0", playHeadTime);
			if(videoSeeked){
				streamView.eventTigger("play", "0", playHeadTime);
				streamView.eventTigger("pause", "0", playHeadTime);
			}
		}
	} else if(hpvars.videoType === 'live'){
		video.play();
	}
	isSeeking = false;
	isSeeked = true;
	hpvars.changeSetting = false;
}

function videoSeekForward(timeShift,seekfrom) {
    printLog("videoSeekForward:: timeShift " + timeShift);
    streamView.eventTigger("seekforward", timeShift, seekfrom);
}

function videoSeekBackward(timeShift,seekfrom) {
    printLog("videoSeekBackward:: timeShift " + timeShift);
    if (videoElement.currentTime < videoPlayingTime - 60) {
        onHideNextEp();
        is_nextep_fire_once = false;
    }
    streamView.eventTigger("seekbackward", timeShift, seekfrom);
}

function hidePlayer(error_msg) {
/* 	console.log("hidePlayer: error_msg="+error_msg);
    var html_display_error = "";
    var display_error_msg = "";
    var display_error_btn = "";
    if (error_msg != "") {
        is_error_occur = true;
        clearInterval(geoCheckTimer);

        var target = playerContainer.find('.vdo-panel');

        if (hpvars.lang == "en") {
            display_error_msg = "Your network has been disconnected";
            display_error_btn = "Retry";
        } else {
            display_error_msg = "您的網絡已中斷";
            display_error_btn = "重試";
        }
        html_display_error = '<div class="upper"><div class="warning-desc failed">' + display_error_msg + '</div><hr><div class="lower"><a class="common_btn2 continue_btn back-home" href="">' + display_error_btn + '</a></div><div class="errorCode">[' + error_msg + ']</div></div>';

        if (typeof(target[0]) == 'undefined') {
            playerContainer.append('<div class="vdo-panel"><div class="warning-panel">' + html_display_error + '</div></div>');
        } else {
            $('#videoContainer .vdo-panel .warning-panel').html(html_display_error);
        }
		
        try {
            videoElement.pause();
           	$('video').css("display", "none");
            $('#controlsContainer').css("display", "none");
            $('#adContainer').css("display", "none");
			$("#giantPlayButtonContainer").html("");
        } catch (e) {
            videoElement.pause();
            $('video').css("display", "none");
            $('#controlsContainer').css("display", "none");
            $('#adContainer').css("display", "none");
			$("#giantPlayButtonContainer").html("");
       	}
    } */
}

function startHistoryTImer() {
	printLog("startHistoryTImer");
    clearInterval(videoHistoryTimer);
    videoHistoryTimer = setInterval(function() {
        historyTimerEvent();
    }, hpvars.historyInterval * 1000);
}

function historyTimerEvent() {
    //clearInterval(videoHistoryTimer);
    setVideoHistory(videoElement.currentTime);
}

function startHideNextEpTimer() {
    displayNextEPTimer = setInterval(function() {
        onHideNextEp();
    }, 30 * 1000);
}

function onShowNextEp() {
    var target = playerContainer.find('#nextEPContainer');
    if (typeof(target[0]) == 'undefined') {
        playerContainer.append("<div style='display: none;' id='nextEPContainer'><div class='nextTxt'>" + langConvert("upnext") + ":</div><div class='nextThumb'><img src='" + hpvars.nextThumb + "'></div><div class='nextTitle'>" + hpvars.nextTitle + "</div></div>");
        playerContainer.find('#nextEPContainer').fadeIn('slow');
    } else {
        target.fadeIn('slow');
    }
    startHideNextEpTimer();
}

function onHideNextEp() {
    clearInterval(displayNextEPTimer);
    playerContainer.find('#nextEPContainer').fadeOut('slow');
    is_nextep_fire = false;
}

function startWatermarkRandomTimer() {
	printLog("startWatermarkRandomTimer");
    clearInterval(watermarkTimer);
    var random_time = Math.round((Math.random() * 301) + 600);
    watermarkTimer = setInterval(function() {
        watermarkRandomTimerEvent();
    }, random_time * 1000);
}

function startWatermarkFixedTimer() {
    clearInterval(fixWatermarkTimer);
    fixWatermarkTimer = setInterval(function() {
        watermarkFixedTimerEvent();
    }, 60 * 1000);
}

function startGeoCheckTimer() {
    printLog("startGeoCheckTimer::");
    clearInterval(geoCheckTimer);

    geoCheckTimer = setInterval(function() {
        geoCheckTimerEvent();
    }, 30 * 60 * 1000);
}

function watermarkFixedTimerEvent() {
    clearInterval(fixWatermarkTimer);
    is_hideTimer_calling = true;
    fixWatermarkTimer = null;
    displayWatermark();
}

function watermarkRandomTimerEvent() {
    clearInterval(watermarkTimer);
    is_hideTimer_calling = true;
    displayWatermark();
}

function geoCheckTimerEvent() {
    printLog("geoCheckTimerEvent");
    $.ajax({
        url: '/tc/geoCheck',
        dataType: "jsonp",
        type: 'get',
        success: function(result) {
            printLog("geoCheck success:: " + result);
            if (!result) {
                window.location.reload(true);
            }
        },
        error: function(rs) {
            printLog("geoCheck error:: " + rs);
            window.location.reload(true);
            // return false;
        }
    });
}

function displayWatermark() {
	var random_position;
    if (firstWatermark) {
        random_position = Math.floor(Math.random() * 3 + 3);
        if (random_position > 4) {
            random_position = 3;
        }
		firstWatermark = false;
    } else {
		random_position = Math.floor(Math.random() * 4 + 1);
        if (random_position > 4) {
            random_position = 2;
        }
		//playerContainer.append("<div class='watermarkUI position" + random_position + "'></div>");
    }
   	$('.watermarkUI.position'+random_position).hide().html(hpvars.displaytxt).fadeIn('slow', function() {
        startHideWatermarkTimer();
    });
}

function startHideWatermarkTimer() {
    displayWatermarkTimer = setTimeout(function() {
        hideWatermark();
    }, 40 * 1000);
}

function hideWatermark() {
    clearTimeout(displayWatermarkTimer);
    $('.watermarkUI').fadeOut('slow');
	//$('.watermarkUI').remove();
    if (!is_fixTimer_called) {
        is_fixTimer_called = true;
        startWatermarkRandomTimer();
    } else {
        startWatermarkRandomTimer();
    }
    is_hideTimer_calling = false;
}

function showFlip() {
	printLog("showFlip");
	$('#flipContainer').show();
	//$("#giantPlayButtonContainer").css("display","none");
    showFlipTimer = setTimeout(function() {
        $('#flipContainer').hide();
		clearTimeout(showFlipTimer);
		if(hpvars.videoType === "live"){
			video.volume = 1;
			jumpToLive();
			video.play();
		} else {
			video.play();
		}
		hpvars.showFlip = false;	
    }, 5 * 1000);
}

function toHHMMSS(secs) {
    var hours = Math.floor(secs / 3600);
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);

    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }
    if (hours <= 0) {
        return minutes + ':' + seconds;
    } else {
        if (hours < 10) {
            hours = '0' + hours;
        }
        return hours + ':' + minutes + ':' + seconds;
    }
}

function printLog(msg) {
    var d = new Date();
    var previous_text;
    d.toLocaleString();
    previous_text = document.getElementById('errLogs').innerHTML;
    document.getElementById('errLogs').innerHTML = previous_text + d.toLocaleString() + ": " + msg + "\n";
    if (hpvars.env != "prod") {
        console.log(d.toLocaleString() + ": " + msg);
    }
}
