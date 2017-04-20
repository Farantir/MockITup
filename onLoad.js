function portraitPosition() {
	
var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

var mx = w / 2;
var my = h / 2;

/*&.style.top= "" + (my - 135) + "px";
&("portrait").style.top= "" + (my - 240) + "px";*/
$("screencontainer").style.top= "" + (my - 240) + "px";

/*
$("landscape").style.left= "" + ((mx - 240) * 0.25) + "px";
$("portrait").style.left= "" + ((mx - 135) * 1.75) + "px";
*/

}

function $(x){
return document.getElementById(x);
}