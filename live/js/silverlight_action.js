var fullscreenContainer;
var is_video_start = false;
var videoHistoryTimer = null;
var watermarkTimer = null;
var fixWatermarkTimer = null;
var watermarkDisplayTxt = "";
var is_historyTimer_fire = false;
var is_fixTimer_called = false;
var is_hideTimer_calling = false;
var playerContainer;
var displayWatermarkTimer = null;
var displayNextEPTimer = null;
var error_msg = "";
var is_nextep_fire = false;
var is_nextep_fire_once = false;
var is_error_occur = false;
var err_log = "";
function init_silverlight_action() {
    fullscreenContainer = document.getElementById("silverlightplayer");
    playerContainer = $("#silverlightplayer");
    if ("onfullscreenchange" in document) {
        document.addEventListener("fullscreenchange", fullScreenHandler)
    }
    if ("onmozfullscreenchange" in document) {
        document.addEventListener("mozfullscreenchange", fullScreenHandler)
    }
    if ("onwebkitfullscreenchange" in document) {
        document.addEventListener("webkitfullscreenchange", fullScreenHandler)
    }
    if ("onmsfullscreenchange" in document) {
        document.onmsfullscreenchange = fullScreenHandler
    }
    $(document).bind("keypress",
    function(event) {
        if (event.which === 87 && event.shiftKey) {
            try {
                if (is_error_occur == true) {
                    $("#errLogs").val(err_log);
                    $("#errLogs").css("display", "block")
                } else {
                    $(".controlOverlay").hide();
                    slCtl2.Content.SLPlayer.printLog(false)
                }
            } catch(err) {
                console.log("open log error =" + err)
            }
        }
        if (event.which === 27 || event.which === 0) {
            try {
                if (is_error_occur == true) {
                    $("#errLogs").hide()
                } else {
                    $(".controlOverlay").show();
                    slCtl2.Content.SLPlayer.printLog(true)
                }
            } catch(err) {
                console.log("open log error =" + err)
            }
        }
    });
    try {
        ana.reg("silverlightplayer", "player")
    } catch(e) {
        console.log("ads error =" + e)
    }
}
function setVideoHistory(current_time) {
    if (current_time != null && slvars.videoId != "live") {
        try {
            var formated_time = toHHMMSS(current_time);
            viewHistory.addRecord(formated_time)
        } catch(e) {
            console.log("setVideoHistory error")
        }
    }
}
function fullScreenHandler(e) {
    try {
        onWindowResize()
    } catch(err) {
        console.log("onWindowResize:err" + err)
    }
}
function checkFullscreenEable() {
    var isFullScreenEnabled = false;
    if (document.fullscreenEnabled) {
        isFullScreenEnabled = document.fullscreenEnabled
    } else {
        if (document.msFullscreenEnabled) {
            isFullScreenEnabled = document.msFullscreenEnabled
        } else {
            if (document.mozFullScreenEnabled) {
                isFullScreenEnabled = document.mozFullScreenEnabled
            } else {
                if (document.webkitFullscreenEnabled) {
                    isFullScreenEnabled = document.webkitFullscreenEnabled
                }
            }
        }
    }
    return isFullScreenEnabled
}
function onFullscreen() {
    if (checkFullscreenEable() == true) {
        if (fullscreenContainer.requestFullscreen) {
            fullscreenContainer.requestFullscreen()
        } else {
            if (fullscreenContainer.msRequestFullscreen) {
                fullscreenContainer.msRequestFullscreen()
            } else {
                if (fullscreenContainer.mozRequestFullScreen) {
                    fullscreenContainer.mozRequestFullScreen()
                } else {
                    if (fullscreenContainer.webkitRequestFullscreen) {
                        fullscreenContainer.webkitRequestFullscreen()
                    } else {
                        if ($(".alert-msg").css("display") == "none") {
                            $(".alert-msg").css("display", "block")
                        } else {
                            $(".alert-msg").css("display", "none")
                        }
                        console.log("this browser is not supported")
                    }
                }
            }
        }
    } else {
        if ($(".alert-msg").css("display") == "none") {
            $(".alert-msg").css("display", "block")
        } else {
            $(".alert-msg").css("display", "none")
        }
        console.log("this browser is not supported")
    }
}
function exitFullscreen() {
    if (checkFullscreenEable() == true) {
        if (document.fullscreen) {
            document.exitFullscreen()
        } else {
            if (document.msFullscreenElement) {
                document.msExitFullscreen()
            } else {
                if (document.mozFullScreen) {
                    document.mozCancelFullScreen()
                } else {
                    if (document.webkitIsFullScreen) {
                        document.webkitExitFullscreen()
                    } else {
                        console.log("Fullscreen API is not supported")
                    }
                }
            }
        }
    }
}
function onWindowResize() {
    if (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msIsFullScreen || document.msFullscreenElement) {
        var adContainerWidth = window.screen.width;
        var videoHeight = window.screen.height;
        playerUI.onFullscreen(true);
        if (typeof(adsManager) != "undefined") {
            adsManager.resize(adContainerWidth, videoHeight, google.ima.ViewMode.FULLSCREEN)
        }
    } else {
        playerUI.onFullscreen(false);
        if (typeof(adsManager) != "undefined") {
            adsManager.resize(640, 360, google.ima.ViewMode.NORMAL)
        }
    }
}
function onSilverlightError(sender, args) {
    var appSource = "";
    if (sender != null && sender != 0) {
        appSource = sender.getHost().Source
    }
    var errorType = args.ErrorType;
    var iErrorCode = args.ErrorCode;
    if (errorType == "ImageError" || errorType == "MediaError") {
        return
    }
    var errMsg = "Unhandled Error in Silverlight Application " + appSource + "\n";
    errMsg += "Code: " + iErrorCode + "    \n";
    errMsg += "Category: " + errorType + "       \n";
    errMsg += "Message: " + args.ErrorMessage + "     \n";
    if (errorType == "ParserError") {
        errMsg += "File: " + args.xamlFile + "     \n";
        errMsg += "Line: " + args.lineNumber + "     \n";
        errMsg += "Position: " + args.charPosition + "     \n"
    } else {
        if (errorType == "RuntimeError") {
            if (args.lineNumber != 0) {
                errMsg += "Line: " + args.lineNumber + "     \n";
                errMsg += "Position: " + args.charPosition + "     \n"
            }
            errMsg += "MethodName: " + args.methodName + "     \n"
        }
    }
    throw new Error(errMsg)
}
function setText(txt) {
    document.getElementById("textout").innerHTML = txt
}
function pluginLoaded(sender, args) {
    slCtl = sender.getHost()
}
function pluginLoadedPlayer(sender, args) {
    slCtl2 = sender.getHost()
}
function getCustID() {
    var test = slCtl.Content.SLobject.getCustID("qa");
    setText(test)
}
function callSLPlay(val) {
    var test = slCtl2.Content.SLPlayer.callSLPlay(val)
}
function callSLPause(val) {
    var test = slCtl2.Content.SLPlayer.callSLPause(val)
}
function videoIsPlaying(videoDuration) {
    silverlightObject.currentTime = videoDuration;
    vdoDuration = videoDuration * 1000;
    if (silverlightObject.currentTime > playerUI.total_time - 60 && !is_nextep_fire && slvars.videoId != "live" && !is_nextep_fire_once) {
        if (slvars.nextThumb != "" && slvars.nextTitle != "" && slvars.episodeNo != "") {
            is_nextep_fire = true;
            is_nextep_fire_once = true;
            onShowNextEp()
        }
    }
}
function getVideoContent() {
    var json = JSON.stringify(slvars);
    return json
}
function globalJSMethod(stringDemo) {
    var d = new Date();
    if (slvars.env == "qa") {
        console.log(d + " globalJSMethod : " + stringDemo)
    }
}
function updateJSplayState(stringDemo) {
    if (!videoOpen_bool && stringDemo != "OnMediaOpened") {
        playState = "OnMediaOpened"
    } else {
        playState = stringDemo
    }
}
function JSDebug(stringDemo) {
    var d = new Date();
    console.log(" JSDebug: " + stringDemo);
}
function consoleDebug(stringDemo) {
    if (slvars.env == "qa") {
        console.log("consoleDebug: " + stringDemo)
    }
}
function convivaNotificationMsg(msg) {
    console.log(msg)
}
function initTracking() {
    if (!is_video_start) {
        var wvideo_element = "silverlightplayer";
        var wtype = slvars.type;
        var wv_id = slvars.v_id;
        var wlang = slvars.lang;
        var wmuid = slvars.memberId;
        var wproduct = "mytvs";
        var wproductVer = slvars.productVer;
        var wp_device_type = slvars.p_device_type;
        var wp_customer_stage = slvars.customer_stage;
        var wp_video_stage = slvars.video_stage;
        var wcd = slvars.cd;
        videoInitTracking(slvars.env, wvideo_element, wv_id, wlang, wmuid, wproduct, wproductVer, wp_device_type, wp_customer_stage, wp_video_stage);
        streamView.streamViewTracking(wvideo_element, wv_id, wp_video_stage)
    }
}
function videoOpen() {
    consoleDebug("videoOpen::");
    initTracking()
}
function OnMediaOpened() {
    if (slvars.adTag != "") {
        if (slvars.videoId == "live") {
            $("#adContainer").css("display", "block");
            videoOpen_bool = true
        } else {
            if (videoOpen_bool == false) {
                $("#adContainer").css("display", "block");
                videoOpen_bool = true
            }
        }
    } else {
        if (slvars.videoId == "live") {
            if (isPause_bool == false) {
                var ti = 500;
                var checkPlaying1 = setInterval(function() {
                    if (videoOpen_bool == false) {
                        if (playState != "Playing") {
                            console.log("before ads live: ");
                            callSLPlay(0);
                            videoOpen_bool = true;
                            isPause_bool = true
                        }
                    }
                },
                ti)
            }
        } else {
            if (isPause_bool == false) {
                var ti = 500;
                var checkPlaying1 = setInterval(function() {
                    if (videoOpen_bool == false) {
                        if (playState == "OnMediaOpened") {
                            videoOpen_bool = true;
                            isPause_bool = true;
                            callSLPlay(0)
                        } else {}
                    }
                },
                ti)
            }
        }
    }
    if (slvars.videoId == "live") {
        playerUI.init("silverlightplayer", false)
    } else {
        if (!is_video_start) {
            playerUI.init("silverlightplayer", true)
        }
    }
}
function videoStart() {
    consoleDebug("videoStart::");
    $("#adContainer").css("display", "none");
    if (!is_video_start) {
        try {
            is_video_start = true;
            setVideoHistory(playerUI.current_time);
            streamView.eventTigger("play", 0);
            playerCall.playerExtendDeviceChecking();
            videoResumeTracking()
        } catch(e) {
            is_video_start = true
        }
    } else {
        videoResumeTracking();
        streamView.eventTigger("play", 0)
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        startWatermarkFixedTimer()
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        startWatermarkRandomTimer()
    }
    if (is_hideTimer_calling == true) {
        startHideWatermarkTimer()
    }
    if (is_nextep_fire) {
        startHideNextEpTimer()
    }
    startHistoryTImer()
}
function videoResume() {
    startHistoryTImer();
    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        startWatermarkFixedTimer()
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        startWatermarkRandomTimer()
    }
    if (is_hideTimer_calling == true) {
        startHideWatermarkTimer()
    }
    if (is_nextep_fire) {
        startHideNextEpTimer()
    }
    videoResumeTracking()
}
function videoStop() {
    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        clearInterval(fixWatermarkTimer)
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        clearInterval(watermarkTimer)
    }
    if (is_hideTimer_calling == true) {
        clearTimeout(displayWatermarkTimer)
    }
    clearInterval(videoHistoryTimer);
    streamView.eventTigger("stop", 0);
    clearInterval(displayNextEPTimer)
}
function videoPause() {
    consoleDebug("videoPause::");
    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        clearInterval(fixWatermarkTimer)
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        clearInterval(watermarkTimer)
    }
    if (is_hideTimer_calling == true) {
        clearTimeout(displayWatermarkTimer)
    }
    clearInterval(videoHistoryTimer);
    videoPauseTracking();
    streamView.eventTigger("pause", 0);
    clearInterval(displayNextEPTimer)
}
function videoEnd() {
    if (is_hideTimer_calling == false && is_fixTimer_called == false) {
        clearInterval(fixWatermarkTimer)
    }
    if (is_hideTimer_calling == false && is_fixTimer_called == true) {
        clearInterval(watermarkTimer)
    }
    if (is_hideTimer_calling == true) {
        clearTimeout(displayWatermarkTimer)
    }
    clearInterval(videoHistoryTimer);
    videoEndTracking();
    streamView.eventTigger("finish", 0);
    contentEndedListener();
    playerUI.onVideoComplete();
    if (slvars.nextVID != "") {
        nextEpURL(slvars.nextVID)
    }
    onHideNextEp()
}
function videoPlay() {
    streamView.eventTigger("play", 0)
}
function videoSeekForward() {
    var timeShift = parseInt(silverlightObject.currentTime) - parseInt(playerUI.original_time);
    streamView.eventTigger("seekforward", timeShift)
}
function videoSeekBackward() {
    if (silverlightObject.currentTime < playerUI.total_time - 60) {
        onHideNextEp();
        is_nextep_fire_once = false
    }
    var timeShift = parseInt(playerUI.original_time) - parseInt(silverlightObject.currentTime);
    streamView.eventTigger("seekbackward", timeShift)
}
function outputOSVersionErr() {
    console.log("outputOSVersionErr()")
}
function parseCustID(dataStr) {
    var sln = "ResponseCustomData=ClientID:".length;
    var pos1 = dataStr.indexOf("ResponseCustomData=ClientID:") + sln;
    var pos2 = dataStr.lastIndexOf(",");
    return dataStr.slice(pos1, pos2)
}
function onCustIDObtained(custID) {
    consoleDebug(custID);
    setText(parseCustID(custID))
}
function outputControlErr(string) {
    console.log("outputControlErr()error_msg=" + string);
    error_msg = string;
    hidePlayer()
}
function hidePlayer(error) {
    if (error_msg != "") {
        is_error_occur = true;
        $("#silverlightplayer").append('<div class="vdo-panel"><div class="warning-panel"><div class="upper notenughcoin"> <div class="warning-desc failed">影片發生錯誤<br>Error Code:' + error_msg + " </div></div></div></div>");
        try {
            err_log = slCtl2.Content.SLPlayer.returnLog();
            $("#silverlightObject").css("display", "none");
            $(".controlOverlay").css("display", "none");
            $("#controlContainer").css("display", "none")
        } catch(e) {
            $("#silverlightObject").css("display", "none");
            $(".controlOverlay").css("display", "none");
            $("#controlContainer").css("display", "none");
            console.log("outputControlErr() err_log=" + e)
        }
    }
}
function startHistoryTImer() {
    clearInterval(videoHistoryTimer);
    videoHistoryTimer = setInterval(function() {
        historyTimerEvent()
    },
    300 * 1000)
}
function historyTimerEvent() {
    clearInterval(videoHistoryTimer);
    setVideoHistory(silverlightObject.currentTime)
}
function startHideNextEpTimer() {
    displayNextEPTimer = setInterval(function() {
        onHideNextEp()
    },
    30 * 1000)
}
function onShowNextEp() {
    var target = playerContainer.find("#nextEPContainer");
    if (slvars.lang == "tc" || slvars.lang == "sc") {
        var title = "第" + (parseInt(slvars.episodeNo) + 1) + "集"
    } else {
        var title = "Ep. " + (parseInt(slvars.episodeNo) + 1)
    }
    if (typeof(target[0]) == "undefined") {
        playerContainer.append("<div style="display: none;" id="nextEPContainer"><div class="nextTxt">" + title + ":</div><div class="nextThumb"><img src="" + slvars.nextThumb + ""></div><div class="nextTitle">" + slvars.nextTitle + "</div></div>");
        playerContainer.find("#nextEPContainer").fadeIn("slow")
    } else {
        target.fadeIn("slow")
    }
    startHideNextEpTimer()
}
function onHideNextEp() {
    clearInterval(displayNextEPTimer);
    playerContainer.find("#nextEPContainer").fadeOut("slow");
    is_nextep_fire = false
}
function startWatermarkRandomTimer() {
    clearInterval(watermarkTimer);
    var random_time = Math.round((Math.random() * 301) + 600);
    watermarkTimer = setInterval(function() {
        watermarkRandomTimerEvent()
    },
    random_time * 1000)
}
function startWatermarkFixedTimer() {
    clearInterval(fixWatermarkTimer);
    fixWatermarkTimer = setInterval(function() {
        watermarkFixedTimerEvent()
    },
    60 * 1000)
}
function watermarkFixedTimerEvent() {
    clearInterval(fixWatermarkTimer);
    is_hideTimer_calling = true;
    fixWatermarkTimer = null;
    displayWatermark()
}
function watermarkRandomTimerEvent() {
    clearInterval(watermarkTimer);
    is_hideTimer_calling = true;
    displayWatermark()
}
function displayWatermark() {
    var target = playerContainer.find("#watermarkContainer");
    if (typeof(target[0]) == "undefined") {
        var random_position = Math.floor(Math.random() * 3 + 3);
        if (random_position > 4) {
            random_position = 3
        }
        playerContainer.append("<div id="watermarkContainer"><div class="watermarkUI position" + random_position + ""></div></div>");
        target = playerContainer.find(".watermarkUI")
    } else {
        var random_position = Math.floor(Math.random() * 4 + 1);
        if (random_position > 4) {
            random_position = 2
        }
        target.html("<div class="watermarkUI position" + random_position + "">" + slvars.displaytxt + "</div>");
        target = target.find(".watermarkUI");
        if (random_position == 1) {
            var new_width = target.width() / 2 - 10;
            new_width = "-" + new_width + "px";
            target.css("left", new_width)
        } else {
            if (random_position == 2) {
                var new_width = target.width() / 2 - 10;
                new_width = "-" + new_width + "px";
                target.css("right", new_width)
            }
        }
    }
    target.hide().html(slvars.displaytxt).fadeIn("slow",
    function() {
        startHideWatermarkTimer()
    })
}
function startHideWatermarkTimer() {
    displayWatermarkTimer = setTimeout(function() {
        hideWatermark()
    },
    40 * 1000)
}
function hideWatermark() {
    clearTimeout(displayWatermarkTimer);
    $(".watermarkUI").fadeOut("slow");
    if (!is_fixTimer_called) {
        is_fixTimer_called = true;
        startWatermarkRandomTimer()
    } else {
        startWatermarkRandomTimer()
    }
    is_hideTimer_calling = false
};