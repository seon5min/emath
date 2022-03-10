/*

CustomSelectBox 클래스
작성자 문경두

jquery 클래스 필수

container :    컨테이너
inContainer :  selectbox 추가할곳 false(body), true(parent), object
enabled :      selectbox 활성 여부
focusinFunc :  selectbox 포커스 콜백
focusoutFunc : selectbox 포커스아웃 콜백
changeFunc :   selectbox valure 변경

*/

function CustomSelectBox( selectbox, inContainer, enabled, focusinFunc, focusoutFunc, changeFunc )
{
	this.selectBox = selectbox;
	this.inContainer = inContainer;
	this.enabled = enabled;
	if(!this.enabled) this.enabled = false;
	this.length;
	this.selectNum = 0;
	this.parent;
	this.title = "";
	this.appendObj;
	this.focusinFunc = focusinFunc;
	this.focusoutFunc = focusoutFunc;
	this.changeFunc = changeFunc;
	this.openFlag = false;
	this.overFlag = false;
	this.display;
	this.margin;
	this.top;
	this.winWidth;
	this.bottom;
	this.right;
	this.left;
	this.scroll = null;
	this.init();
}

CustomSelectBox.checkDevice = function ()
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

CustomSelectBox.prototype.init = function ()
{
	var owner = this;
	owner.parent = owner.selectBox.parent();
	owner.length = owner.selectBox.find("option").length;
	owner.title = owner.selectBox.attr("title");
	owner.width = owner.selectBox.width();
	owner.height = owner.selectBox.height();
	owner.display = owner.selectBox.css("display");
	owner.position = owner.selectBox.css("position");
	owner.top =owner.selectBox.css("top");
	owner.bottom = owner.selectBox.css("bottom");
	owner.left = owner.selectBox.css("left");
	owner.right = owner.selectBox.css("right");
	owner.margin = owner.selectBox.css("margin-top")+" "+owner.selectBox.css("margin-right")+" "+owner.selectBox.css("margin-bottom")+" "+owner.selectBox.css("margin-left");
	owner.windWidth = $(window).width();

	var origAppend = $.fn.append;

    $.fn.append = function () 
	{
		 return origAppend.apply(this, arguments).trigger("append");
    };

	owner.selectBox.bind("append", function ()
	{
		owner.reset();
	});



	owner.selectBox.on("reset", function ( e )
	{
		owner.reset();
	});

	owner.selectBox.on("disable", function ( e )
	{
		owner.setDisabled();
	});

	owner.selectBox.on("enable", function ( e )
	{
		owner.setEnabled();
	});

	owner.selectBox.on("focus", function ( e )
	{
		owner.focus();
	});
	

	

	if(owner.selectBox.attr("title"))
	{
		owner.title = owner.selectBox.attr("title");
	}
	else 
	{
		var count = 0;
		for( var i=0; i<owner.length; i++)
		{
			if( owner.selectBox.find("option").eq(i).attr("selected") )
			{
				count = i+1;
				break;
			}
		}
		owner.selectNum = count;
		owner.title = owner.selectBox.find("option").eq(owner.selectNum-1).text();
	}
	
	var appendStr = '<span class="customSelectBoxContainer" style="z-index:0;display:inline-block;width:'+owner.width+'px;margin:'+owner.margin+';position:'+owner.position+';top:'+owner.top+';bottom:'+owner.bottom+';left:'+owner.left+';right:'+owner.right+'">';
	appendStr +=	'<a class="customSelectBox_btn" href="javascript:;" style="overflow:hidden;display:inline-block;width:100%;height:100%">';
	appendStr +=    '<p class="customSelectBox_title" style="overflow:hidden;display:inline-block;float:left">'+owner.title+'</p>';
	appendStr +=    '<span class="customSelectBox_arrow" style="position:absolute;display:inline-block"></span>';
	appendStr +=    '</a>';
	appendStr +=    '</span>';
	
	owner.appendObj = $(appendStr);
	if(owner.parent.css("display") == "inline")
	{
		owner.parent.css({display:"inline-block", "vertical-align":"top"});
	}
	owner.parent.append(owner.appendObj);
	var appendStr2 ='<div class=customSelectBox_items style="position:absolute;z-index:99999999;top:0px;left:0;display:none;width:'+owner.width+'px;overflow-y:auto;overflow-x:hidden"></div>';
	owner.appendObj.items = $(appendStr2);
	if(typeof owner.inContainer === "object")
	{
		
		owner.inContainer.append(owner.appendObj.items);
	}
	else 
	{
		if(owner.inContainer)  owner.appendObj.append(owner.appendObj.items);
		else                   $("body").append(owner.appendObj.items);
	}

	owner.appendObj.items.bind( 'mousewheel DOMMouseScroll', function ( e ) 
	{
		var e0 = e.originalEvent,
			delta = e0.wheelDelta || -e0.detail;

		this.scrollTop += ( delta < 0 ? 1 : -1 ) * 30;
		e.preventDefault();
	});

	

	if(CustomSelectBox.checkDevice())
	{
		owner.selectBox.parent().css({position:"relative"});
		owner.selectBox.css({"z-index":100, "display":"block", "position":"absolute", top:0, left:0, width:owner.appendObj.width()+5, height:owner.appendObj.height()+5, opacity:0});
		setTimeout(function ()
		{
			owner.resize();
		}, 10);
		owner.selectBox.on("change", function ( e )
		{
			setTimeout(function ()
			{
				owner.title = owner.selectBox.find("option:selected").text();
				owner.appendObj.find(".customSelectBox_title").html(owner.title);
				owner.focusout();
			}, 1);
		});
	}	
	else
	{
		owner.selectBox.css({"display":"none"});
	}
	
	owner.createItems();

	owner.appendObj.bind("mouseover", function ( e )
	{
		owner.overFlag = true;
	});

	owner.appendObj.bind("mouseout", function ( e )
	{
		owner.overFlag = false;
	});

	owner.appendObj.find(".customSelectBox_btn").bind("click", function ( e )
	{
		if(!owner.enabled) return;
		
		if(!owner.openFlag)
		{
			owner.showItems();
			
			setTimeout(function (){

			$("body").bind("click", function ( e )
			{
				if(owner.overFlag) return;

				if(owner.openFlag)
				{
					owner.hideItems();
					$(window).resize();
				}
			});
			},1);
		}
		else 
		{
			owner.hideItems();
		}
		
		$(window).resize();

		
	});

	$(window).bind("resize", $.proxy(owner.resize, owner));

	$(window).bind("scroll", $.proxy(owner.hideItems, owner));


	owner.resize();
	

}


