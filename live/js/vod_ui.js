
(function(){

	var playerUI = window.playerUI = (window.playerUI||{});
	playerUI.onMouseStopTimer;
	playerUI.is_vod=false;
	//in second
	playerUI.current_time = 0;
	playerUI.original_time = 0;
	playerUI.total_time = 0;
	playerUI.seeking_time = 0;
	playerUI.seeking_bar_time = 0;
	playerUI.vol_level = 0;
	playerUI.waiting_time = 5000;
	playerUI.is_paused = false;
	playerUI.is_seeking = false;
	playerUI.is_video_end = false;
	playerUI.is_fullscreen= false;
    playerUI.is_caption_change = false;
    playerUI.is_live_qaulity_change = false;
    
	playerUI.language = 'tc'; //tc or sc or en
	playerUI.currentAudio="";
	playerUI.currentCaption="";
	playerUI.currentQuality ="";
	playerUI.apiData = null;
	playerUI.audio_array = [];
	playerUI.caption_array = [];
	playerUI.quality_array = [];
	playerUI.displayControlTimer;
	playerUI.setHistoryTimer;
	
	playerUI.init = function(containerID, vod_bool){
	     
		 playerUI.Container = $('#'+containerID);
		 playerUI.adsContainer = playerUI.Container.find('#adContainer');
		 playerUI.Control = playerUI.Container.find('#controlContainer');
		 playerUI.Overlay= playerUI.Container.find('.controlOverlay');
		 playerUI.language = slvars.lang;
		 if(vod_bool == true){
		     playerUI.is_vod = vod_bool;
		     playerUI.buildVodUI();
			 playerUI.watermaskContainer =   playerUI.Container.find('#watermaskContainer');
			  
			 
		 }else{
		 	//live 
		 	playerUI.is_vod = vod_bool;
		 	
		 	playerUI.buildLiveUI();
		 }
		 	
		 
	}
	playerUI.buildLiveUI = function(){
		playerUI.Control.append('<div class="videoControlsBg"></div>');
		
		if(playerUI.apiData["timeshift"] > 0 ){
			var timelimit = slCtl2.Content.SLPlayer.getTimeShiftLimit();
			
			if(playerUI.apiData["timeshift"]*60 > timelimit){
				playerUI.total_time = timelimit;
			}else{
				playerUI.total_time = playerUI.apiData["timeshift"]*60;
			}
			playerUI.createPlayPause();
			playerUI.createVolumnBtn();
			playerUI.createCurrentTime();
			playerUI.createSeekBar();
		
			playerUI.createFullscreenBtn();
			playerUI.createSettingBtn();
			playerUI.initPanelControl();
			
		}else{
			playerUI.createPlayPause();
			playerUI.createVolumnBtn();
			playerUI.createFullscreenBtn();
			playerUI.createSettingBtn();
			playerUI.initPanelControl();
		}
		
		
	}
	playerUI.buildVodUI = function(){
		
	 	playerUI.Control.append('<div class="videoControlsBg"></div>');
		playerUI.createPlayPause();
		playerUI.createVolumnBtn();
		playerUI.createCurrentTime();
		
		playerUI.createFullscreenBtn();
		playerUI.createSettingBtn();
		playerUI.createTotalTime();
		playerUI.createSeekBar();
		
		playerUI.initPanelControl();
		

		
	};
	playerUI.initPanelControl=function(){
				playerUI.Overlay.css('display','block');
		
		playerUI.Control.mouseover(function(){
		 		
		 		StopHideTimerFunction();
		 	});
		playerUI.Control.mousemove(function(){
				
		 		clearTimeout(playerUI.onMouseStopTimer);
		 		StopHideTimerFunction();
		 		
				$('.controlOverlay').css({cursor: 'pointer'});
				
		 		playerUI.Control.fadeIn(500);
		 		
		 		playerUI.onMouseStopTimer = setTimeout(function(){playerUI.controlPanelHide();
		 		 }, playerUI.waiting_time);
		 	});
		playerUI.Control.mouseout(function(){
		 		
		 		startHideTimerFunction();
		 	}); 	
		
		playerUI.Overlay.mouseover(function(){
			
		 		StopHideTimerFunction();
		 		
		 	}
		 );
		playerUI.Overlay.mousemove(function(){
			
				clearTimeout(playerUI.onMouseStopTimer);
		 		StopHideTimerFunction();
		 		
				$('.controlOverlay').css({cursor: 'pointer'});
				
		 		playerUI.Control.fadeIn(500);
				
		 		playerUI.onMouseStopTimer = setTimeout(function(){playerUI.controlPanelHide();
		 		 }, playerUI.waiting_time);
		 	}
		 );
	  	playerUI.Overlay.mouseout(function(){
				
		 		
		 		startHideTimerFunction();
		 	}
		 );
		if(playerUI.is_vod){
			playerUI.Overlay.click(function(){
				
		 		playerUI.playPauseClickHandler();
		 	});
		}
		startHideTimerFunction();
	
	}
	playerUI.controlPanelHide = function(){
		playerUI.Control.fadeOut(2000, function(){
			
		$('.settingPanel').removeClass('active');
		$('.settingButton').removeClass('click');
		$(".alert-msg").css("display","none");
			if(playerUI.is_fullscreen){
				
				$('.controlOverlay').css({cursor: 'none'});
			}
		});
		
	}
	playerUI.createPlayPause = function(){
		
		 playerUI.Control.append('<div class="playPauseBtn"><div class="playPauseBox play-icon"></div><div class="playPauseBox pause-icon"></div><div class="playPauseBox replay-icon"></div></div>');
		 var target = playerUI.Control.find('.playPauseBtn');
		 target.click(
		 	playerUI.playPauseClickHandler
		 );
		 
		 if(playerUI.is_paused == false){
		 	$('.pause-icon').css('display','block');
			 $('.play-icon').css('display','none');
			 $('.replay-icon').css('display','none');		 
		 }
	
	}
	playerUI.createSeekBar = function(){
		
		 playerUI.Control.append('<div class="seekBar"><div class="tooltips">10:00</div><div class="currentSeekBar"></div></div>');
		 var target = playerUI.Control.find('.currentSeekBar');
		 
		 if(playerUI.is_vod){
		 	var default_value = 1;
		 	var sign = "";
		 }else{		 
		 	var default_value = playerUI.total_time;
		 	var sign = "-";
		 }
		 
		target.slider({
			range: "min",
		  	value: default_value,
		  	min: 1,
		  	max: playerUI.total_time,
		   stop: playerUI.seekBarOnChangeEnd,
		   start: playerUI.seekBarOnChangeStart,
		   change: playerUI.seekBarOnChange
		});
		playerUI.tooltips = playerUI.Control.find('.tooltips');
		playerUI.tooltips.hide();
		target.mousemove(function(e){
			var parentOffset = $(this).parent().offset(); 
			var x = e.pageX - parentOffset.left;
			var y = e.pageY - parentOffset.top;
			var x_2 = x-20;
			
			var pixel_per_sec = playerUI.total_time/target.width();
			var target_timespan = x*pixel_per_sec;
			//console.log('target_timespan:: before'+target_timespan);
			if(!playerUI.is_vod){
				playerUI.seeking_bar_time = target_timespan;
				target_timespan = playerUI.total_time - target_timespan;
				playerUI.seeking_time = target_timespan;
			}else{
				playerUI.seeking_bar_time = target_timespan;
				playerUI.seeking_time = target_timespan;
			
			}
			
				//console.log('playerUI.current_time::'+playerUI.total_time);
				//console.log('pixel_per_sec::'+pixel_per_sec);
			//	console.log('target_timespan::'+target_timespan);
				//console.log('x::'+x);
			
				if(playerUI.total_time!= 0 && target_timespan < playerUI.total_time && target_timespan > 0 ){
					playerUI.tooltips.text(sign+toHHMMSS(target_timespan));
		   			playerUI.tooltips.show();
		   			playerUI.tooltips.css('left',x_2 + 'px' );
				}else if(target_timespan > playerUI.total_time){
					playerUI.seeking_time = playerUI.total_time;
					playerUI.tooltips.text(sign+toHHMMSS(playerUI.total_time));
		   			playerUI.tooltips.show();
		   			playerUI.tooltips.css('left',x_2 + 'px' );
				}else if(target_timespan < 0){
					playerUI.seeking_time = 0;
					playerUI.tooltips.text(sign+toHHMMSS(0));
		   			playerUI.tooltips.show();
		   			playerUI.tooltips.css('left',x_2 + 'px' );
				}
			
		});
		target.mouseleave(function(e){
	
			playerUI.tooltips.hide();
		});
   		$('.currentSeekBar .ui-slider-handle').mousemove(function(e){
		//	console.log('handle mouseover');
			if(!playerUI.is_seeking){
				playerUI.tooltips.hide();
				e.stopPropagation();
			}
		});
		$(".currentSeekBar .ui-slider-handle").unbind('keydown');
	}
	
	playerUI.seekBarOnChangeEnd = function( event, ui ){		
		playerUI.tooltips.hide();
		try{
			/*if(playerUI.seeking_time > playerUI.current_time  ){
				videoSeekForward();
			}else{
				videoSeekBackward();
			}*/
			playerUI.original_time = playerUI.current_time;
			if(playerUI.is_vod){
				slCtl2.Content.SLPlayer.SeekToPositionByJS(playerUI.seeking_time);
				$( ".currentSeekBar" ).slider( "option", "value", playerUI.seeking_bar_time );
			}else{
				console.log("seekBarOnChangeEnd:::playerUI.seeking_time ="+playerUI.seeking_time);
				//console.log("seekBarOnChangeEnd:::playerUI.seeking_time ="+playerUI.seeking_time);
				slCtl2.Content.SLPlayer.seekLivePostion(playerUI.seeking_time);
				$( ".currentSeekBar" ).slider( "option", "value", playerUI.seeking_bar_time );
				 $('#current_time_txt').text("-"+toHHMMSS(playerUI.seeking_time));
			}
		}catch(err){
			console.log(err);
		}
		playerUI.is_seeking = false;
	}
	playerUI.seekBarOnChangeStart = function( event, ui ){
		playerUI.is_seeking = true;
	}
	
	playerUI.createCurrentTime = function(){
		if(playerUI.is_vod){
			 playerUI.Control.append('<div class="timer currentTime"><span id="current_time_txt">00:00</span></div>');
		 }else{
		 	 playerUI.Control.append('<div class="timer currentTime"><span id="current_time_txt"> -00:00</span></div>');
		 }
	
	}
	playerUI.createTotalTime = function(){
		 playerUI.Control.append('<div class="timer totalTime"><span id="total_time_txt">00:00</span></div>');
		 updateVideoTotalDuration();
		
	}
	playerUI.createVolumnBtn = function(){
		playerUI.Control.append('<div class="volumeContainer"><div class="volumeButton"><div class="volumeButtonBox sound-icon"></div><div class="volumeButtonBox mute-icon"></div></div><div class="volumeBarContainer"><div class="volumeBar"></div></div></div>');
		var sound_btn = playerUI.Control.find('.sound-icon');
		var mute_btn = playerUI.Control.find('.mute-icon');
		var vol_bar = playerUI.Control.find('.volumeBar');
		var vol_bar_container = playerUI.Control.find('.volumeBarContainer');
		var is_vol_over = false;
		try{
			playerUI.vol_level = 1;
			slCtl2.Content.SLPlayer.setVolumeLevel(1);
			if(playerUI.vol_level > 0){
				$('.mute-icon').css('display','none');
				$('.sound-icon').css('display','block');
			}else{
				$('.mute-icon').css('display','block');
				$('.sound-icon').css('display','none');
			}
			
		}catch(err){
			console.log(err);
		}

		vol_bar.slider({
			range: "min",	
		  	min: 0,
		  	max:10,
		  	step:1,
		  	value:playerUI.vol_level*10,
		  	orientation: "vertical",
		  	change: playerUI.volumeOnChange
		   
		});
		
		sound_btn.click(playerUI.muteOrUnmuteClickHandler);
		mute_btn.click(playerUI.muteOrUnmuteClickHandler);
		
	}
	playerUI.volumeOnChange=function(event, ui){
		console.log("volumeOnChange::"+ui.value);
		var vol_level = ui.value/10;
		
		try{
			slCtl2.Content.SLPlayer.setVolumeLevel(vol_level);
			playerUI.vol_level = vol_level;
			
			if(playerUI.vol_level > 0){
				$('.mute-icon').css('display','none');
				$('.sound-icon').css('display','block');
			}else{
				$('.mute-icon').css('display','block');
				$('.sound-icon').css('display','none');
			}
		}catch(err){
			console.log(err);
		}
	
	}
	playerUI.muteOrUnmuteClickHandler =function(){
		if(playerUI.vol_level > 0){
			// mute
			try{
				slCtl2.Content.SLPlayer.setVolumeLevel(0);
				playerUI.vol_level = 0;
				$('.mute-icon').css('display','block');
				$('.sound-icon').css('display','none');
			}catch(err){
				console.log(err);
			}
			
		}else{
			// unmute
			try{
				slCtl2.Content.SLPlayer.setVolumeLevel(1);
				playerUI.vol_level = 1;
				$('.mute-icon').css('display','none');
				$('.sound-icon').css('display','block');
			}catch(err){
				console.log(err);
			}
		}
		$( ".volumeBar" ).slider( "option", "value", playerUI.vol_level*10 );
	}
	playerUI.createSettingBtn = function(){
		
		playerUI.Control.append('<div class="settingContainter"><div class="settingButton"></div><div class="settingPanel"></div></div>');
		var panel = playerUI.Control.find('.settingPanel');
		var btn = playerUI.Control.find('.settingButton');
		
		playerUI.createChannelMenu(panel);
		
		if(!playerUI.is_vod){
				playerUI.createCaptionlMenu(panel);
				playerUI.createQualityMenu(panel);
		}else{
			playerUI.createCaptionlMenu(panel);
			playerUI.createQualityMenu(panel);
			
		}
		btn.click(function(){
			if(btn.hasClass('click')){
				panel.removeClass('active');
				btn.removeClass('click');
				
			}else{
				btn.addClass('click');
				panel.addClass('active');
			}
		});
	
		
		
	}
	
	playerUI.createQualityMenu = function(panel){
		var setting_title = langConvert('Quality', playerUI.language );
		
		panel.append('<div class="setting_menu_item"><select class="quality_list"></select><span class="menu_title">'+setting_title+':</span></div>');
		try{
			playerUI.currentQuality = slCtl2.Content.SLPlayer.getCurrentBitrate();
			
		}catch(e){
		
			console.log("ERROR: createQualityMenu ");
		}
		
		if(playerUI.quality_array.length > 1 && playerUI.currentQuality!=""){
		
			for(var element in playerUI.quality_array ){

					var quality = playerUI.quality_array[element]["quality"];
					var display_lang = playerUI.quality_array[element]["display_name"];
				
				
		
					if(quality != ""){
				
						if(quality == playerUI.currentQuality){
							playerUI.currentQuality= quality;
							panel.find('.quality_list').append('<option value="'+quality+'" selected>'+display_lang+'</option>');
						}else{
							panel.find('.quality_list').append('<option value="'+quality+'">'+display_lang+'</option>');
						}
					}
		
				}
		}else{
			playerUI.currentQuality= 'Auto';
			var display_lang = langConvert(playerUI.currentQuality,playerUI.language  );
			panel.find('.quality_list').append('<option value="Auto" selected>'+display_lang+'</option>');
		}
		
		panel.find('.quality_list').change(function(){
			if($( this ).val() != 'Auto' || $( this ).val()!= playerUI.currentQuality){
				try{
					if(playerUI.is_vod){
						slCtl2.Content.SLPlayer.callSelectQuality($( this ).val());
						playerUI.currentQuality = $( this ).val();
						if(playerUI.is_paused == true){
							playerUI.is_paused = false;
							videoPlay();
							 $('.pause-icon').css('display','block');
							 $('.play-icon').css('display','none');
							 $('.replay-icon').css('display','none');
						}
			 		}else{
			 		
			 			slCtl2.Content.SLPlayer.callChangeLiveBitrate($( this ).val());
			 			playerUI.is_live_qaulity_change = true;
			 			/*var url = window.location.href;
						if(url.lastIndexOf('?') !=-1){
						
							//url = url.split('#').pop().split('?').pop();
							var page = url.substring(0,url.lastIndexOf('?') + 1);
							//console.log(page);
							window.location.href = page+"quality="+$( this ).val();
						}else{
							window.location.href = url +"?quality="+$( this ).val();
						}*/
			 		}
				}catch(e){
					console.log("ERROR: currentQuality ");
				}
				
					 
			}
		});
	}
	playerUI.createCaptionlMenu= function(panel){
		var setting_title = langConvert('Caption', playerUI.language );
		panel.append('<div class="setting_menu_item"><select class="caption_list"></select><span class="menu_title">'+setting_title+':</span></div>');
		try{
			if(playerUI.is_vod)	{
				playerUI.currentCaption = slCtl2.Content.SLPlayer.getSelectedCaptionTrack();
			}else{
				playerUI.currentCaption = slCtl2.Content.SLPlayer.getSelectedCaptionStream();
			}
			
		}catch(e){
		
			console.log("ERROR: getSelectedCaption ");
		}
		
		if(playerUI.caption_array.length > 1 && playerUI.currentCaption!=""){
		
			
			for(var element in playerUI.caption_array ){
			
				var lang = playerUI.caption_array[element]["lang"];
				var display_lang = playerUI.caption_array[element]["display_name"];
				
				
		
				if(lang != ""){
				
					if(lang == playerUI.currentCaption){
						playerUI.currentCaption= lang;
						panel.find('.caption_list').append('<option value="'+lang+'" selected>'+display_lang+'</option>');
					}else{
						panel.find('.caption_list').append('<option value="'+lang+'">'+display_lang+'</option>');
					}
				}
		
			}
		}else{
			playerUI.currentCaption= 'Auto';
			var display_lang = langConvert(playerUI.currentCaption,playerUI.language  );
			panel.find('.caption_list').append('<option value="Auto" selected>'+display_lang+'</option>');
		}
		
		
		panel.find('.caption_list').change(function(){
			console.log("selectCaption caption="+$( this ).val());
			if($( this ).val() != 'Auto' || $( this ).val()!= playerUI.currentCaption){
				try{
					if(playerUI.is_vod){
						//slCtl2.Content.SLPlayer.callSelectCaptionStream($( this ).val());
						playerUI.is_caption_change = true;
						slCtl2.Content.SLPlayer.callSelectCaptionTrack($( this ).val());
			 			playerUI.currentCaption = $( this ).val();
			 		}else{
			 			//live
			 			slCtl2.Content.SLPlayer.callSelectCaptionStream($( this ).val());
			 			playerUI.currentCaption = $( this ).val();
			 		}
				}catch(e){
					console.log("ERROR: selectCaption ");
				}
				
					 
			}
		});
	}
	playerUI.createChannelMenu= function(panel){
		var setting_title = langConvert('Channel', playerUI.language );
		panel.append('<div class="setting_menu_item"><select class="audio_list"></select><span class="menu_title">'+setting_title+':</span></div>');
		try{
			if(playerUI.is_vod)	{
				playerUI.currentAudio = slCtl2.Content.SLPlayer.getSelectedAudio();
			}else{
				playerUI.currentAudio = slCtl2.Content.SLPlayer.getSelectedAudioStream();
			}
			
		}catch(e){
		
			console.log("ERROR: getSelectedAudio ");
		}
		
		if(playerUI.audio_array.length > 1 && playerUI.currentAudio!=""){
		
			
			for(var element in playerUI.audio_array ){
			
				var lang = playerUI.audio_array[element]["lang"];
				var display_lang = playerUI.audio_array[element]["display_name"];
								
				if(lang != ""){
				
					if(lang == playerUI.currentAudio){
						playerUI.currentAudio= lang;
						
						panel.find('.audio_list').append('<option value="'+lang+'" selected>'+display_lang+'</option>');
					}else{
						panel.find('.audio_list').append('<option value="'+lang+'">'+display_lang+'</option>');
					}
				}
		
			}
		}else{
			playerUI.currentAudio= 'Auto';
			var display_lang = langConvert(playerUI.currentAudio,playerUI.language  );
			panel.find('.audio_list').append('<option value="Auto" selected>'+display_lang+'</option>');
		}
	
		panel.find('.audio_list').change(function(){
			if($( this ).val() != 'Auto' || $( this ).val()!= playerUI.currentAudio){
				try{
					if(playerUI.is_vod){
					
						slCtl2.Content.SLPlayer.callSelectAudioTrack($( this ).val());
			 			playerUI.currentAudio = $( this ).val();
			 			if(playerUI.is_paused == true){
			 				playerUI.is_paused = false;
			 				videoPlay();
						 	$('.pause-icon').css('display','block');
						 	$('.play-icon').css('display','none');
							 $('.replay-icon').css('display','none');
			 			}
			 		}else{
			 			//live
			 			slCtl2.Content.SLPlayer.callSelectAudioStream($( this ).val());
			 			playerUI.currentAudio = $( this ).val();
			 		}
				}catch(e){
					console.log("ERROR: selectAutio ");
				}
				
					 
			}
		});
	}
	playerUI.createFullscreenBtn = function(){
		playerUI.Control.append('<div class="fullscreenBtn"><div class="alert-msg">Your browser does not support full screen.</div><div class="fullscreenBtnBox fullsrn-icon"></div><div class="fullscreenBtnBox smallsrn-icon"></div></div>');
		var target_full = playerUI.Control.find('.fullsrn-icon');
		var target_small = playerUI.Control.find('.smallsrn-icon');
		target_full.click(function(){
			onFullscreen();
		
		});
		target_small.click(function(){
			exitFullscreen();
			
		});
	
	}
	
	
	
	playerUI.playPauseClickHandler =function(){
	 console.log('playPauseClickHandler');
	    console.log('is_paused:'+playerUI.is_paused);
		if( playerUI.is_paused == false && playerUI.is_video_end == false){
			 playerUI.is_paused = true;
			 callSLPause(1);
			 $('.pause-icon').css('display','none');
			 $('.play-icon').css('display','block');
			 $('.replay-icon').css('display','none');
		}else if ( playerUI.is_paused == true && playerUI.is_video_end == false){
			 playerUI.is_paused = false;
			 //if 0 = ads start in conviva
			 callSLPlay(1);
			 videoPlay();
			 $('.pause-icon').css('display','block');
			 $('.play-icon').css('display','none');
			 $('.replay-icon').css('display','none');
		}else{
			//retry
			location.reload();
		}
	}
	
	playerUI.onVideoComplete = function(){
		$('.pause-icon').css('display','none');
		$('.play-icon').css('display','none');
		$('.replay-icon').css('display','block');
		playerUI.is_video_end = true;
		
	}
	
	playerUI.onFullscreen = function(is_fullscreen){
		
		if(is_fullscreen){
			console.log("onFullscreen:::window.screen.width="+window.screen.width);
			playerUI.Container.width('100%');
			playerUI.Container.height('100%');
			if(playerUI.is_vod){
				var bar_width =window.screen.width - 150 - 35*4-30;
				
			}else{
				var bar_width =window.screen.width - 100 - 35*4-30;
				
			}
			
			//var bar_width = playerUI.Container.width();
			$('.seekBar').width(bar_width);
			$('.smallsrn-icon').css('display','block');
			$('.fullsrn-icon').css('display','none');
		
			
		}else{
			playerUI.Container.width(1024);
			playerUI.Container.height(576);
			if(playerUI.is_vod){
				$('.seekBar').width(704);
			}else{
				$('.seekBar').width(754);
			}
			$('.smallsrn-icon').css('display','none');
			$('.fullsrn-icon').css('display','block');
			
		}
		playerUI.is_fullscreen = is_fullscreen;
		slCtl2.Content.SLPlayer.goFullscreen(is_fullscreen);
	}
})();
function startHideTimerFunction() {
     playerUI.displayControlTimer  = setTimeout(
     	function(){
     		playerUI.controlPanelHide();
     	}
     	, 3000);
}

