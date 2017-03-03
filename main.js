function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function colorForTimeInSec(timeInSec) {
	if (timeInSec < 30) {
		return "#999";
	} else if (timeInSec < 60) {
		return "#95832c";
	} else if (timeInSec < 90) {
		return "#df9636";
	} else if (timeInSec < 120) {
		return "#e46b30";
	} 

	return "#fc0000";
}

InboxSDK.load('1', 'sdk_shorteremails_f9eda92906').then(function(sdk){

	var composeCount = 0;

	// the SDK has been loaded, now do something with it!
	sdk.Compose.registerComposeViewHandler(function(composeView){
        var timeOutID;
		var readingSpeedWPM = 190;
		var mainDivID = 'wse_main_' + composeCount;

		var updateCount = function() {
        	if (timeOutID == null) {
	        	timeOutID = window.setTimeout(function(){
		        	var bodyElement = $(composeView.getBodyElement()).clone();
		        	$(bodyElement).find('div[data-smartmail="gmail_signature"]').remove();

		        	var bodyText = $(bodyElement).text().trim();
		        	var wordCount;
		        	if (bodyText.length == 0) {
		        		wordCount = 0;
		        	} else {
			        	wordCount = bodyText.split(/\s+/).length;
		        	}

		        	var timeToReadMin = wordCount / readingSpeedWPM;
		        	var timeToReadFormatted = "";
	        		timeToReadFloor = Math.floor(timeToReadMin);
	        		if (timeToReadFloor > 0) {
	        		timeToReadFormatted = timeToReadFloor + " min";	
	        		}

	        		var remaining = timeToReadMin - timeToReadFloor;
	        		if (remaining > 0) {
	        			if (timeToReadFormatted.length > 0) {
	        				timeToReadFormatted += " ";
	        			}
	        			timeToReadFormatted += Math.round(remaining * 60) + " sec";
	        		}

                    if (timeToReadFormatted.length == 0) {
                        timeToReadFormatted = "0 sec"
                    }

		        	document.getElementById(mainDivID).textContent = wordCount + " word" + (wordCount == 1 ? "" : "s") + " – " + timeToReadFormatted + " to read";
		        	$('#'+mainDivID).css('color', colorForTimeInSec(timeToReadMin * 60));
		        	timeOutID = null;
	        	},200);
        	}
		}

		var statusBar = composeView.addStatusBar({
			height: 21
        });

        statusBar.el.innerHTML = "<div class='wse_main' id='"+ mainDivID + "'></div>";

        console.log(composeView.getTextContent().length);
        console.log(composeView.getBodyElement());

       	// Doing this timeout thing to be energy conscious
        composeView.getBodyElement().onkeydown = function(){
        	updateCount();
        };

        updateCount();

        composeCount++;
	});
});
