	var sl_bm_idx;
	function bookmarkCnt() {
		event.stopPropagation();
		var evnum = event.currentTarget;

		var sl_par = $(evnum).parents('.slide_wrap').find('.cnt_item')[sl_bm_idx];
		var org_sl = $(sl_par).find(".btn_zzim")

		if($(org_sl).hasClass("on")) {
			$(org_sl).removeClass("on")
			 $(evnum).removeClass("on")
		}
		else {
			$(org_sl).addClass("on");
			$(evnum).addClass("on");
		}
	}

	function recomTag (query, srchUrl) {
		$.ajax({
			url: '<c:url value="/searchMainTag" />?query='+query+'&srchUrl='+srchUrl,
			type: 'get',
			dataType: 'json',
			async: false,
			success: function (data) {
				if (data.result == 'success') {
					var str = '';
					var arr = data.tag;
					var cnt = data.tag.length;

					if (cnt > 0) {
						arr.forEach(function (e) {
							str += '<li><a href="javascript:void(0);" onclick="tagSearch($(this).text());">'+ e +'</a></li>';
						});
						$('.tag_rel').empty().append(str);
					} else {
						$('.tag_rel').empty();
					}
				} else {
					$('.tag_rel').empty();
				}
			},
			error: function(xhr, status, error) {
				CommonUtil.Console.debug(xhr);
			}
		});
	};

	function tagSearch (str) {
		document.location.replace('/searchNew?query='+str);
	};

	$(document).ready(function(){
		// 추천 콘텐츠
		var recomId, cgrdCd = CommonUtil.cookieUtil.cookie('layerPopup_chk_pop');

		if (cgrdCd == null || cgrdCd.length < 2) {
			recomId = '#recom_' + '<c:out value="${maps.weekTab}"/>';
		} else {
			recomId = '#recom_' + cgrdCd;
		}

		$('.recom_box').removeClass("open");
		$('.recomCon .tab li').removeClass("on");
		$('.recomCon .tab li').filter('[grdCd='+recomId.substr(1)+']').addClass('on');
		$(recomId).addClass("open");


		if (CommonUtil.cookieUtil.cookie('layerPopup_mainBnr') == null) {
			$('#popup_mainBnr').show();
		} else {
			$('#popup_mainBnr').hide();
		}

		/* 2021-10-01 수정*/
		if (checkplatform() == "mo") {
			$('.gnb_mo .series').css("display","none");
			$('.mainTopcnt .series').css("display","none");
			$('.sideLink .math10').css("display","none");

		}
		var mainTop_swiper = new Swiper(".mainTopcnt", {
			loop:false,	autoplay: {delay: 5000,},
			navigation: {
			  nextEl: ".swiper-button-next",
			  prevEl: ".swiper-button-prev",
			},
			pagination: {
			  el: ".swiper-pagination",
			  type:'bullets',
			  clickable:true
			},
		});

		/*메인슬라이드 pause:play */
		$("#top_controls_auto").click(function(){
			if($(this).attr('class') == 'play'){
				mainTop_swiper.autoplay.start()
				$(this).removeClass('play');
			} else {
				mainTop_swiper.autoplay.stop()
				$(this).addClass('play');
			}
			return false;
		});
		var week_swiper_mo = new Swiper(".week_list_mobile", {
			effect:"coverflow", loop:true, loopedSlides:5, initialSlide:0, slidesPerView:1, slidesPerGroup:1, parallax: true,
			coverflowEffect:{rotate:0, stretch:'86.7%', depth:160, modifier:1,slideShadows: false}
		});
		var week_swiper_pc = new Swiper(".week_list", {
			initialSlide:0, slidesPerView:5, spaceBetween:0, slidesPerGroup:5, speed:1000,
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			breakpoints: {
			  761: {slidesPerView:3,spaceBetween:20,slidesPerGroup:3,speed:500},
			  996: {slidesPerView:4,spaceBetween:20,slidesPerGroup:4},
			  1281: {slidesPerView:5,spaceBetween:20,slidesPerGroup:5}
			},
		});

		var newest_swiper = new Swiper(".newest_list", {
			initialSlide:0, slidesPerView:5, spaceBetween:20, slidesPerGroup:5, speed:1000,
			lazyLoading: true,
			lazyLoadingInPrevNext: true,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			lazy : {
				loadPrevNext: true
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			breakpoints: {
			  300: {slidesPerView:1.3,spaceBetween:20,slidesPerGroup:1.3,speed:500},
			  761: {slidesPerView:3,spaceBetween:20,slidesPerGroup:3,speed:500},
			  996: {slidesPerView:4,spaceBetween:20,slidesPerGroup:4},
			  1281: {slidesPerView:5,spaceBetween:20,slidesPerGroup:5}
			},
		});

		var hotcon_swiper = new Swiper(".hotCon .list_con", {
			initialSlide:0, slidesPerView:5, spaceBetween:20, slidesPerGroup:5, speed:1000,
			lazyLoading: true,
			lazyLoadingInPrevNext: true,
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			lazy : {
				loadPrevNext: true
			},
			navigation: {
				nextEl: ".swiper-button-next",
				prevEl: ".swiper-button-prev",
			},
			breakpoints: {
			  300: {slidesPerView:1.3,spaceBetween:20,slidesPerGroup:1.3,speed:500},
			  761: {slidesPerView:3,spaceBetween:20,slidesPerGroup:3,speed:500},
			  996: {slidesPerView:4,spaceBetween:20,slidesPerGroup:4},
			  1281: {slidesPerView:5,spaceBetween:20,slidesPerGroup:5}
			},
		});

		var swiperInstances = {};
		$(".recom_box .swiper-container").each(function(index, element){
			var $this = $(this);
			$this.addClass("instance-" + index);
			$this.find(".swiper-button-prev").addClass("btn-prev-" + index);
			$this.find(".swiper-button-next").addClass("btn-next-" + index);
			swiperInstances[index] = new Swiper(".instance-" + index, {
				nextButton: $this.find(".swiper-button-next")[0],
				prevButton: $this.find(".swiper-button-prev")[0],
				preloadImages: false,
				lazyLoading: true,
				lazyLoadingInPrevNext: true,
				watchSlidesProgress: true,
				watchSlidesVisibility: true,
				lazy : {
				    loadPrevNext: true
				},
				breakpoints: {
				  300: {slidesPerView:1.3,spaceBetween:20,slidesPerGroup:1.3,speed:500},
				  761: {slidesPerView:2,spaceBetween:20,slidesPerGroup:2,speed:500},
				  996: {slidesPerView:3,spaceBetween:20,slidesPerGroup:3},
				  1281: {slidesPerView:4,spaceBetween:20,slidesPerGroup:4}
				},

			});
		});

		/*paging positioning : 2021-10-08 수정*/
		function posPage() {
			var containerWidth = window.innerWidth;
			var thumbH = [], topmgn = [], btmSz = 0;

			$('.slide_wrap .swiper-container').each(function(index, element){
				topmgn.push($(this).position().top);
				thumbH.push($(this).find(".thumbnail").height());
				if (containerWidth > 1280) {btmSz = 20;}
				else  {btmSz = 15}
				if ($(this).parent().parent().hasClass("recom_box")) {
					var cur_recom_num = $(recomId).find(".thumbnail").height();
					var btnH = (cur_recom_num / 2) - btmSz;
					$(this).siblings('.btn-swiper-prev').css({"margin-top":btnH});
					$(this).siblings('.btn-swiper-next').css({"margin-top":btnH});
				}
				else {
					if ($(this).parent().hasClass("hotCon")) {
						var cur_hot_num = $(this).find(".thumbnail").height();
						console.log("hot" + cur_hot_num);
						if (containerWidth > 1280) {btmSz = 16;}
						else  {btmSz = 11}
						var btnH = (cur_hot_num / 2) +topmgn[index] - btmSz;
					}
					else {
						var btnH = (thumbH[index] / 2) + topmgn[index] - btmSz;
					}
					$(this).siblings('.btn-swiper-prev').css({"top":btnH});
					$(this).siblings('.btn-swiper-next').css({"top":btnH});
				}
			});
		}

		$('.btn-swiper-prev').click(function(e) {
			$(this).siblings('.swiper-container').find('.swiper-button-prev').trigger('click');
		});

		$('.btn-swiper-next').click(function(e) {
			$(this).siblings('.swiper-container').find('.swiper-button-next').trigger('click');
		});

		$('.recom_box .swiper-button-prev').click(function(e){
			var $id = $(this).closest(".recom_box").attr("id");
			var parentID = $id.indexOf('EGRD03') > -1 ? 0 :
				$id.indexOf('EGRD04') > -1 ? 1 :
				$id.indexOf('EGRD05') > -1 ? 2 :
				$id.indexOf('EGRD06') > -1 ? 3 :
				$id.indexOf('MGRD01') > -1 ? 4 :
				$id.indexOf('MGRD02') > -1 ? 5 :
				$id.indexOf('MGRD03') > -1 ? 6 :
				$id.indexOf('HGRD') > -1 ? 7 : 0

			swiperInstances[parentID].slidePrev();
		});

		$('.recom_box .swiper-button-next').click(function(e){
			var $id = $(this).closest(".recom_box").attr("id");
			var parentID = $id.indexOf('EGRD03') > -1 ? 0 :
				$id.indexOf('EGRD04') > -1 ? 1 :
				$id.indexOf('EGRD05') > -1 ? 2 :
				$id.indexOf('EGRD06') > -1 ? 3 :
				$id.indexOf('MGRD01') > -1 ? 4 :
				$id.indexOf('MGRD02') > -1 ? 5 :
				$id.indexOf('MGRD03') > -1 ? 6 :
				$id.indexOf('HGRD') > -1 ? 7 : 0

			swiperInstances[parentID].slideNext();
		})

		$(window).on('load resize', function( ) {
			var pageload;
			var containerWidth = window.innerWidth;
			var checkpf = checkplatform();
			if (checkpf == "mo") {
				$('.event_banner').hide();
			}

			$('.tab_sub').hide();

			if(containerWidth <= 760) {
				var $tab_main = $('.recomCon .tab_main');
				if ($tab_main.length > 0) {
					if (recomId.indexOf('EGRD') > -1) {
						$tab_main.find('li').eq(0).addClass('on');
						$('.tab_sub0').show();
					} else {
						$tab_main.find('li').eq(1).addClass('on');
						$('.tab_sub1').show();
					}
					$('.tab_sub').find('li').filter('[grdCd='+recomId.substr(1)+']').addClass('on');
				}

				week_swiper_mo.update();
				newest_swiper.params.slidesPerView = 1.3;

			} else {
				if (containerWidth <= 995 && containerWidth > 760) {
					newest_swiper.params.slidesPerView = 3;
					week_swiper_pc.params.slidesPerView = 3;
				}
				if (containerWidth <= 1280 && containerWidth > 995) {
					newest_swiper.params.slidesPerView = 4;
					week_swiper_pc.params.slidesPerView = 4;
				}
				if (containerWidth > 1280) {
					newest_swiper.params.slidesPerView = 5;
					week_swiper_pc.params.slidesPerView = 5;
				}
				$('ul.tab_sub').hide();
				week_swiper_pc.update();
				newest_swiper.update();
			}
			clearTimeout(pageload);
			pageload = setTimeout(posPage,500);
		});

		// 추천 콘텐츠 태그
		var $recomClass = $(recomId).find('div.cnt_item > div:eq(0)');
		var query = $(recomId).find('dl.default dd:eq(0)').text().trim();
		var srchUrl = $recomClass.hasClass('tagA') ? 'mov' :
					$recomClass.hasClass('tagD') ? 'inter' :
					$recomClass.hasClass('tagH') ? 'paper' :
					$recomClass.hasClass('tagF') ? 'card' :
					$recomClass.hasClass('tagC') ? 'webtoon' : '';

		var recom_title = $(recomId).find('input:hidden:eq(0)').val();
		var recom_link = $(recomId).find('input:hidden:eq(1)').val();

		$('.recom_tit').empty().html(recom_title + '<a href="#none" onclick="moreBtnWeblog('+"'"+recom_link+"',"+"'"+recomId.substr(7).toLowerCase()+"'"+');" class="btn_more" title="더 보기">더보기</a>')

		var tab_recm_pc = $('.recomCon .tab li');
		$(tab_recm_pc).on("click", function(e) {
			var tab_index = $(this).index();

			$(this).siblings().removeClass('on')
			$(this).addClass('on');

			$('.recom_box').removeClass("open");

			var tmpbb = '#' + $(this).attr('grdCd');
			$(tmpbb).addClass("open");

			recom_title = $(tmpbb).find('input:hidden:eq(0)').val();
			recom_link = $(tmpbb).find('input:hidden:eq(1)').val();
			$('.recom_tit').empty().html(recom_title + '<a href="#none" onclick="moreBtnWeblog('+"'"+recom_link+"',"+"'"+recomId.substr(7).toLowerCase()+"'"+');" class="btn_more" title="더 보기">더보기</a>')

			$recomClass = $(tmpbb).find('div.cnt_item > div:eq(0)');
			query = $(tmpbb).find('dl.default dd:eq(0)').text().trim();

			srchUrl = $recomClass.hasClass('tagA') ? 'mov' :
						$recomClass.hasClass('tagD') ? 'inter' :
						$recomClass.hasClass('tagH') ? 'paper' :
						$recomClass.hasClass('tagF') ? 'card' :
						$recomClass.hasClass('tagC') ? 'webtoon' : '';
			if (srchUrl.length > 0 && query.length > 0) {
				recomTag(query, srchUrl);
			} else {
				$('.tag_rel').empty();
			}
		});

		var tab_recm_mm = $('.recomCon .tab_main li');
		$(tab_recm_mm).on("click", function(e) {
			var tab_index = $(this).index();
			var box_index = (tab_index == 0) ? 0 : 4;
			$(this).siblings().removeClass('on')
			$(this).addClass('on');
			$('.tab_sub').hide();
			$('.tab_sub'+tab_index).show();

			$('.tab_sub'+tab_index+" li").removeClass("on");
			$('.tab_sub'+tab_index+" li").eq(0).addClass("on");
			$('.recom_box').removeClass("open");

			var tmpbb = '#' + $('.tab_sub'+tab_index+" li").eq(0).attr('grdCd')
			$(tmpbb).addClass("open");
		});

		var tab_recm_sb = $('.recomCon .tab_sub li');
		$(tab_recm_sb).on("click", function(e) {
			var tab_index = $(this).parent().attr('class').split(' ');
			tab_index = parseInt(tab_index[0].charAt(7),10);
			var box_index = (tab_index == 0) ? 0 : 4;
			var tab_sub_index = box_index + $(this).index();

			$(this).siblings().removeClass('on')
			$(this).addClass('on');
			$('.recom_box').removeClass("open");

			var tmpbb = '#' + $(this).attr('grdCd');
			$(tmpbb).addClass("open");
		});

		$('.recomCon .wrap_cnt li a').on("click", function(e) {
			e.preventDefault()
		});

		/* 키보드 탭 focus :2021-10-18  */
		$('.dep1').on('focus', function(){
			$('.main_menu').stop().animate({height:310},100);
		});

		if (srchUrl.length > 0 && query.length > 0) {
			recomTag(query, srchUrl);
		} else {
			$('.tag_rel').empty();
		}

	});

	// 레이어 팝업
	function setCookie (popupSno, date) {
		var cdate = typeof date === 'undefined' ? 3 : date;

		if($('#setclose_'+popupSno).is(':checked') == true){
			var tDate = new Date();
			tDate.setHours(0);
			tDate.setMinutes(0);
			tDate.setSeconds(0);
			tDate.setDate(tDate.getDate() + cdate);

			$.cookie('layerPopup_'+popupSno, 'Y', {expires: tDate, path:'/'});
			$('#popup_'+popupSno).remove();
		}
	}

	/*2021-10-18*/
	ThumbMov();
	function ThumbMov(){
	$("body").prepend("<div id='media-width'></div>");
	var timer;
	var timerex;
	$(document).on("mouseenter",".swiper-container .hoverMovie",function() {
	    if ( $(this).parents("body").find("div").hasClass("hoverMovie") == true ){
		var This = $(this);
		var data = $(this).find("img").attr('video-src');
		var data1 = $(this).find(".thum img").attr('video-src');
		timer = setTimeout(function(){
		    $(This).find("img").parent().append('<video class="video-preview" preload="none" muted=""><source src='+data+' type="video/mp4"></video>').find('video')[0].play();
		},250);
	    }
	});
	$(document).on("mouseleave",".swiper-container .hoverMovie",function() {
	    if ( $(this).parents("body").find("div").hasClass("hoverMovie") == true){
		clearTimeout(timer);
		timerex =setTimeout(function(){
		$(".hoverMovie").find("video").remove();
		},200);
	    }
	});
	}