CustomSelectBox.prototype.createItems = function ()
{
	var owner = this;
	var appendStr = '<ul class="customSelectBox_item_ul">';
	owner.selectBox.find("option").each(function ()
	{
		appendStr += '<li class="customSelectBox_item_li"><a class="customSelectBox_item_btn" href="javascript:;">'+$(this).text()+'</a></li>';
	});
	appendStr += '</ul>';
	owner.appendObj.items.append(appendStr);
	
	owner.appendObj.items.find("li").find("a").bind("click", function ( e )
	{
		owner.selectNum = $(this).parent().index()+1;
		owner.changeTitle();
		owner.appendObj.find(".customSelectBox_btn").click();
		if(owner.changeFunc) 
		{
			owner.changeFunc({target:owner, index:owner.getIndex(), value:owner.getValue(), title:owner.getTitle()});
		}

		owner.selectBox.change();
	});
	
	
}

CustomSelectBox.prototype.showItems = function ()
{
	var owner = this;
	owner.appendObj.css({"z-index":999999});
	owner.appendObj.parent().css({"z-index":99999});
	if(typeof owner.inContainer === "object")
	{
		owner.appendObj.items.css({"display":"inline-block", top:owner.appendObj.offset().top+owner.appendObj.height()-owner.inContainer.offset().top+2, left:owner.appendObj.offset().left-owner.inContainer.offset().left});
	}
	else if(owner.inContainer == true)
	{
		owner.appendObj.items.css({"display":"inline-block", top:owner.appendObj.height()+2});	
	}
	else 
	{
		owner.appendObj.items.css({"display":"inline-block", top:owner.appendObj.offset().top+owner.appendObj.height()+2, left:owner.appendObj.offset().left});	
	}

	owner.appendObj.find(".customSelectBox_btn").addClass("on");
	if(owner.focusinFunc) owner.focusinFunc(owner);
	owner.openFlag = true;
}

