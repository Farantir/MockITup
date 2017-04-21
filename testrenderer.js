function test()
{
//    $("screencontainer").children[1].innerHTML = $("screencontainer").children[0].innerHTML
				
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
}


function grafik()
{
	$("screencontainer").style.display="";
	$("testscreencontainer").remove();		
}


function new_TestScreen()
{
	tmp = create_Screen();
	tmp.style.display="none";
	$("testscreencontainer").appendChild(tmp);
	return tmp;
}




