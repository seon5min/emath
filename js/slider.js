/*

슬라이더 클래스
작성자 문경두

jquery, TweenMax 클래스 필수

container : 컨테이너


========== parameters ========

animationType : 에니메이션 타입

Slider.TRANSLATE_X       좌우 전환 (모바일 스와이프 O)
Slider.TRANSLATE_Y_UP    상하 전환 아래에서 위로 (모바일 스와이프 X)
Slider.TRANSLATE_Y_DOWN  상하 전환 위에서 아래로 (모바일 스와이프 X)
Slider.DISSOLVE          페이드 인아웃(모바일 스와이프 X)
Slider.DISSOLVE_SCALE    페이드 인아웃 스케일(모바일 스와이프 X)
Slider.SCALE_Y_UP        스케일 상하 전환 아래에서 위로 (모바일 스와이프 X)
Slider.SCALE_Y_DOWN      스케일 상하 전환 아래에서 위로 (모바일 스와이프 X)

cycle : 좌우 상하 전환 시 순환

autoSize : 컨테이너 자동 크기 조절

touchStart : 좌우 전환 시 모바일 터치 스타트 콜백

touchEnd : 좌우 전환 시 모바일 터치 스타트 콜백

changeFunc : 슬라이터 체인지 콜백

speed : 전환속도



*/



function Slider( container, parameters )
{
	this.container = $(container);
	this.currentNum = 0;
	this.listLength = this.container.find(".rol_li").length;
	this.aniFlag = false;
	this.animationType = Slider.TRANSLATE_X;
	this.cycle = false;
	this.autoSize = false;
	this.touchStart = null;
	this.touchEnd = null;
	this.changeFunc = null;
	this.swipe = true;
	this.speed = 0.6;
	
	
	var pattern = /animationType|cycle|autoSize|touchStart|touchEnd|changeFunc|speed|swipe|currentNum/;

	for( var param in parameters)
	{
		if(parameters[param])
		{
			if(pattern.test(param))	this[param] = parameters[param];
		}
	}


	this.container.css({"position":"relative", "overflow":"hidden"});
	this.container.find(".rol_target").css({"position":"relative"});
	this.container.find(".rol_ul").css({"position":"relative", "display":"block"});
	this.container.find(".rol_li").css({"position":"absolute"});

	if(this.animationType == Slider.TRANSLATE_X || this.animationType == Slider.TRANSLATE_Y_UP || this.animationType == Slider.TRANSLATE_Y_DOWN )
	{
		if(this.cycle) this.createSide();
	}
	if(this.autoSize)$(window).resize($.proxy(this, "resize"));
	this.resize();

	this.init();
	
	
}

Slider.TRANSLATE_X = 0;
Slider.TRANSLATE_Y_UP = 1;
Slider.TRANSLATE_Y_DOWN = 2;
Slider.DISSOLVE = 3;
Slider.DISSOLVE_SCALE = 4;
Slider.SCALE_Y_UP = 5;
Slider.SCALE_Y_DOWN = 6;


Slider.checkRowVersion = function ()
{
	//if($.browser.edge) return false;
	if(!$.browser.webkit) return true;

	var x = navigator.userAgent;	
	if(x.match(/Android/))
	{	
		var index = x.indexOf('Android');
		var and_v = eval(x.substr(index+8,1));
		if(and_v < 3) 
		{
			return true;
		}
		
	}
	return false;
}


Slider.prototype.init = function ()
{
	var owner = this;
	var target = this.container.find(".rol_li").eq(this.currentNum);

	target.find("img").bind("load", function ( e )
	{
		if(!owner.container.css("height"))
		{
			owner.container.css({height:$(this).height()});
		}
	});

	if(!Slider.checkRowVersion())
	{
		TweenMax.to( owner.container.find(".rol_target"), 0, {x:0});
		TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d("+ -(owner.container.width() * owner.currentNum) +"px, 0px, 0px)"});
	}
	else
	{
		TweenMax.to( owner.container.find(".rol_target"), 0, {left:-(owner.container.width() * owner.currentNum)});
	}

	if(owner.animationType == Slider.TRANSLATE_X)
	{
		if(owner.swipe) owner.initSwipe();
	}
	else if(owner.animationType == Slider.DISSOLVE || owner.animationType == Slider.DISSOLVE_SCALE)
	{
		owner.initDissolve();
	}
	else if(owner.animationType == Slider.SCALE_Y_UP || owner.animationType == Slider.SCALE_Y_DOWN)
	{
		owner.initScale();
	}
}


