$(function()
{
	try
	{
		$(".blind_con").css({opacity:0.6, display:"none"});
		$(".modalBg").css({opacity:0.3, display:"none"});
		$(".blind_con").bind("touchmove", function (e){ e.preventDefault();});
		$(".modalBg").bind("touchmove", function ( e ){ e.preventDefault()});

		$("input[type='checkbox']").each(function ()
		{
			addCheckBox($(this));
		});

		$("input[type='radio']").each(function ()
		{
			addRadio($(this));
		});

		$("select").each( function ()
		{
			addSelectBox($(this));
		});



		$(".round_box").each(function ()
		{
			$(this).corner();
		});

		$(".emt").text("");
		$('input[type="text"]').placeholder({color:"#aaa"});
		$('input[type="password"]').placeholder({color:"#aaa"});
		$('textarea').placeholder({color:"#aaa"});
		$(".datepicker_btn input[type='date']").css({opacity:0});

		$(".sort_page a").each(function ( i )
		{
			$(this).bind("click", function ( e )
			{
				$(".sort_page a").removeClass("on");
				$(this).addClass("on");
			});
		});

		$(".button_group button").each( function ( i )
		{
			$(this).bind("click", function ( e )
			{
				$(".button_group button").removeClass("on");
				$(this).addClass("on");
			});
		});

	}
	catch ( e ){}



	$(window).resize( resizeWindow );
	$(window).resize();
	$(window).scroll( scrollWindow );
	$(window).scroll();
} );


function addCheckBox( obj )
{
	var onClick = obj.attr("onClick");
	obj.iCheck({handle:"checkbox"});
	obj.on("ifChecked", function (e)
	{
		$(this).attr("checked", true);
		$(this).change();
		if(onClick)
		{
			location.href = "javascript:"+onClick;
		}
	});
	obj.on("ifUnchecked", function (state)
	{
		$(this).attr("checked", false);
		$(this).change();
	});
}


function addRadio( obj )
{
	var onClick = obj.attr("onClick");
	obj.iCheck({handle:"radio"});
	obj.on("ifChecked", function (e)
	{
		$(this).attr("checked", true);
		$(this).change();
		if(onClick)
		{
			location.href = "javascript:"+onClick;
		}
	});
	obj.on("ifUnchecked", function (state)
	{
		$(this).attr("checked", false);
		$(this).change();
	});
}

function addSelectBox( obj )
{
	var selectbox = new CustomSelectBox(obj, false, true);
	var onSelect = obj.attr("onSelect");

	obj.bind("change", function ( e )
	{
		location.href = "javascript:"+onSelect;
	});
}



function resizeWindow ( e )
{
	var top;
	if ($.browser.safari || $.browser.chrome) {
		top = $("body").scrollTop();
	} else {
		top = $("html,body").scrollTop();
	}

	var ww = $(".popupFrame").contents().find(".mainCon").width();
	try
	{
		var w = $("#wrap").position().left + $("#wrap").width()/2;
	}
	catch ( e )
	{
		var w = 0 + $("#wrap").width()/2;
	}

	var h = $(window).height();
	$(".modalPopupContainer").stop().css ( { left:w , top:h/2 + top } );
	var modalWidth = $("#wrap").width();

	$(".tab_pannel").each(function ( i )
	{
		var tabwh = (763-($(this).find("li").length+1))/$(this).find("li").length;
		$(this).find("li").css({width:tabwh});
	});
}

function scrollWindow ( e )
{
	var top = ($.browser.safari || $.browser.chrome ) ? $("body").scrollTop() : $("html,body").scrollTop();
	var ww = $(".popupFrame").contents().find(".mainCon").width();
	try
	{
		var w = $("#wrap").position().left + $("#wrap").width()/2 + $("html,body").scrollLeft();
	}
	catch ( e )
	{
		var w = $("html,body").scrollLeft() + $("#wrap").width()/2;
	}

	var h = $(window).height();
	$(".modalPopupContainer").stop().animate ( { left:w , top:h/2 + top } );
}

