/**
 * @license
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A container for custom video controls.
 * @constructor
 * @suppress {missingProvide}
 */
function ShakaControls() {
    /** @private {shaka.cast.CastProxy} */
    this.castProxy_ = null;

    /** @private {boolean} */
    this.castAllowed_ = true;

    /** @private {?function(!shaka.util.Error)} */
    this.onError_ = null;

    /** @private {HTMLMediaElement} */
    this.video_ = null;

    /** @private {shaka.Player} */
    this.player_ = null;

    /** @private {Element} */
    this.videoContainer_ = document.getElementById('videoContainer');

    /** @private {Element} */
    this.adContainer_ = document.getElementById('adContainer');

    /** @private {Element} */
    this.flipContainer_ = document.getElementById('flipContainer');

    /** @private {Element} */
    this.errLogs_ = document.getElementById('errLogs');

    /** @private {Element} */
    this.controls_ = document.getElementById('controls');

    /** @private {Element} */
    this.playPauseButton_ = document.getElementById('playPauseButton');

    /** @private {Element} */
    this.seekBar_ = document.getElementById('seekBar');

    /** @private {Element} */
    this.soundButton_ = document.getElementById('soundButton');

    /** @private {Element} */
    this.muteButton_ = document.getElementById('muteButton');

    /** @private {Element} */
    this.volumeBar_ = document.getElementById('volumeBar');

    /** @private {Element} */
    //this.captionButton_ = document.getElementById('captionButton');

    /** @private {Element} */
    this.fullscreenButton_ = document.getElementById('fullscreenButton');

    /** @private {Element} */
    this.fullscreenoffButton_ = document.getElementById('fullscreenoffButton');

    /** @private {Element} */
    this.currentTime_ = document.getElementById('currentTime');

    /** @private {Element} */
    this.castReceiverName_ = document.getElementById('castReceiverName');

    /** @private {Element} */
    this.bufferingSpinner_ = document.getElementById('bufferingSpinner');

    /** @private {Element} */
    this.giantPlayButtonContainer_ =
        document.getElementById('giantPlayButtonContainer');

    /** @private {boolean} */
    this.isSeeking_ = false;

    /** @private {number} */
    this.trickPlayRate_ = 1;

    /** @private {?number} */
    this.seekTimeoutId_ = null;

    /** @private {?number} */
    this.mouseStillTimeoutId_ = null;

    /** @private {?number} */
    this.lastTouchEventTime_ = null;

    this.tooltips_ = $('#videoContainer .tooltips');

    this.tooltipsValue_ = null;

    this.before_mute_vol_ = 0;
}


/**
 * Initializes the player controls.
 * @param {shaka.cast.CastProxy} castProxy
 * @param {function(!shaka.util.Error)} onError
 * @param {function(boolean)} notifyCastStatus
 */
