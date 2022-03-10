jQuery(function($)
{
    $.datepicker.regional['ko'] = {
                closeText: '닫기',
                prevText: '',
                nextText: '',
                currentText: '오늘',
                monthNames: ['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월'],
                monthNamesShort: ['01월','02월','03월','04월','05월','06월','07월','08월','09월','10월','11월','12월'],
                dayNames: ['일','월','화','수','목','금','토'],
                dayNamesShort: ['일','월','화','수','목','금','토'],
                dayNamesMin: ['일','월','화','수','목','금','토'],
                weekHeader: 'Wk',
                dateFormat: 'yy-mm-dd',
                firstDay: 0,
                isRTL: false,
                showMonthAfterYear: true,
                yearSuffix: '년 '};

        $.datepicker.setDefaults($.datepicker.regional['ko']);
		$.datepicker.setDefaults({beforeShowDay:function(day) 
		{
			var date = new Date();
			date.setDate(date.getDate()-1);
            var result;
			switch (day.getDay()) {
                    case 0: 
                        if (day < date)   result = [false, "date-prev date-sunday"];
						else              result = [true, "date-sunday"];
                        break;
                    case 6: 
						if (day < date)   result = [false, "date-prev  date-saturday"];
						else              result = [true, "date-saturday"];
                        break;
                    default:
                        if (day < date)   result = [false, "date-prev"];
						else              result = [true, ""];
                        break;
                }
 
            return result;
        }});
		
});
