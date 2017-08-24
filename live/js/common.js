var gbl_current_locale,gbl_current_locale2,gbl_cookie_domain;

$(document).ready(function() {
	gblVar.init();
	menu.init();
//	login.init();
	common.init();
//	tracking.trackClickingForAHref();
//	chromeSpecialPrompt();
});

// Avoid `console` errors in browsers that lack a console.
(function() {
	if (typeof console === "undefined" || typeof console.log === "undefined") {
		var method;
		var noop = function () {};
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = (window.console = window.console || {});

		while (length--) {
			method = methods[length];

			// Only stub undefined methods.
			if (!console[method]) {
				console[method] = noop;
			}
		}
	}
}());

(function(){
	var common = window.common = (window.common||{});
	var myAjax = window.myAjax = (window.myAjax||{});
	var menu = window.menu = (window.menu||{});
	var login = window.login = (window.login||{});
	var tracking = window.tracking = (window.tracking||{});
	var gblVar = window.gblVar = (window.gblVar||{});
	var playerCall = window.playerCall = (window.playerCall||{});
	
	var viewHistory = window.viewHistory = (window.viewHistory||{});
	
	/* assign global variables */
	gblVar.init = function(){
		gbl_current_locale =  $('#current_locale').val();
		gbl_current_locale2 =  $('#current_locale2').val();
		gbl_cookie_domain =  $('#cookie_domain').val();
	}
	
	/*common*/
	var posterClickTrigger = function() {
		
	}

	common.btnClickTrigger = function() {
		/*btn click*/
		//$('.go_href_btn').click(function() {
		$(document).on('click','.go_href_btn',function(){
			tracking.trackClicking($(this));
			targetUrl = $(this).find('a').attr('href');
			location.href = targetUrl;
			return false;
		});
	/*	$('.go_href_btn').find('a').focus(function(){
			this.blur();
		});*/

		//lightbox close
		$(document).on('click','.lightbox_close, .popup-close',function(e){
			e.preventDefault();
			$.colorbox.close();
		});

		$(document).on('click','a', function(e){
			$(this).blur();
		});
		
		$(document).on('click','.click-popup-img',function(e){
			$.colorbox({
				href: $(this).attr('data-img'),
				closeButton: true
			});
		});
		
		$(document).on("keypress", 'form', function (e) {
			var code = e.keyCode || e.which;
			if (code == 13) {
				e.preventDefault();
				if($(this).find('.enter-submit')){
					$(this).find('.enter-submit').eq(0).click();
				}
				return false;
			}
		});
				
		$(document).on('click','.slave-purchase',function(e){
			e.preventDefault();
			$.colorbox({
				'href' : '/'+gbl_current_locale+'/slavePurchaseMsg',
			});
		});
		
		$(document).on('click','.free-purchase',function(e){
			e.preventDefault();
			$.colorbox({
				'href' : '/'+gbl_current_locale+'/freePurchaseMsg',
			});
		});		
	}
	
	common.colorboxSetting = function() {
		$.colorbox.settings.closeButton = false;
		
		$.colorbox.settings.width = '87%';
		$.colorbox.settings.maxWidth =  '900px';
		
		if(gbl_current_locale == 'tc'){
			var close_btn = "<br><button class="btn common_btn4 lightbox_close"><span>確定</span></button>";
			$.colorbox.settings.xhrError = '服務暫時未能提供，請稍候再試。'+close_btn;
		} else {
			var close_btn = "<br><button class="btn common_btn4 lightbox_close"><span>OK</span></button>";
			$.colorbox.settings.xhrError = 'Service cannot be provided at this moment. Please try again later.'+close_btn;
		}
	}
	
	common.loginPrompt = function(){
		if($('#login_prompt').length > 0){
			if(readCookie('login_prompted') == null){
				$.colorbox({
					'href':$('#login_prompt').val(),
					'closeButton':true,
					'width':'auto',
					'height':'auto',
					'onComplete': function(){
						$('.cboxPhoto').css('cursor','pointer');
						$('.cboxPhoto').click(function(){
							$.colorbox.close();
						});
					},
					'onClosed': function(){	
					}
				});
				createCookie('login_prompted','yes',8760);
			} 
		}
	}

	common.init = function(){
		//posterClickTrigger();
		common.btnClickTrigger();
		common.colorboxSetting();
		common.loginPrompt();
	}
	
	/*  watch History */
	
	viewHistory.addRecord = function(lastWatchingTime){
		var lastWatchingTimeLength = lastWatchingTime.length;
		if(lastWatchingTimeLength==5){
			var lastWatchingTime = "00:"+lastWatchingTime;
		}
		var temp = lastWatchingTime.split(':');
		var playback_time = parseInt(temp[0]*60*60)+parseInt(temp[1]*60)+parseInt(temp[2]);
		var programmeId = $('.more-and-fav .program-detail-popup-call').attr('data-popup');
		var episodeId = $('#vod #vod_info #programme_episodeid').html();
		var programmeName = $('#vod #vod_info #upper_header .programme_title').html();
		var programmePath = $('#vod #vod_info #programme_path').html();
		var episodeNumber = $('#vod #vod_info #programme_episode_number').html();
		var videoID = $('#vod #vod_info #programme_vid').html();
		var duration = $('#vod #vod_info #episode_duration').html();
		
		var episode_title = $('#vod #vod_info #programme_episode_title').html();
		var thumbnailImg = $('#vod #vod_info #episode_thumbnail').html();//
		var lastSeenTime = new Date().getTime();
		lastSeenTime = lastSeenTime / 1000.0;
		
		var info = {};
		info.apiTarget = 'setHistory';
		info.param = {};
		info.param.custom_request = 'put';
		info.param.custom_request_is_post = true;
		var apiParam = {};
		apiParam.history_item = [];
		apiParam.history_item[0] = {};
		apiParam.history_item[0]['episode_id'] = episodeId;
		apiParam.history_item[0]['programme_id'] = programmeId;
		apiParam.history_item[0]['programme_title'] = programmeName;
		apiParam.history_item[0]['programme_path'] = programmePath;
		apiParam.history_item[0]['episode_number'] = episodeNumber;
		apiParam.history_item[0]['episode_duration'] = duration;
		apiParam.history_item[0]['episode_title'] = episode_title;
		apiParam.history_item[0]['episode_thumbnail_url'] = thumbnailImg;
		apiParam.history_item[0]['last_seen_time'] = lastSeenTime;
		apiParam.history_item[0]['playback_time'] = playback_time;
		apiParam.history_item[0]['video_id'] = videoID;
		info.apiParam = apiParam;
	
		info.successCallbacks = function(json_data){
			console.log("successCallbacks:"+json_data);
		}

		if(episodeId!=""){
			myAjaxHistory.sendRequest(info);
		}
	}
	
	viewHistory.delAllRecord = function(){
		var info = {};
		info.apiTarget = 'setHistory';
		
		
		info.successCallbacks = function(json_data){
			console.log("successCallbacks:del All:"+json_data);
		}
		myAjaxHistory.sendRequest(info);
	
	}
	var listener = function (event) {
  /* do something here */
	};
	viewHistory.delRecord = function(episodeId) {
	
		var deleteTarget = "#deHistory_"+episodeId;
		
		

		var info = {};
		info.apiTarget = 'setHistory';
		info.apiParam = {};
		info.param = {};

		info.apiParam.episode_id = episodeId;
		info.param.custom_request = 'delete';
		info.successCallbacks = function(json_data){
		var data = JSON.parse(json_data);
		console.log("successCallbacks:delRecord:"+json_data);
		console.log("data.content.result:"+data.content.result);
			if(data.content.result == "OK"){
				tracking.trackClicking($(this)); 
				$(deleteTarget).find(".dele_histoy").remove();
				$(deleteTarget).find(".go_href_btn.episode_overlay ").remove();
				$(deleteTarget).find(".delete_overlay").css("display","block");
				$(deleteTarget).find(".expired_episode_overlay").css("display","none");
			}
		}
		if(episodeId!=""){
			myAjaxHistory.sendRequest(info);
		}
		return false;
	}
	
	/*ajax*/
	//To call api and get view directly, and show ajax returns in a div
	myAjax.show = function(info) {
		var currentHomepage = $('#current_homepage').val();
		if(!(info.div && info.param.method && info.param.view_target && info.param.key)){ //necessary info
			return false;
		}
		$("html").removeClass('notbusy').addClass('busy');
		if(!info.isAppend){
			showLoader(info.div);
		}
		var successCallback = info.successCallbacks || false;
		var url = info.url || currentHomepage+'/call_api_and_get_view';
		var apiParam = info.apiParam || {};
		var param = info.param || {};
		param.api_param = JSON.stringify(apiParam);
		if(info.apiParamQuery){
			param.api_param_query = info.apiParamQuery;
		}
		$.ajax({
			url: url,
			data: param,
			type:"GET",
			dataType:'text',

			success: function(view_data){
				if(info.isAppend){
					$(info.div).append(view_data);
				} else {
					$(info.div).html(view_data);
					common.btnClickTrigger();
				}
				$("html").removeClass('busy').addClass('notbusy');
				if(successCallback){
					successCallback.call(this, view_data);
				}
				
			},

			error:function(xhr, ajaxOptions, thrownError){ 
				console.log(xhr.status); 
				console.log(thrownError); 
			}
		});

	}


	/*tracking*/
	var getTrackingInfoFromClassname = function(classInfo){
		var clickInfo = 'noInfo';
		if(classInfo){
			var temp = classInfo.split('tracking_');
			if(temp[1]){
				var temp2 = temp[1].split(' ');
				clickInfo = temp2[0];
			}
		}

		var currentPage = window.location.pathname;
		if(currentPage=='/'){
			currentPage = '/home';
		}
		var trackingInfo = currentPage+":"+clickInfo;
		return trackingInfo;
	}

	var sendToTracking = function(passingData){
		//console.log("pass tracking data:"+passingData);
	}
	//call tracking for click event
	tracking.trackClicking = function(clickElement){
		//passingData = clickElement.prop("tagName");
		var classInfo = clickElement.attr('class');
		var trackingInfo = getTrackingInfoFromClassname(classInfo);
		sendToTracking(trackingInfo);
	}

	tracking.trackClickingForAHref = function(){
		$(document).on("click", "a" , function() {
			var classInfo = $(this).attr('class');
			var trackingInfo = getTrackingInfoFromClassname(classInfo);
			sendToTracking(trackingInfo);
			//return false;
		});
	}

	/*menu*/
	var searchAutoComplete = function(){
		var term = '';
		var currentHomepage = $('#current_homepage').val();
		var searchUrl = $('#search_url').val();
		var showallMsg = $('#showall_msg').val();

		$.widget( "custom.catcomplete", $.ui.autocomplete, {
			_renderMenu: function( ul, items ) {
			var searchPosition = $('#search-bar').position();
			//var scrollTop = $(document).scrollTop();;
			$('.ui-autocomplete').css({"top": searchPosition.top+45, 'position': 'fixed'});
			$('#default_search').addClass('display_none');
			ul.append( "<li class="ui-autocomplete-category" id="search_bar_showall"><a data-ana-resid="result" data-ana-type="all">"+showallMsg+"</a></li>" );
			term = this.term;
			var that = this,
			currentCategory = "";
			$.each( items, function( index, item ) {
			if ( item.category != currentCategory ) {
				ul.append( "<li class="ui-autocomplete-category">" + item.category + "</li>" );
				currentCategory = item.category;
			}
			li = that._renderItemData( ul, item );
			
			if(item.category_key=='programme'){
				li.children('a').addClass("ana_search_prog");
				li.children('a').attr({'data-ana-type':'program','data-ana-resid':'result'});
			}else{
				li.children('a').addClass("ana_search_artist");
				li.children('a').attr({'data-ana-type':'artist','data-ana-resid':'result'});
			}
			});
			}
		});

		var autoCompleteUrl = currentHomepage+'/search_auto_complete';
		$( "#search-input-bar" ).catcomplete({
			source: autoCompleteUrl,
			select: function(event, ui) {
				if(ui.item){
					$(this).val(ui.item.value);
					//console.log(ui.item);				
					if(ui.item.category_key){
						switch(ui.item.category_key) {
							case 'programme':
								$('#search_url').val(searchUrl);
								//$('#search_url').val(searchUrl+'/program');
								//$( ".ana_search_prog" ).trigger( "click" );
								break;
							case 'cast':
								$('#search_url').val(searchUrl);
								//$('#search_url').val(searchUrl+'/program');
								//$( ".ana_search_artist" ).trigger( "click" );
								break;
							default:
						}
					}
					$(this).parents("form").submit();  //to submit the form when selected
				} else {
					if(term!=''){
						window.location.href = searchUrl+'?keyword='+term;
					} else {
						console.log('autocomplete error');
					}
					return false;
				}
			}
		}).focus(function(){
			if (this.value == ""){
				if(!$("#default_search").hasClass("updated")){
					var info = {};
					info.div = '#default_search';
					info.param = {};
					info.param.method = 'is_get';
					info.param.view_target = 'common.default_auto_complete';
					info.param.key = 'no';
					info.apiParam = 'no';
					info.successCallbacks = function(json){
						var searchPosition = $('#search-bar').position();
						var scrollTop = $(document).scrollTop();
					//	$('#default_search').css({"left": searchPosition.left+986, "top": searchPosition.top+116, 'position': 'fixed'});
						$('#default_search').css({'position': 'relative'});
						$('#default_search').addClass('updated');
						$('#default_search').removeClass('display_none');
						$('#default_search .ui-menu-item').addClass('default_search_item');
						$(".default_search_item").hover(
							function() {
								$( this ).addClass( "ui-state-focus" );
							}, function() {
								$( this ).removeClass( "ui-state-focus" );
							}
						);
					};
					myAjax.show(info);
				} else {
					var searchPosition = $('#search-bar').position();
					var scrollTop = $(document).scrollTop();;
					//$('#default_search').css({"left": searchPosition.left+986, "top": searchPosition.top+116, 'position': 'fixed'});
					$('#default_search').css({'position': 'relative'});
					$('#default_search').removeClass('display_none');
				}
			}
		}).focusout(function(){
			if (this.value == ""){
				$('body').click(function(e) {
					var target = $(e.target);
					if(target.hasClass('default_serach_option')){
						var searchText = $.trim(target.html());
						var searchUrl = $('#search_url').val();
						//console.log($.trim(target.html()));
						if(searchText==''){
							return false;
						}
						//searchText = encodeURIComponent(searchText);
						window.location.href = searchUrl+'?keyword='+searchText;
					} else {
						$('#default_search').addClass('display_none');
						$('body').unbind();
					}
				});
			}
		});
	}

	var searchSubmit = function(){
		
		$('#search').submit(function() {
			var searchUrl = $('#search_url').val();
			var searchText = $('#search-input-bar').val();
			
			/*
			if(checkSpecialChars(searchText)){
				alert("你輸入的字串包含非法字符，請重新輸入！");
				return false;
			}
			*/
			if(searchText==''){
				return false;
			}
			//searchText = encodeURIComponent(searchText);
			window.location.href = searchUrl+'?keyword='+searchText;
			return false;
		});
	}

	var menuPrepare = function(){
		$('.promo-menu-drop-down').mouseover(function(){
			$(this).find('ul').css('display','block');
		});
		$('.promo-menu-drop-down').mouseout(function(){
			$(this).find('ul').css('display','none');
		});
	}

	menu.init = function(){
		menuPrepare();
		searchAutoComplete();
		searchSubmit();
	}

	/* for player */
	playerCall.playerExtendDeviceChecking = function(){
		var check_device = Cookies.get('check_device');
		if(typeof check_device != 'undefined'){	
			var date = new Date();
			date.setTime(date.getTime()+24*60*60*1000);
			var check_device_expire = date.toGMTString();	
			document.cookie='check_device='+check_device+';expires='+check_device_expire+';path=/;domain='+gbl_cookie_domain+';';
		}
	}

	//To add placeholder for ie
	window.add_placeholder = function(id) {
		var el = document.getElementById(id);
		//var placeholder = el.getAttribute("placeholder");
		var placeholder = $('#'+id).attr("placeholder");

		el.onfocus = function ()
		{
			if(this.value == placeholder)
			{
				this.value = '';
				el.style.cssText  = '';
			}
		};

		el.onblur = function ()
		{
			if(this.value.length == 0)
			{
				this.value = placeholder;
				el.style.cssText = 'color:#A9A9A9;';
			}
		};

		el.onblur();
	}

	//var specialChars = "<>@!#$%^&*()_+[]{}?:;|'\"\\,./~`-=";
	var specialChars = "~!*()'\"\\";
	window.checkSpecialChars = function(string){
		for(i = 0; i < specialChars.length;i++){
			if(string.indexOf(specialChars[i]) > -1){
				return true
			}
		}
		return false;
	}
	$.fn.onEnter = function(func) {
		this.bind('keypress', function(e) {
			if (e.keyCode == 13) func.apply(this, [e]);    
		});
		return this; 
	};

	window.showLoader = function(aimDiv){
		var img = $("<img id="progressImgage" src="https://s.img.tvb.com/mytv4/img/ajax-loader.gif">");
		var mask = $("<div id="maskOfProgressImage"></div>").addClass("mask");
		var PositionStyle = "fixed";

		if (aimDiv != null && aimDiv != "" && aimDiv != undefined) {
			$(aimDiv).css("position", "relative").append(img).append(mask);
			PositionStyle = "absolute";
		}
		else {
			$("body").append(img).append(mask);
		}
		img.css({
			"z-index": "2000",
			"display": "none"
		})
		mask.css({
			"position": PositionStyle,
			"top": "0",
			"right": "0",
			"bottom": "0",
			"left": "0",
			"z-index": "1000",
			"background-color": "#fff",
			"display": "none",
			"height": "999px",
			"width": "100%"
		});
		img.show().css({
			"position": PositionStyle,
			"top": "40%",
			"left": "50%",
			"margin-top": function () { return -1 * img.height() / 2 + 100; },
			"margin-left": function () { return -1 * img.width() / 2; }
		});
		mask.show().css("opacity", "0.4");
	}

	// To generate GET parameters based on properties of an object
	window.encodeParam = function(obj) {
		var data = [];
		for (var key in obj)
			data.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
		return data.join('&');
	}

	//To get the value from the URL parameter
	window.getURLParameter = function(name) {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null
	}

	//cookie
	window.createCookie = function(name,value,hrs) {
		if (hrs) {
			var date = new Date();
			date.setTime(date.getTime()+(hrs*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		
		document.cookie=name+'='+value+expires+';path=/;domain='+gbl_cookie_domain+';';
	}

	window.readCookie = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	window.eraseCookie = function(name) {
		createCookie(name,"",-1);
	}
})();

/* function slaveExpiredRedirect(code){
	window.location.href = '/'+gbl_current_locale+'/deviceMsg/'+code+'/page?type=p';
} */

function chromeSpecialPrompt(){
	//if($.browser.name == 'chrome'){
		var chromePrompt = readCookie('chrome_prompted');
	//	var is_web = readCookie('web_auth');
	//	var need_check_device = readCookie('check_device');
	//	if(chromePrompt != 'yes' && is_web != null && need_check_device != null){
		if(chromePrompt != 'yes'){
			var link = '/'+gbl_current_locale+'/prompt/re_login';
			$.colorbox({
				href: link,
				onComplete: function(){
					$.colorbox.resize();
				}
			});
			createCookie('chrome_prompted','yes',8760);
		}
//	}
}