Slider.prototype.initSwipe = function ()
{
	var positionX;
	var startX;
	var startY;
	var vx = 0;
	var oldX = 0;
	var totalLen = this.listLength;
	var pageX = 0;
	var pageY = 0;
	var timer;
	var moveFlag = false;
	var arrow;
	var owner = this;

	
	
	this.container.bind("touchstart", { owner:owner }, down);
	
	function down(e)
	{
		var owner = e.data.owner;
		if(owner.aniFlag) return;
		TweenMax.killTweensOf( owner.container.find(".rol_target"));
		var target = $(e.currentTarget);
		target.find(".rol_target").stop();
		target.stop();
		$("html, body").stop();
		var t = target.find(".rol_target")[0].style.webkitTransform;
		t = t.replace("translate3d(", "").replace(")", "");
		var ta = t.split(", ");
		positionX = -parseInt(ta[0].replace("px", ""));
		if(Slider.checkRowVersion()) positionX = owner.container.find(".rol_target").position().left;
		if(!positionX) positionX = 0;
		startX = e.originalEvent.targetTouches[0].pageX;
		startY = e.originalEvent.targetTouches[0].pageY;

		oldX = startX;
		moveFlag = false;
		target.bind("touchmove", { owner:owner }, checkSwipe);
		
	}

	function checkSwipe( e )
	{
		var owner = e.data.owner;
		var target = $(e.currentTarget);
		pageX = e.originalEvent.targetTouches[0].pageX;
		pageY = e.originalEvent.targetTouches[0].pageY;

		var distX = Math.abs(startX - pageX );
		var distY = Math.abs(startY - pageY );
		
		startX = pageX;
		oldX = startX;

		if( distX > distY)
		{
			
			moveFlag = true;
			e.preventDefault();
			target.bind("touchend", up);
			target.bind("touchmove", { owner:owner }, move);
			if(owner.touchStart) owner.touchStart(owner);
		}
		target.unbind("touchmove", checkSwipe);
	}

	function move(e)
	{
		
		e.preventDefault();
		var owner = e.data.owner;
		pageX = e.originalEvent.targetTouches[0].pageX;
		
		var target = $(e.currentTarget);
		var xx = (startX - pageX)+positionX;
		vx = Math.abs(pageX - oldX);
		
		if(!owner.cycle)
		{
			if(startX < pageX)
			{
				if(xx < 0)xx = xx/6;
			}
			else 
			{
				var totalW = target.width()*(totalLen-1);
				if(xx > totalW) xx = xx-((xx-totalW)/1.2);
			}
		}

		if(Slider.checkRowVersion())
		{
			target.find(".rol_target").css({left:-xx});
		}
		else
		{
			target.find(".rol_target").css({"-webkit-transform":"translate3d("+ -xx +"px, 0px, 0px)"});
		}
		oldX = pageX;
	}

	function up(e)
	{
		if(moveFlag)
		{
			computerScroll( pageX );
		}

		var target = $(e.currentTarget);
		target.unbind("touchmove", move);
		target.unbind("touchend", up);
		if(owner.touchEnd) owner.touchEnd(owner);
	}

	function computerScroll( endX )
	{
		var t = owner.container.find(".rol_target")[0].style.webkitTransform;
		t = t.replace("translate3d(", "").replace(")", "");
		var ta = t.split(", ");
		var targetX = -parseInt(ta[0].replace("px", ""));

		if(Slider.checkRowVersion()) targetX = owner.container.find(".rol_target").position().left;

		var minX;
		var maxX;

		if(owner.cycle)
		{
			minX = -owner.container.width();
			maxX = owner.container.width()*totalLen;
		}

		if(targetX <= minX)
		{
			owner.currentNum = 0;
		}
		else if(targetX >= maxX)
		{
			owner.currentNum = totalLen-1;
		}
		else 
		{
			var harf = targetX - (owner.container.width()*owner.currentNum);
			if(startX < endX)
			{
				if(vx < 2)
				{
					if ( harf > owner.container.width()/2 )		owner.currentNum++;
					else if(harf < -owner.container.width()/2)	owner.currentNum--;
				}
				else 
				{
					owner.currentNum--;
				}
			}
			else 
			{
				if(vx < 2)
				{
					if ( harf > owner.container.width()/2 )		owner.currentNum++;
					else if(harf < -owner.container.width()/2)	owner.currentNum--;
				}
				else 
				{
					owner.currentNum++;
				}
			}
		}
		if(!owner.cycle)
		{
			if (owner.currentNum < 0 )					owner.currentNum = 0;
			else if (owner.currentNum >(totalLen-1))	owner.currentNum = (totalLen-1);
		}
		owner.change();
			
	}
}

