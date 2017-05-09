function save()
{
	/*Creating a string containing all the necassary information*/
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
	
	/*fiering event to tell everyone we are done loading*/
	fireEvent("doneloading", document);
}

function restorelogik(target)
{
    /*Compiles logik transaktions for each element*/
    for (var i = 0; i < target.attributes.length; i++) {
    /*restores the js of the element type*/
    if(target.dataset.elementtype != null && target.dataset.elementtype != "")
    {
		if(elements[target.dataset.elementtype]) elements[target.dataset.elementtype].createfromsave(target);
		else console.log(target.dataset.elementtype);
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
				else if(logick_transaktions[eff.id].target == null)
				{
					logick_transaktions[eff.id] = eff;
					complex = logick_transaktions[eff.id].complex;
					logick_transaktions[eff.id].complex = complex;
				}
				else
				{
					/*If both elements of a transaktion are known, the transaktion can be restored*/
					complex = logick_transaktions[eff.id].complex;
					logick_transaktions[eff.id] = new logick_transaktion(target,effekt.evoker,logick_transaktions[eff.id].target,logick_transaktions[eff.id].effekt);
					/*If the transaktion involves more than one element, it will be assingt here*/
					logick_transaktions[eff.id].complex = complex;
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
				else if(logick_transaktions[eff.id].evoker == null)
				{
					logick_transaktions[eff.id] = eff;
					complex = logick_transaktions[eff.id].complex;
					logick_transaktions[eff.id].complex = complex;
				}
				else
				{
					/*If both elements of a transaktion are known, the transaktion can be restored*/
					complex = logick_transaktions[eff.id].complex;
					logick_transaktions[eff.id] = new logick_transaktion(logick_transaktions[eff.id].evoker,logick_transaktions[eff.id].name,target,eff.effekt);
					/*If the transaktion involves more than one element, it will be assingt here*/
					logick_transaktions[eff.id].complex = complex;
				}          
            }
        }else if(atrname[0] == "data" && atrname[1] == "logik_complex")
        {
        	/*assings additional elements of the transaktion*/
        	var eff = {};
            eff.id = atrname[2]; 
            eff.complex = {};
        	eff.complex[attrib.value] = target;
        	if(logick_transaktions[eff.id] == null) logick_transaktions[eff.id] = eff;
        	else if (logick_transaktions[eff.id].complex == null) logick_transaktions[eff.id].complex = eff.complex;
        	else logick_transaktions[eff.id].complex[attrib.value] = target;


        }else if(atrname[0] == "data" && atrname[1] == "value")
        {
        	target.value = attrib.value;
        }
      }
    }
    
    for(m of target.children) restorelogik(m);
    
    		
    
	 /*restores value of the is visible attibute*/
	if(target.dataset.isVisible == "false" || target.dataset.isVisible == false)
	{
		target.isVisible = false;
		console.log(target);
	}
}
