function testondevice()
{
	var http = new XMLHttpRequest();
	var url = "publish.php";
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
        /*Translates the logick into data-tags. this way they are part of the inner html and can be transferd*/
        for(m in logick_transaktions)
        {
            ev = {"evoker":logick_transaktions[m].evoking_aktion};
            tg = {"target":logick_transaktions[m].name};
            logick_transaktions[m].evoker.dataset["logik-"+m] = JSON.stringify(ev);
            logick_transaktions[m].target.dataset["logik-"+m] = JSON.stringify(tg);
            
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

	return value_toReturn;
}

/*Displays the elements in a rendert view*/
function test_renderer()
{
	testscreen = $("testscreencontainer")
	/*Makes all but the first screen invisile*/
      for(m of testscreen.children) m.style.display = "none";
	  testscreen.children[0].style.display="";

     	 TreeCompile(testscreen);
}

/*Displays the test on a mobile device*/
function mobile_test_render()
{
	testscreen = $("testscreencontainer");

	test_renderer();

/*Changes style of containers to mobilde device view*/
	testscreen.style.width = "100%";
	testscreen.style.height = "100%";
	testscreen.style.border = "";
	for(m of testscreen.children)
	{
		m.style.height = "100%";
		m.style.width = "100%";
		m.style.border = "";
	}
}

/*resizes all elements to fit on the mobile screen*/
function resize_to_mobile_screen(e)
{
	/*var oldwidth = 
	var oldheight =*/ 
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
            /*if the given data tag specifies the element as a target of a event, it needs to be reisterd properly*/
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