Slider.prototype.initDissolve = function ()
{
	var owner = this;
	owner.container.find(".rol_li").each( function ( i )
	{
		if(i == 0) $(this).css({"z-index":owner.listLength});
		else       $(this).css({"z-index":0, display:"none", opacity:0});
	});
}

Slider.prototype.initScale = function ()
{
	var owner = this;
	owner.container.css({"background-color":"#000"});
	owner.container.find(".rol_li").each( function ( i )
	{
		if(i != 0) $(this).css({display:"none"});
		else       $(this).css({display:"block"});
	});
}



Slider.prototype.createSide = function ()
{
	this.container.find(".rol_ul").append( "<li class='first_con rol_li'>"+this.container.find(".rol_li").eq(0).html()+"</li>" ) ;
	this.container.find(".rol_ul").append( "<li class='last_con rol_li'>"+this.container.find(".rol_li").eq(this.listLength-1).html()+"</li>" ) ;
	this.container.find(".first_con").css({ position:"absolute"});
	this.container.find(".last_con").css({ position:"absolute"});
	this.resize();
}


Slider.prototype.resize = function (e)
{
	var owner = this;

	TweenMax.killTweensOf(this.container.find(".rol_target"));

	if(owner.autoSize)
	{
		owner.container.css({width:owner.container.parent().width});
	}

	this.container.find(".rol_li").each( function ( i )
	{
		if(owner.animationType == Slider.TRANSLATE_X)
		{
			if(Slider.checkRowVersion() == true) $(this).css({ width:owner.container.width(), left:(owner.container.width() * i)});
			else                                 $(this).css({ width:owner.container.width(), "-webkit-transform":"translate3d("+ (owner.container.width() * i) +"px, 0px, 0px)"});
		}
		else if(owner.animationType == Slider.TRANSLATE_Y_UP)
		{
			if(Slider.checkRowVersion() == true)   $(this).css({ height:owner.container.height(), top:(owner.container.height() * i) });
			else								   $(this).css({ height:owner.container.height(), "-webkit-transform":"translate3d(0px, "+(owner.container.height() * i)+"px, 0px)" });
		}
		else if(owner.animationType == Slider.TRANSLATE_Y_DOWN)
		{
			if(Slider.checkRowVersion() == true)   $(this).css({ height:owner.container.height(), top:-(owner.container.height() * i) });
			else                                   $(this).css({ height:owner.container.height(), "-webkit-transform":"translate3d(0px, "+-(owner.container.height() * i)+"px, 0px)" });
		}
		else if(owner.animationType == Slider.DISSOLVE || owner.animationType == Slider.DISSOLVE_SCALE)
		{
			$(this).css({position:"absolute", top:0, left:0, width:owner.container.width(), height:owner.container.height(), "overflow":"hidden"});
			$(this).find("img").css({position:"absolute"});
		}
		else if(owner.animationType == Slider.SCALE_Y_UP || owner.animationType == Slider.SCALE_Y_DOWN)
		{
			$(this).css({position:"absolute", top:0, left:0, width:owner.container.width(), height:owner.container.height()});
			$(this).find("img").css({position:"absolute"});
		}
	});

	owner.sideResize();
	owner.aniFlag = false;
}


