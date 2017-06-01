/**********************************************************/
/*This file contains all the logick to compile the html,  */ 
/*pharse it back and resize everythin an the mobile device*/
/**********************************************************/

/*variables needet to resize elements properly*/
var oldwidth = 270;
var oldheight = 480;

/**************************************************/
/*objects that create execution points for plugins*/
/**************************************************/

/*attaching a funktion to this objekt causes the function to be
executed before the html ist copied over to the testscreen or the 
test device. Use only togeter with a cleanup funktion. 
the cleanup function should remove all datatags set by its 
parent function. see this example:
compile_save_data_to_html.save_animations = function(){//write to datatags}
compile_save_data_to_html.save_animations.cleanup = function(){//remove all set Datatags}
*/
var compile_save_data_to_html = {};

/*Adding functions to this objekt causes them to be executed after the logick got
compiled.*/
var compile_execute_stuff_after_compiling = {};

/*attaching a function to this object causes
it to get executed before the logic is loadet from the 
html file*/
var compile_read_data_from_html = {};

/*Attaching a function to this object will cause it to be 
executet for each element in the tree compile methode.
it will recive the current element as parameter*/
var compile_data_for_each_element = {};

/*Attaching a function to this object causes it to
get executet for every data tag of every element
inside the html file.
it will get the current tag, the current element and the current tag value as parameter
compile_data_for_each_tag.myfunction = function(attribute_name,attrigute_value,current_element){....}
*/
var compile_data_for_each_tag = {};

/*adding a function to this objekt will cause it to be executet an each resize
of the mobile screen.*/
var compile_execute_stuff_after_resize = {};


/****************************************************************************/

function testondevice()
{
	var http = new XMLHttpRequest();
	var url = "php/publish.php";
	var params = "data=" + encodeURIComponent(get_html());
	http.open("POST", url, true);

	general_screenchange_cleanup();

      for(m of document.getElementsByClassName("elementbar")) m.style.display = "none";	

	//Send the proper header information along with the request
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {//Call a function when the state changes.
	    if(http.readyState == 4 && http.status == 200) {
		console.log(http.responseText);
		make_qrcode(http.responseText);
	    }
	}
	http.send(params);

      /*Makes the container of the grafic screens invisible*/
	  $("screencontainer").style.display="none";
}

function make_qrcode(qrcodevalue)
{
	qrcode = document.createElement("div");
	qrcode.id = "qrcode";
	qrcode.style.width = "600px";
	qrcode.style.height = "600px";
	qrcode.style.margin = "100px";

	document.body.appendChild(qrcode);

	var qrcode = new QRCode(qrcode, 
	{
		width : 600,
		height : 600
	});
	qrcode.makeCode(qrcodevalue);
}


function get_html()
{
        /*allows plugins to save their own data inside the html to complile later on*/
        for (var key in compile_save_data_to_html) 
        {
          if (compile_save_data_to_html.hasOwnProperty(key)) 
          {
	        compile_save_data_to_html[key]();
          }
        }

        /*Translates the logick into data-tags. this way they are part of the inner html and can be transferd*/
        for(m in logick_transaktions)
        {
            ev = {"evoker":logick_transaktions[m].evoking_aktion};
            tg = {"target":logick_transaktions[m].name};
            logick_transaktions[m].evoker.dataset["logik-"+m] = JSON.stringify(ev);
            logick_transaktions[m].target.dataset["logik-"+m] = JSON.stringify(tg);
            /*Ensuring no information gets overwritten*/
            if(logick_transaktions[m].target == logick_transaktions[m].evoker)
            {
            	var evtg = {"evoker":logick_transaktions[m].evoking_aktion,"target":logick_transaktions[m].name};
            	logick_transaktions[m].evoker.dataset["logik-"+m] = JSON.stringify(evtg);
            }
            
            if(logick_transaktions[m].complex != null) for(com in logick_transaktions[m].complex)
            {
				logick_transaktions[m].complex[com].dataset["logik_complex-"+m] = "" + com;
            };
        }
        
        /*Ensures all textbox text stay the same + all checkboxes keep their state*/
		save_preenterd_values($("screencontainer"));

      /*Copies over innerHTML. This way the logik (onclick events, etc) from the other two screens gets lost*/
	  var value_toReturn = $("screencontainer").innerHTML;

       /*removes data-tags after transfer, as they are no longer needet */
        for(m in logick_transaktions)
        {
            delete logick_transaktions[m].evoker.dataset["logik-"+m];
            delete logick_transaktions[m].target.dataset["logik-"+m];

            if(logick_transaktions[m].complex != null) for(com in logick_transaktions[m].complex)
            {
		        delete logick_transaktions[m].complex[com].dataset["logik_complex-"+m];
            };
        }

        /*Deletes the information saved inside the data tags, so integrity is ensured*/
        for (var key in compile_save_data_to_html) 
        {
          if (compile_save_data_to_html.hasOwnProperty(key)) 
          {
	        compile_save_data_to_html[key].cleanup();
          }
        }

	return value_toReturn;
}

