
(function(){
		var streamView = window.streamView = (window.streamView||{});
		streamView.event = "stateChange";
		streamView.type = "playback";
		streamView.label = "";
		streamView.resID = "video";
		streamView.videoID = "";
		streamView.mode = "";
		streamView.qualityLabel = "";
		streamView.videoStage = "";
		streamView.streamType = "vod";
		streamView.viewMode = "";
		
		streamView.streamViewTracking = function(wvideo_element, wv_id,wp_video_stage){
			streamView.video_element = wvideo_element;
			

			
			if(slvars.videoId == "live"){
				streamView.videoID = wv_id.substring(4);
				streamView.streamType = "live";
			}else{
				streamView.videoID = wv_id;
			}
			
			streamView.quality_lable = slvars.quality_lable;
			
			streamView.videoStage = wp_video_stage;
			
			if(streamView.videoStage == "preview" ){
				streamView.mode = "preview";
			}else{
				streamView.mode = "others";
			}
			streamView.eventTigger("start",0);
					
		}
		streamView.eventTigger= function(label, timeshift){
			var trackingObj = new Object();
			trackingObj.event = streamView.event;
			trackingObj.type = streamView.type;
			trackingObj.resID = streamView.resID; 
			trackingObj.timeshift = timeshift;
			trackingObj.viewMode = streamView.viewMode;
			
			trackingObj.videoID = streamView.videoID;
			trackingObj.mode = streamView.mode;
			trackingObj.qualityLabel = streamView.quality_lable;
			trackingObj.videoStage = streamView.videoStage;
			trackingObj.streamType = streamView.streamType;
			
				if(label == 'start')
				{
					trackingObj.label = "start";
					
				
				}
				else if(label == 'play')
				{
					
					trackingObj.label = "play";
					
				}
				else if(label == 'pause')
				{
				
					trackingObj.label = "pause";
				
				}
				else if(label == 'seekforward')
				{
					
					trackingObj.label = "seekforward";
				
					trackingObj.timeshift =timeshift;
				}
				else if(label == 'seekbackward')
				{
				
					trackingObj.label = "seekbackward";
					
					trackingObj.timeshift = timeshift;
				}
				else if(label == 'stop')
				{
					
					trackingObj.label = "stop";
				
					trackingObj.timeshift = "0";
				}
				else if(label == 'finish')
				{
				
					trackingObj.label = "finish";

					trackingObj.timeshift = "0";
				}
				var triggerEvent = document.createEvent("CustomEvent");
				triggerEvent.initCustomEvent("stateChange", true, true, trackingObj);
				document.getElementById(streamView.video_element ).dispatchEvent(triggerEvent);
		
		}
	
})();