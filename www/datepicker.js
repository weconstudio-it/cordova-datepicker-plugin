/**
 * Phonegap DatePicker Plugin Copyright (c) Greg Allen 2011 MIT Licensed
 * Reused and ported to Android plugin by Daniel van 't Oever
 * Revised for phonegap 3.0.0 by Patrick Foh
 */
var DatePicker = (function (gap) {
	/**
	 * Constructor
	 */
	function DatePicker() {
		this._callback;
	}

	DatePicker.prototype.bind = function(callback) {

		$('[data-native-picker]').unbind('click').bind('click', function(event) {
			var pickerType = $(this).attr('data-native-picker');
			var sender = $(this);
			
	        var currentField = $(this);
	        var value = currentField.val();
	        var myNewDate = Date.parse(currentField.val()) || new Date();
			var format = pickerType == 'time' ? "HH:mm" : "dd/MMM/yyyy";
			
			if (pickerType == 'time') {
				myNewDate.setMinutes(currentField.val().substr(0, 2));
	        	myNewDate.setMinutes(currentField.val().substr(3, 2));
			}
	
	        // Same handling for iPhone and Android
	        window.plugins.datePicker.show({
	            date : myNewDate,
	            mode : pickerType, // date or time or blank for both
	            allowOldDates : true
	        }, function(returnDate) {
	            var newDate = new Date(returnDate);
	            
	            // let's call the callback if it's passed
	            if (typeof callback == 'function') {
	            	callback (sender, newDate);	
	            } else {	            
		            currentField.val(newDate.toString(format));
		
		            // This fixes the problem you mention at the bottom of this script with it not working a second/third time around, because it is in focus.
		            currentField.blur();
	            }
	        });
	    });
	}

	/**
	 * show - true to show the ad, false to hide the ad
	 */
	DatePicker.prototype.show = function(options, cb) {
		if (options.date) {
			options.date = (options.date.getMonth() + 1) + "/" + (options.date.getDate()) + "/" + (options.date.getFullYear()) + "/"
					+ (options.date.getHours()) + "/" + (options.date.getMinutes());
		}
		var defaults = {
			mode : '',
			date : '',
			allowOldDates : true
		};

		for ( var key in defaults) {
			if (typeof options[key] !== "undefined")
				defaults[key] = options[key];
		}
		this._callback = cb;

		return gap.exec(cb, failureCallback, 'Datepicker', defaults.mode, new Array(defaults));
	};

	DatePicker.prototype._dateSelected = function(date) {
		var d = new Date(parseFloat(date) * 1000);
		if (this._callback)
			this._callback(d);
	};

	function failureCallback(err) {
		console.log("datePickerPlugin.js failed: " + err);
	}

	/**
     * Load DatePicker
     */
    gap.addConstructor(function () {
        if (gap.addPlugin) {
            gap.addPlugin("datePicker", DatePicker);
        } else {
            if (!window.plugins) {
                window.plugins = {};
            }

            window.plugins.datePicker = new DatePicker();
        }
    });

	return DatePicker;

})(window.cordova || window.Cordova || window.PhoneGap);