/*Displays the elements in a rendert view*/
function test_renderer()
{
	testscreen = $("testscreencontainer")
	/*Makes all but the first screen invisile*/
      for(m of testscreen.children) m.style.display = "none";
	  testscreen.children[0].style.display="";

        /*allows plugins to execute their own code, before the logick gets loadet*/
        for (var key in compile_read_data_from_html) 
        {
          if (compile_read_data_from_html.hasOwnProperty(key)) 
          {
            compile_read_data_from_html[key]();
          }
        }

     	 TreeCompile(testscreen);

        /*allows plugins to execute their own code, After the logick got loadet*/
        for (var key in compile_execute_stuff_after_compiling) 
        {
          if (compile_execute_stuff_after_compiling.hasOwnProperty(key)) 
          {
            compile_execute_stuff_after_compiling[key]();
          }
        }
}

/*Saves the original positions of the elements on screen, so they can be used for resize calculations later on*/
function save_original_values(e)
{	
	var oldisplay = e.style.display;
	e.style.display = "";
	e.oldfont = parseFloat(window.getComputedStyle(e, null).getPropertyValue('font-size'));
	e.oldwidth = e.offsetWidth;
	e.oldleft = e.offsetLeft;
	e.oldtop = e.offsetTop;
	e.oldheight = e.offsetHeight;

	for(k of e.children) save_original_values(k);
	
	e.style.display = oldisplay;
}

/*Displays the test on a mobile device*/
function mobile_test_render()
{
	testscreen = $("testscreencontainer");

	test_renderer();
	if(testscreen.children[0].offsetWidth>testscreen.children[0].offsetHeight)
	{
		var tmpheight = oldwidth;
		oldwidth = oldheight;
		oldheight = tmpheight;
	}

/*Changes style of containers to mobilde device view*/
	testscreen.style.width = "100%";
	testscreen.style.height = "100%";
	testscreen.style.margin = "0px";
	testscreen.style.padding = "0px";
	testscreen.style.border = "none";
	testscreen.style.position = "absolute";
	testscreen.style.top = "0px";
	testscreen.style.left = "0px";
	
	for(m of testscreen.children)
	{
		m.style.display = "";
		for(k of m.children) save_original_values(k);
		m.style.margin = "0px";
		m.style.padding = "0px";
		m.style.height = "100%";
		m.style.width = "100%";
		m.style.border = "none";
		m.style.position = "absolute";
		m.style.top = "0px";
		m.style.left = "0px"; 
		for(k of m.children) resize_to_mobile_screen(k);
		m.style.display = "none";
	}
	testscreen.children[0].style.display="";

    /*allows plugins to execute their own code, After resizing has been done*/
    for (var key in compile_execute_stuff_after_resize) 
    {
      if (compile_execute_stuff_after_resize.hasOwnProperty(key)) 
      {
        compile_execute_stuff_after_resize[key]();
      }
    }
	
}

/*Resizes everything at the onresize event*/
function mobil_screen_onresize()
{
	testscreen = $("testscreencontainer");
	for(m of testscreen.children)
	{
		var screenwasviyible = m.style.display;
		m.style.display = "";
		for(k of m.children) resize_to_mobile_screen(k);
		m.style.display = screenwasviyible;
	}

    /*allows plugins to execute their own code, After resizing has been done*/
    for (var key in compile_execute_stuff_after_resize) 
    {
      if (compile_execute_stuff_after_resize.hasOwnProperty(key)) 
      {
        compile_execute_stuff_after_resize[key]();
      }
    }
}

