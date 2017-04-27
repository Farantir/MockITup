function save()
{
	/*Creating a string contäining all the necassary information*/
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
      for(m of document.getElementsByClassName("elementbar")) m.style.display = "none";		
	  testscreen = document.createElement("div");
	  testscreen.classList.add("screencontainer");
	  testscreen.id="testscreencontainer";
	  document.body.appendChild(testscreen);
	  datatosave = $("screencontainer").innerHTML;

       /*removes data-tags after creation of the save string, as they are no longer needet */
        for(m in logick_transaktions)
        {
            delete logick_transaktions[m].evoker.dataset["logik-"+m];
            delete logick_transaktions[m].target.dataset["logik-"+m];

            if(logick_transaktions[m].complex != null) for(com in logick_transaktions[m].complex)
            {
				delete logick_transaktions[m].complex[com].dataset["logik_complex-"+m];
            };
        }
	
	

	/*Aktual saving of the file*/
	var link = document.createElement('a');
	link.download = 'Savefile.sav';
	var blob = new Blob([datatosave], {type: 'text/plain'});
	link.href = window.URL.createObjectURL(blob);
	document.body.appendChild(link);
	link.click();
	link.remove();
}

function load()
{
	var myloadfrom = document.createElement("INPUT");
	document.body.appendChild(myloadfrom);
	myloadfrom.setAttribute("type", "file"); 
	myloadfrom.onchange = loadonselect;
	myloadfrom.style.zIndex = "9999999999";
	myloadfrom.click();
	myloadfrom.style.display = "none";

}

function loadonselect()
{
	var storedprogresss = this.files[0];
	
	var reader = new FileReader();
	/*Readding the content of the save file*/
    reader.onload = function(evt) {
        if(evt.target.readyState != 2) return;
        if(evt.target.error) {
            alert('Error while reading file');
            return;
        }

        filecontent = evt.target.result;

        restoredata(filecontent)
    };

    reader.readAsText(storedprogresss);
}

function restoredata(saveddata)
{
	/*Setting the inner html of the screen container to the saved inner html*/
	$("screencontainer").innerHTML = saveddata;
	logick_transaktions = [];
	restorelogik($("screencontainer"));
	
	/*Giving the new screen button its functionality back*/
	$("screencontainer").children[$("screencontainer").children.length-1].onclick = new_Screen;
	$("screencontainer").children[$("screencontainer").children.length-2].onclick = new_Screen;
	
	/*Resoring landscape or portrait mode*/
	if($("screencontainer").children[0].classList.contains("screenportait")) landscape_mode = false;
	else landscape_mode = true;
}


/*
function logick_transaktion(evoker,evoking_aktion,target,name)
{
    this.evoker = evoker;
    this.evoking_aktion = evoking_aktion;
    this.target = target;
    this.name = name;
	
	evoker.settingsbar.addActionIcon(addActionToSettings("Action.png", this));
	target.settingsbar.addActionIcon(addActionToSettings("Action.png", this));
}
*/

function restorelogik(target)
{
    /*Compiles logik transaktions for each element*/
    for (var i = 0; i < target.attributes.length; i++) {
    /*restores the js of the element type*/
    if(target.dataset.elementtype)
    {
		elements[target.dataset.elementtype].createfromsave(target);
    }
    
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
                eff.evoker = target;
				
				/*Resores the logik transaktions array*/
				if(logick_transaktions[eff.id] == null) logick_transaktions[eff.id] = eff;
				else
				{
					/*If both elements of a transaktion are known, the transaktion can be restored*/
					logick_transaktions[eff.id] = new logick_transaktion(target,effekt.evoker,logick_transaktions[eff.id].target,logick_transaktions[eff.id].effekt);
				}
           }
            /*if the given data tag specifies the element as a target of a event, it needs to be reisterd properly*/
            if(effekt.target)
            {
                eff = {};
                eff.target = target;
                eff.effekt = effekt.target;
                eff.id = atrname[2];
                
				/*Resores the logik transaktions array*/
				if(logick_transaktions[eff.id] == null) logick_transaktions[eff.id] = eff; 
				else
				{
					/*If both elements of a transaktion are known, the transaktion can be restored*/
					logick_transaktion(logick_transaktions[eff.id].evoker,logick_transaktions[eff.id].name,target,eff.effekt);
				}               
            }
        }/*else if(atrname[0] == "data" && atrname[1] == "logik_complex")
        {
        	if(test_logick_complex_targets[atrname[2]] == null) test_logick_complex_targets[atrname[2]] = {};
        	test_logick_complex_targets[atrname[2]][attrib.value] = target;
        }*/else if(atrname[0] == "data" && atrname[1] == "value")
        {
        	target.value = attrib.value;
        }
      }
    }

    /*restores value of the is visible attibute*/
    if(target.dataset.isVisible == "false")
    {
    	target.isVisible = "false";
    }
    
    for(m of target.children) restorelogik(m);
}
