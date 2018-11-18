/* AJAX call function */
var ajax = {
	load : function(method, url, callback, error) {
			var xhttp;

			if (typeof XMLHttpRequest !== 'undefined')
				xhttp = new XMLHttpRequest();
			else {
				var versions = [
						"MSXML2.XmlHttp.5.0", 
						"MSXML2.XmlHttp.4.0",
						"MSXML2.XmlHttp.3.0", 
						"MSXML2.XmlHttp.2.0",
						"Microsoft.XmlHttp"
					];

				for(var i = 0, len = versions.length; i < len; i++) {
					try {
						xhttp = new ActiveXObject(versions[i]);
						break;
					}
						catch(error){}
				}
			}

			xhttp.onreadystatechange = function() {
				if (xhttp.readyState === 4) {
					if (xhttp.status === 200) {
						callback(JSON.parse(xhttp.responseText), xhttp.status);
					} else {
						 error(JSON.parse(xhttp.responseText), xhttp.status);
					}
				}
			}

			xhttp.open(method, url, true);
			xhttp.send('');
		}
	}