// 모달팝업 열기
function openModalPopup ( url , ww , hh , isScroll ,func )
{
	modalFunc = func;

	var top = ($.browser.safari || $.browser.chrome ) ? $("body").scrollTop() : $("html,body").scrollTop();
	var w = $("#wrap").position().left + $("#wrap").width()/2;
	var h = $(window).height();

	$(".modalPopupContainer").stop().css ( { left:w , top:h/2 + top } );
	var modalHeight = $(".mainContainer").height();


	if ( modalHeight < $(window).height() ) modalHeight = $(window).height()

	$(".modalBg").css ( { width:"100%" , height:"100%" , position:"fixed" , display:"block" , opacity:0.7 } );


	var iframeStr = '<iframe id="popupFrame" class="popupFrame" allowTransparency="true" width="1px" height="1px" src="' + url +'" scrolling="no" frameborder="0">';
	if ( isScroll ) iframeStr = '<iframe id="popupFrame" class="popupFrame" background="#ff0000" width="0px" height="0px" src="' + url +'" scrolling="yes" frameborder="0">';
	$(".popupCon").empty().append ( iframeStr );
	$(".popupFrame").one ( "load" , popupLoadOk );



	function popupLoadOk ( e )
	{
		if ( ww || hh )
		{
			var w = ww;
			var h = hh;
		}
		else
		{
			var w = $(".popupFrame").contents().find(".mainCon").width();
			var h = $(".popupFrame").contents().find(".mainCon").height();
		}
		$(".popupFrame").css ( { width:w , height:1 } );
		TweenMax.to($(".popupFrame"), 0.5, {width:w , height:h, ease:Quad.easeInOut});
		$(".popupCon").css ( { left:-w/2, top:0 } );
		TweenMax.to($(".popupCon"), 0.5, {left:-w/2 , top:-h/2, ease:Quad.easeInOut});
	}
}


// 모달팝업 닫기
function closeModalPopup()
{
	TweenMax.to($(".popupFrame"), 0.4, {height:1, ease:Quad.easeInOut});
	TweenMax.to($(".popupCon"), 0.4, {top:0, ease:Quad.easeInOut, onComplete:closeModalPopupComplete});

	function closeModalPopupComplete()
	{
		$(".popupCon").empty();
		$(".modalBg").css ( { display:"none" } );
	}
}





function setCenterImage( img )
{
	$(img).parent().css({"text-align":"center"});
	$(img).css({"position":"relative", width:"auto", height:"100%", top:""});
	if($(img).width() > $(img).height())
	{
		$(img).css({"position":"relative", width:"100%", height:"auto"});
		$(img).css({top:($(img).parent().height() - $(img).height())/2});
	}
}



function checkDevice()
{
    var mobileKeyWords = new Array('iphone', 'ipod', 'blackberry', 'android', 'windows ce', 'lg', 'mot', 'samsung', 'sonyericsson', 'pantech' );
    var device_name = "";
    for (var word in mobileKeyWords)
	{
        if (navigator.userAgent.toLowerCase().match( mobileKeyWords[word] ) != null)
		{
            device_name = mobileKeyWords[word];
            break;
        }
    }
	return device_name;
}


function showWindowPop(id, src, ww, hh)
{
	ww=parseInt(ww);
	hh=parseInt(hh);
	var left = (screen.availWidth - ww) / 2;
	var top = (screen.availHeight - hh) / 2;
	window.open (src, id, "width="+ww+"px, height="+hh+"px, left="+left+"px, top="+top+"px, resizable=no,status=no,scrollbars=no,menubar=no");
}


function getParameter (url, param)
{
	var p = url.split("?")[1];
	if(!p) return "";

	var s = p.split( param + "=" )[1];
	if(s)
	{
		var s2 = s.split("&")[0];
		return s2;
	}

	return s;
}


