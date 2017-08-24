function checkdf(){
    var i = getCookie("df");
    if (!i) i = 1;
    var df = document.frm1.selectAge.options[i].value;
    if(parseInt(df)>=1||parseInt(df)>=5){
        document.getElementById("selectAge").options[i].selected = true;
        flashvars.octoLink = octoLink + df;
    }else{
        document.getElementById("selectAge").options[1].selected = true;
        flashvars.octoLink = octoLink + 'abr_web';
    }
    console.log('octoLink:', flashvars.octoLink);
}
function df(){
    var i = document.frm1.selectAge.selectedIndex;
    document.cookie = 'df=' + i;
    console.log('df:', i);
    player_playlist();
}


function setCookie(name, value) {
    var Days = 30;
    var exp = new Date();
    exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    var strsec = getsec(time);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) return (arr[2]);
    else return null;
}

function delCookie(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}

function p(){
	var i = document.frm1.selectP.selectedIndex;
	var d = document.frm1.selectP.options[i].value;
	var a = getCookie("Ch");
	var b = getCookie("Ch_code");
	var c = getCookie("Ch_id");
	SUPER(a,b,c,d);
}

function jget(){
    location.href="http://super.oopo.bid/?mid="+$("#superID").val()+"&stoken="+$("#idToken").val();
}

function base64_encode(str){
        var c1, c2, c3;
        var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";                
        var i = 0, len= str.length, string = '';

        while (i < len){
                c1 = str.charCodeAt(i++) & 0xff;
                if (i == len){
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt((c1 & 0x3) << 4);
                        string += "==";
                        break;
                }
                c2 = str.charCodeAt(i++);
                if (i == len){
                        string += base64EncodeChars.charAt(c1 >> 2);
                        string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                        string += base64EncodeChars.charAt((c2 & 0xF) << 2);
                        string += "=";
                        break;
                }
                c3 = str.charCodeAt(i++);
                string += base64EncodeChars.charAt(c1 >> 2);
                string += base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
                string += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
                string += base64EncodeChars.charAt(c3 & 0x3F)
        }
                return string
}

function SUPER(a,b,c,d) {
	document.title =a+' - mytvSUPER';
	slvars.displaytxt = 'oopo by 1glive';
	slvars.channel_code = b;
	slvars.programme = c+"-"+a;
	slvars.v_id = "live"+c;
    slvars.memberId = $("#superID").val();
	slvars.token = base64_encode($("#idToken").val())+"_"+slvars.tokenkey+"_"+slvars.timetoken+"_"+d;
	
	object  ="<div id="\"silverlightplayer\"">";
		object +="<textarea id="\"errLogs\"" rows="\"10\"" style="\"display:none\""></textarea>";
		object +="<div class="\"controlOverlay\""></div>";
		object +="<div id="\"controlContainer\""></div>";
			object += "<object id="\"silverlightObject\"" data="\"data:application/x-silverlight-2,\"" type="\"application/x-silverlight-2\"" width="\"100%\"" height="\"100%\"">";
				object += "<param name="\"source\"" value="\"ClientBin/oopo_splayer.xap\"">";
				object += "<param name="\"background\"" value="\"white\"">";
				object += "<param name="\"windowless\"" value="\"true\"">";
				object += "<param name="\"onload\"" value="\"pluginLoadedPlayer\"">";
				object += "<param name="\"minRuntimeVersion\"" value="\"5.0.61118.0\"">";
				object += "<param name="\"autoUpgrade\"" value="\"true\"">";
				object += "<param name="\"enableGPUAcceleration\"" value="\"true\"">";
				object += "<param name="\"InitParams\"" value="\"scriptablename=SLPlayer\"">";
			object += "</object>";
	object += "<div class="\"loading_video\""></div></div>";
	
    oopoEpg = '<input type="hidden" id="current_locale" name="current_locale" value="tc">';
    oopoEpg = oopoEpg+'<div class="hidden" id="network_code">'+b+'</div>';
    oopoEpg = oopoEpg+'<div class="live-epg-wrap promo-wrap transparent_with_big_body">';
    	oopoEpg = oopoEpg+'<div class="promo live-epg">';
    		oopoEpg = oopoEpg+'<div class="epg-left">';
    			oopoEpg = oopoEpg+'<div class="current-channel">';
    				oopoEpg = oopoEpg+'<div class="channel-no ">'+c+'</div>';
    				oopoEpg = oopoEpg+'<div class="channel-name">'+a+'</div>';
    				oopoEpg = oopoEpg+'<div class="clearfix"></div>';
    				oopoEpg = oopoEpg+'<a class="to-epg btn" target="_blank" href="https://www.mytvsuper.com/tc/epg/'+b+'">節目表</a>';
    				oopoEpg = oopoEpg+'<div class="clearfix"></div>';
    			oopoEpg = oopoEpg+'</div>';
    			oopoEpg = oopoEpg+'<div class="epg epg-loading"></div>';
    		oopoEpg = oopoEpg+'</div>';
    	oopoEpg = oopoEpg+'</div>';
    oopoEpg = oopoEpg+'</div>';
	
	$("#player").html(object);
	$("#epg").html(oopoEpg);
	
	init_silverlight_action();
	epg.init();
	
    if (d=="4095") {
    		document.cookie = 'Ch=' + a;
    		document.cookie = 'Ch_code=' + b;
    		document.cookie = 'Ch_id=' + c;
    		$('#selectP option[value='+d+']').attr('selected','selected');
    		$('#selectP option[value='+d+']').removeAttr('selected');
    	}
	document.cookie = 'mid=' + $("#superID").val();
	document.cookie = 'stoken=' + $("#idToken").val();
}