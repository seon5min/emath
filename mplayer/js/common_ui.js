	function checkplatform() {
		var filter = "win16|win32|win64|mac"; /* 2022-03-10 |macintel 삭제 */
		if (navigator.platform) {
			if (filter.indexOf( navigator.platform.toLowerCase() ) < 0) {
		        $('body').addClass('touch_mob'); /* 2022-03-10 추가 */
                return "mo";
            } else {
                return "pc";
            }
		}
	}

	function headerFix() {
		var checkpf = checkplatform();
		if (checkpf == "mo") return;
	
		var scrollObj = (window.innerWidth > 760) ? window : "#wrap";

		/* 스크롤 다운시 헤더 고정 */
		$(scrollObj).scroll(function () {
			if ($(this).scrollTop() > 50) {
				$('#content').addClass('fix');
				$('#header_2021').addClass('fix');
				$('.event_banner').hide(); /* 2022-03-03 ; 콜론처리 */
			} else {
				$('#content').removeClass('fix');
				$('#header_2021').removeClass('fix');
				$('.event_banner').show(); /* 2022-03-03 ; 콜론처리 */
			}
		});
	}

	$(document).ready(function(){
		function gnbAction() {
			var containerWidth = window.innerWidth;
			if (containerWidth < 809) { /* 2022-03-03 해상도 996에서 809로 조정 */
				$("body").removeClass("hide_scroll");
				//$("#gnb_pc").hide(); 2022-03-03 히든처리
				//$("#gnb_mo").show(); 2022-03-03 히든처리
				mo_gnb();
			}
			else {
				//$("#gnb_pc").show(); 2022-03-03 히든처리
				//$("#gnb_mo").hide(); 2022-03-03 히든처리
				pc_gnb();
			}
			function pc_gnb() {
				var gnbmenu = $('#gnb_pc');
				var mainNav = $('#gnb_pc .main_menu');
				$(mainNav).stop().animate({height:72},300);

				$(gnbmenu).on({
					click:function(e) {
						$(mainNav).stop().animate({height:310},500);
					},
					mouseenter:function(e) {
						$(mainNav).stop().animate({height:310},500);
					},
					mouseleave:function(e){
						$(mainNav).stop().animate({height:72},300);
					}
				});
				$("#header_2021 h1").css("z-index",9999)
			}
			function mo_gnb() {
				$("#gnb_mo").removeClass("open");

				var winH = $("#gnb_mo").height() - 154;
				$("#gnb_mo .main_menu > ul").height(winH);
				$("#gnb_mo .main_menu > ul > li.open .dep2 ").height(winH);
			}
		}

		//모바일GNB클릭시 2022-03-03 mo_gnb()에서 밖으로 오픈처리
        $("#btnMenu").on("click", function() {
            $(".btn_search").removeClass('close');
            $("#gnb_mo").addClass("open");
            $("body").addClass("hide_scroll"); /*2022-01-13 gnb메뉴 클릭시 스크롤 숨김*/
            $('.event_banner').hide()
        });

        $("#btnCloseMenu").on("click", function() {
            $("#gnb_mo").removeClass("open")
            $("body").removeClass("hide_scroll");
            if (checkplatform() != "mo") $('.event_banner').show()
        });

		//모바일GNB 1depth 클릭시
		$('#gnb_mo.ver2 .main_menu > ul > li').on("click", function(e) {
			$(this).siblings().removeClass("open");
			
			$(this).find('.dep1').addClass("on");
			$(this).addClass("open");
		});

		//모바일GNB 2depth 클릭시
		$('#gnb_mo.ver2 .main_menu .dep2 .sub').on("click", function(e) {
			$(this).toggleClass("on");
		});

		// Family Site
		$(".familySite .current").click(function(){
			if(!$(this).next().is(':visible'))
				$(this).next().slideDown(150);
			else
				$(this).next().slideUp(150);
		});

		$(".btn_search").click(function(e){
			$(this).toggleClass('close')
		});

		$(".btn_close_autocp").click(function(e){
			$(".btn_search").removeClass('close');
		});

		$(window).on('resize', function() {
			headerFix();
            gnbAction(); /* 2022-03-03 ; 콜론처리 */
		});
		headerFix(); /* 2022-03-03 ; 콜론처리 */
        gnbAction(); /* 2022-03-03 ; 콜론처리 */
	});

	function addCheckBox( obj ) {
		var onClick = obj.attr("onClick");
		obj.on("ifChecked", function (e) {
			$(this).attr("checked", true);
			$(this).change();
			if(onClick) {
				location.href = "javascript:"+onClick;
			}
		});
		obj.on("ifUnchecked", function (state) {
			$(this).attr("checked", false);
			$(this).change();
		});
	}

	function addSelectBox(obj) {
		var selectbox = new CustomSelectBox(obj, false, true);
		var onSelect = obj.attr("onSelect");

		obj.bind("change", function (e) {
			location.href = "javascript:"+onSelect;
		});
	}

	/* 2019-12-24 팝업 중앙 오픈 수정*/
	function openPop(popid, idx) {
		var popid = "#" + popid;
		var aW  =  $(window).width() /2;
		var aH  =  $(window).height() /2;

		if(idx != null) {
			$(popid).addClass("open").show();
		}
		var pLeft = aW  - ($(popid).find(".pop-cardmore").width() / 2);
		var pTop = aH  - ($(popid).find(".pop-cardmore").height() / 2);

		if($(popid).hasClass("open")) {
			$(popid).css({'left':pLeft,'top':pTop});
		}
	}

	/*2019-12-24 추가*/
	function closePop(popid) {
		var popid = "#" + popid;
		$(popid).removeClass("open").hide();
	}