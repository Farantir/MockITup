function test()
{
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
    if(target.dataset.isVisible == "false")
    {
        m.style.display = "none";
        m.style.opacity = "1";
    }
}


