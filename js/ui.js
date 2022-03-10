var navigation;




$(function ()
{



	var overTimer;


	$(window).load(function (e)
	{
		contentSizing();
	});

	//contentSizing();

	$(window).resize(function ( e )
	{
		contentSizing();
	});
	$(window).resize();

	$(".content_right").bind("mresize", function ()
	{
		contentSizing();
	});

	if($(".gnb").html())
	{
		navigation = new Gnb($(".gnb"));
	}

	$(".top_nav .logon_btn").bind("mouseover", function ( e )
	{
		clearTimeout(overTimer);
		showMyMenu();
		$(this).addClass("on");
	});

	$(".top_nav .logon_btn").bind("mouseout", function ( e )
	{
		overTimer = setTimeout(function ()
		{
			hideMyMenu();
		}, 500);

	});

	$(".my_menu_con").bind("mouseover", function ( e )
	{
		clearTimeout(overTimer);
	});

	$(".my_menu_con").bind("mouseout", function ( e )
	{
		overTimer = setTimeout(function ()
		{
			hideMyMenu();
		}, 500);
	});


	function showMyMenu()
	{
		$(".my_menu_con").css({display:"block"});
		$(".my_menu_con").css({left:$(".nav_con").offset().left + 1000 - $(".my_menu_con").width()});
	}

	function hideMyMenu()
	{
		$(".my_menu_con").css({display:"none"});
		$(".top_nav .logon_btn").removeClass("on");
	}

	var completeTime;

	$(".gnb .search_con input[type='text']").bind("mouseup", function ( e )
	{
		$(".auto_complete").css({display:"block"});
	});

	$(".main .search_con input[type='text']").bind("mouseup", function ( e )
	{
		$(".auto_complete").css({display:"block"});
	});

	/*$("body").bind("mouseup", function ( e )
	{
		if($(e.target).get(0) != $(".gnb .search_con input[type='text']").get(0) && $(e.target).get(0) != $(".main .search_con input[type='text']").get(0) )
		{
			$(".auto_complete").css({display:"none"});
		}
	});*/

	$(".auto_complete .close_con a").bind("click", function ( e )
	{
		$(".auto_complete").css({display:"none"});
	});

});

function contentSizing()
{
	var lnbH = $(".lnb").height()+10;
	$(".content_right").css({"min-height":""});
	var h = $(".content_right").height();
	if(h<lnbH)
	{
		$(".content_right").css({"min-height":lnbH});
	}
	else
	{
		$(".content_right").css({"min-height":""});
	}
}