Slider.prototype.sideResize = function ()
{
	var owner = this;

	if(owner.cycle)
	{
		if(owner.animationType == Slider.TRANSLATE_X)
		{
			if(Slider.checkRowVersion())
			{
				owner.container.find(".first_con").css({width:owner.container.width(), left:(owner.container.width() * owner.listLength)});
				owner.container.find(".last_con").css({width:owner.container.width(), left:(owner.container.width()*-1)});
				TweenMax.to(owner.container.find(".rol_target"), 0, {left:-owner.container.width() * owner.currentNum});
			}
			else 
			{
				owner.container.find(".first_con").css({width:owner.container.width(), "-webkit-transform":"translate3d("+ (owner.container.width() * owner.listLength) +"px, 0px, 0px)"});
				owner.container.find(".last_con").css({width:owner.container.width(), "-webkit-transform":"translate3d("+ (owner.container.width()*-1) +"px, 0px, 0px)"});		
				TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d("+ -owner.container.width() * owner.currentNum +"px, 0px, 0px)"});
			}
		}
		else if(owner.animationType == Slider.TRANSLATE_Y_UP)
		{
			if(Slider.checkRowVersion())
			{
				owner.container.find(".first_con").css({height:owner.container.height(), top:(owner.container.height() * owner.listLength)});
				owner.container.find(".last_con").css({height:owner.container.height(), top:(owner.container.height()*-1)});
				TweenMax.to(this.container.find(".rol_target"), 0, {top:-owner.container.height() * owner.currentNum});

			}
			else 
			{
				owner.container.find(".first_con").css({height:owner.container.height(), "-webkit-transform":"translate3d(0px, "+(owner.container.height() * owner.listLength)+"px, 0px)"});
				owner.container.find(".last_con").css({height:owner.container.height(), "-webkit-transform":"translate3d(0px, "+(owner.container.height()*-1)+"px, 0px)"});		
				TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d(0px, "+ -owner.container.height() * owner.currentNum +"px, 0px)"});
			}
		}
		else if(owner.animationType == Slider.TRANSLATE_Y_DOWN)
		{
			if(Slider.checkRowVersion())
			{
				owner.container.find(".first_con").css({height:owner.container.height(), top:-(owner.container.height() * owner.listLength)});
				owner.container.find(".last_con").css({height:owner.container.height(), top:-(owner.container.height()*-1)});
				TweenMax.to(this.container.find(".rol_target"), 0, {top:owner.container.height() * owner.currentNum});

			}
			else 
			{
				owner.container.find(".first_con").css({height:owner.container.height(), "-webkit-transform":"translate3d(0px, "+-(owner.container.height() * owner.listLength)+"px, 0px)"});
				owner.container.find(".last_con").css({height:owner.container.height(), "-webkit-transform":"translate3d(0px, "+-(owner.container.height()*-1)+"px, 0px)"});		
				TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d(0px, "+ owner.container.height() * owner.currentNum +"px, 0px)"});
			}
		}
	}
}