ShakaControls.prototype.init = function(castProxy, onError, notifyCastStatus) {
    var _self = this;
    this.castProxy_ = castProxy;
    this.onError_ = onError;
    this.notifyCastStatus_ = notifyCastStatus;
    this.initMinimal(castProxy.getVideo(), castProxy.getPlayer());

    // IE11 doesn't treat the 'input' event correctly.
    // https://connect.microsoft.com/IE/Feedback/Details/856998
    // If you know a better way than a userAgent check to handle this, please
    // send a patch.
    var sliderInputEvent = 'input';
    // This matches IE11, but not Edge.  Edge does not have this problem.
    if (navigator.userAgent.indexOf('Trident/') >= 0) {
        sliderInputEvent = 'change';
    }

    $('#volumeBar').slider({
        range: "min",
        min: 0,
        max: 10,
        step: 1,
        value: _self.video_.volume * 10,
        orientation: "vertical",
        change: function(event, ui) {
            var vol_level = ui.value / 10;
            setAdsVolume(vol_level);
            printLog("volumeOnChange:: " + vol_level);

            try {
                _self.video_.volume = parseFloat(vol_level);
                if (_self.video_.muted && vol_level > 0)
                    _self.video_.muted = !_self.video_.muted;

                if (vol_level > 0) {
                    $('.mute-icon').css('display', 'none');
                    $('.sound-icon').css('display', 'block');
                } else {
                    $('.mute-icon').css('display', 'block');
                    $('.sound-icon').css('display', 'none');
                }

            } catch (err) {
                printLog("volumeOnChange error:: " + err);
            }
        }
    });

    $(document).on('webkitfullscreenchange mozfullscreenchange fullscreenchange MSFullscreenChange',
        function() {
            if (!document.fullscreenElement) {
                $('.smallsrn-icon').css('display', 'none');
                $('.fullsrn-icon').css('display', 'block');
            } else {
                $('.smallsrn-icon').css('display', 'block');
                $('.fullsrn-icon').css('display', 'none');
            }
        });

    $(window).bind('resize', function() {
        if (document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msIsFullScreen || document.msFullscreenElement) {
            var adContainerWidth = window.screen.width;
            var videoHeight = window.screen.height;
            //if (typeof(adsManager) != 'undefined') {
            //    adsManager.resize(adContainerWidth, videoHeight, google.ima.ViewMode.FULLSCREEN);
            //}
			$("#videoContainer").addClass("fullscreen");
        	if(window.screen.width/16*9 > window.screen.height){
            	adjustSize = (window.screen.width - window.screen.height/9*16 ) / 2 + 15;
				//console.log("watermark adjustSize left/right= "+adjustSize);
            	$(".fullscreen .watermarkUI.position1").css("left",adjustSize+"px");
            	$(".fullscreen .watermarkUI.position2").css("right",adjustSize+"px");
				$(".fullscreen .watermarkUI.position3").css("left","30%");
				$(".fullscreen .watermarkUI.position4").css("right","30%");
        	} else {
				adjustSize = (window.screen.height - window.screen.width/16*9 ) / 2 + 10;
				//console.log("watermark adjustSize top= "+adjustSize);
                $(".fullscreen .watermarkUI.position3, .fullscreen .watermarkUI.position4").css("top",adjustSize+"px");
			}
        } else {
            //if (typeof(adsManager) != 'undefined') {
            //    adsManager.resize(640, 360, google.ima.ViewMode.NORMAL);
            //}

			$("#videoContainer").removeClass("fullscreen");
        	$(".watermarkUI.position1").css("left","10px");
        	$(".watermarkUI.position2").css("right","10px");
        	$(".watermarkUI.position3").css("left","10px").css("top","5px");
        	$(".watermarkUI.position4").css("right","10px").css("top","5px");
        }
    });

    $('.settingButton').click(function() {
        if ($(this).hasClass('click')) {
            $(this).next('.settingPanel').removeClass('active');
            $(this).removeClass('click');

        } else {
            $(this).addClass('click');
            $(this).next('.settingPanel').addClass('active');
        }
    });

    this.playPauseButton_.addEventListener(
        'click', this.onPlayPauseClick_.bind(this));
    this.video_.addEventListener(
        'play', this.onPlayStateChange_.bind(this));
    this.video_.addEventListener(
        'pause', this.onPlayStateChange_.bind(this));

    this.seekBar_.addEventListener(
        'mousemove', this.onSeekMouseMove_.bind(this));
    this.seekBar_.addEventListener(
        'mousedown', this.onSeekStart_.bind(this));
    this.seekBar_.addEventListener(
        'touchstart', this.onSeekStart_.bind(this));
    this.seekBar_.addEventListener(
        sliderInputEvent, this.onSeekInput_.bind(this));
    this.seekBar_.addEventListener(
        'touchend', this.onSeekEnd_.bind(this));
    this.seekBar_.addEventListener(
        'mouseup', this.onSeekEnd_.bind(this));
    this.seekBar_.addEventListener(
        'mouseout', this.onSeekMouseOut_.bind(this));

    this.muteButton_.addEventListener(
        'click', this.onMuteClick_.bind(this));

    this.soundButton_.addEventListener(
        'click', this.onMuteClick_.bind(this));

    this.volumeBar_.addEventListener(
        sliderInputEvent, this.onVolumeInput_.bind(this));

    this.video_.addEventListener(
        'volumechange', this.onVolumeStateChange_.bind(this));

    // initialize volume display with a fake event
    this.onVolumeStateChange_();

    //  this.captionButton_.addEventListener(
    //      'click', this.onCaptionClick_.bind(this));

    this.player_.addEventListener(
        'texttrackvisibility', this.onCaptionStateChange_.bind(this));
    this.player_.addEventListener(
        'trackschanged', this.onTracksChange_.bind(this));
    // initialize caption state with a fake event
    this.onCaptionStateChange_();

    this.fullscreenButton_.addEventListener(
        'click', this.onFullscreenClick_.bind(this));

    this.fullscreenoffButton_.addEventListener(
        'click', this.onFullscreenClick_.bind(this));

    //  this.currentTime_.addEventListener(
    //      'click', this.onCurrentTimeClick_.bind(this));

    this.videoContainer_.addEventListener(
        'touchstart', this.onContainerTouch_.bind(this));
    this.videoContainer_.addEventListener(
        'click', this.onPlayPauseClick_.bind(this));

    // Clicks in the controls should not propagate up to the video container.
    this.controls_.addEventListener(
        'click',
        function(event) {
            event.stopPropagation();
        });

    this.videoContainer_.addEventListener(
        'mousemove', this.onMouseMove_.bind(this));
    this.videoContainer_.addEventListener(
        'touchmove', this.onMouseMove_.bind(this));
    this.videoContainer_.addEventListener(
        'touchend', this.onMouseMove_.bind(this));
    this.videoContainer_.addEventListener(
        'mouseout', this.onMouseOut_.bind(this));

    this.castProxy_.addEventListener(
        'caststatuschanged', this.onCastStatusChange_.bind(this));

};


