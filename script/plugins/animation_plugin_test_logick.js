/*initioalizes the animaton engine*/
compile_read_data_from_html.initialize_animations = function()
{
    compiled_animations = [];
}

/*Loads the animations inside the compiled_animation array*/
compile_data_for_each_tag.get_Animations = function(attribute_name,attrigute_value,current_element)
{
    /*Loads the animation*/
    if(attribute_name[1] == "animation")
    {
        compiled_animations[attribute_name[2]] = JSON.parse(attrigute_value);
        compiled_animations[attribute_name[2]].target = current_element;
    }else if(attribute_name[1] == "animation_logik")
    {
        /*Tells the logick transaktion whitch animation to use*/
        test_logik_transaktions[attribute_name[1]].animation_id = attrigute_value;
    }
    
}

/*Creates the logick needet to animate objekts*/
test_logick_effekts["start_animation"] = function(target,unused,id)
{
    /*reciving the id of the target animation*/
    var animation = test_logik_transaktions[attribute_name[1]].animation_id;
}