Slider.prototype.change = function ()
{
	
	var owner = this;
	this.aniFlag = true;



	if(owner.animationType == Slider.TRANSLATE_X)
	{
		var ease = Cubic.easeInOut;
		if(owner.swipe) ease = Expo.easeOut;
		if(Slider.checkRowVersion())	TweenMax.to( owner.container.find(".rol_target"), owner.speed, {left:-(owner.container.width() * owner.currentNum), ease:ease, onComplete:motionEnd});
		else							TweenMax.to( owner.container.find(".rol_target"), owner.speed, {"-webkit-transform":"translate3d("+ -(owner.container.width() * owner.currentNum) +"px, 0px, 0px)", ease:Expo.easeOut, onComplete:motionEnd});
		if(owner.autoSize)
		{
			var target = owner.container.find(".rol_li").eq( owner.currentNum );
			owner.container.css({height:target.height()});
		}
	}
	else if(owner.animationType == Slider.TRANSLATE_Y_UP)
	{
		if(Slider.checkRowVersion())	TweenMax.to( owner.container.find(".rol_target"), owner.speed, {top:-(owner.container.height() * owner.currentNum), ease:Expo.easeOut, onComplete:motionEnd});
		else							TweenMax.to( owner.container.find(".rol_target"), owner.speed, {"-webkit-transform":"translate3d(0px, "+-(owner.container.height() * owner.currentNum)+"px, 0px)", ease:Expo.easeOut, onComplete:motionEnd});
	}

	else if(owner.animationType == Slider.TRANSLATE_Y_DOWN)
	{
		if(Slider.checkRowVersion())	TweenMax.to( owner.container.find(".rol_target"), owner.speed, {top:(owner.container.height() * owner.currentNum), ease:Expo.easeOut, onComplete:motionEnd});
		else							TweenMax.to( owner.container.find(".rol_target"), owner.speed, {"-webkit-transform":"translate3d(0px, "+(owner.container.height() * owner.currentNum)+"px, 0px)", ease:Expo.easeOut, onComplete:motionEnd});
	}
	else if(owner.animationType == Slider.DISSOLVE || owner.animationType == Slider.DISSOLVE_SCALE)
	{
		owner.container.find(".rol_li").each( function ( i )
		{
			if(i == owner.currentNum)
			{
				TweenMax.to( $(this), 0, {opacity:0, display:"block", "z-index":owner.listLength});
				TweenMax.to( $(this), owner.speed, {opacity:1, onComplete:motionEnd});
				if(owner.animationType == Slider.DISSOLVE_SCALE)
				{
					if(!Slider.checkRowVersion())
					{
						TweenMax.to( $(this).find("img"), 0, {scaleX:1.2, scaleY:1.2});
						TweenMax.to( $(this).find("img"), owner.speed, {scaleX:1, scaleY:1});
					}
					else
					{
						if($.browser.mozilla)
						{

							TweenMax.to( $(this).find("img"), 0, {scaleX:1.2, scaleY:1.2});
							TweenMax.to( $(this).find("img"), owner.speed, {scaleX:1, scaleY:1});
						}
					}
				}
			}
			else 
			{
				$(this).css({"z-index":0});
			}
		});
	}
	else if(owner.animationType == Slider.SCALE_Y_UP)
	{
		owner.container.find(".rol_li").each( function ( i )
		{
			if(owner.currentNum == i)
			{
				TweenMax.to($(this).find("img"), 0, { transformOrigin:"0% 0%", scaleY:0});
				TweenMax.to($(this).find("img"), owner.speed, {scaleY:1, ease:Expo.easeInOut});
				if(!Slider.checkRowVersion())
				{
					TweenMax.to($(this), 0, {opacity:0.5, display:"block", "-webkit-transform":"translate3d(0px, "+ owner.container.height() +"px, 0px)"});
					TweenMax.to( $(this), owner.speed, {opacity:1, "-webkit-transform":"translate3d(0px, 0px, 0px)", ease:Expo.easeInOut, onComplete:motionEnd});
				}
				else 
				{
					TweenMax.to($(this), 0, {display:"block", top:owner.container.height()});
					TweenMax.to( $(this), owner.speed, {top:0, ease:Expo.easeInOut, onComplete:motionEnd});
				}
			}
			else 
			{
				if( $(this).css("display") == "block")
				{
					TweenMax.to($(this).find("img"), 0, {transformOrigin:"0% 0%", scaleY:1});
					TweenMax.to($(this).find("img"), owner.speed, {scaleY:0, ease:Expo.easeInOut});
					TweenMax.to($(this), 0, {opacity:1});
					TweenMax.to($(this), owner.speed, {opacity:0.5});
				}
			}

			
		});
	}
	else if(owner.animationType == Slider.SCALE_Y_DOWN)
	{
		owner.container.find(".rol_li").each( function ( i )
		{
			if(owner.currentNum == i)
			{
				TweenMax.to($(this).find("img"), 0, { transformOrigin:"100% 100%", scaleY:0});
				TweenMax.to($(this).find("img"), owner.speed, {scaleY:1, ease:Expo.easeInOut});

				if(!Slider.checkRowVersion())
				{
					TweenMax.to($(this), 0, {opacity:0.5, display:"block", "-webkit-transform":"translate3d(0px, "+ -owner.container.height() +"px, 0px)"});
					TweenMax.to( $(this), owner.speed, {opacity:1, "-webkit-transform":"translate3d(0px, 0px, 0px)", ease:Expo.easeInOut, onComplete:motionEnd});
				}
				else 
				{
					TweenMax.to($(this), 0, {display:"block", top:-owner.container.height()});
					TweenMax.to( $(this), owner.speed, {top:0, ease:Expo.easeInOut, onComplete:motionEnd});
				}
			}
			else 
			{
				if( $(this).css("display") == "block")
				{
					TweenMax.to($(this).find("img"), 0, {transformOrigin:"100% 100%", scaleY:1});
					TweenMax.to($(this).find("img"), owner.speed, {scaleY:0, ease:Expo.easeInOut});
					TweenMax.to($(this), 0, {opacity:1});
					TweenMax.to($(this), owner.speed, {opacity:0.5});
				}
			}

			
		});
	}
	
	if(owner.currentNum == -1)						owner.currentNum = owner.listLength-1;
	else if(owner.currentNum ==  owner.listLength)	owner.currentNum = 0;

	
	if(owner.changeFunc)owner.changeFunc( owner.currentNum );
	

	function motionEnd()
	{
		try
		{
			if(owner.animationType == Slider.TRANSLATE_X)
			{
				if(owner.cycle)
				{
					if(Slider.checkRowVersion())	TweenMax.to(owner.container.find(".rol_target"), 0, {left:-owner.container.width()*owner.currentNum});
					else							TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d("+ -owner.container.width()*owner.currentNum +"px, 0px, 0px)"});
				}
			}
			else if(owner.animationType == Slider.TRANSLATE_Y_UP)
			{
				if(owner.cycle)
				{
					if(Slider.checkRowVersion())	TweenMax.to(owner.container.find(".rol_target"), 0, {top:-owner.container.height()*owner.currentNum});
					else							TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d(0px, "+-owner.container.height()*owner.currentNum+"px, 0px)"});
				}
			}
			else if(owner.animationType == Slider.TRANSLATE_Y_DOWN)
			{
				if(owner.cycle)
				{
					if(Slider.checkRowVersion())	TweenMax.to(owner.container.find(".rol_target"), 0, {top:owner.container.height()*owner.currentNum});
					else							TweenMax.to(owner.container.find(".rol_target"), 0, {"-webkit-transform":"translate3d(0px, "+owner.container.height()*owner.currentNum+"px, 0px)"});
				}
			}
			else if(owner.animationType == Slider.DISSOLVE || owner.animationType == Slider.DISSOLVE_SCALE)
			{
				owner.container.find(".rol_li").each( function ( i )
				{
					if(i != owner.currentNum)
					{
						$(this).css({opacity:0, display:"none"});
					}
				});
			}
			else if(owner.animationType == Slider.SCALE_Y_UP || owner.animationType == Slider.SCALE_Y_DOWN)
			{
				owner.container.find(".rol_li").each( function ( i )
				{
					if(i != owner.currentNum)
					{
						$(this).css({display:"none", opacity:1});
						TweenMax.to($(this).find("img"), 0, {scaleY:1,scaleX:1, scaleY:1});
					}
				});
			}
			owner.aniFlag = false;
		}
		catch (e){}
	}
}



Slider.prototype.changePage = function ( idx )
{
	if(this.aniFlag) return;

	if(this.animationType == Slider.TRANSLATE_X)
	{
		if(!this.cycle)
		{
			if(idx < 0 || idx > this.listLength-1)return;
		}
	}
	else if(this.animationType == Slider.TRANSLATE_Y_UP || this.animationType == Slider.TRANSLATE_Y_DOWN)
	{
		if(!this.cycle)
		{
			if(idx < 0) idx = this.listLength-1;
			else if(idx > this.listLength-1) idx = 0;
		}
	}
	else 
	{
		if(idx < 0) idx = this.listLength-1;
		else if(idx > this.listLength-1) idx = 0;
	}
	
	this.currentNum = idx;
	this.change(true);
}

