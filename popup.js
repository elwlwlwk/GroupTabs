chrome.windows.get(-2, {}, function(window){
	if(window.width*0.8 <= 800){
		document.documentElement.style.width= window.width*0.8+"px";
	}
	else{
		document.documentElement.style.width= "800px";
	}

	if(window.height*0.8 <= 600){
		document.documentElement.style.height= window.height*0.8+"px";
	}
	else{
		document.documentElement.style.height= "600px";
	}
})

function render_tab_group(group_idx){
	var tabs= tab_group[group_idx]["tab_list"];
	var tab_settings= document.getElementById("tab_settings");
	var tab_list= document.getElementById("tab_list");
	var ul_tab_groups= document.getElementById("tab_groups");

	while(tab_list.firstChild){
		tab_list.removeChild(tab_list.firstChild);
	}

	while(ul_tab_groups.firstChild){
		ul_tab_groups.removeChild(ul_tab_groups.firstChild);
	}

	for(let idx in tab_group){
		var new_li= document.createElement("li");
		new_li.id= `li_group_${idx}`;

		var new_a= document.createElement("a");
		new_a.onclick= function(){render_tab_group(idx)};

		var group_name= document.createTextNode(tab_group[idx]["group_name"]);

		if(idx == group_idx){
			new_li.className="active";
		}

		new_a.appendChild(group_name);
		new_li.appendChild(new_a);
		ul_tab_groups.appendChild(new_li);
	}


	var group_name_change_input = document.getElementById("group_name_change_input");
	group_name_change_input.value = tab_group[group_idx]["group_name"];
	group_name_change_input.onkeyup = function() {
		change_group_name(group_idx, group_name_change_input.value);
	}

	tabs.forEach(function(tab){
		var new_li= document.createElement("li");
		var tab_txt= document.createTextNode(tab.url);
		new_li.appendChild(tab_txt);
		tab_list.appendChild(new_li);
	})

	document.getElementById("li_add_group").onclick= function(){
		var new_idx=0;
		while(Object.keys(tab_group).includes(new_idx.toString())){
			new_idx++;
		}
		tab_group[new_idx]={"group_name":new_idx, "tab_list":[]};
		tab_group[new_idx]["tab_list"].push(new Tab("chrome://newtab/"))
		render_tab_group(group_idx);
	};

	document.getElementById("div_tab_list").onclick= function(){
		restore_tab_group(group_idx);
	}
}

function change_group_name(group_idx, value) {
	tab_group[group_idx]["group_name"] = value;
	render_tab_group(group_idx);
	save_tab_group();
}

function render_popup(){
	load_tab_group(function(){
		update_cur_tab_group(function(){
			render_tab_group(cur_group_idx);
		})
	})
}
render_popup();