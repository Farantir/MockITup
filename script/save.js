/*to add custom data to a savefile (using html data- tags) plugins need to add a function to the custom_presave_logick objekt.
for example:
custom_presave_logick.save_all_animations = function(){for()....}
its important, that for every addet function a cleanup function is also addet.
the job if the cleanup function is to remove all addet data- tags after the saving is completet. this way 
data integrity is ensured. to add a cleanup function, simply add .cleanup = function.. 
to your custom save function. see this example:
custom_presave_logick.save_all_animations.cleanup = function(){for()....}
*/
custom_presave_logick = {};
/*
to restore the data saved by a custom save function, a custom_loading_logick function ist needet. 
creating one ist quite simple. just add one to the objekt. It gets called after the data was loadet. 
if you want to create a function that gets called for each data tag instead, you schould use custom_loading_datatag_info instead.
this function will get called for each element and will get the current element passed as parameter
*/
custom_loading_logick = {};
/*
used to restore your data tags. will get callled for each datatag for echach element. gets passed the following values:
1. data tag name array 2. data tag value 3. target element
use it like this:
custom_loading_datatag_info.set_element_rotating = function(tag,value,target){if(tag[1]=="rotation") {target.classList.add(value); target.rotating_logick......}}
*/
custom_loading_datatag_info = {};

/*Allows Plugins to excute a funktion Before the loading of each individual element beginnst*/
custom_logick_before_loading = {};

function save()
{
    prepare_html_for_save();

    /*Copies over innerHTML. This way the logik (onclick events, etc) from the other two screens gets lost*/
    datatosave = $("screencontainer").innerHTML;

    clean_html_after_save();

	/*Aktual saving of the file*/
	var link = document.createElement('a');
	link.download = 'Savefile.sav';
	var blob = new Blob([datatosave], {type: 'text/plain'});
	link.href = window.URL.createObjectURL(blob);
	document.body.appendChild(link);
	link.click();
	link.remove();
}

/*saves all the js data into the html file*/
function prepare_html_for_save()
{
        /*allows plugins to add custom data to the savefile*/
		for (var key in custom_presave_logick) 
		{
		  if (custom_presave_logick.hasOwnProperty(key)) 
		  {
			custom_presave_logick[key]();
		  }
		}

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
}

function clean_html_after_save()
{
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
	
		/*calls the cleanup function of the plugins to remove data tags in the dom tree after saving. this is important for data integrity*/
		for (var key in custom_presave_logick) 
		{
		  if (custom_presave_logick.hasOwnProperty(key)) 
		  {
		  	if(custom_presave_logick[key].cleanup) custom_presave_logick[key].cleanup();
		  }
		}
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
	/*allows plugins to use custom logick before parsing individual elements*/
	for (var key in custom_logick_before_loading) 
	{
	  if (custom_logick_before_loading.hasOwnProperty(key)) 
	  {
		custom_logick_before_loading[key]();
	  }
	}

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
	
    /*Cleaning html data tags of the savefile set by plugins out of the data.*/
	for (var key in custom_presave_logick) 
	{
	  if (custom_presave_logick.hasOwnProperty(key)) 
	  {
	  	if(custom_presave_logick[key].cleanup) custom_presave_logick[key].cleanup();
	  }
	}
    
    /*cleaning all the data tags from the load file*/
    clean_html_after_save();

	/*fiering event to tell everyone we are done loading*/
	fireEvent("doneloading", document);
}

function restorelogik(target)
{
    /*restores the js of the element type*/
    if(target.dataset.elementtype != null && target.dataset.elementtype != "")
    {
		if(elements[target.dataset.elementtype]) elements[target.dataset.elementtype].createfromsave(target);
		else console.log(target.dataset.elementtype);
    }
    
    /*restores value of the is visible attibute*/
	if(target.dataset.isVisible == "false" || target.dataset.isVisible == false)
	{
		target.isVisible = false;
		console.log(target);
	}

	/*allows plugins to use custom data before parsing data tags.*/
	for (var key in custom_loading_logick) 
	{
	  if (custom_loading_logick.hasOwnProperty(key)) 
	  {
		custom_loading_logick[key](target);
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
        }else if(atrname[0] == "data")
        {
        	/*allows plugins to use custom data tags to manipulate the elements on loading*/
			for (var key in custom_loading_datatag_info) 
			{
			  if (custom_loading_datatag_info.hasOwnProperty(key)) 
			  {
				custom_loading_datatag_info[key](atrname,attrib.value,target);
			  }
			}
        }
      }
    }
    
    for(m of target.children) restorelogik(m);
}