/**
 * Initializes minimal player controls.  Used on both sender (indirectly) and
 * receiver (directly).
 * @param {HTMLMediaElement} video
 * @param {shaka.Player} player
 */
ShakaControls.prototype.initMinimal = function(video, player) {
    this.video_ = video;
    this.player_ = player;
    this.player_.addEventListener(
        'buffering', this.onBufferingStateChange_.bind(this));
    window.setInterval(this.updateTimeAndSeekRange_.bind(this), 125);
};


/**
 * This allows the application to inhibit casting.
 *
 * @param {boolean} allow
 */
ShakaControls.prototype.allowCast = function(allow) {
    this.castAllowed_ = allow;
    this.onCastStatusChange_(null);
};



/**
 * Used by the application to notify the controls that a load operation is
 * complete.  This allows the controls to recalculate play/paused state, which
 * is important for platforms like Android where autoplay is disabled.
 */
ShakaControls.prototype.loadComplete = function() {
    // If we are on Android or if autoplay is false, video.paused should be true.
    // Otherwise, video.paused is false and the content is autoplaying.
    this.onPlayStateChange_();
};


/**
 * Hiding the cursor when the mouse stops moving seems to be the only decent UX
 * in fullscreen mode.  Since we can't use pure CSS for that, we use events both
 * in and out of fullscreen mode.
 * @param {!Event} event
 * @private
 */