function StopHideTimerFunction() {
    clearTimeout( playerUI.displayControlTimer );
}


function updateCurrentTime(time){
	 $('#current_time_txt').text(toHHMMSS(time));
	 playerUI.current_time = time;
	 if(!playerUI.is_seeking){
			$( ".currentSeekBar" ).slider( "option", "value", time );
	 }
}
//update
function  updateVideoTotalDuration(){
    
//	console.log('updateVideoTotalDuration:'+ playerUI.total_time);
	$('#total_time_txt').text(toHHMMSS(playerUI.total_time));
	
	$( ".currentSeekBar" ).slider( "option", "max", playerUI.total_time );

}
//for vod only
function getApiData(data){
		
		datajson = JSON.parse(data);
		playerUI.total_time = slvars.duration;
		
		playerUI.apiData = datajson;
		if(typeof(datajson['video_stage']) !='undefined' && typeof(datajson['is_preview']) !='undefined'){
			if(datajson['is_preview'] == false){
				slvars.video_stage = datajson['video_stage'];
			}else{
				slvars.video_stage = "preview";
			}
		}
		slvars.quality_lable = slCtl2.Content.SLPlayer.getCurrentQualityLabel();
		
		
	//	if(slvars.videoId!="live"){
			if(typeof(datajson['profiles']) !='undefined' ){
				for( var element in datajson['profiles']){
						
						if(element!="auto"){
							var tmp = new Object;
							tmp["quality"] =  element;
							tmp["display_name"] = langConvert(tmp["quality"], playerUI.language );
							playerUI.quality_array.push(tmp);
						}
				}
			}
	//	}
		
	}
