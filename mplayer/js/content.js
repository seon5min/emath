
$(document).ready(function(){
	var btn_crs_sub = $('.course_sub .items button');
	$(btn_crs_sub).on("click", function(e) {
		$(this).siblings().removeClass("on");
		$(this).addClass("on")
	});

	/* 콘텐츠 관련 레이어 */
	var btn_fn_cnt = $('.list_con .cnt_item .btn_fncnt');
	$(btn_fn_cnt).on("click", function(e) {
		e.stopPropagation();
		$('.popup_slayer_fncont').removeClass("open");
		$(this).parent().siblings('.popup_slayer_fncont').addClass("open").attr('tabindex','0').focus();
	});

	/*검색&내콘텐츠목록 콘텐츠 레이어*/
	$('.srch_item .btn_fncnt').on("click", function(e) {
		var _has_open = $('.popup_slayer_fncont').hasClass("open");
		if(!_has_open) {
			$(this).parent().siblings('.popup_slayer_fncont').addClass("open").attr('tabindex','0').focus();
		}
		else $('.popup_slayer_fncont').removeClass("open");
	});

	$(".popup_slayer_fncont .close").on("click", function(e) {
		$('.popup_slayer_fncont').removeClass("open").removeAttr('tabindex');
	});

	$(".btn_srch_dt").on("click", function(e) {
		var sel_optpart = $(".search_option")
		if($(sel_optpart).hasClass("open")) {
			$(this).removeClass("on");
			$(sel_optpart).removeClass("open");
		}
		else {
			$(this).addClass("on");
			$(sel_optpart).addClass("open");
		}
	});
	$(".diff_opt .btn_seltgl").on("click", function(e) {
		$(this).toggleClass("on")
		$(".diff_opt ul").toggleClass("open")
	});

	/* 모바일&태블릿 찜하기*/
	$(".btn_pop_zzim, .btn_pop_fav").on("click", function(e) {
		//$(this).toggleClass("on")
	});


	/* sns 공유하기 */
	var btn_share = $('.btn_pop_shr');
	$(btn_share).on("click", function(e) {
		$(this).closest(".popup_slayer_fncont").removeClass("open")
		$('.pop_share_sns').addClass("open").attr('tabindex','0').focus();
	});
	$(".btn_sns").on("click", function(e) {
		$('.pop_share_sns').addClass("open").attr('tabindex','0').focus();
	});

	var btn_share_close = $('.pop_share_sns .btn_pop_close');
	$(btn_share_close).on("click", function(e) {
		$('.pop_share_sns').removeClass("open").removeAttr('tabindex');
	});

	/* 학습기록삭제,다운로드 팝업 */
	var btn_rel_con = $('.btn_content, .btn_pop_dwn');
	$(btn_rel_con).on("click", function(e) {
		var btn_type = $(this).attr("class").split(" ")[1];
		$(".pop_rel_con").removeClass("open").removeAttr('tabindex');
		if(btn_type == "btn_download" || btn_type == null)	{
			$('.pop_download').addClass("open").attr('tabindex','0').focus();
		}
		if(btn_type == "btn_del_rcd") {
			$(".pop_del_stdlog").addClass("open").attr('tabindex','0').focus();
		}
	});
	var btn_rel_con = $('.pop_rel_con .btn_pop_close');
	$(btn_rel_con).on("click", function(e) {
		$(this).closest('.pop_rel_con').removeClass("open").removeAttr('tabindex');
	});



	/* 게임존 이달의top10 */
	var btn_top10 = $('.game_list .cnt_item .btn_top10');
	var org_gamelist;
	$(btn_top10).on("click", function(e) {
  		e.preventDefault();
		var containerWidth = window.innerWidth;
		var evtB = $(".event_banner").is(':visible');
		var evtBH = (!evtB) ? 0 : $(".event_banner").height();
		var	headerH = evtBH + 72;
		org_gamelist = $(this);

		if(containerWidth < 760)	var gm_offset = $("#wrap").scrollTop();
		else 	var gm_offset = $(window).scrollTop();

		var popH = $('.pop_gametop10 .pop_content').height() + gm_offset;
		var allowH = $('#wrap').height() - popH - headerH;
		var finH = gm_offset - headerH;

		var popname = ".pop_gametop10 .pop_container";
		if (popH >  allowH)	{
			if(finH < 0) finH = 100 + headerH;
			$(popname).css({top:finH}).show();
		}
		else  {
			$(popname).css({top:gm_offset}).show();
		}

		if(containerWidth < 760)	var gm_offset = $("#wrap").scrollTop(finH);
		else var gm_offset = $(window).scrollTop(finH);

		$('.pop_gametop10').addClass("open");
		//$('.pop_gametop10 .pop_content').attr('tabindex','0').focus();

	});

	var btn_top10_close = $('.pop_gametop10 .btn_pop_close');
	$(btn_top10_close).on("click", function(e) {
		org_gamelist.focus();
		$('.pop_gametop10').removeClass("open")
		//$('.pop_gametop10').removeClass("open").removeAttr('tabindex');
	});

	$('.btn_latest_game').on("click", function(e) {
		$(this).toggleClass("on");
		$('.latest_game_list').toggleClass("open");
	});

	$('html').click(function(e) {
		e.stopPropagation();

		var _this = $(e.target).attr("class");
		var _parent = $(e.target).parent().parent().attr("class");
		if(_parent == null || _parent == undefined) _parent = "none";

		if (_this == "btn_fncnt") return;
		else $('.popup_slayer_fncont').removeClass("open").removeAttr('tabindex');
	});

	$(window).on('load resize', function() {
		containerWidth = window.innerWidth;
		init_check_device();
	});



});
var containerWidth;