/*resizes all elements to fit on the mobile screen*/
function resize_to_mobile_screen(e)
{
	if(e.dataset.elementtype != "listelement")
	{
		e.style.left = calculate_ratio(e.oldleft,oldwidth,$("testscreencontainer").clientWidth) + "px";
		e.style.width = calculate_ratio(e.oldwidth,oldwidth,$("testscreencontainer").clientWidth) + "px";
		
		e.style.top = calculate_ratio(e.oldtop,oldheight,$("testscreencontainer").offsetHeight) + "px";
		e.style.height = calculate_ratio(e.oldheight,oldheight,$("testscreencontainer").offsetHeight) + "px";
	}
	
	/*Determen if the font needs to be affekted by the heigt or the width*/
	var touse = calculate_ratio(e.oldfont,oldwidth,$("testscreencontainer").clientWidth);
	var by_height = calculate_ratio(e.oldfont,oldheight,$("testscreencontainer").offsetHeight)
	if(touse > by_height) touse = by_height;
	e.style.fontSize = touse + "px";
	

	
	if(e.dataset.elementtype != "listelement") for(k of e.children) resize_to_mobile_screen(k);
}

/*Calculates the new value based on the old ones*/
function calculate_ratio(targetold,parentold,parentnew)
{
	return (targetold/parentold)*parentnew
}

function test()
{
	general_screenchange_cleanup();

      for(m of document.getElementsByClassName("elementbar")) m.style.display = "none";		
	  testscreen = document.createElement("div");
	  testscreen.classList.add("screencontainer");
	  testscreen.id="testscreencontainer";
	  document.body.appendChild(testscreen);
	  testscreen.innerHTML = get_html();

        /*Makes the container of the grafic screens invisible*/
	  $("screencontainer").style.display="none";

	test_renderer();
}

/*recursively saves every preentert value (e.g. from text boxes) to the data tags*/
function save_preenterd_values(target)
{
	for(m of target.children) save_preenterd_values(m);
	
	if(target.value != null) target.dataset["value"] = target.value;
}

/*Compiles every element in the tree recursively*/
function TreeCompile(target)
{
    for(m of target.children) TreeCompile(m);
    
    /*ensures elements out of its parents are invisible*/
    target.style.overflow = "hidden";    

    if(target.dataset.elementtype == "Container") target.style.border = "";

    /*allows plugins to execute their own code for each element*/
    for (var key in compile_data_for_each_element) 
    {
      if (compile_data_for_each_element.hasOwnProperty(key)) 
      {
        compile_data_for_each_element[key](target);
      }
    }

    /*Compiles logik transaktions for each element*/
    for (var i = 0; i < target.attributes.length; i++) {
      var attrib = target.attributes[i];
      if (attrib.specified) 
      {
        atrname = attrib.name.split("-");
        /*if the element contains a data tag used for logik aktions, further processing is required*/
        if(atrname[0] == "data" && atrname[1] == "logik")
        {
           effekt = JSON.parse(attrib.value);
            /*if the given data tag defines the element as evoker of en event, it needs to do so, at the specified event*/
           if(effekt.evoker)
           {    eff = {}
                eff.name = effekt.evoker
                eff.id = atrname[2];

                if(!target.tans_out) target.tans_out = [];
                target.tans_out.push(eff);
                test_logick_events[effekt.evoker](target,test_do_execute);
           }
            /*if the given data tag specifies the element as a target of a event, it needs to be reigsterd properly*/
            if(effekt.target)
            {
                eff = {};
                eff.target = target;
                eff.effekt = test_logick_effekts[effekt.target];
                test_logik_transaktions[atrname[2]] = eff;
            }
        }else if(atrname[0] == "data" && atrname[1] == "logik_complex")
        {
        	if(test_logick_complex_targets[atrname[2]] == null) test_logick_complex_targets[atrname[2]] = {};
        	test_logick_complex_targets[atrname[2]][attrib.value] = target;
        }else if(atrname[0] == "data" && atrname[1] == "value")
        {
        	target.value = attrib.value;
        }else if(atrname[0] == "data")
        {
            /*allows plugins to execute their own code for each data tag
            they will recive the tag name, the value and the current element as
            parameters*/
            for (var key in compile_data_for_each_tag) 
            {
              if (compile_data_for_each_tag.hasOwnProperty(key)) 
              {
                compile_data_for_each_tag[key](atrname,attrib.value,target);
              }
            }
        }
      }
    }

    /*Defines if element is visible at the beginnig of the test*/
    if(target.dataset.isVisible == "false")
    {
        target.style.display = "none";
        target.style.opacity = "1";
    }
}


