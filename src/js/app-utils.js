
function customMouseEvent(el, e, x, y) {

  var ev = document.createEvent("MouseEvents");
  ev.initMouseEvent(e, true, true, window, 1, 0, 0,
    x, y, // coordinates
    false, false, false, false, 0, null);
  el.dispatchEvent(ev);

}

function dateParse(dateStr, numChar) {

	date = new Date(dateStr.substr(0, 10));
	date = date.toUTCString();
	return date.substr(0, (numChar) ? numChar : 11);

};

function iconParse(iconData) {

	icon = iconData.substr(iconData.lastIndexOf("/")); // /???.png
	iconData = iconData.replace(icon, '');
	return iconData.substr(iconData.lastIndexOf("/") + 1) + icon;

}

function fileExist(urlFile) {

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", IMG_PATH+urlFile+'.svg', false);
  xhttp.send();
  return urlFile += xhttp.status == 200 ? '.svg' : '.png';

}

function properCase(str) {

	return str.replace(/^(.)|\s(.)/g, function (out) {
         return out.toUpperCase() });

}

function focusSelect(elem, isFocus) {

	if (isFocus) 
		elem.classList.add('focus');
	else
		elem.classList.remove('focus');

}