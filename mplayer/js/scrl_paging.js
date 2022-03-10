
var showList = function() {
	var cur_list_size = 0;
	var card_size = $('.srch_item').length;
	var loaing_t, cont_wrap_body, cont_wrap_el, scrollObj;

	function drawList() {
		$('.srch_item').hide();
		cur_list_size = cur_list_size + 20;
		var draw_size = (cur_list_size > card_size) ? card_size : cur_list_size;

		for(i=0; i<=draw_size; i++){
			$('.srch_item').eq(i).show();
		}
		$('#pageload_calc').hide();
		clearTimeout(loaing_t);
	}

	function mobCheck() {
		if (window.innerWidth > 760) {
			scrollObj = window;
			cont_wrap_body  = eval("document.body");
			cont_wrap_el = eval("document.documentElement");
		}
		else  {
			scrollObj = document.getElementById("wrap");
			cont_wrap_body  = eval(scrollObj);
			cont_wrap_el = eval(scrollObj);
		}

		function getDocumentHeight() {
			return Math.max(
				Math.max(cont_wrap_body.scrollHeight, cont_wrap_el.scrollHeight),
				Math.max(cont_wrap_body.offsetHeight, cont_wrap_el.offsetHeight),
				Math.max(cont_wrap_body.clientHeight, cont_wrap_el.clientHeight)
			);
		}
		$(scrollObj).scroll(function() {
			 var docHeight = parseInt(getDocumentHeight(),10);
			 if( $(scrollObj).scrollTop() + window.innerHeight == docHeight)  {
				 if(cur_list_size > card_size) {
					$('#pageload_calc').hide();
					return;
				 }
				$('#pageload_calc').show();
				loaing_t = setTimeout(function(){drawList();},2000);
			}
		});
	}
	mobCheck();
	drawList();
}

function movingTop() {
	var scrollObj = (window.innerWidth > 760) ? window : "#wrap";
	var clW = window.innerWidth;
	var posL;
	if (clW > 1280) {
		posL = 1230 + ((clW - 1280) / 2);
		console.log(posL)
		$('.btn_gotop').css("right", "unset")
		$('.btn_gotop').css("left", posL)
	}
	else {
		$('.btn_gotop').css("left", "unset")
		$('.btn_gotop').css("right", "4%")
	}

	$(scrollObj).scroll(function() {
		if($(scrollObj).scrollTop() >= 100){
			$('.btn_gotop').addClass("on")
		} else {
			$('.btn_gotop').removeClass("on")
		}
	});
}
$(window).on('resize', function() {
	movingTop();
});

$(".btn_gotop").click(function(){
	var scrollObj = (window.innerWidth > 760) ? "html, body" : "#wrap";
	$(scrollObj).animate({scrollTop:0}, 500);
});
movingTop();
showList();