function init_check_device(){
	var checkpf = checkplatform();
	var containerWidth = window.innerWidth;
	if (checkpf == "mo") {
		$('.mycon_chk').hide();
		//$('.btn_download').hide();
		$('.my_contents_mid .btn_del_sel').hide();
	}
	if (containerWidth < 1025 && checkpf == "mo") {
		$('.list_con .btn_fncnt').show();
		$('.con_opt select').hide();
	}
	if (containerWidth > 760 || checkpf == "pc") {
		ThumbMov();
	}
}

function openCrsList() {
	var crs_tit = document.querySelectorAll('.tit_course_m');
	if($(crs_tit).is(".open")) 	$(crs_tit).removeClass("open");
	else $(crs_tit).addClass("open");
}

/* pc 버전 찜하기*/
var sl_bm_idx; /*삭제해도무관*/
function bookmarkCnt() {
	event.stopPropagation();
	var evnum = event.currentTarget;
	$(evnum).toggleClass("on");
}



function ThumbMov(){
	var timer;
	var timerex;
	var checkpf = checkplatform();
	$(document).on("mouseenter",".list_con .hoverMovie",function() {
		if (containerWidth <= 760 || checkpf == "mo") return;
		else {
			if ( $(this).parents("body").find("li").hasClass("hoverMovie") == true ){
				var This = $(this);
				var data = $(this).find("img").attr('video-src');
				var hasmov = $(this).find("video").length;

				timer = setTimeout(function(){
					if(hasmov > 0) return;
					$(This).find("img").parent().append('<video class="video-preview" preload="none" muted=""><source src='+data+' type="video/mp4"></video>').find('video')[0].play();
				},250);
			}
		}

	});
	$(document).on("mouseleave",".list_con .hoverMovie",function() {
		if (containerWidth <= 760 || checkpf == "mo") return;
		else {
			if ( $(this).parents("body").find("li").hasClass("hoverMovie") == true){
				clearTimeout(timer);
				timerex =setTimeout(function(){
					$(".hoverMovie").find("video").remove();
				},200);
			}
		}
	});
}