function changeQuality(){
 slCtl2.Content.SLPlayer.callChangeLiveBitrate("low");
 playerUI.is_live_qaulity_change = true;
}

function getVODAudio(data){
	
	datajson = JSON.parse(data);
	for(var element in datajson){
	
		var tmp = new Object;
	
		tmp["lang"] =  datajson[element]["Name"];
		tmp["display_name"] = langConvert(tmp["lang"], playerUI.language );
		playerUI.audio_array.push(tmp);
	}
}
function getLiveAudio(data){

	datajson = JSON.parse(data);
	var counter = 1;
	for(var element in datajson){
	
		var tmp = new Object;
	
		tmp["lang"] =  datajson[element]["Language"];
		tmp["display_name"] = "聲道"+counter;
		
		playerUI.audio_array.push(tmp);
		counter++;
	}

}
function getLiveCaption(data){
	
	datajson = JSON.parse(data);
	
	for(var element in datajson){
		
		var tmp = new Object;	
		tmp["lang"] =  datajson[element]["Language"];
		tmp["display_name"] = langConvert(tmp["lang"], playerUI.language );
		playerUI.caption_array.push(tmp);
		
	}

}
function getVODCaption(data){
	
	datajson = JSON.parse(data);
	console.log(data);
	for(var element in datajson){
		
		var tmp = new Object;	
		tmp["lang"] =  datajson[element]["Name"];
		tmp["display_name"] = langConvert(tmp["lang"], playerUI.language );
		playerUI.caption_array.push(tmp);
		
	}

}

//for common use
function toHHMMSS(secs){
	 var hours = Math.floor(secs/3600);
	
	 var divisor_for_minutes = secs % (60 * 60);
     var minutes = Math.floor(divisor_for_minutes / 60);
 
    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
    
    if(minutes < 10){
    		minutes = '0'+minutes;
	}
    if(seconds < 10){
    		seconds = '0'+seconds;
	}
	//console.log('toHHMMSS='+hours);
    if(hours