ShakaControls.prototype.onMouseMove_ = function(event) {
    if (event.type == 'touchstart' || event.type == 'touchmove' ||
        event.type == 'touchend') {
        this.lastTouchEventTime_ = Date.now();
    } else if (this.lastTouchEventTime_ + 1000 < Date.now()) {
        // It has been a while since the last touch event, this is probably a real
        // mouse moving, so treat it like a mouse.
        this.lastTouchEventTime_ = null;
    }

    // Use the cursor specified in the CSS file.
    this.videoContainer_.style.cursor = '';
    // Show the controls.
    this.controls_.style.opacity = 1;

    // Hide the cursor when the mouse stops moving.
    // Only applies while the cursor is over the video container.
    if (this.mouseStillTimeoutId_) {
        // Reset the timer.
        window.clearTimeout(this.mouseStillTimeoutId_);
    }

    // Only start a timeout on 'touchend' or for 'mousemove' with no touch events.
    if (event.type == 'touchend' || !this.lastTouchEventTime_) {
        this.mouseStillTimeoutId_ = window.setTimeout(
            this.onMouseStill_.bind(this), 3000);
    }
};


/** @private */
ShakaControls.prototype.onSeekMouseOut_ = function() {
    this.tooltips_.hide();
};


/** @private */
ShakaControls.prototype.onMouseOut_ = function() {
    // Expire the timer early.
    if (this.mouseStillTimeoutId_) {
        window.clearTimeout(this.mouseStillTimeoutId_);
    }
    // Run the timeout callback to hide the controls.
    // If we don't, the opacity style we set in onMouseMove_ will continue to
    // override the opacity in CSS and force the controls to stay visible.
    this.onMouseStill_();
};


/** @private */
ShakaControls.prototype.onMouseStill_ = function() {
    // The mouse has stopped moving.
    this.mouseStillTimeoutId_ = null;
    // Hide the cursor.  (NOTE: not supported on IE)
    this.videoContainer_.style.cursor = 'none';
    // Revert opacity control to CSS.  Hovering directly over the controls will
    // keep them showing, even in fullscreen mode. Unless there were touch events,
    // then override the hover and hide the controls.
    this.controls_.style.opacity = this.lastTouchEventTime_ ? '0' : '';
};


/**
 * @param {!Event} event
 * @private
 */
ShakaControls.prototype.onContainerTouch_ = function(event) {
    if (!this.video_.duration) {
        // Can't play yet.  Ignore.
        return;
    }

    if (this.controls_.style.opacity == 1) {
        this.lastTouchEventTime_ = Date.now();
        // The controls are showing.
        // Let this event continue and become a click.
    } else {
        // The controls are hidden, so show them.
        this.onMouseMove_(event);
        // Stop this event from becoming a click event.
        event.preventDefault();
    }
};


/** @private */
ShakaControls.prototype.onPlayPauseClick_ = function() {
    if (!this.video_.duration || (is_video_start && this.player_.isLive()) || this.adContainer_.style.display == "block" || this.errLogs_.style.display == "block" || (is_video_start && this.flipContainer_.style.display == "block")) {
        // Can't play yet.  Ignore.
        console.log("click play");
        return;
    }

    this.player_.cancelTrickPlay();
    this.trickPlayRate_ = 1;

	//if(this.video_.ended){
    if ((this.video_.paused && this.video_.currentTime == this.seekBar_.max) || this.video_.ended) {
		location.reload();
	} else {
    	if (this.video_.paused) {
			if(!is_video_start){
				if(this.player_.isLive()){
					if(hpvars.showFlip){
                		showFlip();
						this.giantPlayButtonContainer_.style.display = 'none';
            		} else {
                		jumpToLive();
            		}	
				} else {
					//if(typeof(ads) !== "undefined"){
					//if(hpvars.adTag === ""){
					//	requestAds();
					//} else {
					//	video.play();
					//}
					video.play();
					this.giantPlayButtonContainer_.style.display = 'none';	
				}
			} else {
        		this.video_.play();
			}
    	} else {
        	this.video_.pause();
    	}
	}
};