String.prototype.searchAll = function ( searchStr )
{
	var str = this.toString();
	var startIndex = 0, searchStrLen = searchStr.length;
    var index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}




//에니메이션 유틸
function AnimationUtils(){}

//아코디언
AnimationUtils.SlideContent = function ( container, changeFunc, margin, noScroll)
{
	container.each( function ( i )
	{
		var target = $(this).find(".slideTarget");
		var btn = $(this).find(".slideBtn");

		btn.unbind("mousedown");
		target.css({"position":"", height:""});
		target.attr("hh", target.height());

		target.css({height:0, "overflow":"hidden"});
		target.attr("yy", $(this).position().top + margin);

		if(target.attr("on") == "yes")
		{
			TweenMax.to(target, 0, {delay:0.01, height:target.attr("hh"), "overflow":"hidden"});
		}
		else
		{
			target.attr("on", "no");
		}
		$(this).css({"position":"relative"});
		btn.bind("mousedown", function ( e )
		{
			AnimationUtils.SlideDown(container, i, changeFunc, noScroll);
		});

	});
}

AnimationUtils.SlideDown = function (container, idx, changeFunc, noScroll)
{

	container.each( function ( i )
	{
		var target = $(this).find(".slideTarget");
		if(idx == i)
		{

			if(target.attr("on") == "no")
			{

				TweenMax.to(target, 0.6, {height:parseInt( target.attr("hh") ), ease:Expo.easeOut, onComplete:function ()
				{
					$(window).resize();
					if( check_row_version() == true )
					{

						if(conScrollBar) conScrollBar.resize();
					}
				}});

				if(!noScroll)
				{

					if(check_row_version() == true)
					{
						if(conScrollBar)conScrollBar.moveToY( -parseInt( target.attr("yy") ), 0.6);
					}
					else
					{
						TweenMax.to( $("#container"), 0.6, {scrollTop:parseInt(target.attr("yy")), ease:Expo.easeOut});
					}
				}

				target.attr("on", "yes");
				if(changeFunc)changeFunc("on");
				$(this).addClass("on");

			}
			else
			{

				TweenMax.to(target, 0.6, {height:0, ease:Expo.easeOut, onComplete:function ()
				{
					$(window).resize();
					if( check_row_version() == true )
					{
						if(conScrollBar) conScrollBar.resize();
					}
				}});

				target.attr("on", "no");
				if(changeFunc)changeFunc("off");
				$(this).removeClass("on");
			}
		}
		else
		{
			if(target.attr("on") == "yes")
			{
				TweenMax.to(target, 0.6, {height:0, ease:Expo.easeOut});
				$(this).removeClass("on");
				target.attr("on", "no");
			}

		}
	});

}

AnimationUtils.setToolTip = function (container, btnCon, toolTip, width)
{
	var toolTipObj = $('<div class="tooltip_con" style="width:"'+width+'><div class="tooltip_set">'+toolTip+'</div><span class="arrow"></span></div>');
	$("body").append(toolTipObj);
	setPosition();

	btnCon.bind("mouseover", function ( e )
	{
		setPosition();
		toolTipObj.css({display:"block"});
		TweenMax.to(toolTipObj, 0.4, {opacity:1});
	});

	btnCon.bind("mouseout", function ( e )
	{
		TweenMax.to(toolTipObj, 0.4, {opacity:0, onComplete:function ()
		{
			toolTipObj.css({display:"none"});
		}});
	});

	function setPosition()
	{
		var left = btnCon.position().left - (toolTipObj.width()/2)+6;
		var left2 = toolTipObj.width()/2;
		if(left<0)
		{
			left2 += left;
			left = 0;
		}
		toolTipObj.css({top:btnCon.offset().top+20, left:left+container.offset().left, display:"none", opacity:0});
		toolTipObj.find(".arrow").css({left:left2});
	}

}



