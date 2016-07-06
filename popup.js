var dragging_tab;

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

	if(!tab_group[group_idx]["tab_list"].length){
		tab_group[group_idx]["tab_list"].push(new Tab("chrome://newtab/"));
	}

	for(let idx in tab_group){//append tab group list to dom
		var new_li= document.createElement("li");
		new_li.id= `li_group_${idx}`;
		new_li.onclick= function(){render_tab_group(idx)};
		new_li.ondragover= function(ev){ev.preventDefault();};
		new_li.ondrop= function(ev){
			ev.preventDefault();
			tab_group[idx]["tab_list"].push(dragging_tab["tab"]);
			tab_group[dragging_tab["group_idx"]]["tab_list"].splice(tab_group[dragging_tab["group_idx"]]["tab_list"].indexOf(dragging_tab["tab"]),1);
			close_tab_url(dragging_tab["tab"]["url"]);
			save_tab_group(render_tab_group(group_idx));
		};

		var new_a= document.createElement("a");

		var remove_button= document.createElement("span");
		remove_button.className="glyphicon glyphicon-remove";

		var group_name= document.createTextNode(tab_group[idx]["group_name"]);

		if(idx == group_idx){
			new_li.className="active";
		}

		new_a.appendChild(group_name);
		//new_a.appendChild(remove_button);
		new_li.appendChild(new_a);
		ul_tab_groups.appendChild(new_li);
	}


	var group_name_change_input = document.getElementById("group_name_change_input");
	group_name_change_input.value = tab_group[group_idx]["group_name"];
	group_name_change_input.onkeyup = function() {
		change_group_name(group_idx, group_name_change_input.value);
	}

	tabs.forEach(function(tab){//append tab list to dom
		var new_li= document.createElement("li");
		var new_a= document.createElement("a");
		new_a.draggable="true";
		new_a.ondragstart= function(ev){
			dragging_tab= {"group_idx": group_idx, "tab": tab};
		}
		new_a.onclick= function(){
			restore_tab_group(group_idx, tab);
		}

		var remove_button= document.createElement("span");
		remove_button.className= "glyphicon glyphicon-remove";
		remove_button.onclick= function(){
			tab_group[group_idx]["tab_list"].splice(tab_group[group_idx]["tab_list"].indexOf(tab), 1);
			if(group_idx== cur_group_idx){
				close_tab_url(tab.url);
			}
			save_tab_group(render_tab_group(group_idx));
		}

		var tab_txt= document.createTextNode(tab.url);
		new_a.appendChild(tab_txt);
		new_li.appendChild(new_a);
		new_li.appendChild(remove_button);
		tab_list.appendChild(new_li);
	})

	document.getElementById("li_add_group").onclick= function(){
		var new_idx=0;
		while(Object.keys(tab_group).includes(new_idx.toString())){
			new_idx++;
		}
		tab_group[new_idx]={"group_name":new_idx, "tab_list":[]};
		render_tab_group(group_idx);
	};
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