/** @private */
ShakaControls.prototype.onPlayStateChange_ = function() {
	printLog("hpvars.autoplay= "+hpvars.autoplay);
    // Video is paused during seek, so don't show the play arrow while seeking:
    if ((this.video_.paused && this.video_.currentTime == this.seekBar_.max) || this.video_.ended) {
        this.playPauseButton_.textContent = '';
		this.playPauseButton_.style.background = 'url(http://img.tvb.com/mytvsuper/web/img/player_ui/btn_replay.png) top';
        this.giantPlayButtonContainer_.style.display = 'none';
    } else if (this.video_.paused && !this.isSeeking_ && this.adContainer_.style.display !== "block" && this.flipContainer_.style.display !== "block") {
        this.playPauseButton_.textContent = '';
		this.playPauseButton_.style.background = 'url(http://img.tvb.com/mytvsuper/web/img/player_ui/btn_play.png) top';
		if(!hpvars.autoplay)
        	this.giantPlayButtonContainer_.style.display = 'inline';
    } else {
        this.playPauseButton_.textContent = '';
		this.playPauseButton_.style.background = 'url(http://img.tvb.com/mytvsuper/web/img/player_ui/btn_pause.png) top';
        this.giantPlayButtonContainer_.style.display = 'none';
    }
};


/** @private */
ShakaControls.prototype.onSeekMouseMove_ = function(e) {
    var Offset = $('#seekBar').offset();
    var position = $('#seekBar').position();
    var max = parseFloat(e.target.getAttribute('max'));
    var min = parseFloat(e.target.getAttribute('min'));
    var seekRange = this.player_.seekRange();
    var duration = this.video_.duration;

    var target_timespan = (e.pageX - Offset.left) / e.target.clientWidth * (max - min) + min;

    target_timespan = Math.min(target_timespan, max);
    target_timespan = Math.max(min, target_timespan);
    this.tooltipsValue_ = target_timespan;

    if (this.player_.isLive()) {
        // The amount of time we are behind the live edge.
        var behindLive = Math.floor(seekRange.end - target_timespan);
        target_timespan = Math.max(0, behindLive);
        var showHour = target_timespan >= 3600;

        if ((target_timespan >= 0) || this.isSeeking_) {
            target_timespan = '- ' + this.buildTimeString_(target_timespan, showHour);
        }
    } else {
        var showHour = duration >= 3600;
        target_timespan = this.buildTimeString_(target_timespan, showHour);
    }

    if (typeof duration !== 'undefined' && duration > 0) {
        this.tooltips_.text(target_timespan);
        this.tooltips_.show();
        this.tooltips_.css('left', (e.pageX - Offset.left + position.left - 23) + 'px');
    }
};


/** @private */
ShakaControls.prototype.onSeekStart_ = function() {
    this.isSeeking_ = true;
    this.video_.pause();
};


/** @private */
ShakaControls.prototype.onSeekInput_ = function() {
    this.seekBar_.value = (this.tooltipsValue_ != null) ? this.tooltipsValue_ : this.seekBar_.value;

    if (!this.video_.duration) {
        // Can't seek yet.  Ignore.
        return;
    }

    // Update the UI right away.
    this.updateTimeAndSeekRange_();

    // Collect input events and seek when things have been stable for 125ms.
    if (this.seekTimeoutId_ != null) {
        window.clearTimeout(this.seekTimeoutId_);
    }
    this.seekTimeoutId_ = window.setTimeout(
        this.onSeekInputTimeout_.bind(this), 125);
};


/** @private */
ShakaControls.prototype.onSeekInputTimeout_ = function() {
    this.seekTimeoutId_ = null;
	this.video_.currentTime = parseFloat(this.seekBar_.value);
    //refreshTextTrack();
};


/** @private */
ShakaControls.prototype.onSeekEnd_ = function() {
  if (this.seekTimeoutId_ != null) {
    // They just let go of the seek bar, so end the timer early.
    window.clearTimeout(this.seekTimeoutId_);
    this.onSeekInputTimeout_();
  }

  this.isSeeking_ = false;
  if(this.video_.currentTime == this.seekBar_.max){
    this.video_.currentTime = this.video_.currentTime - 0.1;
  }
  this.video_.play();
};


