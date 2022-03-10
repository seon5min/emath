


function Gnb( container )
{
	this.container = container;
	this.selectMain;
	this.mainMenu;
	this.subMenu;
	this.timer;
	this.init();
}


Gnb.prototype.init = function ()
{
	var owner = this;
	owner.mainMenu = owner.container.find(".main_menu .menu_con li");
	owner.subMenu = owner.container.find(".sub_menu .menu_con");
	owner.selectMain = owner.container.find(".main_menu .menu_con li.on").index()+1;


	//console.log(owner.selectMain);
	owner.mainMenu.each( function ( i )
	{
		$(this).bind("mouseover", function ( e )
		{
			clearTimeout(owner.timer);
			var idx = i+1;
			overMain( idx );
			if(idx>0) showSubMenu( idx );
		});
	});

	owner.container.bind("mouseleave", function ( e )
	{
		owner.timer = setTimeout( function ()
		{
			overMain(owner.selectMain);
			if(location.href.indexOf("/resource/")==-1){
				owner.mainMenu.removeClass("other");
			}
			hideSubMenu();
		}, 200);
	});


	owner.subMenu.each( function ( i )
	{
		$(this).find(".title_con").css({top:264*i});
		$(this).find(".sub_con").css({top:264*i});
	});

	function overMain( idx )
	{
		owner.mainMenu.each( function ( i )
		{
			if( i+1 == idx)	$(this).addClass("on").removeClass("other");
			else			$(this).removeClass("on").addClass("other");
		});

	}


	function showSubMenu( idx )
	{

		owner.container.find(".sub_menu").css({"display":"block", "z-index":"10"});
		TweenMax.to(owner.container.find(".sub_menu"), 0, {height:264, ease:Expo.easeOut});
		owner.subMenu.each(function ( i )
		{
			if(i+1 == idx)
			{
				$(this).css({"z-index":10});
				$('.input_con input').blur();
			}
			else
			{
				$(this).css({"z-index":"-10"});
			}
			$(this).find(".title_con").css({top:(264*i)-(264*(idx-1))});
			$(this).find(".sub_con").each(function ( j )
			{
				//TweenMax.to($(this), 0.8+(0.15*j), {top:(264*i)-(264*(idx-1)), ease:Expo.easeOut});
				TweenMax.to($(this), 0, {top:(264*i)-(264*(idx-1)), ease:Expo.easeOut});
			});
		});
	}

	function hideSubMenu()
	{
		TweenMax.to(owner.container.find(".sub_menu"), 0, {height:0, ease:Expo.easeOut, onComplete:function()
		{
			owner.container.find(".sub_menu").css({"display":"none", "z-index":"0"});
		}});

	}
}


