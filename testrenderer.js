function test()
{

        for(m in logick_transaktions)
        {
            ev = {"evoker":logick_transaktions[m].evoking_aktion};
            tg = {"target":logick_transaktions[m].name};
            logick_transaktions[m].evoker.dataset["logik-"+m] = JSON.stringify(ev);
            logick_transaktions[m].target.dataset["logik-"+m] = JSON.stringify(tg);
        }

//    $("screencontainer").children[1].innerHTML = $("screencontainer").children[0].innerHTML
      for(m of document.getElementsByClassName("elementbar")) m.style.display = "none";		
	  testscreen = document.createElement("div");
	  testscreen.classList.add("screencontainer");
	  testscreen.id="testscreencontainer";
	  document.body.appendChild(testscreen);
	  
	  for(m of document.getElementsByClassName("screengrafikeditor"))
        {
         	tmp = new_TestScreen();
		 	tmp.innerHTML = m.innerHTML;	
        }
	   testscreen.children[0].style.display="";
	  $("screencontainer").style.display="none";
      TreeCompile(testscreen);

        for(m in logick_transaktions)
        {
            delete logick_transaktions[m].evoker.dataset[m];
            delete logick_transaktions[m].target.dataset[m];
        }
}

/*Changes view to the Grafik screen*/
function grafik()
{
	$("screencontainer").style.display="";
	if($("testscreencontainer")) $("testscreencontainer").remove();
    logick_elements.style.display = "none";
    grafic_elements.style.display = "";		
}

function new_TestScreen()
{
	tmp = create_Screen();
	tmp.style.display="none";
	$("testscreencontainer").appendChild(tmp);
	return tmp;
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