CustomSelectBox.prototype.hideItems = function ()
{
	var owner = this;
	owner.appendObj.css({"z-index":0});
	owner.appendObj.parent().css({"z-index":0});
	owner.appendObj.items.css({"display":"none"});

	$("body").unbind("click");
	owner.appendObj.find(".customSelectBox_btn").removeClass("on");
	if(owner.focusoutFunc) owner.focusoutFunc(owner);
	owner.openFlag = false;
}




CustomSelectBox.prototype.changeTitle = function ()
{
	var owner = this;
	owner.selectBox.find("option").attr("selected", false);
	if(owner.selectNum > 0)
	{
		owner.selectBox.find("option").eq(owner.selectNum-1).attr("selected", true);
		owner.title = owner.selectBox.find("option").eq(owner.selectNum-1).text();
		owner.appendObj.find(".customSelectBox_title").html(owner.title);
	}
	else 
	{
		if(owner.selectBox.attr("title"))
		{
			owner.title = owner.selectBox.attr("title");
			owner.appendObj.find(".customSelectBox_title").text(owner.title);
		}
		else 
		{
			var count = 0;
			for( var i=0; i<owner.length; i++)
			{
				if( owner.selectBox.find("option").eq(i).attr("selected") )
				{
					count = i+1;
					break;
				}
			}
			owner.selectNum = count;
			owner.title = owner.selectBox.find("option").eq(owner.selectNum-1).text();
		}
	}
	
}

CustomSelectBox.prototype.getValue = function ()
{
	return this.selectBox.find("option").eq(this.selectNum-1).val();

}

CustomSelectBox.prototype.getIndex = function ()
{
	return this.selectNum;
}

CustomSelectBox.prototype.getTitle = function ()
{
	return this.title;
}


CustomSelectBox.prototype.setDisabled = function ()
{
	this.enabled = false;
}

CustomSelectBox.prototype.setEnabled = function ()
{
	this.enabled = true;
}

CustomSelectBox.prototype.focus = function ()
{
	this.appendObj.find(".customSelectBox_btn").addClass("on");
	if(this.focusinFunc) this.focusinFunc(this);
	this.setEnabled();
	var owner = this;

	$("body").unbind("click");
	setTimeout(function (){
	$("body").bind("click", function ( e )
	{
		if(owner.overFlag) return;

		owner.appendObj.find(".customSelectBox_btn").removeClass("on");
		if(owner.focusoutFunc) owner.focusoutFunc(owner);
		owner.openFlag = false;
		owner.hideItems();
	});
	},1);
	owner.resize();
}

CustomSelectBox.prototype.focusout = function ()
{
	this.appendObj.find(".customSelectBox_btn").removeClass("on");
}


CustomSelectBox.prototype.resize = function ()
{
	var owner = this;
	
	var y = Math.round((owner.appendObj.find(".customSelectBox_btn").height() - owner.appendObj.find(".customSelectBox_title").height())/2);
	//owner.appendObj.find(".customSelectBox_title").css({width:owner.appendObj.find(".customSelectBox_btn").width() - owner.appendObj.find(".customSelectBox_arrow").width()-parseInt(owner.appendObj.find(".customSelectBox_title").css("padding-left")), "padding-top":y});
	owner.appendObj.find(".customSelectBox_title").css({"padding-top":y});
	owner.appendObj.items.css({width:owner.appendObj.width()});

	if(owner.windWidth != $(window).width())
	{

		$("body").unbind("click");
		owner.appendObj.find(".customSelectBox_btn").removeClass("on");
		if(owner.focusoutFunc) owner.focusoutFunc(owner);
		if(owner.openFlag) 
		{
			owner.hideItems();
			owner.openFlag = false;	
			$("body").unbind("click");
		}
	}

	owner.windWidth = $(window).width();
}


CustomSelectBox.prototype.reset = function ()
{
	
	var owner = this;
	owner.selectNum = 0;
	owner.appendObj.items.scrollTop(0);
	owner.appendObj.items.empty();
	owner.createItems();



	owner.length = owner.selectBox.find("option").legnth;

	//console.log(owner.selectBox.html());
	if(owner.selectBox.attr("title"))
	{
		owner.title = owner.selectBox.attr("title");
	}
	else 
	{
		owner.selectNum =  owner.selectBox.find("option:selected").index()+1;
		owner.title = owner.selectBox.find("option").eq(this.selectNum-1).text();
	}
	owner.changeTitle();
	owner.resize();	
}