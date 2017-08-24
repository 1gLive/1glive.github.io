<?php
error_reporting(0);
if ($_SERVER["HTTP_HOST"] == "oopo.bid") {header("Location: 404.html");}
$password = "666666"; // 这里是密码
$p = "";
$isview = false; 
if(isset($_COOKIE["isview"]) and $_COOKIE["isview"] == $password){ 
$isview = true; 
}else{ 
if(isset($_POST["pwd"])){ 
if(strip_tags($_POST["pwd"]) == $password){ 
setcookie("isview",strip_tags($_POST["pwd"]),time()+3600*3); 
$isview = true; 
}else{ 
$p = (empty($_POST["pwd"])) ? "需要密码才能观看，请输入密码。" : "密码不正确，请重新输入。"; 
} 
}else{ 
$isview = false; 
$p = "请输入密码观看，获取密码扫二维码。"; 
} 
} 
if($isview){ ?>
<html>
	<head>
	    <?php $ent = time();?>
	    <title>mytvSUPER</title>
		<meta charset="utf-8" />
		<script type="text/javascript" src="https://s.img.tvb.com/mytvsuper/web/js/lib/jquery-1.11.2.min.js<?php echo '?t='.time();?>"></script>
		<script type="text/javascript" src="js/Silverlight.js<?php echo '?t='.time();?>"></script>
        <script type="text/javascript" src="js/videoTracking_html5_v2.js<?php echo '?t='.time();?>"></script>
        <script type="text/javascript" src="js/streamView_html5_v2.js<?php echo '?t='.time();?>"></script>
        <script type="text/javascript" src="js/silverlight_action.js<?php echo '?t='.time();?>"></script>
        <script type="text/javascript" src="js/vod_ui.js<?php echo '?t='.time();?>"></script>
        <script type="text/javascript" src="js/jquery-ui.js<?php echo '?t='.time();?>"></script>
		<script type="text/javascript" src="js/object.js<?php echo '?t='.time();?>"></script> 
        <link rel="stylesheet" href="https://s.img.tvb.com/mytvsuper/web/css/lib/bootstrap.css<?php echo '?t='.time();?>" /> 
        <link rel="stylesheet" href="css/live.css<?php echo '?t='.time();?>" type="text/css" media="screen" />
        <script type="text/javascript" src="js/jquery.colorbox.js<?php echo '?t='.time();?>"></script>
        <script src="js/common.js<?php echo '?t='.time();?>"></script>
        <link type="text/css" rel="stylesheet" href="css/jquery-ui.css<?php echo '?t='.time();?>" />
		<link type="text/css" rel="stylesheet" href="css/vod.css<?php echo '?t='.time();?>" />
        <link rel="shortcut icon" href="/tvb.ico"/>
		<style>
		img{width:6.4%;height:3.2%;}
		a{ text-decoration:none;}
		</style>
		<script type="text/javascript">
            var slCtl = slCtl2 = null;
            var SLcustID = null;
            var slvars = {};
            var vdoDuration = 0;
            var playState = "";
            var videoOpen_bool = false;
            var isPause_bool = false;
            slvars.pingStream = "1";
            slvars.lang = "tc";
            slvars.cc = "HK";
            slvars.env = "prod";
            slvars.videoId = "live";
            slvars.host = "mytvsuper.com";
            slvars.programmeId = "";
            slvars.membershipId = "guest";
            slvars.timeLimit = "90000";
            slvars.timetoken = "<?php echo $ent;?>";
            slvars.tokenkey = "<?php echo sha1($ent+4095);?>";
            slvars.duration = "0";
            slvars.videoType = "live";
            slvars.episodeNo = "";
            slvars.title = "";
            slvars.drm = "true";
            slvars.type = "start";
            slvars.product = 'mytvsuper';
            slvars.productVer = '1.0';
            slvars.p_device_type = 'pc';
            slvars.is_master = 'true'; 
            slvars.customer_stage = 'paid'; 
            slvars.resolution = screen.width + "X" + screen.height;
            slvars.startPosition = '0';
			slvars.quality ="auto";
        </script>
	</head>
	<body style="background-color: rgb(204, 232, 207)">
	    <br>
        <div id="player"></div>
        <HR width="100%" color=#46A65F SIZE=3>
		<div align="center">`
			<br>
			<a href="#翡翠台" onclick=SUPER("翡翠台","J","81","4095")  title="翡翠台"><img src="img/Free-Jade.png" alt="翡翠台"></a>&nbsp;&nbsp;
			<a href="#J2" onclick=SUPER("J2","B","82","4095")  title="J2"><img src="img/Free-J2.png" alt="J2"></a>&nbsp;&nbsp;
			<a href="#互動新聞台" onclick=SUPER("互動新聞台","C","83","4095")  title="互動新聞台"><img src="img/Free-iNews.png" alt="互動新聞台"></a>&nbsp;&nbsp;
			<a href="#明珠台" onclick=SUPER("明珠台","P","84","4095")  title="明珠台"><img src="img/Free-Pearl.png" alt="明珠台"></a>&nbsp;&nbsp;
			<a href="#J5" onclick=SUPER("J5","A","85","4095")  title="J5"><img src="img/Free-J5.png" alt="J5"></a>&nbsp;&nbsp;
			<a href="https://www.mytvsuper.com/tc/live/81" target="_blank" title="MytvSuper">MytvSuper官网登录</a>
		</div>
        <br>
        <div id="epg" style="margin-right:5%;float:right;"></div>
        <div class="hidden" id="api_domain">api.mytvsuper.com</div>
        <script src="js/live.js<?php echo '?t='.time();?>"></script>
		<div align="center">`
			<br>
			<a href="#TVB經典台" onclick=SUPER("TVB經典台","CTVC","86","4095")  title="TVB經典台"><img src="img/TVBClassic_after20170401.jpg" alt="TVB經典台"></a>
			<a href="#韓劇台" onclick=SUPER("韓劇台","CTVS","87","4095")  title="韓劇台"><img src="img/Korean_after20170401.jpg" alt="韓劇台"></a>
			<a href="#日劇台" onclick=SUPER("日劇台","CTVD","88","4095")  title="日劇台"><img src="img/Japanese_after20170401.jpg" alt="日劇台"></a>
			<a href="#華語劇台" onclick=SUPER("華語劇台","CDR3","89","4095")  title="華語劇台"><img src="img/Chinese_after20170401.jpg" alt="華語劇台"></a>
			<a href="#精選亞洲劇台" onclick=SUPER("精選亞洲劇台","CDR4","90","4095")  title="精選亞洲劇台"><img src="img/AsianSelect_after20170401.jpg" alt="精選亞洲劇台"></a>
			<a href="#娛樂新聞台" onclick=SUPER("娛樂新聞台","CTVE","91","4095")  title="娛樂新聞台"><img src="img/Ent-News_after20170401.jpg" alt="娛樂新聞台"></a>
			<a href="#綜藝台" onclick=SUPER("綜藝台","CWIN","92","4095")  title="綜藝台"><img src="img/AsianVariety_after20170401.jpg" alt="綜藝台"></a>
			<br>
			<a href="#為食台" onclick=SUPER("為食台","CTVL","93","4095")  title="為食台"><img src="img/Food_after20170401.jpg" alt="為食台"></a>
			<a href="#體育台" onclick=SUPER("體育台","CSPT","94","4095")  title="體育台"><img src="img/Sport_after20170401.jpg" alt="體育台"></a>
			<a href="#翡翠即日重溫" onclick=SUPER("翡翠即日重溫","CTVR","95","4095")  title="翡翠即日重溫"><img src="img/JadeCatchUp_after20170401.jpg" alt="翡翠即日重溫"></a>
			<a href="#旅遊台" onclick=SUPER("旅遊台","CTVT","96","4095")  title="旅遊台"><img src="img/Travel_after20170401.jpg" alt="旅遊台"></a>
			<a href="#TVBRadio" onclick=SUPER("TVBRadio","CTVM","97","4095")  title="TVBRadio"><img src="img/TVB-Radio_after20170401.jpg" alt="TVBRadio"></a>
			<a href="#粵語片台" onclick=SUPER("粵語片台","CCLM","200","4095")  title="粵語片台"><img src="img/ClassicMovies_after20170401.jpg" alt="粵語片台"></a>
			<a href="#直播新聞台" onclick=SUPER("直播新聞台","CTN2","700","4095")  title="直播新聞台"><img src="img/TVBN2_after20170401.jpg" alt="直播新聞台"></a>
			<br>
			<a href="#美亞電影台" onclick=SUPER("美亞電影台","CMAM","201","4095")  title="美亞電影台"><img src="img/MeiAh.png" alt="美亞電影台"></a>
			<a href="#DW" onclick=SUPER("DW","CDW1","706","4095")  title="DW"><img src="img/DW.png" alt="DW"></a>
			<a href="#Thrill360" onclick=SUPER("Thrill360","CTHR","202","4095")  title="Thrill360"><img src="img/Thrill360.png" alt="Thrill360"></a>
			<a href="#天映經典頻道" onclick=SUPER("天映經典頻道","CCCM","203","4095")  title="天映經典頻道"><img src="img/Celestial_Classic.png" alt="天映經典頻道"></a>
			<a href="#KIX360" onclick=SUPER("KIX360","CKIX","304","4095")  title="KIX360"><img src="img/KIX360.png" alt="KIX360"></a>
			<a href="#Animax" onclick=SUPER("Animax","CANI","504","4095")  title="Animax"><img src="img/animax.png" alt="Animax"></a>
			<a href="#無線衛星新聞台" onclick=SUPER("無線衛星新聞台","CTSN","702","4095")  title="無線衛星新聞台"><img src="img/TVBS-NEWS.png" alt="無線衛星新聞台"></a>
		</div>
		<div align="center" style="display:;">
		<br>
			ID：<input id="superID" placeholder="myTV SUPER账号" value="" type="text" style="background-color: rgb(204, 232, 207);border:2px solid rgb(204, 232, 207); width:100px; height:24px; font-size:16px; font-weight:bold; line-height:1.6;">
			&nbsp;Token：<input id="idToken" placeholder="ID相应的slvars.token" value="" type="text" style="background-color: rgb(204, 232, 207);border:2px solid rgb(204, 232, 207); width:200px; height:24px; font-size:16px; font-weight:bold; line-height:1.6;">
			&nbsp;清晰度：
			<form name="frm1" style="display: inline;">
				<select id="selectP" onchange="p()" name="selectP" style="background-color: rgb(204, 232, 207);border:2px solid rgb(204, 232, 207); width:65px; height:24px; font-size:16px; font-weight:bold; line-height:1.6;">
					<option value="4095" selected>Auto</option>
					<option value="4064" >低</option>
					<option value="3992" >中</option>
					<option value="3975" >高</option>
				</select>
			</form>
			&nbsp;&nbsp;<a class="to-epg btn" href="#" onclick=jget()>Get方式</a>
			<br><br><br>
			<font color="#FF3300">
			<p>使用说明：</p>
			<p>必须在ID填写myTVSUPER账号，以及在token填写账号对应的<a href="token.html" target="_blank">token</a>值。</p>
	        <p>myTV SUPER by Silverlight 推荐使用IE11、UC浏览器或win10使用QQ浏览器兼容模式。</p>
			</font>
		</div>
		<script type="text/javascript">
			$("#superID").attr("value",<?php if (isset($_GET["mid"])) {echo '"'.strip_tags($_GET["mid"]).'"';} else {echo 'getCookie("mid")';}?>);
			$("#idToken").attr("value",<?php if (isset($_GET["stoken"])) {echo '"'.strip_tags($_GET["stoken"]).'"';} else {echo 'getCookie("stoken")';}?>);
			SUPER("翡翠台","J","81","4095");
        </script>
        <!-- UY BEGIN -->
        <div id="uyan_frame"></div>
        <script type="text/javascript" src="http://v2.uyan.cc/code/uyan.js?uid=2139570"></script>
        <!-- UY END -->
  <!--HOSTNAME: w2.mytvsuper.hk4.inline.tvb.com-->
<?php }else{ ?> 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" " http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"> 
<html xmlns=" http://www.w3.org/1999/xhtml"> 
<head> 
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> 
<meta http-equiv="pragma" content="no-cache" /> 
<meta http-equiv="cache-control" content="no-cache" /> 
<meta http-equiv="expires" content="0" /> 
<title>芝麻开门</title> 
</head>
<body>
<!--[if lt IE 6]> 
<style type="text/css"> 
.z3_ie_fix{ float:left; } 
</style> 
<![endif]--> 
<style type="text/css"> 
<!-- 
body{ background:#000 url(../img/bg.png); } 
.passport{ border:1px solid red; background-color:#FFFFCC; width:400px; height:100px; position:absolute; left:49.9%;  top:49.9%; margin-left:-250px; margin-top:-55px; font-size:14px; text-align:center; line-height:30px; color:#746A6A; } 
--> 
</style> 
<div class="passport"> 
<div style="padding-top:20px;"> 
<form action="" method="post" style="margin:0px;">输入密码 
<input type="password" name="pwd" /> <input type="submit" value="进入" />
</form> 
<?php echo $p; ?> 
</div>
<a target="_blank" href="//shang.qq.com/wpa/qunwpa?idkey=21889bf0ad53364655663fb3578dc9911e255c0cb58da5584e825ce4c54271b8"><img style="position:absolute; left:49.9%;  top:49.9%; margin-left:200px; margin-top:-55px;height:110px;" border="0" src="qq.png" alt="Q群637324695" title="Q群637324695"</a>
</div>
<script>           
    function setCookie(expiredays){
        value=document.getElementsByName('pwd')[0].value;
        var exdate=new Date()
        exdate.setDate(exdate.getDate()+expiredays)
        document.cookie='pwd'+ "=" +escape(value)+
        ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
    }
</script> 
<?php 
} ?> 
	</body>
</html>