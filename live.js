$(document).ready(function(){
	epg.init();
	setInterval(epg.init, 30*60*1000);
	if($('.free-purchase').length > 0){
		$('.free-purchase').click();
	}
});

(function(){
	var epg = window.epg = (window.epg ||{});
	var data_epg, data_channel_list;
	var current_date, current_date_hyphen, current_network_code;

	epg.init = function(){
		epg.setDateTime();
		epg.setEPGData();
	};

	epg.setDateTime = function(){
		var today = new Date();
		var hr = today.getHours();
		if(hr < 6){
			today.setDate(today.getDate() - 1);
		}
		var dd = today.getDate();
		var mm = today.getMonth()+1;
		var yyyy = today.getFullYear();
		if(dd<10) {
			dd='0'+dd;
		} else {
			dd = dd.toString();
		}
		if(mm<10) {
			mm='0'+mm;
		} else {
			mm = mm.toString();
		}
		current_date = yyyy+mm+dd;
		current_date_hyphen = yyyy+'-'+mm+'-'+dd;

		//current_date = '20171214';
		//current_date_hyphen = '2017-12-14';
	};

	epg.setEPGData = function(){
		current_network_code = $('#network_code').html();
		$.ajax({
			url: "https://"+$('#api_domain').html()+"/rest_listing_api/epg/format/jsonp",
			dataType: "jsonp",
			data: { network_code:"all",from: current_date},
			jsonp: "callback",
			success: function(rs){
				if(typeof rs.content[current_date_hyphen] != 'undefined'){
					data_epg = rs.content[current_date_hyphen];
					epg.renderCurrentChannelEPG(epg.getChannelEPG(6, current_network_code));
					epg.prepareAllEPG();
				}
			}
		});
	};

	epg.prepareAllEPG = function(){
		var rs = $('#channel_listing').html();
		epg.renderAllEPG(epg.prepareChannelArray(JSON.parse(rs)));
	}

	epg.renderCurrentChannelEPG = function(epg){
		var wrap, time, programme;
		if(!$('.epg').hasClass('epg-loading')){
			$('.epg').html('');
			$('.epg').addClass('epg-loading');
		}
		for(x in epg){
			wrap = $('<div/>').addClass('epg-row');
			time = $('<div/>').addClass('epg-time').html(epg[x].time);
			programme = $('<div/>').addClass('epg-programme').html('<span>'+epg[x].programme+'</span>');
			/*
			if(typeof epg[x].programme_full != 'undefined'){
				wrap.attr('title',epg[x].programme_full);
			}
			*/
			wrap.attr('title',epg[x].programme);
			if(epg[x].onair_codes.length > 0){
				for(y in epg[x].onair_codes){
					programme.append($('<cite/>').addClass(epg[x].onair_codes[y]));
				}
			}
			wrap.append(time,programme);
			$('.epg').append(wrap);
			$('.epg').removeClass('epg-loading');
		}
	}

	epg.renderAllEPG = function(epg_all){
		var wrap, ch_logo, right, row_1, ch_name, time, programme_name, cite_wrap, clearfix, a;
		if(!$('.epg-all').hasClass('hidden')){
			$('.epg-all').html('');
			$('.epg-all').addClass('epg-loading');
		}

		wrap = $('<a/>').addClass('epg-all-wrap');
		ch_logo = $('<div/>').addClass('epg-logo');
		right = $('<div/>').addClass('right-wrap');
		clearfix = $('<div/>').addClass('clearfix');
		row_1 = $('<div/>').addClass('epg-row-1');
		ch_logo = $('<div/>').addClass('epg-logo');
		ch_name = $('<div/>').addClass('epg-ch-name');
		time = $('<div/>').addClass('epg-time');
		programme_name = $('<div/>').addClass('epg-programme');
		cite_wrap = $('<div/>').addClass('cite-wrap');

		row_1.append(ch_name, time, cite_wrap);
		right.append(row_1, programme_name);
		wrap.append(ch_logo, right, clearfix);

		for(x in epg_all){
			a = wrap.clone();
			if(x%3 == 2){
				a.addClass('epg-all-wrap-3');
			}
			a.attr('href',epg_all[x].channel_no);
			if(typeof epg_all[x].current_channel != 'undefined'){
				a.addClass('current-channel');
			}
			a.find('.epg-logo').html(epg_all[x].channel_no);
			if(epg_all[x].channel_no.length > 2){
				a.find('.epg-logo').addClass('epg-logo-3');
			}
			a.find('.epg-ch-name').html(epg_all[x].channel_name);
			if(typeof epg_all[x].current_programme[0] != 'undefined'){
				a.find('.epg-ch-name').after('<div class="bar">|</div>');
				a.find('.epg-time').html(epg_all[x].current_programme[0].time);
				a.find('.epg-programme').html(epg_all[x].current_programme[0].programme);
				if(epg_all[x].current_programme[0].onair_codes.length > 0){
					for(y in epg_all[x].current_programme[0].onair_codes){
						a.find('.cite-wrap').append($('<cite/>').addClass(epg_all[x].current_programme[0].onair_codes[y]));
					}
				}
				/*
				if(typeof epg_all[x].current_programme[0].programme_full != 'undefined'){
					a.attr('title',epg_all[x].current_programme[0].programme_full);
				}
				*/
				a.attr('title',epg_all[x].current_programme[0].programme);
			}

			$('.epg-all').append(a);
		}
		if($('.epg-all-wrap').length > 0){
			$('.epg-all').removeClass('hidden epg-loading');
		}
	}

	epg.getChannelEPG = function(no_of_program, network_code){
		var tmp,nc;
		var data = [];
	//	var now = Date.now();
		if(data_epg){
			for(depg in data_epg){
				if(data_epg[depg].network_code == network_code){
					for(y in data_epg[depg].epg){
						if(checkTime(data_epg[depg].epg[y].start_datetime) || data_epg[depg].epg.length == 1 || y == (data_epg[depg].epg.length - 1)){

							if(data_epg[depg].epg.length == 1){
								var for_start = 0;
								var for_end = 1;
							} else if(y == (data_epg[depg].epg.length - 1)) {
								if(checkTime(data_epg[depg].epg[y].start_datetime)){
									var for_start = y-1;
								} else {
									var for_start = y;
								}
								var for_end = y+1;

							} else {
								var for_start =  y-1;
								var for_end = (y-1+no_of_program);
							}
							for(var i = for_start ; i < for_end ; i++){
								if(typeof(data_epg[depg].epg[i]) != 'undefined'){
									tmp = new Object();
									tmp.time = processDisplayTime(data_epg[depg].epg[i].start_datetime);
									if(data_epg[depg].epg[i]['programme_title_'+gbl_current_locale] != ''){
										tmp.programme = data_epg[depg].epg[i]['programme_title_'+gbl_current_locale];
									} else {
										tmp.programme = data_epg[depg].epg[i].programme_title_tc;
									}
									/*
									if(no_of_program == 1){
										if(tmp.programme.length > 15){
											tmp.programme_full = tmp.programme;
											tmp.programme = tmp.programme.substring(0,13)+'...';
										}
									} else {
										if(gbl_current_locale == 'tc'){
											var trim_length = 30;
										} else {
											var trim_length = 55;
										}
										if(tmp.programme.length > trim_length){
											console.log(tmp.programme);
											tmp.programme_full = tmp.programme;
											tmp.programme = tmp.programme.substring(0,trim_length-2)+'...';
										}
									}
									*/
									if(typeof(data_epg[depg].epg[i].onair_codes) != 'undefined'){
										tmp.onair_codes = processOnAirCodes(data_epg[depg].epg[i].onair_codes);
									} else {
										tmp.onair_codes = [];
									}
									data.push(tmp);
								}
							}
							return data;
						}
					}
				}
			}
		}
		return [];
	};

	epg.prepareChannelArray = function(c){
		var tmp;
		var data = [];
		for(x in c){
			tmp = new Object();
			tmp.channel_no = c[x].channel_no;
			tmp.path = c[x].path;
			if(typeof c[x]['name_'+gbl_current_locale] != 'undefined' && c[x]['name_'+gbl_current_locale]){
				tmp.channel_name = c[x]['name_'+gbl_current_locale];
			} else {
				tmp.channel_name = c[x].name_tc;
			}
			/*
			if(gbl_current_locale == 'tc'){
				if(tmp.channel_name.length >= 14){
					tmp.channel_name = tmp.channel_name.substring(0,11)+'...';
				}
			} else {
				if(tmp.channel_name.length > 20){
					tmp.channel_name = tmp.channel_name.substring(0,17)+'...';
				}
			}
			*/
			if(typeof c[x].network_code != 'undefined' && c[x].network_code){
				tmp.current_programme = epg.getChannelEPG(1, c[x].network_code);
				if(c[x].network_code == current_network_code){
					tmp.current_channel = true;
				}
			} else {
				tmp.current_programme = [];
			}
			data.push(tmp);
		}
		return data;
	};

	var checkTime = function(start_time){
//		var d = new Date();
		var current_ts = Date.now();
		var start_time_split = start_time.match(/(\d+)-(\d+)-(\d+) (\d+):(\d+):(\d+)/);
		var epg_time = new Date(start_time_split[1],parseInt(start_time_split[2], 10) - 1,start_time_split[3],start_time_split[4],start_time_split[5],start_time_split[6]);
		var epg_ts = epg_time.getTime();

//		var current_time = new Date("January 22, 2018 12:30:00");
//		current_ts = current_time.getTime();

		if(epg_ts > current_ts){
			return true;
		}
		return false;
	};

	var processDisplayTime = function(start_time){
		if(start_time){
			var daynight = new Object();
			if(gbl_current_locale == 'tc'){
				daynight.am = '涓婂崍';
				daynight.pm = '涓嬪崍';
			} else {
				daynight.am = 'am';
				daynight.pm = 'pm';
			}
			var display_daynight = daynight.am;
			var dt_split = start_time.split(' ');
			var time = dt_split[1];
			var time_split = time.split(':');
			var display_time = time_split[0]+':';
			if(parseInt(time_split[0]) > 12){
				display_time = (parseInt(time_split[0])-12)+':';
				if((parseInt(time_split[0])-12) < 10){
					display_time = '0'+display_time;
				}
				display_daynight = daynight.pm;
			}
			if(parseInt(time_split[0]) == 12){
				display_daynight = daynight.pm;
			}
			if(display_time != ''){
				display_time += time_split[1];
				if(gbl_current_locale == 'tc'){
					display_time = display_daynight+display_time;
				} else {
					display_time += display_daynight;
				}
			}
			return display_time;
		}
	};

	var processOnAirCodes = function(code){
		var output = [];
		if(code.match(/C2,C3/i)){
			output.push('c2_c3');
		} else if(code.match(/LC/i) || code.match(/SA/i)){
			output.push('lc');
		} else if(code.match(/C2/i)){
			output.push('c2');
		} else if(code.match(/C3/i)){
			output.push('c3');
		}
		if(code.match(/C1/i)){
			output.push('e');
		} else if(code.match(/C9/i)){
			output.push('e');
		}
		if(code.match(/PG/i) || code.match(/P[0-9]/i)){
			output.push('pg');
		}
		if(code.match(/M[0-9]{1,}/i)){
			output.push('m');
		}
		if(code.match(/E/i)){
			output.push('e');
		}
		if(code.match(/HD/i)){
			output.push('hd');
		}
		/* multilingual checking copied from epg */
		var filters = [];
		for(var i = 0; i<=9 ; i++){
			filters.push('S'+i);
		}
		for(var i = 0; i<=9 ; i++){
			filters.push('D'+i);
		}
		var code_split = code.split(',');
		var same_count = 0;
		for(z in code_split){
			if(filters.indexOf(code_split[z]) != -1){
				same_count++;
			}
			if(same_count >= 2){
				if(output.indexOf('ml') == -1){
					output.push('ml');
					break;
				}
			}
		}
		return output;
	};
})();
