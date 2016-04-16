/*Config script vars*/
var calendarsSel = "calendars";
var yearToValidateHolidays = "2008";
var urlApi = "http://holidayapi.com/v1/holidays";


function validateCountryCode(cc)
{
	/*@todo*/
	return true;
}

function printThisHolidays(dates)
{
	for(i=0;i<=dates.length;i++)
	{
		console.log("."+dates[i]);

		$("."+dates[i]+ ":not('.hideElm')").addClass("bgorange");
	}
}

function getDataFromApi(arr)
{
	arrHholidaysApi = [];
	countryCode = $("#countryCode").val();
	params = "?country="+countryCode;

	if(validateCountryCode(countryCode))
	{
      var recur_loop = function(i) {
      var num = i || 0;
	  if(num < arr.length) {
	  	arrHholidaysApi = [];
	    sep = arr[num].split('_');
	  	month = sep[0];
	  	year  = sep[1];
	  	params += "&year="+year;
	    params += "&month="+month;
	    urlRequest = urlApi+params;
	    $.getJSON(urlRequest, function(data) {
          $.each(data.holidays, function(i,v) {
        	arrHholidaysApi.push(v.date);
          });
          printThisHolidays(arrHholidaysApi);
          
          recur_loop(num+1);
        });  	
	  }
      };
      recur_loop();	
    }
	else alert("Invalid country code");


}

function validateShowHolidays(arr)
{
	arrToValidateHolidays = [];
	for(i=0;i<arr.length;i++)
	{
		deconc = arr[i].split('_');
		year   = deconc[1];
		if(year==yearToValidateHolidays){
		  arrToValidateHolidays.push(arr[i]);
		}
	}
	return arrToValidateHolidays;
}

function monthsWithYearsBetweenTwoDates(from, to) {
  arr = [];
  datFrom = from;
  datTo = to;
  fromYear =  datFrom.getFullYear();
  toYear =  datTo.getFullYear();
  diffYear = (12 * (toYear - fromYear)) + datTo.getMonth();
  for (var i = datFrom.getMonth(); i <= diffYear; i++) {
    arr.push([i%12+1] + "_" + Math.floor(fromYear+(i/12)));
  }        
  return arr;
}


function calculateDiff(from, to) {
  arr = [];
  datFrom = from;
  datTo = to;
  fromYear =  datFrom.getFullYear();
  toYear =  datTo.getFullYear();
  diffYear = (12 * (toYear - fromYear)) + datTo.getMonth();
  cant=0;
  for (var i = datFrom.getMonth(); i <= diffYear; i++) {
    cant++;
    arr.push([i%12] + "_" + Math.floor(fromYear+(i/12)));
  }        
  return cant;
}


function generateCalendar(dateUser,daysSetByUser)
{
  dateStart  = new Date(dateUser);
  dateEnd    = new Date(dateUser);
  dateEnd.addDays(daysSetByUser);

  monthDifference = calculateDiff(dateStart,dateEnd);

  $('.'+calendarsSel).pickmeup('destroy');

  $('.'+calendarsSel).pickmeup({
    flat:true,
    date: [dateStart,dateEnd],
    mode: 'range',
    calendars	: monthDifference,
    first_day : 7
  });
  $(".pmu-days .pmu-button:not(.pmu-selected)").addClass("hideElm");
  arrDates = monthsWithYearsBetweenTwoDates(dateStart, dateEnd);
  responseHdays = validateShowHolidays(arrDates);

  if(responseHdays!="")
  {
	 getDataFromApi(responseHdays);
  }
}

function validate(dateUser,daysSetByUser)
{
	/*@todo */
	return true;
}

function run()
{
  var dateUser      = $("#dateStart").val()+"T12:00:00";
  var daysSetByUser = parseInt($("#numberOfDays").val());
  response = validate(dateUser,daysSetByUser);
  if(response) generateCalendar(dateUser,daysSetByUser);
  else alert("Please verify your entry"); 
}

$(function () {
  $("#run").click(function(){
    run();
  });
});