/** @private */
ShakaControls.prototype.onMuteClick_ = function() {
    this.video_.muted = !this.video_.muted;
    if (this.video_.muted) {
        this.before_mute_vol_ = this.video_.volume * 10;
        $('#volumeBar').slider('value', 0);
    } else {
        $('#volumeBar').slider('value', this.before_mute_vol_);
        //$('#volumeBar').slider('value',10);
    }
};


/**
 * Updates the controls to reflect volume changes.
 * @private
 */
ShakaControls.prototype.onVolumeStateChange_ = function() {
    if (this.video_.muted) {
        this.volumeBar_.value = 0;
    } else {
        this.volumeBar_.value = this.video_.volume;
    }

    var gradient = ['to top'];
    gradient.push('#ccc ' + (this.volumeBar_.value * 100) + '%');
    gradient.push('#fff ' + (this.volumeBar_.value * 100) + '%');
    gradient.push('#fff 100%');
    this.volumeBar_.style.background =
        'linear-gradient(' + gradient.join(',') + ')';
};


/** @private */
ShakaControls.prototype.onVolumeInput_ = function() {
    //console.log("onVolumeInput_");
    this.video_.volume = parseFloat(this.volumeBar_.value);
    this.video_.muted = false;
};


/** @private */
ShakaControls.prototype.onCaptionClick_ = function() {
    this.player_.setTextTrackVisibility(!this.player_.isTextTrackVisible());
};


/** @private */
ShakaControls.prototype.onTracksChange_ = function() {
    var hasText = this.player_.getTextTracks().length;
    //this.captionButton_.style.display = hasText ? 'inherit' : 'none';
};


/** @private */
ShakaControls.prototype.onCaptionStateChange_ = function() {
    if (this.player_.isTextTrackVisible()) {
        //this.captionButton_.style.color = 'white';
    } else {
        // Make the button look darker to show that the text track is inactive.
        //this.captionButton_.style.color = 'rgba(255, 255, 255, 0.3)';
    }
};


/** @private */
ShakaControls.prototype.onFullscreenClick_ = function() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        this.videoContainer_.requestFullscreen();
    }
};


/** @private */
ShakaControls.prototype.onCurrentTimeClick_ = function() {
    // Jump to LIVE if the user clicks on the current time.
    if (this.player_.isLive()) {
        this.video_.currentTime = this.seekBar_.max;
    }
};

/**
 * @param {Event} event
 * @private
 */

ShakaControls.prototype.onCastStatusChange_ = function(event) {
    var canCast = this.castProxy_.canCast() && this.castAllowed_;
    var isCasting = this.castProxy_.isCasting();

    this.notifyCastStatus_(isCasting);
    this.castReceiverName_.style.display =
        isCasting ? 'inherit' : 'none';
    this.castReceiverName_.textContent =
        isCasting ? 'Casting to ' + this.castProxy_.receiverName() : '';
    this.controls_.classList.toggle('casting', this.castProxy_.isCasting());
};


/**
 * @param {Event} event
 * @private
 */
ShakaControls.prototype.onBufferingStateChange_ = function(event) {
    this.bufferingSpinner_.style.display =
        event.buffering ? 'inherit' : 'none';
};


/**
 * @param {boolean} show True to show trick play controls, false to show seek
 *   bar.
 */
ShakaControls.prototype.showTrickPlay = function(show) {
    this.seekBar_.parentElement.style.width = show ? 'auto' : '100%';
    this.seekBar_.style.display = show ? 'none' : 'flex';
};


/**
 * Called when the seek range or current time need to be updated.
 * @private
 */
ShakaControls.prototype.updateTimeAndSeekRange_ = function() {
  var displayTime = this.isSeeking_ ?
      this.seekBar_.value : this.video_.currentTime;
  var duration = this.video_.duration;
  var bufferedLength = this.video_.buffered.length;
  var bufferedStart = bufferedLength ? this.video_.buffered.start(0) : 0;
  var bufferedEnd = bufferedLength ? this.video_.buffered.end(0) : 0;
  var seekRange = this.player_.seekRange();
  var current_time_second = new Date().getTime() / 1000;
  var showHour;

	if(hpvars.eventStartTime != 0 && current_time_second-hpvars.eventStartTime < hpvars.timeLimit*60){
		this.seekBar_.min = seekRange.end - (current_time_second-hpvars.eventStartTime);
	} else {
		this.seekBar_.min = seekRange.start;
	}
	this.seekBar_.max = seekRange.end;
	hpvars.seekfrom = parseInt(this.video_.currentTime) * 1000;

  if (this.player_.isLive()) {
    // The amount of time we are behind the live edge.
    // fix no autoplay current time
	if(this.video_.paused){
	//	displayTime = seekRange.end;
	}
	var behindLive = Math.floor(seekRange.end - displayTime);
	displayTime = Math.max(0, behindLive);
    showHour = displayTime >= 3600;
        if ((displayTime >= 0) || this.isSeeking_) {
            if (displayTime < 500000000)
                this.currentTime_.textContent =
                '- ' + this.buildTimeString_(displayTime, showHour);
        }

        if (!this.isSeeking_) {
            this.seekBar_.value = seekRange.end - displayTime;
        }
    } else {
		if(hpvars.adPlaying && this.isSeeking_){
			this.isSeeking_ = false;
		}
        var showHour = duration >= 3600;
        this.currentTime_.textContent =
            this.buildTimeString_(displayTime, showHour);

        if (!this.isSeeking_) {
            this.seekBar_.value = displayTime;
        }

        this.currentTime_.style.cursor = '';
    }
	hpvars.playhead = parseInt(displayTime) * 1000;

    var gradient = ['to right'];
    if (bufferedLength == 0) {
        gradient.push('#000 0%');
    } else {
        // NOTE: the fallback to zero eliminates NaN.
        var bufferStartFraction = (bufferedStart / duration) || 0;
        var bufferEndFraction = (bufferedEnd / duration) || 0;
        var playheadFraction = (displayTime / duration) || 0;

        if (this.player_.isLive()) {
            var bufferStart = Math.max(bufferedStart, seekRange.start);
            var bufferEnd = Math.min(bufferedEnd, seekRange.end);
            var seekRangeSize = seekRange.end - seekRange.start;
            var bufferStartDistance = bufferStart - seekRange.start;
            var bufferEndDistance = bufferEnd - seekRange.start;
            var playheadDistance = displayTime - seekRange.start;
            bufferStartFraction = (bufferStartDistance / seekRangeSize) || 0;
            bufferEndFraction = (bufferEndDistance / seekRangeSize) || 0;
            playheadFraction = (playheadDistance / seekRangeSize) || 0;
        }

        gradient.push('#a5a5a5 ' + (bufferStartFraction * 100) + '%');
        gradient.push('#a5a5a5 ' + (bufferStartFraction * 100) + '%');
        gradient.push('#a5a5a5 ' + (playheadFraction * 100) + '%');
        gradient.push('#a5a5a5 ' + (playheadFraction * 100) + '%');
        gradient.push('#a5a5a5 ' + (bufferEndFraction * 100) + '%');
        gradient.push('#fff ' + (bufferEndFraction * 100) + '%');
    }
    this.seekBar_.style.background =
        'linear-gradient(' + gradient.join(',') + ')';
};


/**
 * Builds a time string, e.g., 01:04:23, from |displayTime|.
 *
 * @param {number} displayTime
 * @param {boolean} showHour
 * @return {string}
 * @private
 */
ShakaControls.prototype.buildTimeString_ = function(displayTime, showHour) {
    var h = Math.floor(displayTime / 3600);
    var m = Math.floor((displayTime / 60) % 60);
    var s = Math.floor(displayTime % 60);
    if (s < 10) s = '0' + s;
    var text = m + ':' + s;
    if (m < 10) text = '0' + text;
    if (showHour) {
        text = h + ':' + text;
    }
    return text;
};
